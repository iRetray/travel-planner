import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TravelsService } from '../travels.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private travelsService: TravelsService) {
    console.log('✅ LocalStrategy Guard with Passport');
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    console.log(
      '✅ LocalStrategy method validate (username)',
      username,
      '(password)',
      password,
    );
    const user = await this.travelsService.validateUser(username, password);
    if (!user) {
      console.log('❌ User not found or invalid credentials');
      throw new UnauthorizedException();
    }
    console.log('✅ User validated! RETURN (user)', user);
    return user;
  }
}
