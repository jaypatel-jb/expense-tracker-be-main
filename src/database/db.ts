import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let pool: mysql.Pool | null = null;

/**
 * Connect to MySQL database and create a connection pool.
 */
export const connectDB = async () => {
  try {
    if (!pool) {
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10, // Set limit as needed
        queueLimit: 0,
      });

      // Test connection
      await pool.query("SELECT 1");
      console.log("✅ MySQL Connected Successfully");
    }
    return pool;
  } catch (error) {
    console.error("❌ MySQL Connection errored:", (error as Error).message);
    process.exit(1); // Stop the server
  }
};

/**
 * Get the database connection pool.
 */
export const DB = (): mysql.Pool => {
  if (!pool) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return pool;
};
