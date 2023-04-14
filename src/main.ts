import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { AppModule } from './app.module'
import { createSwagger } from './swagger'
import { createDocument as createTimetableDocument } from './timetable/src/swagger'
import { createDocument as createTwitchBotDocument } from './twitch-bot/src/swagger'

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule)
    app.useStaticAssets(join(__dirname, 'static'))

    createSwagger(app, createTwitchBotDocument(app), { path: 'v1/twitch-bot' })
    createSwagger(app, createTimetableDocument(app), { path: 'v2/timetable' })

    const configService = app.get(ConfigService)
    await app.listen(configService.get('PORT') ?? 3000)
}
bootstrap()
