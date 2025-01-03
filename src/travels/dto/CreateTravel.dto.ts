import { IsString } from 'class-validator';

export class CreateTravelDto {
  @IsString()
  name: string;
  @IsString()
  description: string;
}
