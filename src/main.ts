import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

function createSwagger(app: INestApplication) {
  const version = require('../package.json').version || '';

  const options = new DocumentBuilder()
    .setTitle('Kicshikxo API')
    .setVersion(version)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/', app, document, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Kicshikxo API',
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  createSwagger(app);

  await app.listen(3000);
}
bootstrap();
