import { Request, Response, NextFunction } from "express"
import Joi from "joi"

// Middleware for validating request body against a Joi schema
export const validateRequest = (schema: Joi.ObjectSchema): any => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body)

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.details.map((detail) => detail.message).join(", ")
      })
    }

    next()
  }
}

// Validation schemas
export const schemas = {
  // Auth schemas
  signup: Joi.object({
    name: Joi.string().required().trim(),
    email: Joi.string().email().required().trim(),
    password: Joi.string().min(6).required(),
    mobileNumber: Joi.string().required().trim()
  }),

  login: Joi.object({
    email: Joi.string().email().required().trim(),
    password: Joi.string().required()
  }),

  sendOTP: Joi.object({
    phoneNumber: Joi.string().required().trim(),
    email: Joi.string().email().trim(),
    channel: Joi.string().trim(),
    hash: Joi.string().trim(),
    orderId: Joi.string().required().trim(),
    expiry: Joi.number(),
    otpLength: Joi.number()
  }),

  resendOTP: Joi.object({
    orderId: Joi.string().required().trim()
  }),

  verifyOTP: Joi.object({
    phoneNumber: Joi.string().required().trim(),
    orderId: Joi.string().required().trim(),
    otp: Joi.string().required().trim(),
    email: Joi.string().email().trim()
  }),

  // User schemas
  createUser: Joi.object({
    name: Joi.string().required().trim(),
    email: Joi.string().email().required().trim(),
    mobileNumber: Joi.string().required().trim(),
    coins: Joi.number().default(0),
    password: Joi.string().min(6).required()
  }),

  updateUser: Joi.object({
    name: Joi.string().trim(),
    email: Joi.string().email().trim(),
    mobileNumber: Joi.string().trim(),
    coins: Joi.number()
  }),

  // Version schemas
  createVersion: Joi.object({
    name: Joi.string().required().trim(),
    version: Joi.number().required()
  }),

  updateVersion: Joi.object({
    name: Joi.string().trim(),
    version: Joi.number()
  }),

  // Wallpaper schemas
  createWallpaper: Joi.object({
    name: Joi.string().required().trim()
  }),

  // Admin schemas
  createAdmin: Joi.object({
    name: Joi.string().required().trim(),
    email: Joi.string().email().required().trim(),
    password: Joi.string().min(6).required(),
    mobileNumber: Joi.string().required().trim()
  })
}
