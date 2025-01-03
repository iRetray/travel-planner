import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/User.dto';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
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

  findUser(username: string): UserDto | undefined {
    return this.users.find((user) => user.username === username);
  }
}
