import { Controller, Get, Query } from '@nestjs/common';
import { groupDto } from './dto/group.dto';
import { TimetableService } from './timetable.service';
import { weekDto } from './dto/week.dto';
import {
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Timetable v2')
@Controller('/v2/timetable')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Get('groups')
  @ApiOperation({ summary: 'Получение списка групп' })
  @ApiResponse({
    status: 200,
    type: groupDto,
    isArray: true,
    description: 'Список недель',
  })
  @ApiQuery({
    name: 'academic-year',
    description: 'Учебный год группы',
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
    status: 200,
    type: weekDto,
    isArray: true,
    description: 'Список недель',
  })
  @ApiQuery({
    name: 'token',
    description: 'JWT токен аутентификации',
    type: String,
    required: true,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Количество недель для получения',
    type: Number,
    required: false,
    example: 42,
  })
  @ApiQuery({
    name: 'offset',
    description: 'Количество пропущенных недель',
    type: Number,
    required: false,
    example: 3,
  })
  async getWeeks(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ): Promise<weekDto[]> {
    console.log(limit, offset);
    return this.timetableService.getWeeks(limit, offset, 'ПКС-4.2');
  }
}
