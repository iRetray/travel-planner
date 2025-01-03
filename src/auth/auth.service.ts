import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

const ENCRYPTION_CONFIG = {
  saltRounds: 10,
};

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  private async getHash(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, ENCRYPTION_CONFIG.saltRounds, (error, hash) => {
        if (error) {
          reject(error);
        }
        resolve(hash);
      });
    });
  }

  private async areHashesEquals(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, (error, isEqual) => {
        if (error) {
          reject(error);
        }
        resolve(isEqual);
      });
    });
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findUser(username);
    const isUsernameValid = typeof user !== 'undefined';
    if (!isUsernameValid) {
      return null;
    }
    const isCorrectPassword = await this.areHashesEquals(
      password,
      user.passwordHash,
    );
    if (isUsernameValid && isCorrectPassword) {
      return user;
    }
    return null;
  }
}
