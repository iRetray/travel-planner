import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(error: any, user: any) {
    console.log('✅ JwtAuthGuard method handleRequest');
    if (error || !user) {
      console.log('❌ User not found or error occurred (error)', error);
      throw new UnauthorizedException(
        'Your session has expired or the token is invalid. Please log in again.',
      );
    }
    console.log('✅ Returning user');
    return user;
  }
}
