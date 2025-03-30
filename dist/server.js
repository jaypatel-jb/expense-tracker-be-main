"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // Import the CORS middleware
const utils_1 = require("./lib/utils");
const db_1 = require("./database/db");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const expense_routes_1 = __importDefault(require("./routes/expense.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
(0, db_1.connectDB)();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: "*", // Allow all origins
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization"
}));
// Set a higher limit for JSON payloads
app.use(express_1.default.json({ limit: "50mb" }));
// Set a higher limit for URL-encoded payloads
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
// Middleware to parse JSON request bodies
app.use(express_1.default.json());
// Mount  routes
app.use("/api/user", user_routes_1.default);
app.use("/api/category", category_routes_1.default);
app.use("/api/expense", expense_routes_1.default);
app.use("/api/statistic", dashboard_routes_1.default);
// Global error handler middleware
//@ts-ignore
app.use((err, req, res, next) => {
    return (0, utils_1.handleError)(err, res); // Pass the error to the handleError function
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
