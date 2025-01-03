import { Module } from '@nestjs/common';

import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';

import { TravelsController } from './travels/travels.controller';
import { TravelsService } from './travels/travels.service';
import { TravelsModule } from './travels/travels.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, TravelsModule, AuthModule],
  controllers: [TravelsController, AppController],
  providers: [UsersService, TravelsService],
})
export class AppModule {}
