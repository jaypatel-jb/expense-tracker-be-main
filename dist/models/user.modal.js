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
exports.UserModel = void 0;
const db_1 = require("../database/db");
class UserModel {
    static createUser(name_1, email_1) {
        return __awaiter(this, arguments, void 0, function* (name, email, status = "active") {
            try {
                const connection = (0, db_1.DB)();
                const query = `INSERT INTO users (name, email, status) VALUES (?, ?, ?)`;
                const [result] = yield connection.execute(query, [name, email, status]);
                return result;
            }
            catch (error) {
                console.log("error", error);
                throw error;
            }
        });
    }
    static getAllUser() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            try {
                const connection = (0, db_1.DB)();
                let query = `SELECT * FROM users WHERE 1=1`;
                const queryParams = [];
                // Filter by name (if provided)
                if (filters.name) {
                    query += ` AND name LIKE ?`;
                    queryParams.push(`%${filters.name}%`);
                }
                // Filter by email (if provided)
                if (filters.email) {
                    query += ` AND email LIKE ?`;
                    queryParams.push(`%${filters.email}%`);
                }
                // Filter by status (if provided, must be 'active' or 'inactive')
                if (filters.status) {
                    query += ` AND status IN ('active', 'inactive') AND status = ?`;
                    queryParams.push(filters.status);
                }
                const [result] = yield connection.execute(query, queryParams);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = (0, db_1.DB)();
                const query = `SELECT * FROM users WHERE email = ?`;
                const [rows] = yield connection.execute(query, [email]);
                return Array.isArray(rows) ? rows[0] : null;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = (0, db_1.DB)();
                const query = `SELECT id, name, email, status, created_at FROM users WHERE id =?`;
                const [rows] = yield connection.execute(query, [id]);
                return Array.isArray(rows) ? rows[0] : null;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static updateUser(id, name, email, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = (0, db_1.DB)();
                const query = `UPDATE users SET name =?,email=? ,status=? WHERE id =?`;
                const [result] = yield connection.execute(query, [name, email, status, id]);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = (0, db_1.DB)();
                const query = `DELETE FROM users WHERE id =?`;
                const [result] = yield connection.execute(query, [id]);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.UserModel = UserModel;
