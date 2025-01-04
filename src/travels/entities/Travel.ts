import { IsString } from 'class-validator';

export class TravelType {
  @IsString()
  id: string;
  @IsString()
  name: string;
  @IsString()
  description: string;
}
