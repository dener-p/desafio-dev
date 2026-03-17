import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Desafio Técnico - Backend')
    .setDescription('')
    .setVersion('1.0')
    .addTag('')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  const document = cleanupOpenApiDoc(swaggerDocument);
  SwaggerModule.setup('swagger', app, document);

  app.enableCors({
    origin: '*',
  });

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
void bootstrap();
