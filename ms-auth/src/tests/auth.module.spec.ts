import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../auth.module';
import { AuthService } from '../auth.service';
import { AuthController } from '../auth.controller';
import { LocalStrategy } from '../local.strategy';
import { JwtStrategy } from '../jwt.strategy';
import { authProviders } from '../auth.providers';

describe('AuthModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should resolve AuthService', () => {
    const service = module.get<AuthService>(AuthService);
    expect(service).toBeInstanceOf(AuthService);
  });

  it('should resolve AuthController', () => {
    const controller = module.get<AuthController>(AuthController);
    expect(controller).toBeInstanceOf(AuthController);
  });

  it('should resolve LocalStrategy', () => {
    const strategy = module.get<LocalStrategy>(LocalStrategy);
    expect(strategy).toBeInstanceOf(LocalStrategy);
  });

  it('should resolve JwtStrategy', () => {
    const strategy = module.get<JwtStrategy>(JwtStrategy);
    expect(strategy).toBeInstanceOf(JwtStrategy);
  });

  it('should resolve each authProvider', () => {
    for (const provider of authProviders) {
      const providerToken =
        typeof provider === 'function' ? provider : provider.provide;
      const resolved = module.get(providerToken);
      expect(resolved).toBeDefined();
    }
  });
});
