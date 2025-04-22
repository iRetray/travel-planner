import { Module } from '@nestjs/common';
import { UsersServiceAdapter } from './users.service';
import { usersProviders } from './users.providers';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';

import { ENV_CONFIG } from './config/config';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ENV_CONFIG],
    }),
  ],
  providers: [UsersServiceAdapter, ...usersProviders],
  exports: [UsersServiceAdapter],
  controllers: [UsersController],
})
export class UsersModule {}
