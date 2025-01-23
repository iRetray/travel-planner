import { NestFactory } from '@nestjs/core';
import { TravelsModule } from './travels.module';

async function bootstrap() {
  const app = await NestFactory.create(TravelsModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
