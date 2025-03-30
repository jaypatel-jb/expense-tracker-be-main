import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { env } from "../config/env"
import User from "../models/userList.model"
import Admin from "../models/user.model"
import { generateOrderId, resendOTP, sendOTP, verifyOTP } from "../utils/otpless"

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password, mobileNumber } = req.body

    // Check if user already exists
    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      })
    }

    // Create user with isVerified set to false
    const user = await User.create({
      name,
      email,
      password,
      mobileNumber,
      isAdmin: false,
      isVerified: false
    })

    // Generate orderId for OTP
    const orderId = generateOrderId()

    // Send OTP
    const otpResponse = await sendOTP({
      phoneNumber: mobileNumber,
      email,
      orderId
    })
    console.log("🚀 ~ signup ~ otpResponse:", otpResponse)

    if (!otpResponse?.orderId) {
      // If OTP sending fails, delete the created user
      await User.findByIdAndDelete(user._id)

      return res.status(400).json({
        success: false,
        message: "Failed to send OTP",
        error: otpResponse.message
      })
    }

    res.status(201).json({
      success: true,
      message: "OTP sent successfully",
      data: {
        _id: user._id,
        orderId
      }
    })
  } catch (error) {
    console.error("Signup error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email }).select("+password")

    // Check if user exists and password matches
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      })
    }

    // Check if user is verified
    if (!user.isVerified) {
      // Generate orderId for OTP
      const orderId = generateOrderId()

      // Send OTP
      await sendOTP({
        phoneNumber: user.mobileNumber || "",
        email: user.email,
        orderId
      })

      return res.status(403).json({
        success: false,
        message: "Account not verified. OTP has been sent to your mobile number.",
        data: {
          _id: user._id,
          orderId,
          requiresVerification: true
        }
      })
    }

    // Generate token
    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token
      }
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findById(req.user?.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        coins: user.coins
      }
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

// @desc    Resend OTP to user
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendUserOTP = async (req: Request, res: Response): Promise<any> => {
  try {
    const { orderId } = req.body

    const otpResponse = await resendOTP({ orderId })

    if (!otpResponse.orderId) {
      return res.status(400).json({
        success: false,
        message: otpResponse.message || "Failed to resend OTP",
        error: otpResponse.message || otpResponse?.reason || otpResponse?.errorMessage
      })
    }

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
      data: {
        orderId
      }
    })
  } catch (error) {
    console.error("Resend OTP error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

// @desc    Admin login
// @route   POST /api/auth/admin-login
// @access  Public
export const adminLogin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await Admin.findOne({ email }).select("+password")

    // Check if user exists and password matches
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      })
    }

    // Check if user is an admin
    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized as an admin"
      })
    }

    // Generate token
    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token
      }
    })
  } catch (error) {
    console.error("Admin login error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

// @desc    Verify OTP and complete user registration
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyUserOTP = async (req: Request, res: Response): Promise<any> => {
  try {
    const { phoneNumber, orderId, otp, email } = req.body

    const otpResponse = await verifyOTP({
      phoneNumber,
      orderId,
      otp,
      email
    })

    if (!otpResponse.isOTPVerified) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
        error: otpResponse.message || otpResponse?.reason || otpResponse?.errorMessage
      })
    }

    // Find user by phone number and update verification status
    const user = await User.findOne({ mobileNumber: phoneNumber })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    // Update user verification status
    user.isVerified = true
    await user.save()

    // Generate token
    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        coins: user.coins,
        token
      }
    })
  } catch (error) {
    console.error("Verify OTP error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

// Generate JWT token
const generateToken = (id: string) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: "30d"
  })
}
