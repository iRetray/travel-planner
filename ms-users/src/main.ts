import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const port = parseInt(process.env.PORT) || 3000;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule,
    {
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port },
    },
  );
  console.log('🚀 Running MS Users on port: ', port);
  await app.listen();
}
bootstrap();
