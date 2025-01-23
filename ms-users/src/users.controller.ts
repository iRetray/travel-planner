import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto, GetUserDto, IsUsernameAvailableDto } from './dto';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'GET_USER' })
  async getUser(data: GetUserDto) {
    const { username } = data;
    return await this.usersService.getUser(username);
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
