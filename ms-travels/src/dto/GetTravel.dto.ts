import { IsString, MinLength } from 'class-validator';

export class GetTravelDto {
  @IsString()
  @MinLength(3)
  id: string;
}
