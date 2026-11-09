# Daily Memo Server

The Daily Memo server is the backend API for the Daily Memo application. It is built with Node.js, Express, MongoDB, and JWT-based authentication. The API handles user registration, login, email verification, password reset, JWT refresh flow, todo management, and contact message (user queries) submission.

## What this server does

This backend provides the core APIs for the app, including:

- User authentication and authorization
  - Register
  - Login
  - Email verification
  - Forgot password and reset password
  - Access token and refresh token flow
- Todo management
  - Create, read, update, and delete tasks
- Contact module
  - Submit contact forms and related messages
- Secure configuration with environment variables
- CORS support for frontend domains
- Health check endpoint for deployment and monitoring

## Tech stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Nodemailer for emails
- Cookie-based token handling
- Docker support for local MongoDB setup

## Prerequisites

Before running the server locally, make sure you have:

- Node.js 18 or newer
- pnpm 12 or newer
- MongoDB running locally or a MongoDB Atlas connection URI
- A valid SMTP provider for email sending (or a test SMTP setup)

## 1) Install dependencies

From the `server` directory:

```bash
cd server
pnpm install
```

If you prefer npm, you can also use:

```bash
npm install
```

## 2) Create environment file

Copy the sample environment file:

```bash
cp env.example .env
```

Then update `.env` with your values:

```env
PORT=3000
NODE_ENV=development

MONGO_USER=your_mongo_username
MONGO_PASS=your_mongo_password
MONGODB_URI=mongodb://localhost:27017/daily-memo

JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password

SMTP_FROM_NAME=Daily Memo
SMTP_FROM_EMAIL=your_email@example.com

CLIENT_URL=http://localhost:5173
```

### Environment variables explained

- `PORT`: port where the Express server will run
- `NODE_ENV`: application environment (`development`, `production`, etc.)
- `MONGODB_URI`: MongoDB connection string
- `JWT_ACCESS_SECRET`: secret for access tokens
- `JWT_REFRESH_SECRET`: secret for refresh tokens
- `JWT_ACCESS_EXPIRES_IN`: access token lifetime
- `JWT_REFRESH_EXPIRES_IN`: refresh token lifetime
- `SMTP_*`: email configuration for account verification and password reset
- `CLIENT_URL`: frontend URL allowed by CORS

## 3) Start MongoDB locally

### Option A: Use Docker

This project includes a MongoDB container setup in `server/docker-compose.yml`.

```bash
cd server
docker compose up -d
```

This starts:

- MongoDB at `mongodb://localhost:27017`
- Mongo Express at `http://localhost:8081`

### Option B: Use a local MongoDB instance

If MongoDB is already installed on your machine, make sure it is running and use that connection string in `.env`.

## 4) Run the server locally

Start the API in development mode:

```bash
cd server
pnpm dev
```

This runs:

```bash
node server.js
```

The server will start on:

```text
http://localhost:3000
```

You can check if it is alive by visiting:

```text
http://localhost:3000/health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is healthy and running"
}
```

## 5) Docker scripts

The project also includes helper scripts for Docker-based workflow:

```bash
cd server
pnpm up
pnpm down
pnpm start
pnpm stop
pnpm restart
```

## API overview

The backend exposes routes under the `/api/v1` prefix:

- `/api/v1/auth` — authentication routes
- `/api/v1/todos` — todo APIs
- `/api/v1/contact` — contact message APIs

## Notes

- The server uses cookie-based auth for refresh/access tokens.
- CORS is configured to allow only the frontend URL defined in `CLIENT_URL`.
- Production environment should use secure secrets and a proper MongoDB connection string.
- Keep `.env` out of version control in a real deployment.

## Troubleshooting

### MongoDB connection failed

- Check whether MongoDB is running
- Verify `MONGODB_URI` in `.env`
- If using Docker, make sure the MongoDB container is started with:

```bash
docker compose up -d
```

### CORS error

- Make sure `CLIENT_URL` matches your frontend origin exactly
- For local frontend development, use something like:

```env
CLIENT_URL=http://localhost:5173
```

### Email not sending

- Verify `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS`
- Some providers require an app password instead of the normal account password

## Summary

This server acts as the backend for Daily Memo, handling user accounts, secure auth flow, todo data, and contact-related services. Once configured correctly, it can run locally with a MongoDB database and provide the APIs your frontend app needs.
