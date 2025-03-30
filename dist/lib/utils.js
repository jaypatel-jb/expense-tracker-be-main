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
exports.generateHashPASS = exports.errorHandler = exports.formatZodError = exports.handleError = void 0;
const zod_1 = require("zod");
const handleError = (error, res) => {
    if (error.name === "ValidationError") {
        // Handle Mongoose validation errors
        const messages = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({
            status: "error",
            message: messages.join(", ")
        });
    }
    // Handle general errors
    return res.status(500).json({
        status: "error",
        message: error.message || "Server error"
    });
};
exports.handleError = handleError;
const formatZodError = (error) => {
    return error.errors
        .map((err) => { var _a; return (err.path && ((_a = err === null || err === void 0 ? void 0 : err.path) === null || _a === void 0 ? void 0 : _a.length) > 0 ? `${err.path.join(" , ")}: ${err.message}` : err.message); })
        .join("; ");
};
exports.formatZodError = formatZodError;
const errorHandler = (err, req, res) => {
    if (err instanceof zod_1.ZodError) {
        const formattedErrors = (0, exports.formatZodError)(err);
        return res.status(400).json({
            message: "Validation errored",
            errors: formattedErrors,
            status: "error"
        });
    }
    console.error("Unexpected error:", err);
    res.status(500).json({
        message: "Server error",
        error: err.message || "An error occurred",
        status: "error"
    });
};
exports.errorHandler = errorHandler;
const generateHashPASS = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return password;
});
exports.generateHashPASS = generateHashPASS;
