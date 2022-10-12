import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { checkLoginDataDto } from './dto/checkLoginData.dto';
import { checkLoginResponseDto } from './dto/checkLoginResponse.dto';
import { loginDataDto } from './dto/loginData.dto';
import { loginResponseDto } from './dto/loginResponse.dto';

@ApiTags('Timetable v2')
@Controller('/v2/timetable/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Получение токена аутентификации' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: loginResponseDto,
    description: 'Токен аутентификации',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Неверный пароль доступа',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Указанная группа не найдена',
  })
  @ApiBody({
    type: loginDataDto,
    description: 'Данные для аутентификации',
    required: true,
  })
  login(@Body() loginData: loginDataDto): Promise<loginResponseDto> {
    return this.authService.login(loginData);
  }

  @Post('check-login')
  @ApiOperation({ summary: 'Проверка аутентификации по токену' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: checkLoginResponseDto,
    description: 'Успешность выполнения проверки',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Невалидный токен аутентификации',
  })
  @ApiBody({
    type: checkLoginDataDto,
    description: 'Токен аутентификации',
    required: true,
  })
  checkLogin(
    @Body() checkLoginData: checkLoginDataDto,
  ): Promise<checkLoginResponseDto> {
    return this.authService.checkLogin(checkLoginData);
  }
}
