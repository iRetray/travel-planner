import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto, GetUserDto, IsUsernameAvailableDto } from './dto';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'GET_USER' })
  async getUser(data: GetUserDto) {
    console.log(
      '✅ Controller handling method [getUser] from TCP (data)',
      data,
    );
    const { username } = data;
    const user = await this.usersService.getUser(username);
    console.log('✅ Returning object (user)', user);
    return user;
  }

  @Post('/createUser')
  createUser(@Body() body: CreateUserDto) {
    console.log('✅ Controller handling method /createUser (body)', body);
    return this.usersService.createUser(body);
  }

  @Get('/isUsernameAvailable/:username')
  isUsernameAvailable(@Param() params: IsUsernameAvailableDto) {
    console.log(
      '✅ Controller handling method /isUsernameAvailable/:username (params)',
      params,
    );
    return this.usersService.isUsernameAvailable(params.username);
  }
}
