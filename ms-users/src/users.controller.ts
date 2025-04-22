import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto, GetUserDto, IsUsernameAvailableDto } from './dto';

import { UsersServiceAdapter } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersServiceAdapter) {}

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

  @MessagePattern({ cmd: 'CREATE_USER' })
  createUser(data: CreateUserDto) {
    console.log(
      '✅ Controller handling method [createUser] from TCP (data)',
      data,
    );
    return this.usersService.createUser(data);
  }

  @MessagePattern({ cmd: 'IS_USERNAME_AVAILABLE' })
  isUsernameAvailable(data: IsUsernameAvailableDto) {
    console.log(
      '✅ Controller handling method [isUsernameAvailable] from TCP (data)',
      data,
    );
    return this.usersService.isUsernameAvailable(data.username);
  }
}
