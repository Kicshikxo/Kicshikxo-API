import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { Module } from '@nestjs/common';
import { TimetableController } from './timetable.controller';
import { TimetableService } from './timetable.service';

@Module({
  imports: [],
  controllers: [TimetableController, AuthController],
  providers: [TimetableService, AuthService],
})
export class TimetableModule {}
