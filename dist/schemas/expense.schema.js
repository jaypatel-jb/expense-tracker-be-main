"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParamsSchema = exports.ExpensesSchema = void 0;
const zod_1 = require("zod");
exports.ExpensesSchema = zod_1.z.object({
    user_id: zod_1.z.string().nonempty(),
    category_id: zod_1.z.string().nonempty(),
    amount: zod_1.z.coerce.number().positive("Amount must be a positive number"),
    date: zod_1.z.coerce.date(),
    description: zod_1.z.string().nonempty(),
});
exports.ParamsSchema = zod_1.z.object({
    id: zod_1.z.string().nonempty()
});
