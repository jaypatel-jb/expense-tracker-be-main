import { NextFunction, Request, Response } from "express"
import { CategoryModel } from "../models/category.model"
import { generateHashPASS } from "../lib/utils"
import { DB } from "../database/db"

const createCategory = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const {name } = req.body
  try {
    const emailExist = await CategoryModel.getCategoryByName(name)
    console.log("ddd", emailExist)
    if (emailExist) {
      res.status(409).json({
        status: "error",
        message: "Category already exist"
      })
    }
    await CategoryModel.createCategory(name)
    res.status(201).json({
      status: "success",
      message: "Category created successfully"
    })
  } catch (error) {
    next(error)
  }
}

const updateCategory = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const { name} = req.body
  const { id } = req.params
  try {
    const connection = DB()
    const CategoryExist = await CategoryModel.getCategoryById(parseInt(id))
    if (!CategoryExist) {
      res.status(400).json({
        status: "error",
        message: "Category Category Not foud"
      })
    }

    const [rows] = await connection.execute(`SELECT * FROM categories WHERE name =? AND id !=?`, [name, id])

    if (Array.isArray(rows) && rows.length > 0) {
      res.status(409).json({
        status: "error",
        message: "Category already exist"
      })
    }

    await CategoryModel.updateCategory(parseInt(id), name)
    res.status(201).json({
      status: "success",
      message: "Category Updated successfully"
    })
  } catch (error) {
    next(error)
  }
}

const deleteCategory = async (req: Request, res: Response, next: NextFunction) :Promise<any>=> {
  const { id } = req.params
  try {
    const CategoryExist = await CategoryModel.getCategoryById(parseInt(id))
    if (!CategoryExist) {
      return res.status(409).json({
        status: "error",
        message: "Category Category Not foud"
      })
    }
    await CategoryModel.deleteCategory(parseInt(id))
    return res.status(201).json({
      status: "success",
      message: "Category Deleted successfully"
    })
  } catch (error) {
    next(error)
  }
}
const getCategory = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const { id } = req.params
  try {
    const Category = await CategoryModel.getCategoryById(parseInt(id))
    if (!Category) {
      return res.status(409).json({
        status: "error",
        message: "Category Not foud"
      })
    }
    return res.status(201).json({
      status: "success",
      message: "Category Get successfully",
      data: Category
    })
  } catch (error) {
    next(error)
  }
}

const getCategorys = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  try {
    const Categorys = await CategoryModel.getAllCategory(req.query)
    return res.status(201).json({
      status: "success",
      message: "Category Get successfully",
      data: Categorys
    })
  } catch (error) {
    next(error)
  }
}

export default { createCategory, updateCategory, deleteCategory, getCategory, getCategorys }
