import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { RouterModule } from '@nestjs/core'
import { BotModule as MemesBotModule } from './memes-bot/src/bot.module'
import { TimetableModule } from './timetable/src/timetable.module'
import { BotModule as TwitchBotModule } from './twitch-bot/src/bot.module'

@Module({
    imports: [
        TwitchBotModule,
        RouterModule.register([{ path: 'v1/twitch-bot', module: TwitchBotModule }]),
        TimetableModule,
        RouterModule.register([{ path: 'v2/timetable', module: TimetableModule }]),
        MemesBotModule,
        ConfigModule.forRoot()
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
