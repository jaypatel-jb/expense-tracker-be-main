import express, { Request, Response } from "express"
import path from "path"
import { env, validateEnv } from "./config/env"
import connectDB from "./config/db"
import { applySecurityMiddleware } from "./middleware/security.middleware"

// Import routes
import authRoutes from "./routes/auth.routes"
import versionRoutes from "./routes/version.routes"
import userRoutes from "./routes/user.routes"
import wallpaperRoutes from "./routes/wallpaper.routes"

// Validate environment variables
validateEnv()

// Connect to database
connectDB()

// Initialize express app
const app = express()

// Apply security middleware
applySecurityMiddleware(app)

// Serve static files from uploads directory
app.get("/", (req: Request, res: Response): any => {
  return res.send("API is running")
})
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

// Set up routes
app.use("/api/auth", authRoutes)
app.use("/api/versions", versionRoutes)
app.use("/api/users", userRoutes)
app.use("/api/wallpapers", wallpaperRoutes)

// Start server
const PORT = env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running in ${env.NODE_ENV} mode on port ${PORT}`)
})
