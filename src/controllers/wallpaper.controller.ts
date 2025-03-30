import { Request, Response } from "express"
import path from "path"
import fs from "fs"
import Wallpaper, { IWallpaper } from "../models/wallpaper.model"
import { env } from "../config/env"

// @desc    Upload wallpaper images
// @route   POST /api/wallpapers
// @access  Private/Admin
export const uploadWallpaper = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name } = req.body
    const files = req.files as Express.Multer.File[]

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image"
      })
    }

    // Get paths of uploaded files with domain prefix
    const imagePaths = files.map((file) => `${env.DOMAIN_URL}/uploads/wallpapers/${file.filename}`)

    // Create wallpaper entry
    const wallpaper = await Wallpaper.create({
      name,
      imagePaths
    })

    res.status(201).json({
      success: true,
      data: wallpaper
    })
  } catch (error) {
    console.error("Upload wallpaper error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

// @desc    Get all wallpapers
// @route   GET /api/wallpapers
// @access  Private/Admin
export const getWallpapers = async (req: Request, res: Response) => {
  try {
    // Add pagination
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    // Get total count
    const total = await Wallpaper.countDocuments()

    // Get wallpapers with pagination
    const wallpapers = await Wallpaper.find().sort({ createdAt: -1 }).skip(skip).limit(limit)

    res.status(200).json({
      success: true,
      data: wallpapers,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Get wallpapers error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

// @desc    Get wallpaper by ID
// @route   GET /api/wallpapers/:id
// @access  Private/Admin
export const getWallpaperById = async (req: Request, res: Response): Promise<any> => {
  try {
    const wallpaper = await Wallpaper.findById(req.params.id)

    if (!wallpaper) {
      return res.status(404).json({
        success: false,
        message: "Wallpaper not found"
      })
    }

    res.status(200).json({
      success: true,
      data: wallpaper
    })
  } catch (error) {
    console.error("Get wallpaper by ID error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

// @desc    Update wallpaper
// @route   PUT /api/wallpapers/:id
// @access  Private/Admin
export const updateWallpaper = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name } = req.body
    const files = req.files as Express.Multer.File[]

    // Check if wallpaper exists
    let wallpaper = await Wallpaper.findById(req.params.id)

    if (!wallpaper) {
      return res.status(404).json({
        success: false,
        message: "Wallpaper not found"
      })
    }

    // Update data object
    const updateData: { name?: string; imagePaths?: string[] } = {}

    // Update name if provided
    if (name) {
      updateData.name = name
    }

    // Update images if provided
    if (files && files.length > 0) {
      // Delete old image files
      wallpaper.imagePaths.forEach((imagePath) => {
        const fullPath = path.join(__dirname, "../..", imagePath)
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath)
        }
      })

      // Get paths of new uploaded files with domain prefix
      updateData.imagePaths = files.map((file) => `${env.DOMAIN_URL}/uploads/wallpapers/${file.filename}`)
    }

    // Update wallpaper in database
    wallpaper = await Wallpaper.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })

    res.status(200).json({
      success: true,
      data: wallpaper,
      message: "Wallpaper updated successfully"
    })
  } catch (error) {
    console.error("Update wallpaper error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

// @desc    Delete wallpaper
// @route   DELETE /api/wallpapers/:id
// @access  Private/Admin
export const deleteWallpaper = async (req: Request, res: Response): Promise<any> => {
  try {
    // Check if wallpaper exists
    const wallpaper = await Wallpaper.findById(req.params.id)

    if (!wallpaper) {
      return res.status(404).json({
        success: false,
        message: "Wallpaper not found"
      })
    }

    // Delete image files
    wallpaper.imagePaths.forEach((imagePath) => {
      const fullPath = path.join(__dirname, "../..", imagePath)
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath)
      }
    })

    // Delete wallpaper from database
    await Wallpaper.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      data: {},
      message: "Wallpaper deleted successfully"
    })
  } catch (error) {
    console.error("Delete wallpaper error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}
