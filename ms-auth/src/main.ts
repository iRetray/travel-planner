import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const httpPort = parseInt(process.env.HTTP_PORT_MS_AUTH) || 3000;
  const tcpPort = parseInt(process.env.TCP_PORT_MS_AUTH) || 3002;

  const app = await NestFactory.create(AuthModule);

  await app.listen(httpPort);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: tcpPort,
    },
  });

  await app.startAllMicroservices();
  console.log('🚀 Running MS Auth (HTTP) on port: ', httpPort);
  console.log('🚀 Running MS Auth (Open to TCP) on port: ', tcpPort);
}

bootstrap();
