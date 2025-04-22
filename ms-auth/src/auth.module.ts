import { Module } from '@nestjs/common';
import { AuthServiceAdapter } from './auth.service';

import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

import { ENV_CONFIG } from './config/config';
import { authProviders } from './auth.providers';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ENV_CONFIG],
    }),
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
  providers: [AuthServiceAdapter, LocalStrategy, JwtStrategy, ...authProviders],
  exports: [AuthServiceAdapter],
  controllers: [AuthController],
})
export class AuthModule {}
