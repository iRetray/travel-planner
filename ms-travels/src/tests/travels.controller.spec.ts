import { Test, TestingModule } from '@nestjs/testing';
import { TravelsController } from '../travels.controller';
import { TravelsService } from '../travels.service';
import { JwtService } from '@nestjs/jwt';
import { CreateTravelDto, GetTravelDto } from '../dto';

describe('TravelsController', () => {
  let controller: TravelsController;
  let travelsServiceMock: jest.Mocked<TravelsService>;
  let jwtServiceMock: jest.Mocked<JwtService>;

  beforeEach(async () => {
    // Mocking dependencies
    travelsServiceMock = {
      getTravel: jest.fn(),
      getTravelsByUsername: jest.fn(),
      createTravel: jest.fn(),
      editTravel: jest.fn(),
      deleteTravel: jest.fn(),
    } as unknown as jest.Mocked<TravelsService>;

    jwtServiceMock = {
      decode: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TravelsController],
      providers: [
        { provide: TravelsService, useValue: travelsServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    controller = module.get<TravelsController>(TravelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTravel', () => {
    it('should call getTravel from TravelsService with the decoded username', async () => {
      const decodedToken = { username: 'user1' };
      const authorization = 'Bearer token';
      const params = { id: '1' } as GetTravelDto;

      jwtServiceMock.decode.mockReturnValue(decodedToken);
      travelsServiceMock.getTravel.mockResolvedValue({
        id: 'ABC',
        name: 'Viaje a Medellin',
        description: 'Vamos de rumba',
        startDate: 1744589934187,
        endDate: 1744586534187,
        destination: 'Medellin',
        activities: ['Correr', 'Bailar', 'Comer'],
        ownerId: 'DEF',
      });

      await controller.getTravel(params, authorization);

      expect(jwtServiceMock.decode).toHaveBeenCalledWith('token');
      expect(travelsServiceMock.getTravel).toHaveBeenCalledWith('1', 'user1');
    });
  });

  describe('getTravels', () => {
    it('should call getTravelsByUsername from TravelsService with the decoded username', async () => {
      const decodedToken = { username: 'user1' };
      const authorization = 'Bearer token';

      jwtServiceMock.decode.mockReturnValue(decodedToken);
      travelsServiceMock.getTravelsByUsername.mockResolvedValue([]);

      await controller.getTravels(authorization);

      expect(jwtServiceMock.decode).toHaveBeenCalledWith('token');
      expect(travelsServiceMock.getTravelsByUsername).toHaveBeenCalledWith(
        'user1',
      );
    });
  });

  describe('createTravel', () => {
    it('should call createTravel from TravelsService with the decoded username and travel data', async () => {
      const decodedToken = { username: 'user1' };
      const authorization = 'Bearer token';
      const body = { destination: 'Paris' } as CreateTravelDto;

      jwtServiceMock.decode.mockReturnValue(decodedToken);
      travelsServiceMock.createTravel.mockResolvedValue({
        id: 'ABC',
        name: 'Viaje a Medellin',
        description: 'Vamos de rumba',
        startDate: 1744589934187,
        endDate: 1744586534187,
        destination: 'Medellin',
        activities: ['Correr', 'Bailar', 'Comer'],
        ownerId: 'DEF',
      });

      await controller.createTravel(body, authorization);

      expect(jwtServiceMock.decode).toHaveBeenCalledWith('token');
      expect(travelsServiceMock.createTravel).toHaveBeenCalledWith(
        body,
        'user1',
      );
    });
  });

  describe('editTravel', () => {
    it('should call editTravel from TravelsService with the decoded username, travel data, and travel id', async () => {
      const decodedToken = { username: 'user1' };
      const authorization = 'Bearer token';
      const params = { id: '1' } as GetTravelDto;
      const body = { destination: 'New York' } as CreateTravelDto;

      jwtServiceMock.decode.mockReturnValue(decodedToken);
      travelsServiceMock.editTravel.mockResolvedValue({
        id: 'ABC',
        name: 'Viaje a Medellin',
        description: 'Vamos de rumba',
        startDate: 1744589934187,
        endDate: 1744586534187,
        destination: 'Medellin',
        activities: ['Correr', 'Bailar', 'Comer'],
        ownerId: 'DEF',
      });

      await controller.editTravel(params, body, authorization);

      expect(jwtServiceMock.decode).toHaveBeenCalledWith('token');
      expect(travelsServiceMock.editTravel).toHaveBeenCalledWith(
        '1',
        body,
        'user1',
      );
    });
  });

  describe('deleteTravel', () => {
    it('should call deleteTravel from TravelsService with the decoded username and travel id', async () => {
      const decodedToken = { username: 'user1' };
      const authorization = 'Bearer token';
      const params = { id: '1' } as GetTravelDto;

      jwtServiceMock.decode.mockReturnValue(decodedToken);
      travelsServiceMock.deleteTravel.mockResolvedValue({
        message: 'Travel deleted',
      });

      await controller.deleteTravel(params, authorization);

      expect(jwtServiceMock.decode).toHaveBeenCalledWith('token');
      expect(travelsServiceMock.deleteTravel).toHaveBeenCalledWith(
        '1',
        'user1',
      );
    });
  });
});
