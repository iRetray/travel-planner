import { Document } from 'mongoose';

export interface InvalidTokenMongoType extends Document {
  readonly isInvalid: boolean;
}
