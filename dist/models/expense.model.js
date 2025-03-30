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
exports.ExpenseModel = void 0;
const db_1 = require("../database/db");
class ExpenseModel {
    static createExpense(user_id, category_id, amount, date, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = (0, db_1.DB)();
                const query = `INSERT INTO expenses (user_id, category_id, amount,date,description) VALUES (?, ?, ?,?,?)`;
                const [result] = yield connection.execute(query, [user_id, category_id, amount, date, description]);
                console.log(result);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getAllExpense() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            try {
                const connection = (0, db_1.DB)();
                let query = `
        SELECT expenses.*, users.name AS user_name, users.email, categories.name AS category_name 
        FROM expenses 
        JOIN users ON expenses.user_id = users.id 
        JOIN categories ON expenses.category_id = categories.id
      `;
                const conditions = [];
                const params = [];
                // ✅ Apply search filter (searches in category name, user name, email, and expense description)
                if (filter.search) {
                    conditions.push(`(categories.name LIKE ? OR users.name LIKE ? OR users.email LIKE ? OR expenses.description LIKE ?)`);
                    params.push(`%${filter.search}%`, `%${filter.search}%`, `%${filter.search}%`, `%${filter.search}%`);
                }
                // ✅ Apply email filter separately (if provided)
                if (filter.email) {
                    conditions.push(`users.email LIKE ?`);
                    params.push(`%${filter.email}%`);
                }
                // ✅ Apply users filter (if provided)
                if (filter.users && filter.users.length > 0) {
                    conditions.push(`expenses.user_id IN (${filter.users.map(() => "?").join(", ")})`);
                    params.push(...filter.users);
                }
                // ✅ Apply category filter (if provided)
                if (filter.category && filter.category.length > 0) {
                    conditions.push(`expenses.category_id IN (${filter.category.map(() => "?").join(", ")})`);
                    params.push(...filter.category);
                }
                // ✅ Apply date range filter (if provided)
                if (filter.dateRange && filter.dateRange.length === 2) {
                    conditions.push(`DATE(expenses.created_at) BETWEEN ? AND ?`);
                    params.push(filter.dateRange[0], filter.dateRange[1]);
                }
                // ✅ Add WHERE clause if any conditions exist
                if (conditions.length > 0) {
                    query += ` WHERE ` + conditions.join(" AND ");
                }
                query += ` ORDER BY expenses.id DESC`;
                // ✅ Execute query with parameters
                const [result] = yield connection.execute(query, params);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getExpenseById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = (0, db_1.DB)();
                const query = `SELECT expenses.*, users.name AS user_name, users.email, categories.name AS category_name 
        FROM expenses 
        JOIN users ON expenses.user_id = users.id 
        JOIN categories ON expenses.category_id = categories.id WHERE expenses.id =?`;
                const [rows] = yield connection.execute(query, [id]);
                return Array.isArray(rows) ? rows[0] : null;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static updateExpense(id, user_id, category_id, amount, date, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = (0, db_1.DB)();
                const query = `UPDATE expenses SET user_id =?, category_id =?, amount =?, date =?, description =? WHERE id =?`;
                const [result] = yield connection.execute(query, [user_id, category_id, amount, date, description, id]);
                return result;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    static deleteExpense(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = (0, db_1.DB)();
                const query = `DELETE FROM Expenses WHERE id =?`;
                const [result] = yield connection.execute(query, [id]);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.ExpenseModel = ExpenseModel;
