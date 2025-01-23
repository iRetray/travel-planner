import { IsString, MinLength } from 'class-validator';

export class IsUsernameAvailableDto {
  @IsString()
  @MinLength(3)
  username: string;
}
