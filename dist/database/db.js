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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = exports.connectDB = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let pool = null;
/**
 * Connect to MySQL database and create a connection pool.
 */
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!pool) {
            pool = promise_1.default.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
                waitForConnections: true,
                connectionLimit: 10, // Set limit as needed
                queueLimit: 0,
            });
            // Test connection
            yield pool.query("SELECT 1");
            console.log("✅ MySQL Connected Successfully");
        }
        return pool;
    }
    catch (error) {
        console.error("❌ MySQL Connection errored:", error.message);
        process.exit(1); // Stop the server
    }
});
exports.connectDB = connectDB;
/**
 * Get the database connection pool.
 */
const DB = () => {
    if (!pool) {
        throw new Error("Database not connected. Call connectDB() first.");
    }
    return pool;
};
exports.DB = DB;
