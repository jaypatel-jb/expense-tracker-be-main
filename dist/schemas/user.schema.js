"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParamsSchema = exports.UpdateUserSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    status: zod_1.z.enum(["active", "inactive"]).default("active")
});
exports.UpdateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    status: zod_1.z.enum(["active", "inactive"])
});
exports.ParamsSchema = zod_1.z.object({
    id: zod_1.z.string().nonempty()
});
