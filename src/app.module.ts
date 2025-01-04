import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';

import { TravelsModule } from './travels/travels.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

import { CONFIG } from './config/config';

@Module({
  imports: [
    UsersModule,
    TravelsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [CONFIG],
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
