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
exports.CategoryModel = void 0;
const db_1 = require("../database/db");
class CategoryModel {
    static createCategory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = (0, db_1.DB)();
                const query = `INSERT INTO categories (name) VALUES (?)`;
                const [result] = yield connection.execute(query, [name]);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getAllCategory() {
        return __awaiter(this, arguments, void 0, function* (filters = {}) {
            try {
                const connection = (0, db_1.DB)();
                let query = `SELECT * FROM categories`;
                const queryParams = [];
                // Filter by name (if provided)
                if (filters.name) {
                    query += ` WHERE name LIKE ?`;
                    queryParams.push(`%${filters.name}%`);
                }
                const [result] = yield connection.execute(query, queryParams);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getCategoryByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = (0, db_1.DB)();
                const query = `SELECT * FROM categories WHERE name = ?`;
                const [rows] = yield connection.execute(query, [name]);
                return Array.isArray(rows) ? rows[0] : null;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = (0, db_1.DB)();
                const query = `SELECT * FROM categories WHERE id =?`;
                const [rows] = yield connection.execute(query, [id]);
                return Array.isArray(rows) ? rows[0] : null;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static updateCategory(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = (0, db_1.DB)();
                const query = `UPDATE categories SET name =? WHERE id =?`;
                const [result] = yield connection.execute(query, [name, id]);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = (0, db_1.DB)();
                const query = `DELETE FROM categories WHERE id =?`;
                const [result] = yield connection.execute(query, [id]);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.CategoryModel = CategoryModel;
