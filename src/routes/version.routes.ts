import express from 'express';
import {
  createVersion,
  getVersions,
  getVersionById,
  updateVersion,
  deleteVersion,
} from '../controllers/version.controller';
import { protect, admin } from '../middleware/auth.middleware';
import { validateRequest, schemas } from '../middleware/validation.middleware';

const router = express.Router();

// Version routes
router.route('/')
  .post(protect, admin, validateRequest(schemas.createVersion), createVersion)
  .get(protect, admin, getVersions);

router.route('/:id')
  .get(protect, admin, getVersionById)
  .put(protect, admin, validateRequest(schemas.updateVersion), updateVersion)
  .delete(protect, admin, deleteVersion);

export default router;