import { DatabaseService } from './database.service';
import { AuthController } from './auth/auth.controller';
import { AuthMiddleware } from './auth.middleware';
import { AuthService } from './auth/auth.service';
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
  imports: [],
  controllers: [TimetableController, AuthController, UpdatesController],
  providers: [DatabaseService, TimetableService, AuthService, UpdatesService],
})
export class TimetableModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/v2/timetable/weeks', method: RequestMethod.GET });
  }
}
