import * as mongoose from 'mongoose';

const MONGO_DB_URI = 'mongodb://localhost/travel-planner';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> => mongoose.connect(MONGO_DB_URI),
  },
];
