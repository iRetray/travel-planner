import { IsString, MinLength } from 'class-validator';

export class GetUserDto {
  @IsString()
  @MinLength(3)
  username: string;
}
