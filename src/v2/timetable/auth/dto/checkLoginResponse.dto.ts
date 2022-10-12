import { ApiProperty } from '@nestjs/swagger';

export class checkLoginResponseDto {
  @ApiProperty({
    example: true,
    description: 'Успешность выполнения',
  })
  success: boolean;
}
