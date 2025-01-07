import { Document } from 'mongoose';

export interface TravelMongoType extends Document {
  readonly id: string;
  readonly name: string;
  readonly description: string;
}
