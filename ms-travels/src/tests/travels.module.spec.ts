import { Test, TestingModule } from '@nestjs/testing';
import { TravelsModule } from '../travels.module';
import { TravelsController } from '../travels.controller';
import { TravelsService } from '../travels.service';
import { DatabaseModule } from '../database/database.module';
import { travelsProviders } from '../travels.providers';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../guards/jwt.strategy';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

describe('TravelsModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [TravelsModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide TravelsController', () => {
    expect(module.get<TravelsController>(TravelsController)).toBeDefined();
  });

  it('should provide TravelsService', () => {
    expect(module.get<TravelsService>(TravelsService)).toBeDefined();
  });

  it('should provide DatabaseModule', () => {
    expect(module.get<DatabaseModule>(DatabaseModule)).toBeDefined();
  });

  it('should provide travelsProviders', () => {
    travelsProviders.forEach((provider) => {
      expect(module.get(provider.provide)).toBeDefined();
    });
  });

  it('should provide JwtModule', () => {
    expect(module.get<JwtModule>(JwtModule)).toBeDefined();
  });

  it('should provide ConfigModule', () => {
    expect(module.get<ConfigModule>(ConfigModule)).toBeDefined();
  });

  it('should provide ConfigService', () => {
    expect(module.get<ConfigService>(ConfigService)).toBeDefined();
  });

  it('should provide JwtStrategy', () => {
    expect(module.get<JwtStrategy>(JwtStrategy)).toBeDefined();
  });

  it('should provide JwtAuthGuard', () => {
    expect(module.get<JwtAuthGuard>(JwtAuthGuard)).toBeDefined();
  });
});
