import { Document } from 'mongoose';

export interface InvalidTokenMongoType extends Document {
  readonly token: string;
  readonly isInvalid: boolean;
}
