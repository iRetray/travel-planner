import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { AuthLoginDto } from '../dto/AuthLogin.dto';
import { AuthRegisterDto } from '../dto/AuthRegister.dto';
import { TokenDto } from '../dto/TokenDto.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    isTokenValid: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should call authService.login and return result', async () => {
      const loginDto: AuthLoginDto = { username: 'user', password: 'pass' };
      const result = { message: 'logged in' };

      jest.spyOn(console, 'log').mockImplementation(() => {});
      mockAuthService.login.mockResolvedValue(result);

      const response = await controller.login(loginDto);

      expect(console.log).toHaveBeenCalledWith(
        '✅ Controller handling method /login',
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
      expect(response).toBe(result);
    });
  });

  describe('register', () => {
    it('should call authService.register and return result', async () => {
      const registerDto: AuthRegisterDto = {
        username: 'newuser',
        password: 'pass',
        displayName: 'User',
      };
      const result = { message: 'registered' };

      jest.spyOn(console, 'log').mockImplementation(() => {});
      mockAuthService.register.mockResolvedValue(result);

      const response = await controller.register(registerDto);

      expect(console.log).toHaveBeenCalledWith(
        '✅ Controller handling method /register (body)',
        registerDto,
      );
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
      expect(response).toBe(result);
    });
  });

  describe('logout', () => {
    it('should extract token and call authService.logout', async () => {
      const token = 'fake.jwt.token';
      const headers = `Bearer ${token}`;
      const result = { message: 'logged out' };

      jest.spyOn(console, 'log').mockImplementation(() => {});
      mockAuthService.logout.mockResolvedValue(result);

      const response = await controller.logout(headers);

      expect(console.log).toHaveBeenCalledWith(
        '✅ Controller handling method /logout (token)',
        token,
      );
      expect(mockAuthService.logout).toHaveBeenCalledWith(token);
      expect(response).toBe(result);
    });
  });

  describe('isTokenValid', () => {
    it('should call authService.isTokenValid with token', async () => {
      const tokenDto: TokenDto = { token: 'abc.def.ghi' };
      const result = true;

      jest.spyOn(console, 'log').mockImplementation(() => {});
      mockAuthService.isTokenValid.mockResolvedValue(result);

      const response = await controller.isTokenValid(tokenDto);

      expect(console.log).toHaveBeenCalledWith(
        '✅ Controller handling method [isTokenValid] from TCP (data)',
        tokenDto,
      );
      expect(mockAuthService.isTokenValid).toHaveBeenCalledWith(tokenDto.token);
      expect(response).toBe(result);
    });
  });
});
