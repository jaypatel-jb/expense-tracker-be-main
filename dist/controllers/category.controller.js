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
const category_model_1 = require("../models/category.model");
const db_1 = require("../database/db");
const createCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        const emailExist = yield category_model_1.CategoryModel.getCategoryByName(name);
        console.log("ddd", emailExist);
        if (emailExist) {
            res.status(409).json({
                status: "error",
                message: "Category already exist"
            });
        }
        yield category_model_1.CategoryModel.createCategory(name);
        res.status(201).json({
            status: "success",
            message: "Category created successfully"
        });
    }
    catch (error) {
        next(error);
    }
});
const updateCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const { id } = req.params;
    try {
        const connection = (0, db_1.DB)();
        const CategoryExist = yield category_model_1.CategoryModel.getCategoryById(parseInt(id));
        if (!CategoryExist) {
            res.status(400).json({
                status: "error",
                message: "Category Category Not foud"
            });
        }
        const [rows] = yield connection.execute(`SELECT * FROM categories WHERE name =? AND id !=?`, [name, id]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.status(409).json({
                status: "error",
                message: "Category already exist"
            });
        }
        yield category_model_1.CategoryModel.updateCategory(parseInt(id), name);
        res.status(201).json({
            status: "success",
            message: "Category Updated successfully"
        });
    }
    catch (error) {
        next(error);
    }
});
const deleteCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const CategoryExist = yield category_model_1.CategoryModel.getCategoryById(parseInt(id));
        if (!CategoryExist) {
            return res.status(409).json({
                status: "error",
                message: "Category Category Not foud"
            });
        }
        yield category_model_1.CategoryModel.deleteCategory(parseInt(id));
        return res.status(201).json({
            status: "success",
            message: "Category Deleted successfully"
        });
    }
    catch (error) {
        next(error);
    }
});
const getCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const Category = yield category_model_1.CategoryModel.getCategoryById(parseInt(id));
        if (!Category) {
            return res.status(409).json({
                status: "error",
                message: "Category Not foud"
            });
        }
        return res.status(201).json({
            status: "success",
            message: "Category Get successfully",
            data: Category
        });
    }
    catch (error) {
        next(error);
    }
});
const getCategorys = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Categorys = yield category_model_1.CategoryModel.getAllCategory(req.query);
        return res.status(201).json({
            status: "success",
            message: "Category Get successfully",
            data: Categorys
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = { createCategory, updateCategory, deleteCategory, getCategory, getCategorys };
