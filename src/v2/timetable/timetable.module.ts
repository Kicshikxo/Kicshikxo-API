import { TimetableService } from './timetable.service';
import { TimetableController } from './timetable.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [TimetableController],
  providers: [TimetableService],
})
export class TimetableModule {}
