import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

/* import { v4 as uuidv4 } from 'uuid'; */

/* import { UsersService } from '../users/users.service'; */
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/AuthLogin.dto';
import { AuthRegisterDto } from './dto/AuthRegister.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserDto } from './interfaces/User.dto';

const ENCRYPTION_CONFIG = {
  saltRounds: 10,
};

@Injectable()
export class AuthService {
  constructor(
    /* private usersService: UsersService, */
    private jwtService: JwtService,
  ) {}

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
    /* const user = await this.usersService.getUser(username); */
    const user = '' as any;
    const isUsernameValid = typeof user !== 'undefined';
    if (!isUsernameValid) {
      throw new NotFoundException("User doesn't exist!");
    }
    const isCorrectPassword = await this.areHashesEquals(
      password,
      user.passwordHash,
    );
    if (!isCorrectPassword) {
      throw new InternalServerErrorException('Incorrect password!');
    }
    return user;
  }

  async login(user: AuthLoginDto) {
    const hashedPassword = await this.getHash(user.password);
    const userWithHashedPassword = {
      ...user,
      password: hashedPassword,
    };
    /* const userObject = await this.usersService.getUser(user.username); */
    const userObject = '' as any;
    return {
      message: 'User logged in successfully!',
      description: `Welcome ${userObject.displayName}`,
      access_token: this.jwtService.sign(userWithHashedPassword),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async register(user: AuthRegisterDto) {
    const isUsernameAvailable = true;
    /* const isUsernameAvailable = this.usersService.isUsernameAvailable(
      user.username,
    ); */
    if (!isUsernameAvailable) {
      throw new ConflictException('Username already taken!');
    }
    /* const newUser: UserDto = {
      ID: uuidv4(),
      displayName: user.displayName,
      username: user.username,
      passwordHash: await this.getHash(user.password),
    }; */
    const createdUser = '' as any;
    /* const createdUser = await this.usersService.createUser(newUser); */
    if (!createdUser) {
      throw new BadRequestException('User could not be created!');
    }
    return { message: 'User created successfully!' };
  }
}
