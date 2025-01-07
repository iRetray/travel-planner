import { ConfigProps } from './config.interface';

export const ENV_CONFIG = (): ConfigProps => ({
  jwtSecret: process.env.JWT_SECRET,
  mongoUri: process.env.MONGO_DB_URI,
});
