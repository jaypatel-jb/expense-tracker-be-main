import mongoose, { Document, Schema } from 'mongoose';

export interface IWallpaper extends Document {
  name: string;
  imagePaths: string[];
  createdAt: Date;
  updatedAt: Date;
}

const wallpaperSchema = new Schema<IWallpaper>(
  {
    name: {
      type: String,
      required: [true, 'Wallpaper name is required'],
      trim: true,
    },
    imagePaths: {
      type: [String],
      required: [true, 'At least one image is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search functionality
wallpaperSchema.index({ name: 'text' });

const Wallpaper = mongoose.model<IWallpaper>('Wallpaper', wallpaperSchema);

export default Wallpaper;