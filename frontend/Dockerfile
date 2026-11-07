# Stage 1: Build the frontend assets
FROM node:20-slim AS builder

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# Copy the rest of the frontend code
COPY . .

# Build the project (Vite will output to the 'dist' folder)
RUN pnpm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the built assets from the 'builder' stage to Nginx's default serving directory
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Expose port 80 (Nginx default)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]