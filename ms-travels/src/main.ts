import { NestFactory } from '@nestjs/core';
import { TravelsModule } from './travels.module';

async function bootstrap() {
  const app = await NestFactory.create(TravelsModule);
  const port = parseInt(process.env.PORT) || 3000;
  console.log('🚀 Running MS Travels on port: ', port);
  await app.listen(port);
}
bootstrap();
