import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

export const applySecurityMiddleware = (app: express.Application) => {
  // Body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Set security headers with helmet
  app.use(helmet());

  // Enable CORS
  app.use(cors());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  });

  // Apply rate limiting to all requests
  app.use(limiter);

  // Sanitize data
  app.use((req, res, next) => {
    // Simple sanitization - convert strings to prevent NoSQL injection
    if (req.body) {
      Object.keys(req.body).forEach((key) => {
        if (typeof req.body[key] === 'string') {
          // Replace characters that could be used for NoSQL injection
          req.body[key] = req.body[key].replace(/\$|\{|\}|\[|\]/g, '');
        }
      });
    }
    next();
  });
};