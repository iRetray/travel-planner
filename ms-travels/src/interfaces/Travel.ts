import { IsArray, IsNumber, IsString } from 'class-validator';

export class TravelType {
  @IsString()
  id: string;
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsNumber()
  startDate: number;
  @IsNumber()
  endDate: number;
  @IsString()
  destination: string;
  @IsArray()
  activities: string[];
  @IsString()
  ownerId: string;
}
