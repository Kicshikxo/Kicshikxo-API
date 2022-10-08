import { ApiProperty } from '@nestjs/swagger';

export class lessonDto {
  @ApiProperty({
    example: 1,
    description: 'Порядковый номер урока по расписанию',
  })
  index: number;

  @ApiProperty({ example: 'Математика', description: 'Название урока' })
  name: string;

  @ApiProperty({ example: '42', description: 'Кабинет урока' })
  cabinet: string;
}
