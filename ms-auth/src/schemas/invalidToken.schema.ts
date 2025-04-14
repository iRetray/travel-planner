import * as mongoose from 'mongoose';

export const InvalidTokenSchema = new mongoose.Schema({
  token: String,
  isInvalid: Boolean,
});
