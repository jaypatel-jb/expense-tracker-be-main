"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const expense_model_1 = require("../models/expense.model");
const db_1 = require("../database/db");
const createExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, category_id, amount, date, description } = req.body;
    console.log(user_id, category_id, amount, date, description);
    try {
        console.log("Sss");
        yield expense_model_1.ExpenseModel.createExpense(parseInt(user_id), parseInt(category_id), amount, date, description);
        res.status(201).json({
            status: "success",
            message: "Expense created successfully"
        });
    }
    catch (error) {
        next(error);
    }
});
const updateExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, category_id, amount, date, description } = req.body;
    const { id } = req.params;
    try {
        const connection = (0, db_1.DB)();
        const ExpenseExist = yield expense_model_1.ExpenseModel.getExpenseById(parseInt(id));
        if (!ExpenseExist) {
            res.status(400).json({
                status: "error",
                message: "Expense Expense Not foud"
            });
        }
        yield expense_model_1.ExpenseModel.updateExpense(parseInt(id), parseInt(user_id), parseInt(category_id), amount, date, description);
        res.status(201).json({
            status: "success",
            message: "Expense Updated successfully"
        });
    }
    catch (error) {
        next(error);
    }
});
const deleteExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const ExpenseExist = yield expense_model_1.ExpenseModel.getExpenseById(parseInt(id));
        if (!ExpenseExist) {
            return res.status(409).json({
                status: "error",
                message: "Expense Expense Not foud"
            });
        }
        yield expense_model_1.ExpenseModel.deleteExpense(parseInt(id));
        return res.status(201).json({
            status: "success",
            message: "Expense Deleted successfully"
        });
    }
    catch (error) {
        next(error);
    }
});
const getExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const Expense = yield expense_model_1.ExpenseModel.getExpenseById(parseInt(id));
        if (!Expense) {
            return res.status(409).json({
                status: "error",
                message: "Expense Not foud"
            });
        }
        return res.status(201).json({
            status: "success",
            message: "Expense Get successfully",
            data: Expense
        });
    }
    catch (error) {
        next(error);
    }
});
const getExpenses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query;
        const Expenses = yield expense_model_1.ExpenseModel.getAllExpense(query);
        return res.status(201).json({
            status: "success",
            message: "Expense Get successfully",
            data: Expenses
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = { createExpense, updateExpense, deleteExpense, getExpense, getExpenses };
