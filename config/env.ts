// config/env.ts

// Optional: Install dotenv if you want to load from .env file
//import * as dotenv from 'dotenv';

// Load environment variables from .env file (if you're using one)
//dotenv.config();

// Define an interface for your environment variables
interface Env {
  APP_SECRET: string;
  API_HOST: string;
  NODE_ENV?: string;  // Optional: common env variable
  PORT?: string;      // Optional: common env variable
}

// Create a safely typed env object
const env: Env = {
  APP_SECRET: process.env.APP_SECRET || '',
  API_HOST: process.env.API_HOST || 'http://localhost:3000', // Default value
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '3000',
};

// Validate required variables
if (!env.APP_SECRET) {
  throw new Error('APP_SECRET is required in environment variables');
}

if (!env.API_HOST) {
  throw new Error('API_HOST is required in environment variables');
}

export { env };