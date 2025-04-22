import { Test, TestingModule } from '@nestjs/testing';
import { AuthServiceAdapter } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthServiceAdapter;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked-jwt-token'),
  };

  const mockInvalidTokenModel = {
    create: jest.fn(),
    findOne: jest.fn().mockReturnValue({ exec: jest.fn() }),
  };

  const mockSend = jest.fn();
  const mockMsUsersClient = {
    send: mockSend,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthServiceAdapter,
        { provide: JwtService, useValue: mockJwtService },
        { provide: 'INVALID_TOKEN_MODEL', useValue: mockInvalidTokenModel },
      ],
    }).compile();

    service = module.get<AuthServiceAdapter>(AuthServiceAdapter);
    // @ts-ignore
    service.msUsersClient = mockMsUsersClient;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('logout', () => {
    it('should store token as invalid and return confirmation', async () => {
      mockInvalidTokenModel.create.mockResolvedValueOnce({
        token: 'fake-token',
        isInvalid: true,
      });

      const result = await service.logout('fake-token');

      expect(mockInvalidTokenModel.create).toHaveBeenCalledWith({
        token: 'fake-token',
        isInvalid: true,
      });
      expect(result).toEqual({ message: 'Token invalidated!' });
    });
  });

  describe('isTokenValid', () => {
    it('should return true when token is not found (valid)', async () => {
      mockInvalidTokenModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.isTokenValid('valid-token');

      expect(result).toBe(true);
    });

    it('should return false when token is found (invalid)', async () => {
      mockInvalidTokenModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue({ token: 'invalid' }),
      });

      const result = await service.isTokenValid('invalid-token');

      expect(result).toBe(false);
    });
  });

  describe('validateUser', () => {
    it('should return user if username and password are correct', async () => {
      const mockUser = { username: 'test', passwordHash: 'hashed-pass' };
      const observable = {
        subscribe: ({ next }) => next(mockUser),
      };
      mockSend.mockReturnValue(observable);
      (bcrypt.compare as jest.Mock).mockImplementation((pass, hash, cb) =>
        cb(null, true),
      );

      const result = await service.validateUser('test', 'pass');

      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const observable = {
        subscribe: ({ next }) => next(undefined),
      };
      mockSend.mockReturnValue(observable);

      await expect(service.validateUser('fail', 'pass')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException if password is wrong', async () => {
      const mockUser = { username: 'test', passwordHash: 'hashed-pass' };
      const observable = {
        subscribe: ({ next }) => next(mockUser),
      };
      mockSend.mockReturnValue(observable);
      (bcrypt.compare as jest.Mock).mockImplementation((pass, hash, cb) =>
        cb(null, false),
      );

      await expect(service.validateUser('test', 'wrongpass')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('login', () => {
    it('should login and return jwt token and description', async () => {
      const mockUser = { username: 'test', displayName: 'Test User' };
      const observable = {
        subscribe: ({ next }) => next(mockUser),
      };
      mockSend.mockReturnValue(observable);
      (bcrypt.hash as jest.Mock).mockImplementation((pass, salt, cb) =>
        cb(null, 'hashed-pass'),
      );

      const result = await service.login({ username: 'test', password: '123' });

      expect(result).toEqual({
        message: 'User logged in successfully!',
        description: 'Welcome Test User',
        access_token: 'mocked-jwt-token',
      });
    });
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const observableUsername = { subscribe: ({ next }) => next(true) };
      const observableCreate = {
        subscribe: ({ next }) =>
          next({
            ID: '1',
            username: 'newuser',
            displayName: 'New',
            passwordHash: 'hashed',
          }),
      };
      mockSend
        .mockReturnValueOnce(observableUsername) // check username
        .mockReturnValueOnce(observableCreate); // create user
      (bcrypt.hash as jest.Mock).mockImplementation((pass, salt, cb) =>
        cb(null, 'hashed'),
      );

      const result = await service.register({
        username: 'newuser',
        displayName: 'New',
        password: '123',
      });

      expect(result).toEqual({ message: 'User created successfully!' });
    });

    it('should throw ConflictException if username is taken', async () => {
      const observable = { subscribe: ({ next }) => next(false) };
      mockSend.mockReturnValue(observable);

      await expect(
        service.register({
          username: 'taken',
          displayName: 'User',
          password: '123',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if user not created', async () => {
      const observableUsername = { subscribe: ({ next }) => next(true) };
      const observableCreate = { subscribe: ({ next }) => next(undefined) };
      mockSend
        .mockReturnValueOnce(observableUsername) // check username
        .mockReturnValueOnce(observableCreate); // create user
      (bcrypt.hash as jest.Mock).mockImplementation((pass, salt, cb) =>
        cb(null, 'hashed'),
      );

      await expect(
        service.register({
          username: 'failuser',
          displayName: 'Fail',
          password: '123',
        }),
      ).rejects.toThrow();
    });
  });
});
