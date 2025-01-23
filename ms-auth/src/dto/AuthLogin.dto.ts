import { IsString, MinLength } from 'class-validator';

export class AuthLoginDto {
  @IsString()
  @MinLength(3)
  username: string;
  @IsString()
  @MinLength(3)
  password: string;
}
