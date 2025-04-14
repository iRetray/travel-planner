import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let mockMsAuthClient: any;

  beforeEach(async () => {
    mockMsAuthClient = {
      send: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: ClientProxyFactory,
          useValue: {
            create: jest.fn(() => mockMsAuthClient),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if the token is valid', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: 'Bearer validToken' },
          }),
          getResponse: () => ({}),
        }),
      } as ExecutionContext;

      mockMsAuthClient.send.mockReturnValue(of(true));
      jest
        .spyOn(guard, 'canActivate')
        .mockImplementation(() => Promise.resolve(true));

      const result = await guard.canActivate(context);
      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException if the token is invalid', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: 'Bearer invalidToken' },
          }),
          getResponse: () => ({}),
        }),
      } as ExecutionContext;

      mockMsAuthClient.send.mockReturnValue(of(false));
      // Simulate super.canActivate throwing UnauthorizedException
      jest
        .spyOn(guard, 'canActivate')
        .mockImplementation(() => Promise.reject(new UnauthorizedException()));

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if no token is provided', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {},
          }),
          getResponse: () => ({}),
        }),
      } as ExecutionContext;

      // Simulate super.canActivate throwing UnauthorizedException
      jest
        .spyOn(guard, 'canActivate')
        .mockImplementation(() => Promise.reject(new UnauthorizedException()));

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return false if super.canActivate returns false', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: 'Bearer validToken' },
          }),
          getResponse: () => ({}),
        }),
      } as ExecutionContext;

      jest
        .spyOn(guard, 'canActivate')
        .mockImplementation(() => Promise.resolve(false));

      const result = await guard.canActivate(context);
      expect(result).toBe(false);
    });

    it('should handle reject from observable', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: 'Bearer invalidToken' },
          }),
          getResponse: () => ({}),
        }),
      } as ExecutionContext;

      mockMsAuthClient.send.mockReturnValue(
        throwError(new Error('Test Error')),
      );
      // Simulate super.canActivate throwing UnauthorizedException
      jest
        .spyOn(guard, 'canActivate')
        .mockImplementation(() => Promise.reject(new UnauthorizedException()));

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('handleRequest', () => {
    it('should return the user if no error and user is present', () => {
      const user = { id: 1, username: 'test' };
      const result = guard.handleRequest(null, user);
      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException if error is present', () => {
      expect(() => guard.handleRequest(new Error('Test Error'), null)).toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user is null', () => {
      expect(() => guard.handleRequest(null, null)).toThrow(
        UnauthorizedException,
      );
    });
  });
});
