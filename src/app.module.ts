import { TimetableModule } from './v2/timetable/timetable.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
  imports: [TimetableModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
