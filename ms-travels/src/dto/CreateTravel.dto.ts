import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateTravelDto {
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
}

export class DecodedTokenType {
  username: string;
  password: string;
}
