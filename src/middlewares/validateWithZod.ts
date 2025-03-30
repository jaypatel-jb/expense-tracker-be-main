import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";
import { formatZodError } from "../lib/utils";

interface ZodValidationSchemas {
  body?: ZodSchema<any>;
  query?: ZodSchema<any>;
  params?: ZodSchema<any>;
}

export const validateWithZod =
  ({ body, query, params }: ZodValidationSchemas):any =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (body) req.body = body.parse(req.body);
      if (query) req.query = query.parse(req.query);
      if (params) req.params = params.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: "error",
          message: "Validation errored",
          errors: formatZodError(error),
        });
      }
      next(error);
    }
  };
