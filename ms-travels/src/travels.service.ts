import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { CreateTravelDto, DecodedTokenType, GetTravelDto } from './dto';
import { TravelType } from './interfaces/Travel';
import { TravelMongoType } from './interfaces/travel.interface';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TravelsService {
  constructor(
    private usersService: UsersService,
    @Inject('TRAVEL_MODEL')
    private readonly travelModel: Model<TravelMongoType>,
  ) {}

  getTravel(id: GetTravelDto['id']) {
    return this.travelModel
      .findOne({ id })
      .exec()
      .then((travel) => {
        if (!travel) {
          throw new NotFoundException(`Travel with id '${id}' not found`);
        }
        return travel;
      });
  }

  getTravels(): Promise<TravelType[]> {
    return this.travelModel.find().exec();
  }

  async createTravel(
    travel: CreateTravelDto,
    decodedToken: DecodedTokenType,
  ): Promise<TravelType> {
    const currentUser = await this.usersService.getUser(decodedToken.username);
    const userID = currentUser.ID;
    const newId = uuidv4();
    const newTravel: TravelType = { id: newId, ownerId: userID, ...travel };
    const createdTravel = this.travelModel.create(newTravel);
    return createdTravel;
  }
}
