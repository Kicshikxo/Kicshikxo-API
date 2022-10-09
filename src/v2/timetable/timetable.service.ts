import { Injectable } from '@nestjs/common';
import { groupDto } from './dto/group.dto';
import { weekDto } from './dto/week.dto';
import { Pool } from 'pg';

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

  async getGroups(academicYear: string): Promise<groupDto[]> {
    const groups = await this.pool.query(
      `SELECT id, academic_year FROM groups ${
        academicYear ? `WHERE academic_year = '${academicYear}'` : ''
      }`,
    );
    return groups.rows.map<groupDto>((group) => ({
      id: group.id,
      academicYear: group.academic_year,
    }));
  }

  async getWeeks(
    limit: number,
    offset: number,
    group: string,
  ): Promise<weekDto[]> {
    const weeks = await this.pool.query(
      `SELECT id as week, date::timestamptz, "index", name, cabinet FROM (SELECT id FROM weeks ORDER BY id DESC LIMIT ${
        limit || 'NULL'
      } OFFSET ${
        offset || 'NULL'
      }) AS selected_weeks, LATERAL select_lessons_by_week_id(id,'${group}') AS selected_lessons`,
    );
    const result: weekDto[] = [];
    // for (const lesson of weeks.rows.map(row => Object.assign(row, { date: row.date.toISOString().split('T')[0] }))) {
    //     if (!result[lesson.week]) result[lesson.week] = []
    //     result[lesson.week].push({ date: lesson.date, index: lesson.index, name: lesson.name, cabinet: lesson.cabinet })
    // }
    // for ()
    for (const lesson of weeks.rows.map((row) =>
      Object.assign(row, { date: row.date.toISOString().split('T')[0] }),
    )) {
    }
    return [];
  }
}
