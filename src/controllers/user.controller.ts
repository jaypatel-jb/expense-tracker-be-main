import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { env } from "../config/env"
import User from "../models/user.model"
import UserList from "../models/userList.model"

// @desc    Create a new user
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, mobileNumber, coins, email, password } = req.body

    // Check if user with email already exists
    const userExists = await UserList.findOne({ email })

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      })
    }

    // Create new user
    const user = await UserList.create({
      name,
      mobileNumber,
      coins,
      email,
      password,
      isVerified: true
    })

    res.status(201).json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error("Create user error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response) => {
  try {
    // Add pagination
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    // Get total count
    const total = await UserList.countDocuments()

    // Get users with pagination
    const users = await UserList.find().sort({ createdAt: -1 }).skip(skip).limit(limit)

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await UserList.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error("Get user by ID error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, mobileNumber, coins, email } = req.body

    // Check if user exists
    let user = await UserList.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const emailExists = await UserList.findOne({ email })
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email is already taken"
        })
      }
    }

    // Update user
    user = await UserList.findByIdAndUpdate(
      req.params.id,
      { name, mobileNumber, coins, email },
      { new: true, runValidators: true }
    )

    res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error("Update user error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    // Check if user exists
    const user = await UserList.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    // Delete user
    await UserList.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      data: {},
      message: "User deleted successfully"
    })
  } catch (error) {
    console.error("Delete user error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

// Helper function to generate JWT token
const generateToken = (id: string) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: "30d"
  })
}

// @desc    Create a new admin user
// @route   POST /api/users/admin
// @access  Private/Admin
export const createAdmin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password, mobileNumber } = req.body

    // Check if admin already exists
    const adminExists = await User.findOne({ email })

    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email already exists"
      })
    }

    // Create admin user
    const admin = await User.create({
      name,
      email,
      password,
      mobileNumber,
      isAdmin: true
    })

    // Generate token
    const token = generateToken(admin._id)

    res.status(201).json({
      success: true,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        isAdmin: admin.isAdmin,
        token
      },
      message: "Admin created successfully"
    })
  } catch (error) {
    console.error("Create admin error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}
