import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Headers,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

import { AuthLoginDto } from './dto/AuthLogin.dto';
import { AuthRegisterDto } from './dto/AuthRegister.dto';
import { TokenDto } from './dto/TokenDto.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @UsePipes(new ValidationPipe())
  @Post('/login')
  async login(@Body() body: AuthLoginDto) {
    console.log('✅ Controller handling method /login');
    return this.authService.login(body);
  }

  @UsePipes(new ValidationPipe())
  @Post('/register')
  async register(@Body() body: AuthRegisterDto) {
    console.log('✅ Controller handling method /register (body)', body);
    return this.authService.register(body);
  }

  @UsePipes(new ValidationPipe())
  @Post('/logout')
  async logout(@Headers('authorization') authorization: string) {
    const token = authorization.split(' ')[1];
    console.log('✅ Controller handling method /logout (token)', token);
    return this.authService.logout(token);
  }

  @MessagePattern({ cmd: 'IS_TOKEN_VALID' })
  async isTokenValid(data: TokenDto) {
    console.log(
      '✅ Controller handling method [isTokenValid] from TCP (data)',
      data,
    );
    const { token } = data;
    return this.authService.isTokenValid(token);
  }
}
