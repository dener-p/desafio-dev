import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import cors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import { validateEnv } from './env';

async function bootstrap() {
  validateEnv();
  const adapter = new FastifyAdapter();

  await adapter.register(fastifyCookie);
  // register CORS on the raw fastify instance
  await adapter.register(cors, {
    origin: process.env.CORS,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
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
  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
void bootstrap();
