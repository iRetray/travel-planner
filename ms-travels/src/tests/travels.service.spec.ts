import { Test, TestingModule } from '@nestjs/testing';
import { TravelsServiceAdapter } from '../travels.service';
import { Model } from 'mongoose';
import { ClientProxyFactory } from '@nestjs/microservices';
import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('TravelsService', () => {
  let service: TravelsServiceAdapter;
  let travelModel: Model<any>;
  let msUsersClient: any;

  const mockTravelModel = {
    findOne: jest.fn().mockReturnValue({ exec: jest.fn() }),
    find: jest.fn().mockReturnValue({ exec: jest.fn() }),
    create: jest.fn(),
    findOneAndUpdate: jest.fn().mockReturnValue({ exec: jest.fn() }),
    deleteOne: jest.fn().mockReturnValue({ exec: jest.fn() }),
  };

  const mockMsUsersClient = {
    send: jest.fn(),
    subscribe: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TravelsServiceAdapter,
        {
          provide: 'TRAVEL_MODEL',
          useValue: mockTravelModel,
        },
        {
          provide: ClientProxyFactory,
          useValue: {
            create: jest.fn(() => ({
              send: jest.fn().mockReturnValue({
                subscribe: jest.fn().mockImplementation((observer) => {
                  observer.next({ ID: 'owner123' });
                  observer.complete();
                }),
              }),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<TravelsServiceAdapter>(TravelsServiceAdapter);
    travelModel = module.get<Model<any>>('TRAVEL_MODEL');
    msUsersClient = {
      send: jest.fn().mockReturnValue({
        subscribe: jest.fn().mockImplementation((observer) => {
          observer.next({ ID: 'owner123' });
          observer.complete();
        }),
      }),
    };
    // @ts-ignore
    service.msUsersClient = msUsersClient;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTravel', () => {
    it('should return a travel if found and owned by the user', async () => {
      const id = '123';
      const username = 'testUser';
      const ownerId = 'owner123';
      const travel = { id, ownerId, name: 'Test Travel' };

      mockTravelModel.findOne().exec.mockResolvedValue(travel);

      const result = await service.getTravel(id, username);
      expect(result).toEqual(travel);
    });

    it('should throw NotFoundException if travel is not found', async () => {
      const id = '123';
      const username = 'testUser';

      mockTravelModel.findOne().exec.mockResolvedValue(null);

      await expect(service.getTravel(id, username)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if travel is not owned by the user', async () => {
      const id = '123';
      const username = 'testUser';
      const ownerId = 'owner123';
      const travel = { id, ownerId: 'otherOwner', name: 'Test Travel' };

      mockTravelModel.findOne().exec.mockResolvedValue(travel);

      await expect(service.getTravel(id, username)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('getTravelsByUsername', () => {
    it('should return travels owned by the user', async () => {
      const username = 'testUser';
      const ownerId = 'owner123';
      const travels = [
        { id: '1', ownerId },
        { id: '2', ownerId: 'otherOwner' },
        { id: '3', ownerId },
      ];

      mockTravelModel.find().exec.mockResolvedValue(travels);

      const result = await service.getTravelsByUsername(username);
      expect(result).toEqual([
        { id: '1', ownerId },
        { id: '3', ownerId },
      ]);
    });

    it('should return an empty array if no travels are found', async () => {
      const username = 'testUser';

      mockTravelModel.find().exec.mockResolvedValue([]);

      const result = await service.getTravelsByUsername(username);
      expect(result).toEqual([]);
    });
  });

  describe('createTravel', () => {
    it('should create a new travel', async () => {
      const travelDto = {
        name: 'Viaje a Medellin',
        description: 'Vamos de rumba',
        startDate: 1744589934187,
        endDate: 1744586534187,
        destination: 'Medellin',
        activities: ['Correr', 'Bailar', 'Comer'],
      };
      const username = 'testUser';
      const ownerId = 'owner123';
      const newTravel = { id: expect.any(String), ownerId, ...travelDto };

      mockTravelModel.create.mockResolvedValue(newTravel);

      const result = await service.createTravel(travelDto, username);
      expect(result).toEqual(newTravel);
    });
  });

  describe('editTravel', () => {
    it('should update a travel if found and owned by the user', async () => {
      const id = '123';
      const updates = {
        name: 'Viaje a Medellin',
        description: 'Vamos de rumba',
        startDate: 1744589934187,
        endDate: 1744586534187,
        destination: 'Medellin',
        activities: ['Correr', 'Bailar', 'Comer'],
      };
      const username = 'testUser';
      const ownerId = 'owner123';
      const travel = { id, ownerId, name: 'Original Travel' };
      const updatedTravel = { id, ownerId, ...updates };

      mockTravelModel.findOne().exec.mockResolvedValue(travel);
      mockTravelModel.findOneAndUpdate().exec.mockResolvedValue(updatedTravel);

      const result = await service.editTravel(id, updates, username);
      expect(result).toEqual(updatedTravel);
    });

    it('should throw NotFoundException if travel is not found', async () => {
      const id = '123';
      const updates = {
        name: 'Viaje a Medellin',
        description: 'Vamos de rumba',
        startDate: 1744589934187,
        endDate: 1744586534187,
        destination: 'Medellin',
        activities: ['Correr', 'Bailar', 'Comer'],
      };
      const username = 'testUser';

      mockTravelModel.findOne().exec.mockResolvedValue(null);

      await expect(service.editTravel(id, updates, username)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if travel is not owned by the user', async () => {
      const id = '123';
      const updates = {
        name: 'Viaje a Medellin',
        description: 'Vamos de rumba',
        startDate: 1744589934187,
        endDate: 1744586534187,
        destination: 'Medellin',
        activities: ['Correr', 'Bailar', 'Comer'],
      };
      const username = 'testUser';
      const ownerId = 'owner123';
      const travel = { id, ownerId: 'otherOwner', name: 'Original Travel' };

      mockTravelModel.findOne().exec.mockResolvedValue(travel);

      await expect(service.editTravel(id, updates, username)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('deleteTravel', () => {
    it('should delete a travel if found and owned by the user', async () => {
      const id = '123';
      const username = 'testUser';
      const ownerId = 'owner123';
      const travel = { id, ownerId, name: 'Test Travel' };

      mockTravelModel.findOne().exec.mockResolvedValue(travel);
      mockTravelModel.deleteOne().exec.mockResolvedValue({ deletedCount: 1 });

      const result = await service.deleteTravel(id, username);
      expect(result).toEqual({
        message: `Travel with id '${id}' deleted successfully`,
      });
    });

    it('should throw NotFoundException if travel is not found', async () => {
      const id = '123';
      const username = 'testUser';

      mockTravelModel.findOne().exec.mockResolvedValue(null);

      await expect(service.deleteTravel(id, username)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if travel is not owned by the user', async () => {
      const id = '123';
      const username = 'testUser';
      const ownerId = 'owner123';
      const travel = { id, ownerId: 'otherOwner', name: 'Test Travel' };

      mockTravelModel.findOne().exec.mockResolvedValue(travel);

      await expect(service.deleteTravel(id, username)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('validateUser', () => {
    it('should return a user if username and password are correct', async () => {
      const username = 'testUser';
      const password = 'password';
      const user = { ID: 'owner123' };

      mockMsUsersClient.subscribe.mockImplementation((observer) =>
        observer.next(user),
      );
      jest.spyOn(service as any, 'areHashesEquals').mockResolvedValue(true);

      const result = await service.validateUser(username, password);
      expect(result).toEqual(user);
    });

    it('should throw InternalServerErrorException if password is incorrect', async () => {
      const username = 'testUser';
      const password = 'password';
      const user = { username: 'test', passwordHash: 'hash' };

      mockMsUsersClient.subscribe.mockImplementation((observer) =>
        observer.next(user),
      );
      jest.spyOn(service as any, 'areHashesEquals').mockResolvedValue(false);

      await expect(service.validateUser(username, password)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
