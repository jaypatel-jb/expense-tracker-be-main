import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  uploadWallpaper,
  getWallpapers,
  getWallpaperById,
  updateWallpaper,
  deleteWallpaper,
} from '../controllers/wallpaper.controller';
import { protect, admin } from '../middleware/auth.middleware';
import { validateRequest, schemas } from '../middleware/validation.middleware';

const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/wallpapers');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  },
});

// File filter - only allow images
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  // limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Wallpaper routes
router.route('/')
  .post(protect, admin, upload.array('images', 10), uploadWallpaper)
  .get(protect, admin, getWallpapers);

router.route('/:id')
  .get(protect, admin, getWallpaperById)
  .put(protect, admin, upload.array('images', 10), updateWallpaper)
  .delete(protect, admin, deleteWallpaper);

export default router;