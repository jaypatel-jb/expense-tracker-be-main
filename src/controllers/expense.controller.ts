import { NextFunction, Request, Response } from "express"
import { ExpenseModel } from "../models/expense.model"
import { ExpensesType } from "../schemas/expense.schema"
import { generateHashPASS } from "../lib/utils"
import { DB } from "../database/db"

const createExpense = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { user_id, category_id, amount, date, description } = req.body as ExpensesType

  console.log(user_id, category_id, amount, date, description)
  try {
    console.log("Sss")
    await ExpenseModel.createExpense(parseInt(user_id), parseInt(category_id), amount, date, description)
    res.status(201).json({
      status: "success",
      message: "Expense created successfully"
    })
  } catch (error) {
    next(error)
  }
}

const updateExpense = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { user_id, category_id, amount, date, description } = req.body as ExpensesType
  const { id } = req.params
  try {
    const connection = DB()
    const ExpenseExist = await ExpenseModel.getExpenseById(parseInt(id))
    if (!ExpenseExist) {
      res.status(400).json({
        status: "error",
        message: "Expense Expense Not foud"
      })
    }

    await ExpenseModel.updateExpense(parseInt(id), parseInt(user_id), parseInt(category_id), amount, date, description)
    res.status(201).json({
      status: "success",
      message: "Expense Updated successfully"
    })
  } catch (error) {
    next(error)
  }
}

const deleteExpense = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params
  try {
    const ExpenseExist = await ExpenseModel.getExpenseById(parseInt(id))
    if (!ExpenseExist) {
      return res.status(409).json({
        status: "error",
        message: "Expense Expense Not foud"
      })
    }
    await ExpenseModel.deleteExpense(parseInt(id))
    return res.status(201).json({
      status: "success",
      message: "Expense Deleted successfully"
    })
  } catch (error) {
    next(error)
  }
}
const getExpense = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params
  try {
    const Expense = await ExpenseModel.getExpenseById(parseInt(id))
    if (!Expense) {
      return res.status(409).json({
        status: "error",
        message: "Expense Not foud"
      })
    }
    return res.status(201).json({
      status: "success",
      message: "Expense Get successfully",
      data: Expense
    })
  } catch (error) {
    next(error)
  }
}

const getExpenses = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const query = req.query

    
    const Expenses = await ExpenseModel.getAllExpense(query)
    return res.status(201).json({
      status: "success",
      message: "Expense Get successfully",
      data: Expenses
    })
  } catch (error) {
    next(error)
  }
}

export default { createExpense, updateExpense, deleteExpense, getExpense, getExpenses }
