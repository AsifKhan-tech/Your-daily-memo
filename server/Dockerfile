# 1. Use the official Node.js image as the base (v18 or v20 are good for production)
# slim: Image size will small
FROM node:20-slim

# 2. Set the working directory inside the container
WORKDIR /usr/src/app

# 3. Copy ONLY package.json and pnpm-lock.yaml (if using pnpm) first.
COPY package.json pnpm-lock.yaml ./

# 4. Install dependencies using pnpm (since project uses pnpm)
RUN npm install -g pnpm && pnpm install

# 5. Copy the rest backend code into the container
COPY . .

# 6. Expose the port Express app runs on 4000
EXPOSE 4000

# 7. Define the command to start the app
CMD [ "npm", "run", "dev" ]