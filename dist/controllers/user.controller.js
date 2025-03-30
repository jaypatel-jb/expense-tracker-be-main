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
const user_modal_1 = require("../models/user.modal");
const db_1 = require("../database/db");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, status } = req.body;
    try {
        const emailExist = yield user_modal_1.UserModel.getUserByEmail(email);
        if (emailExist) {
            res.status(409).json({
                status: "error",
                message: "User Email Already exist"
            });
        }
        yield user_modal_1.UserModel.createUser(name, email, status);
        res.status(201).json({
            status: "success",
            message: "User created successfully"
        });
    }
    catch (error) {
        next(error);
    }
});
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, status } = req.body;
    const { id } = req.params;
    try {
        const connection = (0, db_1.DB)();
        const userExist = yield user_modal_1.UserModel.getUserById(parseInt(id));
        if (!userExist) {
            res.status(400).json({
                status: "error",
                message: "User User Not foud"
            });
        }
        const [rows] = yield connection.execute(`SELECT * FROM users WHERE email =? AND id !=?`, [email, id]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.status(409).json({
                status: "error",
                message: "Email already exist"
            });
        }
        yield user_modal_1.UserModel.updateUser(parseInt(id), name, email, status);
        res.status(201).json({
            status: "success",
            message: "User Updated successfully"
        });
    }
    catch (error) {
        next(error);
    }
});
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const userExist = yield user_modal_1.UserModel.getUserById(parseInt(id));
        if (!userExist) {
            return res.status(409).json({
                status: "error",
                message: "User User Not foud"
            });
        }
        yield user_modal_1.UserModel.deleteUser(parseInt(id));
        return res.status(201).json({
            status: "success",
            message: "User Deleted successfully"
        });
    }
    catch (error) {
        next(error);
    }
});
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield user_modal_1.UserModel.getUserById(parseInt(id));
        if (!user) {
            return res.status(409).json({
                status: "error",
                message: "User Not foud"
            });
        }
        return res.status(201).json({
            status: "success",
            message: "User Get successfully",
            data: user
        });
    }
    catch (error) {
        next(error);
    }
});
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_modal_1.UserModel.getAllUser(req.query);
        return res.status(201).json({
            status: "success",
            message: "User Get successfully",
            data: users
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = { createUser, updateUser, deleteUser, getUser, getUsers };
