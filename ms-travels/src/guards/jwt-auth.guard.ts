import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  private msAuthClient: ClientProxy;

  constructor() {
    super();
    const port = parseInt(process.env.TCP_PORT_MS_AUTH) || 3002;
    this.msAuthClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port },
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('✅ JWT canActivate');
    const can = (await super.canActivate(context)) as boolean;
    if (!can) {
      console.log('❌ (can) is false');
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      console.log('❌ Token not provided');
      throw new UnauthorizedException('No token provided');
    }

    console.log('✅ Launching request to GET USER TCP');

    const isTokenValid = await new Promise<boolean>((resolve, reject) => {
      this.msAuthClient.send({ cmd: 'IS_TOKEN_VALID' }, { token }).subscribe({
        next: resolve,
        error: reject,
      });
    });

    console.log('✅ (isTokenValid)', isTokenValid);

    if (!isTokenValid) {
      throw new UnauthorizedException('Token has been invalidated (logout)');
    }

    console.log('✅ JWT canActivate (response BOOLEAN) ', true);
    return true;
  }

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
