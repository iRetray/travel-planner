import { Document } from 'mongoose';

export interface TravelMongoType extends Document {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly startDate: number;
  readonly endDate: number;
  readonly destination: string;
  readonly activities: string[];
  readonly ownerId: string;
}
