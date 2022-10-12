import { ApiProperty } from '@nestjs/swagger';

export class tokenDataDto {
  @ApiProperty({
    example: 'ПКС-4.2 2022-2023',
    description: 'Идентификатор группы',
  })
  group: string;

  @ApiProperty({
    example: '$2b$08$WcG4vnqCQA3XpEm5zs0TdOxpRvvWcvS8TUiC2SfzN.PFF.GrGk9IW',
    description: 'Пароль bcrypt',
    required: false,
  })
  password?: string;
}
