import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

import { CreateTravelDto, DecodedTokenType, GetTravelDto } from './dto';
import { TravelType } from './interfaces/Travel';
import { TravelMongoType } from './interfaces/travel.interface';
import { Model } from 'mongoose';

import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { UserDto } from './interfaces/User.dto';

@Injectable()
export class TravelsService {
  private msUsersClient: ClientProxy;

  constructor(
    @Inject('TRAVEL_MODEL')
    private readonly travelModel: Model<TravelMongoType>,
  ) {
    const port = parseInt(process.env.MS_USERS_PORT) || 3000;
    this.msUsersClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port },
    });
  }

  getTravel(id: GetTravelDto['id']) {
    return this.travelModel
      .findOne({ id })
      .exec()
      .then((travel) => {
        if (!travel) {
          throw new NotFoundException(`Travel with id '${id}' not found`);
        }
        return travel;
      });
  }

  getTravels(): Promise<TravelType[]> {
    return this.travelModel.find().exec();
  }

  async createTravel(
    travel: CreateTravelDto,
    decodedToken: DecodedTokenType,
  ): Promise<TravelType> {
    const username = decodedToken.username;
    const currentUser = await new Promise<UserDto>((resolve, reject) => {
      this.msUsersClient.send({ cmd: 'GET_USER' }, { username }).subscribe({
        next: resolve,
        error: reject,
      });
    });
    const userID = currentUser.ID;
    const newId = uuidv4();
    const newTravel: TravelType = { id: newId, ownerId: userID, ...travel };
    const createdTravel = this.travelModel.create(newTravel);
    return createdTravel;
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
    const user = await new Promise<UserDto>((resolve, reject) => {
      this.msUsersClient.send({ cmd: 'GET_USER' }, { username }).subscribe({
        next: resolve,
        error: reject,
      });
    });
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
}
