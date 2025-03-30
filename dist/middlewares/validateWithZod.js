"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWithZod = void 0;
const zod_1 = require("zod");
const utils_1 = require("../lib/utils");
const validateWithZod = ({ body, query, params }) => (req, res, next) => {
    try {
        if (body)
            req.body = body.parse(req.body);
        if (query)
            req.query = query.parse(req.query);
        if (params)
            req.params = params.parse(req.params);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({
                status: "error",
                message: "Validation errored",
                errors: (0, utils_1.formatZodError)(error),
            });
        }
        next(error);
    }
};
exports.validateWithZod = validateWithZod;
