import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { RouterModule } from '@nestjs/core'
import { TimetableModule } from './timetable/src/timetable.module'
import { BotModule } from './twitch-bot/src/bot.module'

@Module({
    imports: [
        BotModule,
        RouterModule.register([{ path: 'v1/twitch-bot', module: BotModule }]),
        TimetableModule,
        RouterModule.register([{ path: 'v2/timetable', module: TimetableModule }]),
        ConfigModule.forRoot()
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
