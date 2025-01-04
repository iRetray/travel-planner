import { ConfigProps } from './config.interface';

export const CONFIG = (): ConfigProps => ({
  jwtSecret: process.env.JWT_SECRET,
});
