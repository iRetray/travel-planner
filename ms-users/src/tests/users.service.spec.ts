import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { Model } from 'mongoose';
import { UserDto } from '../interfaces/User.dto';
import { UserMongoType } from '../interfaces/user.interface';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<UserMongoType>;

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    select: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'USER_MODEL',
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<UserMongoType>>('USER_MODEL');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUser', () => {
    it('should return a user if found', async () => {
      const username = 'testUser';
      const expectedUser: UserDto = {
        username: 'newUser',
        ID: 'ABC',
        displayName: 'Retray',
        passwordHash: 'ABC-DEF',
      };

      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(expectedUser),
      });

      const result = await service.getUser(username);
      expect(result).toEqual(expectedUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const username = 'nonExistentUser';

      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getUser(username)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user: UserDto = {
        username: 'newUser',
        ID: 'ABC',
        displayName: 'Retray',
        passwordHash: 'ABC-DEF',
      };
      const expectedCreatedUser: UserDto = {
        ID: expect.any(String),
        ...user,
      };

      mockUserModel.create.mockResolvedValue(expectedCreatedUser);

      const result = await service.createUser(user);
      expect(result).toEqual(expectedCreatedUser);
      expect(mockUserModel.create).toHaveBeenCalledWith(
        expect.objectContaining(user),
      );
    });
  });

  describe('isUsernameAvailable', () => {
    it('should return true if username is available', async () => {
      const username = 'availableUser';

      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.isUsernameAvailable(username);
      expect(result).toBe(true);
    });

    it('should return false if username is not available', async () => {
      const username = 'unavailableUser';

      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({ username: 'unavailableUser' }),
      });

      const result = await service.isUsernameAvailable(username);
      expect(result).toBe(false);
    });
  });
});
