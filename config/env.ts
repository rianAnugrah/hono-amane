// config/env.ts

import dotenv from 'dotenv';

// Load .env file if exists (useful in local development)
dotenv.config();

interface Env {
  APP_SECRET: string;
  API_HOST: string;
  APP_PORT: string;
  VITE_URL: string;
  APP_DOMAIN: string;
  APP_CRONTIME: string;
  DATABASE_URL: string;
  NODE_ENV: string;
  UPLOAD_FOLDER: string;
}

// Helper function to get env with fallback
function getEnv(key: keyof Env, fallback = ''): string {
  const value = process.env[key];
  if (!value && fallback === '' && requiredKeys.includes(key)) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  return value || fallback;
}

// List of required environment variables
const requiredKeys: (keyof Env)[] = ['APP_SECRET', 'API_HOST', 'DATABASE_URL'];

const env: Env = {
  APP_SECRET: getEnv('APP_SECRET', 'your-default-secret'),
  API_HOST: getEnv('API_HOST', 'https://api.example.com'),
  APP_PORT: getEnv('APP_PORT', '3012'),
  VITE_URL: getEnv('VITE_URL', 'https://dev.hcml.co.id'),
  APP_DOMAIN: getEnv('APP_DOMAIN', '.example.com'),
  APP_CRONTIME: getEnv('APP_CRONTIME', '* * * * *'),
  DATABASE_URL: getEnv('DATABASE_URL'),
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  UPLOAD_FOLDER: getEnv('UPLOAD_FOLDER', 'uploads'),
};

export { env };
