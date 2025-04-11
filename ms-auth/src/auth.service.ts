import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/AuthLogin.dto';
import { AuthRegisterDto } from './dto/AuthRegister.dto';
import { UserDto } from './interfaces/User.dto';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Model } from 'mongoose';
import { InvalidTokenMongoType } from './interfaces/invalidToken.schema';

const ENCRYPTION_CONFIG = {
  saltRounds: 10,
};

@Injectable()
export class AuthService {
  private msUsersClient: ClientProxy;

  constructor(
    private jwtService: JwtService,
    @Inject('INVALID_TOKEN_MODEL')
    private readonly invalidTokenModel: Model<InvalidTokenMongoType>,
  ) {
    const port = parseInt(process.env.TCP_PORT_MS_USERS) || 3003;
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

  async logout(user: AuthLoginDto) {
    // TODO: logout
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

  async register(user: AuthRegisterDto) {
    console.log('✅ Service method [register] (user)', user);
    const isUsernameAvailable = await new Promise<boolean>(
      (resolve, reject) => {
        this.msUsersClient
          .send({ cmd: 'IS_USERNAME_AVAILABLE' }, { username: user.username })
          .subscribe({
            next: resolve,
            error: reject,
          });
      },
    );
    if (!isUsernameAvailable) {
      console.log('❌ Username already taken!');
      throw new ConflictException('Username already taken!');
    }
    const newUser: UserDto = {
      ID: uuidv4(),
      displayName: user.displayName,
      username: user.username,
      passwordHash: await this.getHash(user.password),
    };
    const createdUser = await new Promise<UserDto>((resolve, reject) => {
      this.msUsersClient.send({ cmd: 'CREATE_USER' }, newUser).subscribe({
        next: resolve,
        error: reject,
      });
    });
    console.log('✅ (createdUser)', createdUser);
    if (!createdUser) {
      console.log('❌ Error creating new user');
      throw new BadRequestException('User could not be created!');
    }
    return { message: 'User created successfully!' };
  }

  async invalidateToken(token: string): Promise<void> {
    console.log('✅ Service method [invalidateToken] (token)', token);
    await this.invalidTokenModel.create({ token });
    console.log('✅ Token invalidated');
  }

  async isTokenValid(token: string): Promise<boolean> {
    const creado = await this.invalidateToken('ABC');
    console.log('✅ Service method [isTokenInvalidated] (creado)', creado);
    console.log('✅ Service method [isTokenInvalidated] (token)', token);
    const result = await this.invalidTokenModel.findOne({ token }).exec();
    console.log('✅ (isTokenInvalidated)', !!!result);
    return !!!result;
  }
}
