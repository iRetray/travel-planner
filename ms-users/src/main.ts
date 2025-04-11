import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const port = parseInt(process.env.TCP_PORT_MS_USERS) || 3003;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule,
    {
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port },
    },
  );
  console.log('🚀 Running MS Users (Open to TCP) on port: ', port);
  await app.listen();
}
bootstrap();
