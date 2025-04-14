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
    console.log('✅ TravelsService constructor');
    const port = parseInt(process.env.TCP_PORT_MS_USERS) || 3000;
    this.msUsersClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port },
    });
    console.log('✅ MS Users connected by TCP at port:', port);
  }

  getTravel(id: GetTravelDto['id']) {
    console.log('✅ Metodo [getTravel] (id)', id);
    return this.travelModel
      .findOne({ id })
      .exec()
      .then((travel) => {
        if (!travel) {
          console.log('❌ Travel not found');
          throw new NotFoundException(`Travel with id '${id}' not found`);
        }
        console.log('✅ (travel)', travel);
        return travel;
      });
  }

  async getTravelsByUsername(username: string): Promise<TravelType[]> {
    console.log('✅ Metodo [getTravelsByUsername] (username)', username);
    const currentUser = await new Promise<UserDto>((resolve, reject) => {
      this.msUsersClient.send({ cmd: 'GET_USER' }, { username }).subscribe({
        next: resolve,
        error: reject,
      });
    });
    const currentOwner = currentUser.ID;
    return this.travelModel
      .find()
      .exec()
      .then((travels) => {
        if (travels) {
          return travels.filter((travel) => travel.ownerId === currentOwner);
        }
        return [];
      });
  }

  async createTravel(
    travel: CreateTravelDto,
    username: string,
  ): Promise<TravelType> {
    const currentUser = await new Promise<UserDto>((resolve, reject) => {
      this.msUsersClient.send({ cmd: 'GET_USER' }, { username }).subscribe({
        next: resolve,
        error: reject,
      });
    });
    const userID = currentUser.ID;
    const newId = uuidv4();
    const newTravel: TravelType = { id: newId, ownerId: userID, ...travel };
    console.log('✅ (newTravel)', newTravel);
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
}
