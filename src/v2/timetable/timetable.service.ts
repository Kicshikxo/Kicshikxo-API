import { dayDto } from './dto/day.dto';
import { groupDto } from './dto/group.dto';
import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { weekDto } from './dto/week.dto';
import {
  lessonDto,
  lessonWithDateAndWeekIdDto,
  lessonWithDateDto,
} from './dto/lesson.dto';
import {
  firstValueFrom,
  from,
  groupBy,
  map,
  mergeMap,
  Observable,
  reduce,
  toArray,
} from 'rxjs';

@Injectable()
export class TimetableService {
  private readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      user: process.env.POSTGRES_API_USER,
      password: process.env.POSTGRES_API_PASSWORD,
      database: process.env.POSTGRES_TIMETABLE_DATABASE,
    });
  }

  async getAcademicYears(): Promise<string[]> {
    const academicYears = await this.pool.query('SELECT * FROM academic_years');
    return academicYears.rows.map((row) => row.year);
  }

  async getGroups(academicYear: string): Promise<groupDto[]> {
    const groups = await this.pool.query(
      `SELECT id, academic_year as "academicYear" FROM groups ${
        academicYear ? `WHERE academic_year = '${academicYear}'` : ''
      }`,
    );
    return groups.rows as groupDto[];
  }

  async getWeeks(
    limit: number,
    offset: number,
    group: string,
  ): Promise<weekDto[]> {
    const lessons = (
      await this.pool.query(
        `SELECT
          week_id AS "weekId",
          date::timestamptz,
          index,
          name,
          cabinet
        FROM
          (
            SELECT
                week_id
            FROM
                select_filled_weeks_for_group('${group}')
            LIMIT ${limit || 'NULL'}
            OFFSET ${offset || 'NULL'}
          ) AS selected_weeks,
        	LATERAL select_lessons_by_week_id(
            week_id,
            '${group}'
          ) AS selected_lessons`,
      )
    ).rows.map((row) =>
      Object.assign(row, { date: row.date.toISOString().split('T')[0] }),
    );

    const lessonsStream$: Observable<weekDto[]> = from(lessons).pipe(
      groupBy((lesson: lessonWithDateAndWeekIdDto) => lesson.weekId, {
        element: (lesson: lessonWithDateDto) => ({
          date: lesson.date,
          index: lesson.index,
          name: lesson.name,
          cabinet: lesson.cabinet,
        }),
      }),
      mergeMap((daysGroup$) =>
        daysGroup$.pipe(
          groupBy((lesson: lessonWithDateDto) => lesson.date, {
            element: (lesson: lessonDto) => ({
              index: lesson.index,
              name: lesson.name,
              cabinet: lesson.cabinet,
            }),
          }),
          mergeMap((lessonsGroup$) =>
            lessonsGroup$.pipe(
              reduce((acc, cur) => [...acc, cur], [lessonsGroup$.key]),
            ),
          ),
          map<any[], dayDto>((arr) => ({
            date: arr[0],
            lessons: arr.slice(1),
          })),
          reduce((acc, cur) => [...acc, cur], [daysGroup$.key]),
        ),
      ),
      map<any[], weekDto>((arr) => ({ id: arr[0], days: arr.slice(1) })),
      toArray<weekDto>(),
    );

    return firstValueFrom(lessonsStream$);
  }
}
