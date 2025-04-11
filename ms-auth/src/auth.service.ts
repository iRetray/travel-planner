import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/AuthLogin.dto';
import { AuthRegisterDto } from './dto/AuthRegister.dto';
import { UserDto } from './interfaces/User.dto';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

const ENCRYPTION_CONFIG = {
  saltRounds: 10,
};

@Injectable()
export class AuthService {
  private msUsersClient: ClientProxy;

  constructor(private jwtService: JwtService) {
    const port = parseInt(process.env.MS_USERS_PORT) || 3000;
    this.msUsersClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port },
    });
  }

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
    console.log(
      '✅ Service method [validateUser] (username)',
      username,
      '(password)',
      password,
    );
    const user = await new Promise<UserDto>((resolve, reject) => {
      this.msUsersClient.send({ cmd: 'GET_USER' }, { username }).subscribe({
        next: resolve,
        error: reject,
      });
    });
    console.log('✅ (user)', user);
    const isUsernameValid = typeof user !== 'undefined';
    if (!isUsernameValid) {
      console.log('❌ User not found');
      throw new NotFoundException("User doesn't exist!");
    }
    const isCorrectPassword = await this.areHashesEquals(
      password,
      user.passwordHash,
    );
    if (!isCorrectPassword) {
      console.log('❌ Password is not correct');
      throw new InternalServerErrorException('Incorrect password!');
    }
    console.log('✅ Returning user (user)', user);
    return user;
  }

  async login(user: AuthLoginDto) {
    console.log('✅ Service method [login] (user)', user);
    const currentUser = await new Promise<UserDto>((resolve, reject) => {
      this.msUsersClient
        .send({ cmd: 'GET_USER' }, { username: user.username })
        .subscribe({
          next: resolve,
          error: reject,
        });
    });
    console.log('✅ (currentUser)', currentUser);
    const hashedPassword = await this.getHash(user.password);
    console.log('✅ (hashedPassword)', hashedPassword);
    const userWithHashedPassword = {
      ...user,
      password: hashedPassword,
    };
    return {
      message: 'User logged in successfully!',
      description: `Welcome ${currentUser.displayName}`,
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
