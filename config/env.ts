// config/env.ts

// Define an interface for your environment variables
interface Env {
  APP_SECRET: string;
  API_HOST: string;
  APP_PORT?: string;
  VITE_URL?: string;
  APP_DOMAIN?: string;
  APP_CRONTIME?: string;
  DATABASE_URL?: string;
}

// Create a safely typed env object
const env: Env = {
  APP_SECRET: import.meta.env.APP_SECRET || '45tereyhdfst6785ergdfy574wsfgty654es3543trwrtgrer',
  API_HOST: import.meta.env.VITE_API_HOST || 'https://api-data.hcml.co.id/',
  APP_PORT: import.meta.env.VITE_APP_PORT || '3012',
  VITE_URL: import.meta.env.VITE_URL || 'https://dev.hcml.co.id',
  APP_DOMAIN: import.meta.env.VITE_APP_DOMAIN || '.hcml.co.id',
  APP_CRONTIME: import.meta.env.VITE_APP_CRONTIME || '"* 12 * * *"',
  DATABASE_URL: import.meta.env.VITE_DATABASE_URL || 'postgresql://postgres:Jakarta@123@localhost:5432/amane?schema=public',
};

// Validate required variables
if (!env.APP_SECRET) {
  throw new Error('APP_SECRET is required in environment variables');
}

if (!env.API_HOST) {
  throw new Error('API_HOST is required in environment variables');
}

export { env };