import { Response } from "express"

import { ZodError } from "zod"

export const handleError = (error: any, res: Response) => {
  
    if (error.name === "ValidationError") {
      // Handle Mongoose validation errors
      const messages = Object.values(error.errors).map((err: any) => err.message)
      return res.status(400).json({
        status: "error",
        message: messages.join(", ")
      })
    }
  
    // Handle general errors
    return res.status(500).json({
      status: "error",
      message: error.message || "Server error"
    })
  }
  

  
export const formatZodError = (error: ZodError) => {
  return error.errors
    .map((err) => (err.path && err?.path?.length > 0 ? `${err.path.join(" , ")}: ${err.message}` : err.message))
    .join("; ")
}

export const errorHandler = (err: any, req: Request, res: Response) => {
  if (err instanceof ZodError) {
    const formattedErrors = formatZodError(err)
    return res.status(400).json({
      message: "Validation errored",
      errors: formattedErrors,
      status: "error"
    })
  }

  console.error("Unexpected error:", err)
  res.status(500).json({
    message: "Server error",
    error: err.message || "An error occurred",
    status: "error"
  })
}


export const generateHashPASS = async (password: string) => {
 return password
}