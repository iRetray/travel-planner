import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  ID: String,
  displayName: String,
  username: String,
  passwordHash: String,
});
