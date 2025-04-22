import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from './interfaces/User.dto';

import { v4 as uuidv4 } from 'uuid';
import { Model } from 'mongoose';
import { UserMongoType } from './interfaces/user.interface';
import { UsersServicePort } from './domain/UsersService.port';

@Injectable()
export class UsersServiceAdapter implements UsersServicePort {
  constructor(
    @Inject('USER_MODEL')
    private readonly userModel: Model<UserMongoType>,
  ) {}

  getUser(username: string): Promise<UserDto> {
    return this.userModel
      .findOne({ username })
      .select('-_id -__v')
      .exec()
      .then((foundUser) => {
        if (!foundUser) {
          throw new NotFoundException('Username is not registered!');
        }
        return foundUser;
      });
  }

  createUser(user: UserDto): Promise<UserDto> {
    const newId = uuidv4();
    const newUser = { id: newId, ...user };
    const createdUser = this.userModel.create(newUser);
    return createdUser;
  }

  isUsernameAvailable(username: string): Promise<boolean> {
    return this.userModel
      .findOne({ username })
      .select('-_id -__v')
      .exec()
      .then((foundUser) => {
        console.log('✅ Buscando usuario (username): ', username);
        const isUsernameInDatabase = !!foundUser;
        console.log('✅ (isUsernameInDatabase) ', isUsernameInDatabase);
        return !isUsernameInDatabase;
      });
  }
}
