import { Request, Response } from 'express';
import { tokenDataDto } from './auth/dto/tokenData.dto';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';

declare module 'express' {
  interface Request {
    tokenData?: tokenDataDto;
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  use(req: Request, res: Response, next: Function) {
    req.tokenData = this.authService.readToken(
      req.headers.authorization?.substring('Bearer '.length),
    );
    if (!req.tokenData) {
      throw new UnauthorizedException();
    }

    next();
  }
}
