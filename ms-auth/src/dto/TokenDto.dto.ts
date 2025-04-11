import { IsString, MinLength } from 'class-validator';

export class TokenDto {
  @IsString()
  @MinLength(3)
  token: string;
}
