import { Module } from '@nestjs/common';
import { TravelsController } from './travels.controller';
import { TravelsService } from './travels.service';
import { DatabaseModule } from 'src/database/database.module';
import { travelsProviders } from './travels.providers';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('jwtSecret'),
          signOptions: { expiresIn: '120s' },
        };
      },
    }),
  ],
  controllers: [TravelsController],
  providers: [TravelsService, ...travelsProviders],
})
export class TravelsModule {}
