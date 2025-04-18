import * as mongoose from 'mongoose';

export const TravelSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    description: String,
    startDate: Number,
    endDate: Number,
    destination: String,
    activities: [String],
    ownerId: String,
  },
  {
    toJSON: {
      transform: (_doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);
