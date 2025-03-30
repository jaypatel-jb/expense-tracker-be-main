"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = __importDefault(require("../controllers/category.controller"));
const validateWithZod_1 = require("../middlewares/validateWithZod");
const category_schema_1 = require("../schemas/category.schema");
const router = (0, express_1.Router)();
router.post("/", (0, validateWithZod_1.validateWithZod)({ body: category_schema_1.CreateCategorySchema }), category_controller_1.default.createCategory);
router.get("/", category_controller_1.default.getCategorys);
router.put("/:id", (0, validateWithZod_1.validateWithZod)({ body: category_schema_1.CreateCategorySchema, params: category_schema_1.ParamsSchema }), category_controller_1.default.updateCategory);
router.delete("/:id", (0, validateWithZod_1.validateWithZod)({ params: category_schema_1.ParamsSchema }), category_controller_1.default.deleteCategory);
router.get("/:id", (0, validateWithZod_1.validateWithZod)({ params: category_schema_1.ParamsSchema }), category_controller_1.default.getCategory);
exports.default = router;
