import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Environment variables
export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/admin-panel',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  OTPLESS_CLIENT_ID: process.env.OTPLESS_CLIENT_ID || '',
  OTPLESS_CLIENT_SECRET: process.env.OTPLESS_CLIENT_SECRET || '',
  DOMAIN_URL: process.env.DOMAIN_URL || 'https://yourdomain.com',
};

// Validate environment variables
export const validateEnv = () => {
  if (!env.MONGO_URI) {
    console.warn('Warning: MONGO_URI is not set. Using default MongoDB URI.');
  }

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'secret') {
    console.warn('Warning: JWT_SECRET is not set or using default value. This is not secure for production.');
  }
  
  if (!env.OTPLESS_CLIENT_ID || !env.OTPLESS_CLIENT_SECRET) {
    console.warn('Warning: OTPLESS_CLIENT_ID or OTPLESS_CLIENT_SECRET is not set. OTP verification will not work properly.');
  }
};