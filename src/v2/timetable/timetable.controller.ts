import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { groupDto } from './dto/group.dto';
import { TimetableService } from './timetable.service';
import { weekDto } from './dto/week.dto';
import { Controller, Get, Query, HttpStatus } from '@nestjs/common';

@ApiTags('Timetable v2')
@Controller('/v2/timetable')
export class TimetableController {
  constructor(
    private readonly timetableService: TimetableService,
    private readonly authService: AuthService,
  ) {}

  @Get('academic-years')
  @ApiOperation({ summary: 'Получение списка учебных лет' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'string[]',
      example: ['2021-2022', '2022-2023'],
    },
    isArray: true,
    description: 'Список учебных лет',
  })
  async getAcademicYears(): Promise<string[]> {
    return this.timetableService.getAcademicYears();
  }

  @Get('groups')
  @ApiOperation({ summary: 'Получение списка групп' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: groupDto,
    isArray: true,
    description: 'Список групп',
  })
  @ApiQuery({
    name: 'academic-year',
    description: 'Учебный год группы (по умолчанию все)',
    type: String,
    required: false,
    example: '2022-2023',
  })
  async getGroups(
    @Query('academic-year') academicYear: string,
  ): Promise<groupDto[]> {
    return this.timetableService.getGroups(academicYear);
  }

  @Get('weeks')
  @ApiOperation({ summary: 'Получение списка недель' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: weekDto,
    isArray: true,
    description: 'Список недель',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Невалидный токен аутентификации',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Количество недель для получения (по умолчанию все)',
    type: Number,
    required: false,
    example: 42,
  })
  @ApiQuery({
    name: 'offset',
    description: 'Количество пропущенных недель (по умолчанию 0)',
    type: Number,
    required: false,
    example: 3,
  })
  @ApiQuery({
    name: 'token',
    description: 'Токен аутентификации',
    type: String,
    required: true,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  async getWeeks(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('token') token: string,
  ): Promise<weekDto[]> {
    const tokenData = this.authService.readToken(token);
    return this.timetableService.getWeeks(limit, offset, tokenData.group);
  }
}
