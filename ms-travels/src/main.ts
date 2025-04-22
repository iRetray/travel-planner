import { NestFactory } from '@nestjs/core';
import { TravelsModule } from './travels.module';

async function bootstrap() {
  const app = await NestFactory.create(TravelsModule);
  const port = parseInt(process.env.HTTP_PORT_MS_TRAVELS) || 3001;
  console.log('🚀 Running MS Travels (HTTP) on port: ', port);
  await app.listen(port);
}
bootstrap();
