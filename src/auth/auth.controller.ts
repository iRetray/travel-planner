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
    return this.authService.login(body);
  }

  @UsePipes(new ValidationPipe())
  @Post('/register')
  async register(@Body() body: AuthRegisterDto) {
    return this.authService.register(body);
  }
}
