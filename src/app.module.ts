import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TimetableModule } from './v2/timetable/timetable.module';

@Module({
  imports: [TimetableModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
