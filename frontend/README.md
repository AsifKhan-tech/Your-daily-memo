# Daily Memo Frontend

The Daily Memo frontend is a responsive single-page application for capturing and managing todos. It also provides account registration and login, email verification, password recovery, a protected profile, and a contact form.

## Tech stack

- React 19
- Vite
- React Router
- Joi for client-side validation

## Prerequisites

- Node.js 22 or newer
- pnpm 12.15.0
- The Daily Memo API running locally for authentication, todo storage, and contact form features

Install the project's pnpm version if needed:

```bash
npm install --global pnpm@12.15.0
```

## Run locally

From the repository root:

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

By default, the frontend sends API requests to `http://localhost:3000/api/v1`. To use another API URL, create `frontend/.env` and set:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Restart the Vite development server after changing environment variables. The API must allow the frontend's origin via its `CLIENT_URL` setting. See the [server setup guide](../server/Readme.md) for instructions to configure and run the API and MongoDB.

## Available scripts

Run these commands from the `frontend` directory:

```bash
pnpm dev       # Start the Vite development server
pnpm build     # Build the production app into dist/
pnpm preview   # Preview the production build locally
pnpm lint      # Run ESLint
```

## Project structure

```text
src/
  components/   Shared layout and UI components
  features/     Authentication, contact, and todo features
  hooks/        Shared React hooks
  lib/          API client, configuration, and utilities
  styles/       Base, component, theme, and responsive styles
```

## Production and Docker

The production build is a static site served by Nginx. From the repository root, Docker Compose builds the frontend together with the API and MongoDB:

```bash
docker compose up --build
```

Configure the root and server environment files as described in the [project setup guide](../README.md). In the Compose build, `VITE_API_BASE_URL` is set to `/api/v1` and Nginx forwards those requests to the API.
