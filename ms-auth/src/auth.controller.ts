import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

import { AuthLoginDto } from './dto/AuthLogin.dto';
import { AuthRegisterDto } from './dto/AuthRegister.dto';

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

  /* TODO: Create method to Logout */
}
