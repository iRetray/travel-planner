import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const port = parseInt(process.env.PORT) || 3000;
  console.log('🚀 Running MS Auth on port: ', port);
  await app.listen(port);
}
bootstrap();
