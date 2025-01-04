import { Injectable, NotFoundException } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { CreateTravelDto, GetTravelDto } from './dto';
import { TravelType } from './entities/Travel';

@Injectable()
export class TravelsService {
  private travels: TravelType[] = [];

  getTravel(id: GetTravelDto['id']) {
    const searchedTravel = this.travels.find((travel) => travel.id === id);
    if (searchedTravel) {
      return searchedTravel;
    }
    throw new NotFoundException(`Travel with id '${id}' not found`);
  }

  getTravels() {
    return this.travels;
  }

  createTravel(travel: CreateTravelDto) {
    const newId = uuidv4();
    const newTravel = { id: newId, ...travel };
    this.travels.push(newTravel);
    return { message: 'Travel created successfully!', travel: newTravel };
  }
}
