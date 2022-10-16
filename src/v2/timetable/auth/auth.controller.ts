import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { checkLoginDataDto } from './dto/checkLogin.data.dto';
import { checkLoginResponseDto } from './dto/checkLogin.response.dto';
import { loginDataDto } from './dto/login.data.dto';
import { loginResponseDto } from './dto/login.response.dto';

@ApiTags('Timetable v2')
@Controller('/v2/timetable/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Получение токена аутентификации' })
  @ApiResponse({
    status: HttpStatus.OK,
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Проверка аутентификации по токену' })
  @ApiResponse({
    status: HttpStatus.OK,
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
