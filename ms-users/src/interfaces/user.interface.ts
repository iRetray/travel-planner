import { Document } from 'mongoose';

export interface UserMongoType extends Document {
  readonly ID: string;
  readonly displayName: string;
  readonly username: string;
  readonly passwordHash: string;
}
