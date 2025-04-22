import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

import { CreateTravelDto, GetTravelDto } from './dto';
import { TravelType } from './interfaces/Travel';
import { TravelMongoType } from './interfaces/travel.interface';
import { Model } from 'mongoose';

import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { UserDto } from './interfaces/User.dto';
import { TravelsServicePort } from './domain/TravelsService.port';

@Injectable()
export class TravelsServiceAdapter implements TravelsServicePort {
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

  async getTravel(
    id: GetTravelDto['id'],
    username: string,
  ): Promise<TravelType> {
    console.log('✅ Metodo [getTravel] (id)', id);
    const currentUser = await new Promise<UserDto>((resolve, reject) => {
      this.msUsersClient.send({ cmd: 'GET_USER' }, { username }).subscribe({
        next: resolve,
        error: reject,
      });
    });
    const currentOwner = currentUser.ID;
    return this.travelModel
      .findOne({ id })
      .exec()
      .then((travel) => {
        if (!travel) {
          console.log('❌ Travel not found');
          throw new NotFoundException(`Travel with id '${id}' not found`);
        }
        if (currentOwner !== travel.ownerId) {
          console.log('❌ This travel is not yours!');
          throw new ForbiddenException(`Travel with id '${id}' is not yours`);
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
    const newTravel: TravelType = {
      id: newId,
      ownerId: userID,
      ...travel,
    };
    console.log('✅ (newTravel)', newTravel);
    const createdTravel = this.travelModel.create(newTravel);
    return createdTravel;
  }

  async editTravel(
    id: GetTravelDto['id'],
    updates: CreateTravelDto,
    username: string,
  ): Promise<TravelType> {
    console.log('✅ Metodo [editTravel]');
    console.log('(id)', id);
    console.log('(updates)', JSON.stringify(updates));
    console.log('(username)', username);
    const currentUser = await new Promise<UserDto>((resolve, reject) => {
      this.msUsersClient.send({ cmd: 'GET_USER' }, { username }).subscribe({
        next: resolve,
        error: reject,
      });
    });

    const currentOwner = currentUser.ID;
    const travel = await this.travelModel.findOne({ id }).exec();
    if (!travel) {
      console.log(`❌ Travel with id ${id} not found`);
      throw new NotFoundException(`Travel with id '${id}' not found`);
    }
    if (travel.ownerId !== currentOwner) {
      console.log('❌ This travel is not yours!');
      throw new ForbiddenException(`You are not allowed to update this travel`);
    }

    const updatedTravel = await this.travelModel
      .findOneAndUpdate({ id }, { $set: updates }, { new: true })
      .exec();
    console.log('✅ Travel updated:', updatedTravel);

    return updatedTravel;
  }

  async deleteTravel(
    id: GetTravelDto['id'],
    username: string,
  ): Promise<{ message: string }> {
    const currentUser = await new Promise<UserDto>((resolve, reject) => {
      this.msUsersClient.send({ cmd: 'GET_USER' }, { username }).subscribe({
        next: resolve,
        error: reject,
      });
    });

    const currentOwner = currentUser.ID;
    const travel = await this.travelModel.findOne({ id }).exec();

    if (!travel) {
      console.log(`❌ Travel with id ${id} not found`);
      throw new NotFoundException(`Travel with id '${id}' not found`);
    }

    if (travel.ownerId !== currentOwner) {
      console.log('❌ This travel is not yours!');
      throw new ForbiddenException(`You are not allowed to delete this travel`);
    }

    await this.travelModel.deleteOne({ id }).exec();
    console.log(`✅ Travel with id ${id} deleted successfully`);

    return { message: `Travel with id '${id}' deleted successfully` };
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
