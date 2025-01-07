import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from './interfaces/User.dto';

import { v4 as uuidv4 } from 'uuid';
import { Model } from 'mongoose';
import { UserMongoType } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_MODEL')
    private readonly userModel: Model<UserMongoType>,
  ) {}

  private readonly users: UserDto[] = [
    {
      ID: uuidv4(),
      displayName: 'Julian Cruz',
      username: 'jcruz',
      passwordHash:
        '$2b$10$yglieiYnY1ofpcWgpaWw8.KNArVc8YwnETq/GmMgMy2LoZFAwvBFS', // 12345 no hashed
    },
    {
      ID: uuidv4(),
      displayName: 'Juliana Daniela',
      username: 'morejuli',
      passwordHash: '567',
    },
  ];

  findUser(username: string): Promise<UserDto> {
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
        const isUsernameAvailable = typeof foundUser === 'undefined';
        return isUsernameAvailable;
      });
  }
}
