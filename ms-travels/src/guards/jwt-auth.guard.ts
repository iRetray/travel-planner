import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(error: any, user: any) {
    console.log('✅ JWT Auth Guard');
    if (error || !user) {
      console.log('❌ Session expired or invalid token');
      throw new UnauthorizedException(
        'Your session has expired or the token is invalid. Please log in again.',
      );
    }
    console.log('✅ Session is valid');
    return user;
  }
}
