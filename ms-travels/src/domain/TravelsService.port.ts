import { CreateTravelDto, GetTravelDto } from 'src/dto';
import { TravelType } from 'src/interfaces/Travel';

export interface TravelsServicePort {
  getTravel(id: GetTravelDto['id'], username: string): Promise<TravelType>;
  getTravelsByUsername(username: string): Promise<TravelType[]>;
  createTravel(travel: CreateTravelDto, username: string): Promise<TravelType>;
  editTravel(
    id: GetTravelDto['id'],
    updates: CreateTravelDto,
    username: string,
  ): Promise<TravelType>;
  deleteTravel(
    id: GetTravelDto['id'],
    username: string,
  ): Promise<{ message: string }>;
}
