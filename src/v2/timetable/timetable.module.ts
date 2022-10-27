import { AuthController } from './auth/auth.controller';
import { AuthMiddleware } from './auth.middleware';
import { AuthService } from './auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { JwtModule } from '@nestjs/jwt';
import { TimetableController } from './timetable.controller';
import { TimetableService } from './timetable.service';
import { UpdatesController } from './updates/updates.controller';
import { UpdatesService } from './updates/updates.service';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [TimetableController, AuthController, UpdatesController],
  providers: [DatabaseService, TimetableService, AuthService, UpdatesService],
})
export class TimetableModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/v2/timetable/weeks', method: RequestMethod.GET },
        { path: '/v2/timetable/auth/check-login', method: RequestMethod.GET },
      );
  }
}
