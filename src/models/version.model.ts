import mongoose, { Document, Schema } from 'mongoose';

export interface IVersion extends Document {
  name: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const versionSchema = new Schema<IVersion>(
  {
    name: {
      type: String,
      required: [true, 'Version name is required'],
      trim: true,
    },
    version: {
      type: Number,
      required: [true, 'Version number is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Version = mongoose.model<IVersion>('Version', versionSchema);

export default Version;