import { Module } from '@nestjs/common';
import { TravelsController } from './travels.controller';
import { TravelsService } from './travels.service';
import { DatabaseModule } from 'src/database/database.module';
import { travelsProviders } from './travels.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [TravelsController],
  providers: [TravelsService, ...travelsProviders],
})
export class TravelsModule {}
