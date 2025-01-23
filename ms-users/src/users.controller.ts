import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto, GetUserDto, IsUsernameAvailableDto } from './dto';

import { UsersService } from './users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/getUser/:username')
  getUser(@Param() params: GetUserDto) {
    return this.usersService.getUser(params.username);
  }

  @Post('/createUser')
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

  @Get('/isUsernameAvailable/:username')
  isUsernameAvailable(@Param() params: IsUsernameAvailableDto) {
    return this.usersService.isUsernameAvailable(params.username);
  }
}
