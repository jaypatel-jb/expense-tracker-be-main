import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createAdmin,
} from "../controllers/user.controller";
import { protect, admin } from "../middleware/auth.middleware";
import { validateRequest, schemas } from "../middleware/validation.middleware";

const router = express.Router();

// User routes
router
  .route("/")
  .post(protect, admin, validateRequest(schemas.createUser), createUser)
  .get(protect, admin, getUsers);

// Admin creation route
router
  .route("/admin")
  .post(protect, admin, validateRequest(schemas.createAdmin), createAdmin);

// Initial admin creation route (no auth required)
router
  .route("/init-admin")
  .post(validateRequest(schemas.createAdmin), createAdmin);

router
  .route("/:id")
  .get(protect, admin, getUserById)
  .put(protect, admin, validateRequest(schemas.updateUser), updateUser)
  .delete(protect, admin, deleteUser);

export default router;
