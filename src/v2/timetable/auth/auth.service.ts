import { checkLoginDataDto } from './dto/checkLoginData.dto';
import { checkLoginResponseDto } from './dto/checkLoginResponse.dto';
import { compareSync, hashSync } from 'bcrypt';
import { loginDataDto } from './dto/loginData.dto';
import { loginResponseDto } from './dto/loginResponse.dto';
import { Pool } from 'pg';
import { sign, verify } from 'jsonwebtoken';
import { tokenDataDto } from './dto/tokenData.dto';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthService {
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

  async login(loginData: loginDataDto): Promise<loginResponseDto> {
    const group = `${loginData.group} ${loginData.academicYear}`;

    const groupAccess = await this.pool.query(
      `SELECT password FROM group_access WHERE "group" = '${group}'`,
    );

    if (!groupAccess.rowCount) {
      throw new BadRequestException();
    }

    const accessPassword: string = groupAccess.rows[0].password;

    if (!loginData.password || !accessPassword) {
      return {
        token: sign({ group }, process.env.JWT_SECRET),
      };
    }

    if (loginData.password === accessPassword) {
      return {
        token: sign(
          { group, password: hashSync(loginData.password, 8) },
          process.env.JWT_SECRET,
        ),
      };
    }

    throw new UnauthorizedException();
  }

  readToken(token: string): tokenDataDto {
    try {
      return verify(token, process.env.JWT_SECRET) as tokenDataDto;
    } catch {
      throw new UnauthorizedException();
    }
  }

  async checkLogin(
    checkLoginData: checkLoginDataDto,
  ): Promise<checkLoginResponseDto> {
    const tokenData = this.readToken(checkLoginData.token);

    const groupAccess = await this.pool.query(
      `SELECT password FROM group_access WHERE "group" = '${tokenData.group}'`,
    );

    if (
      groupAccess.rowCount &&
      (!tokenData.password ||
        compareSync(groupAccess.rows[0].password, tokenData.password))
    ) {
      return { success: true };
    } else {
      throw new UnauthorizedException();
    }
  }
}
