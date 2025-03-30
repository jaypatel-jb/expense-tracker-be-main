import { NextFunction, Request, Response } from "express"
import { UserModel } from "../models/user.modal"
import { UpdateUserType, UserRegisterType } from "../schemas/user.schema"
import { DB } from "../database/db"

const createUser = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const { email, name, status } = req.body as UserRegisterType
  try {
    const emailExist = await UserModel.getUserByEmail(email)
    if (emailExist) {
      res.status(409).json({
        status: "error",
        message: "User Email Already exist"
      })
    }
    await UserModel.createUser(name, email, status)
    res.status(201).json({
      status: "success",
      message: "User created successfully"
    })
  } catch (error) {
    next(error)
  }
}

const updateUser = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const { name, email, status } = req.body as UpdateUserType
  const { id } = req.params
  try {
    const connection = DB()
    const userExist = await UserModel.getUserById(parseInt(id))
    if (!userExist) {
      res.status(400).json({
        status: "error",
        message: "User User Not foud"
      })
    }

    const [rows] = await connection.execute(`SELECT * FROM users WHERE email =? AND id !=?`, [email, id])

    if (Array.isArray(rows) && rows.length > 0) {
      res.status(409).json({
        status: "error",
        message: "Email already exist"
      })
    }

    await UserModel.updateUser(parseInt(id), name, email, status)
    res.status(201).json({
      status: "success",
      message: "User Updated successfully"
    })
  } catch (error) {
    next(error)
  }
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) :Promise<any>=> {
  const { id } = req.params
  try {
    const userExist = await UserModel.getUserById(parseInt(id))
    if (!userExist) {
      return res.status(409).json({
        status: "error",
        message: "User User Not foud"
      })
    }
    await UserModel.deleteUser(parseInt(id))
    return res.status(201).json({
      status: "success",
      message: "User Deleted successfully"
    })
  } catch (error) {
    next(error)
  }
}
const getUser = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const { id } = req.params
  try {
    const user = await UserModel.getUserById(parseInt(id))
    if (!user) {
      return res.status(409).json({
        status: "error",
        message: "User Not foud"
      })
    }
    return res.status(201).json({
      status: "success",
      message: "User Get successfully",
      data: user
    })
  } catch (error) {
    next(error)
  }
}

const getUsers = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  try {
    const users = await UserModel.getAllUser(req.query)
    return res.status(201).json({
      status: "success",
      message: "User Get successfully",
      data: users
    })
  } catch (error) {
    next(error)
  }
}

export default { createUser, updateUser, deleteUser, getUser, getUsers }
