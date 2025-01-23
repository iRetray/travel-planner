import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class VerifyOwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    const authorization = headers.authorization;
    // TODO: Check the auth ownership before

    return true;
  }
}
