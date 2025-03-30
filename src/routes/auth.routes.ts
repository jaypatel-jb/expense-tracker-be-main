import express from "express";
import {
  signup,
  login,
  adminLogin,
  getProfile,
  resendUserOTP,
  verifyUserOTP,
} from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";
import { validateRequest, schemas } from "../middleware/validation.middleware";

const router = express.Router();

// Auth routes
router.post("/signup", validateRequest(schemas.signup), signup);
router.post("/login", validateRequest(schemas.login), login);
router.post("/admin-login", validateRequest(schemas.login), adminLogin);
router.get("/profile", protect, getProfile);

// OTP verification routes
router.post("/resend-otp", validateRequest(schemas.resendOTP), resendUserOTP);
router.post("/verify-otp", validateRequest(schemas.verifyOTP), verifyUserOTP);

export default router;
