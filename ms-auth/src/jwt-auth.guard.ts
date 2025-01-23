import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(error: any, user: any) {
    console.log('launching guard');
    if (error || !user) {
      throw new UnauthorizedException(
        'Your session has expired or the token is invalid. Please log in again.',
      );
    }
    return user;
  }
}
