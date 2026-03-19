import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import awsLambdaFastify from '@fastify/aws-lambda';

import fastifyCookie from '@fastify/cookie';
import cors from '@fastify/cors';

import { AppModule } from './src/app.module';

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
