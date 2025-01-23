import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  ID: string;
  @IsString()
  @MinLength(3)
  displayName: string;
  @IsString()
  @MinLength(3)
  username: string;
  @IsString()
  @MinLength(3)
  passwordHash: string;
}
