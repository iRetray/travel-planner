import { IsString } from 'class-validator';

export class TravelDto {
  @IsString()
  id: string;
  @IsString()
  name: string;
  @IsString()
  description: string;
}
