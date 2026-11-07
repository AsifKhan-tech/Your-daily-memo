/**
  services:
  # ... (Your existing mongodb and mongo-express services remain unchanged here) ...

  # Ye tumhara naya Backend App container hai
  api-server:
    build: .                 # Tells Docker to look for the Dockerfile in the current directory
    container_name: daily_memo_backend
    ports:
      - "4000:4000"          # Map container port 4000 to local port 4000
    restart: unless-stopped
    depends_on:
      - mongodb              # Ensures the DB starts BEFORE the app
    env_file:
      - .env                 # Injects environment variables from your local .env file
    volumes:
      - .:/usr/src/app       # Syncs your local code with container (for hot-reloading in dev)
      - /usr/src/app/node_modules # Prevents local node_modules from overwriting container's
 
 
 
 
 */

// for future
