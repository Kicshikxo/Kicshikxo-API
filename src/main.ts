import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { createSwagger } from './swagger'
import { createDocument as createTimetableDocument } from './timetable/src/swagger'
import { createDocument as createTwitchBotDocument } from './twitch-bot/src/swagger'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const configService = app.get(ConfigService)
    createSwagger(app, createTwitchBotDocument(app), { path: 'v1/twitch-bot' })
    createSwagger(app, createTimetableDocument(app), { path: 'v2/timetable' })
    await app.listen(configService.get('PORT') ?? 3000)
}
bootstrap()
