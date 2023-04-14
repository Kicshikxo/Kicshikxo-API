import { INestApplication } from '@nestjs/common'
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger'

export const createSwagger = (app: INestApplication, document: OpenAPIObject, options?: { path?: string }) => {
    SwaggerModule.setup(options?.path ?? '/', app, document, {
        customCss: '.swagger-ui .topbar{display:none}*{outline:none!important;font-family:Rubik,sans-serif!important}',
        customCssUrl: 'https://fonts.googleapis.com/css2?family=Rubik&display=swap',
        customSiteTitle: document.info.title
    })
}
