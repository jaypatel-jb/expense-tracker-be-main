import { Request, Response } from 'express';
import Version, { IVersion } from '../models/version.model';

// @desc    Create a new version
// @route   POST /api/versions
// @access  Private/Admin
export const createVersion = async (req: Request, res: Response) => {
  try {
    const { name, version } = req.body;

    // Check if version already exists
    const versionExists = await Version.findOne({ version });

    if (versionExists) {
      return res.status(400).json({
        success: false,
        message: 'Version already exists',
      });
    }

    // Create new version
    const newVersion = await Version.create({
      name,
      version,
    });

    res.status(201).json({
      success: true,
      data: newVersion,
    });
  } catch (error) {
    console.error('Create version error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Get all versions
// @route   GET /api/versions
// @access  Private/Admin
export const getVersions = async (req: Request, res: Response) => {
  try {
    const versions = await Version.find().sort({ version: -1 });

    res.status(200).json({
      success: true,
      data: versions,
    });
  } catch (error) {
    console.error('Get versions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Get version by ID
// @route   GET /api/versions/:id
// @access  Private/Admin
export const getVersionById = async (req: Request, res: Response) => {
  try {
    const version = await Version.findById(req.params.id);

    if (!version) {
      return res.status(404).json({
        success: false,
        message: 'Version not found',
      });
    }

    res.status(200).json({
      success: true,
      data: version,
    });
  } catch (error) {
    console.error('Get version by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Update version
// @route   PUT /api/versions/:id
// @access  Private/Admin
export const updateVersion = async (req: Request, res: Response) => {
  try {
    const { name, version } = req.body;

    // Check if version exists
    let versionDoc = await Version.findById(req.params.id);

    if (!versionDoc) {
      return res.status(404).json({
        success: false,
        message: 'Version not found',
      });
    }

    // Check if version number is already taken by another version
    if (version && version !== versionDoc.version) {
      const versionExists = await Version.findOne({ version });
      if (versionExists) {
        return res.status(400).json({
          success: false,
          message: 'Version number is already taken',
        });
      }
    }

    // Update version
    versionDoc = await Version.findByIdAndUpdate(
      req.params.id,
      { name, version },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: versionDoc,
    });
  } catch (error) {
    console.error('Update version error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Delete version
// @route   DELETE /api/versions/:id
// @access  Private/Admin
export const deleteVersion = async (req: Request, res: Response) => {
  try {
    // Check if version exists
    const version = await Version.findById(req.params.id);

    if (!version) {
      return res.status(404).json({
        success: false,
        message: 'Version not found',
      });
    }

    // Delete version
    await Version.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
      message: 'Version deleted successfully',
    });
  } catch (error) {
    console.error('Delete version error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};