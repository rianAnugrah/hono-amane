# Dockerfile for hono-amane app
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm ts-node typescript && pnpm install --frozen-lockfile

# Copy the rest of the app
COPY . .



# Build the app
RUN pnpm run build

# Ensure Prisma CLI is available
RUN pnpm add -D prisma

# Expose the app port
EXPOSE 3012

# Start the app (migrations are run in docker-compose command)
CMD ["npm", "run", "prod"] 