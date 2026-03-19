import fastifyCookie from '@fastify/cookie';
import cors from '@fastify/cors';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

import awsLambdaFastify from '@fastify/aws-lambda';

let proxy;

async function bootstrap() {
  const adapter = new FastifyAdapter();

  await adapter.register(fastifyCookie);

  await adapter.register(cors, {
    origin: true, // IMPORTANT: don't hardcode localhost in prod
    credentials: true,
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  await app.init();

  const instance = app.getHttpAdapter().getInstance();

  return awsLambdaFastify(instance);
}

export default async function handler(req, res) {
  if (!proxy) {
    proxy = await bootstrap();
  }
  return proxy(req, res);
}

// async function bootstrap() {
//   const adapter = new FastifyAdapter();
//
//   await adapter.register(fastifyCookie);
//   // register CORS on the raw fastify instance
//   await adapter.register(cors, {
//     origin: 'http://localhost:3000',
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization', 'Accept'], // fix
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // add this
//   });
//   const app = await NestFactory.create<NestFastifyApplication>(
//     AppModule,
//     adapter,
//   );
//   const swaggerConfig = new DocumentBuilder()
//     .setTitle('Desafio Técnico - Backend')
//     .setDescription('')
//     .setVersion('1.0')
//     .addTag('')
//     .build();
//   const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
//   const document = cleanupOpenApiDoc(swaggerDocument);
//   SwaggerModule.setup('swagger', app, document);
//   await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
// }
// void bootstrap();
