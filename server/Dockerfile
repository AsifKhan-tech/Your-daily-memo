FROM node:22-slim

ENV NODE_ENV=production
WORKDIR /usr/src/app

RUN npm install -g pnpm@12.15.0

# Firstly copy dependency files (layer caching)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Reamaining code, non-root user 
COPY --chown=node:node . .

USER node
EXPOSE 3000
CMD ["node", "server.js"]