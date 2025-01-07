import * as mongoose from 'mongoose';

export const TravelSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
});
