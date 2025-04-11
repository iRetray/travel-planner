import { Mongoose } from 'mongoose';
import { InvalidTokenSchema } from './schemas/invalidToken.schema';

export const authProviders = [
  {
    provide: 'INVALID_TOKEN_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('InvalidToken', InvalidTokenSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
