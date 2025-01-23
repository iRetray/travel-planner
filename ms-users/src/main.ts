import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  const port = process.env.PORT || 3000;
  console.log('🚀 Running MS Users on port: ', port);
  await app.listen(port);
}
bootstrap();
