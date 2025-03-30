"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParamsSchema = exports.CreateCategorySchema = void 0;
const zod_1 = require("zod");
exports.CreateCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
});
exports.ParamsSchema = zod_1.z.object({
    id: zod_1.z.string().nonempty()
});
