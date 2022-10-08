import { lessonDto } from './lesson.dto';
import { ApiProperty } from '@nestjs/swagger';

export class dayDto {
  @ApiProperty({
    example: '2022-09-14',
    description: 'Дата в формате ISO-8601',
  })
  date: string;

  @ApiProperty({
    example: [{ index: 1, name: 'asd', cabinet: '123' }],
    description: 'Список уроков дня',
    isArray: true,
  })
  lessons: lessonDto[];
}
