import { config as dotenvConfig } from "dotenv"
dotenvConfig()
import express, { Express, NextFunction, Request, Response } from "express"
import cors from "cors" // Import the CORS middleware
import { handleError } from "./lib/utils"
import { connectDB } from "./database/db"
import userRoutes from "./routes/user.routes"
import categoryRoutes from "./routes/category.routes"
import expensesRoutes from "./routes/expense.routes"
import statisticRoutes from "./routes/dashboard.routes"

connectDB()
const app: Express = express()
const port = process.env.PORT || 5000

app.use(
  cors({
    origin: "*", // Allow all origins
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization"
  })
)
// Set a higher limit for JSON payloads
app.use(express.json({ limit: "50mb" }))
// Set a higher limit for URL-encoded payloads
app.use(express.urlencoded({ limit: "50mb", extended: true }))

// Middleware to parse JSON request bodies
app.use(express.json())
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Expense Tracker API")
})

// Mount  routes
app.use("/api/user",userRoutes)
app.use("/api/category",categoryRoutes)
app.use("/api/expense",expensesRoutes)
app.use("/api/statistic",statisticRoutes)

// Global error handler middleware

//@ts-ignore
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  return handleError(err, res) // Pass the error to the handleError function
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
