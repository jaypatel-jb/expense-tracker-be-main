import { Request, Response } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

// Helper function to generate JWT token
const generateToken = (id: string) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Create initial admin user without authentication
// @route   POST /api/setup/admin
// @access  Public
export const createInitialAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password, mobileNumber } = req.body;

    // Check if any admin already exists
    const adminCount = await User.countDocuments({ isAdmin: true });

    if (adminCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Admin users already exist. Use the regular admin creation endpoint.",
      });
    }

    // Check if admin with this email already exists
    const adminExists = await User.findOne({ email });

    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create admin user
    const admin = await User.create({
      name,
      email,
      password,
      mobileNumber,
      isAdmin: true,
    });

    // Generate token
    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        isAdmin: admin.isAdmin,
        token,
      },
      message: "Initial admin created successfully",
    });
  } catch (error) {
    console.error("Create initial admin error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};