import { Mongoose } from 'mongoose';
import { TravelSchema } from './schemas/travel.schema';

export const travelsProviders = [
  {
    provide: 'TRAVEL_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('Travel', TravelSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
