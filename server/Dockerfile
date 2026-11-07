FROM node:20-slim
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]