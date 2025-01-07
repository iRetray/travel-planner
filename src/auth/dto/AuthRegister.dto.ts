import { IsString, MinLength } from 'class-validator';

export class AuthRegisterDto {
  @IsString()
  @MinLength(3)
  displayName: string;
  @IsString()
  @MinLength(3)
  username: string;
  @IsString()
  @MinLength(3)
  password: string;
}
