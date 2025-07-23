# Foodie-API

Backend for Foodie-API. Only the POST /users endpoint is implemented in this version.

## Setup

1. Install dependencies:
   ```sh
   yarn install
   ```
2. Copy `.env.example` to `.env` and set your environment variables.
3. Build the project:
   ```sh
   yarn build
   ```
4. Start the server:
   ```sh
   yarn start
   ```

## API Documentation

Swagger UI is available at [http://localhost:3000/docs](http://localhost:3000/docs)

## Endpoint

### POST /users

- Registers a new user.
- Request body: `{ name, email, password, phone }`
- Response: `{ userId, message }`
