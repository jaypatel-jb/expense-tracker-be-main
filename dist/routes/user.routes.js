"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const validateWithZod_1 = require("../middlewares/validateWithZod");
const user_schema_1 = require("../schemas/user.schema");
const router = (0, express_1.Router)();
router.post("/", (0, validateWithZod_1.validateWithZod)({ body: user_schema_1.registerSchema }), user_controller_1.default.createUser);
router.get("/", user_controller_1.default.getUsers);
router.put("/:id", (0, validateWithZod_1.validateWithZod)({ body: user_schema_1.UpdateUserSchema, params: user_schema_1.ParamsSchema }), user_controller_1.default.updateUser);
router.delete("/:id", (0, validateWithZod_1.validateWithZod)({ params: user_schema_1.ParamsSchema }), user_controller_1.default.deleteUser);
router.get("/:id", (0, validateWithZod_1.validateWithZod)({ params: user_schema_1.ParamsSchema }), user_controller_1.default.getUser);
exports.default = router;
