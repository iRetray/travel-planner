import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { CreateUserDto, GetUserDto, IsUsernameAvailableDto } from '../dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    getUser: jest.fn(),
    createUser: jest.fn(),
    isUsernameAvailable: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUser', () => {
    it('should call usersService.getUser with the correct username', async () => {
      const getUserDto: GetUserDto = { username: 'testUser' };
      await controller.getUser(getUserDto);
      expect(usersService.getUser).toHaveBeenCalledWith('testUser');
    });

    it('should return the result of usersService.getUser', async () => {
      const getUserDto: GetUserDto = { username: 'testUser' };
      const expectedResult = { id: 1, username: 'testUser' };
      mockUsersService.getUser.mockResolvedValue(expectedResult);
      const result = await controller.getUser(getUserDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createUser', () => {
    it('should call usersService.createUser with the correct data', () => {
      const createUserDto: CreateUserDto = {
        username: 'newUser',
        ID: 'ABC',
        displayName: 'Retray',
        passwordHash: 'ABC-DEF',
      };
      controller.createUser(createUserDto);
      expect(usersService.createUser).toHaveBeenCalledWith(createUserDto);
    });

    it('should return the result of usersService.createUser', () => {
      const createUserDto: CreateUserDto = {
        username: 'newUser',
        ID: 'ABC',
        displayName: 'Retray',
        passwordHash: 'ABC-DEF',
      };
      const expectedResult = { id: 2, username: 'newUser' };
      mockUsersService.createUser.mockReturnValue(expectedResult);
      const result = controller.createUser(createUserDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('isUsernameAvailable', () => {
    it('should call usersService.isUsernameAvailable with the correct username', () => {
      const isUsernameAvailableDto: IsUsernameAvailableDto = {
        username: 'checkUser',
      };
      controller.isUsernameAvailable(isUsernameAvailableDto);
      expect(usersService.isUsernameAvailable).toHaveBeenCalledWith(
        'checkUser',
      );
    });

    it('should return the result of usersService.isUsernameAvailable', () => {
      const isUsernameAvailableDto: IsUsernameAvailableDto = {
        username: 'checkUser',
      };
      const expectedResult = true;
      mockUsersService.isUsernameAvailable.mockReturnValue(expectedResult);
      const result = controller.isUsernameAvailable(isUsernameAvailableDto);
      expect(result).toEqual(expectedResult);
    });
  });
});
