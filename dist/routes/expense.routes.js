"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expense_controller_1 = __importDefault(require("../controllers/expense.controller"));
const validateWithZod_1 = require("../middlewares/validateWithZod");
const expense_schema_1 = require("../schemas/expense.schema");
const router = (0, express_1.Router)();
router.post("/", (0, validateWithZod_1.validateWithZod)({ body: expense_schema_1.ExpensesSchema }), expense_controller_1.default.createExpense);
router.get("/", expense_controller_1.default.getExpenses);
router.put("/:id", (0, validateWithZod_1.validateWithZod)({ body: expense_schema_1.ExpensesSchema, params: expense_schema_1.ParamsSchema }), expense_controller_1.default.updateExpense);
router.delete("/:id", (0, validateWithZod_1.validateWithZod)({ params: expense_schema_1.ParamsSchema }), expense_controller_1.default.deleteExpense);
router.get("/:id", (0, validateWithZod_1.validateWithZod)({ params: expense_schema_1.ParamsSchema }), expense_controller_1.default.getExpense);
exports.default = router;
