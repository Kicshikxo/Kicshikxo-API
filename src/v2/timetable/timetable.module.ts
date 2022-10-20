import { AuthMiddleware } from './auth.middleware';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TimetableController } from './timetable.controller';
import { TimetableService } from './timetable.service';

@Module({
  imports: [],
  controllers: [TimetableController, AuthController],
  providers: [TimetableService, AuthService],
})
export class TimetableModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/v2/timetable/weeks', method: RequestMethod.GET });
  }
}
