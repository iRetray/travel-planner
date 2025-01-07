import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { CreateTravelDto, GetTravelDto } from './dto';
import { TravelType } from './interfaces/Travel';
import { TravelMongoType } from './interfaces/travel.interface';
import { Model } from 'mongoose';

@Injectable()
export class TravelsService {
  constructor(
    @Inject('TRAVEL_MODEL')
    private readonly travelModel: Model<TravelMongoType>,
  ) {}

  getTravel(id: GetTravelDto['id']) {
    return this.travelModel
      .findOne({ id })
      .select('-_id -__v')
      .exec()
      .then((travel) => {
        if (!travel) {
          throw new NotFoundException(`Travel with id '${id}' not found`);
        }
        return travel;
      });
  }

  getTravels(): Promise<TravelType[]> {
    return this.travelModel.find().select('-_id -__v').exec();
  }

  createTravel(travel: CreateTravelDto): Promise<TravelType> {
    const newId = uuidv4();
    const newTravel = { id: newId, ...travel };
    const createdTravel = this.travelModel.create(newTravel);
    return createdTravel;
  }
}
