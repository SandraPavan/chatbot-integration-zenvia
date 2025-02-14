import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import setupDb from './db/db-setup'
import * as dotenv from 'dotenv'
dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  await setupDb()

  await app.listen(3010);
}
bootstrap();
