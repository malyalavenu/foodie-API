[![CI](https://github.com/malyalavenu/foodie-API/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/malyalavenu/foodie-API/actions/workflows/ci.yml)
[![Unit Tests](https://github.com/malyalavenu/foodie-API/actions/workflows/unit-tests.yml/badge.svg?branch=main)](https://github.com/malyalavenu/foodie-API/actions/workflows/unit-tests.yml)
[![CodeQL](https://github.com/malyalavenu/foodie-API/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/malyalavenu/foodie-API/actions/workflows/codeql.yml)

> **Note:** This repository is maintained using an AI code assistant.

# Foodie-API

A secure, modern REST API for food delivery, built with Node.js, Express, TypeScript, PostgreSQL, and JWT authentication.

## Features
- User registration, login, and profile management
- Restaurant listing, details, and creation
- JWT-based authentication for protected routes
- Input validation and security best practices
- Comprehensive automated testing and CI/CD
- [Swagger API documentation](http://localhost:3000/docs)

## Available API Routes

### Users
| Method | Endpoint              | Description                | Auth Required |
|--------|-----------------------|----------------------------|--------------|
| POST   | `/users`              | Register a new user        | No           |
| POST   | `/users/login`        | User login (get JWT)       | No           |
| GET    | `/users/:userId`      | Get user profile           | Yes          |
| PATCH  | `/users/:userId`      | Update user profile        | Yes          |

### Restaurants
| Method | Endpoint                    | Description                | Auth Required |
|--------|-----------------------------|----------------------------|--------------|
| GET    | `/restaurants`              | List restaurants           | Yes          |
| GET    | `/restaurants/:restaurantId`| Get restaurant by ID       | Yes          |
| POST   | `/restaurants`              | Create a new restaurant    | Yes          |

> **See [`TODOs.md`](./TODOs.md) for planned/unimplemented routes.**

## Getting Started

### Local Development

1. **Clone the repo:**
   ```sh
   git clone https://github.com/malyalavenu/foodie-API.git
   cd foodie-API
   ```
2. **Install dependencies:**
   ```sh
   yarn install
   ```
3. **Configure environment:**
   - Copy `.env.example` to `.env` and fill in your DB and JWT settings.
4. **Run database migrations:**
   ```sh
   yarn migrate
   ```
5. **Build the project:**
   ```sh
   yarn build
   ```
6. **Start the server:**
   ```sh
   yarn start
   ```
   The API will be available at [http://localhost:3000](http://localhost:3000)

### Running with Docker

1. **Build and start services:**
   ```sh
   docker-compose up --build
   ```
   This will start the API and a PostgreSQL database.
2. **API Docs:**
   Visit [http://localhost:3000/docs](http://localhost:3000/docs)

## Testing

- Run all tests:
  ```sh
  yarn test
  ```
- Coverage reports are generated in the `coverage/` directory.

## Security
- CodeQL and CI/CD workflows scan for vulnerabilities on every push/PR.
- See [`SECURITY.md`](./SECURITY.md) for responsible disclosure and security policy.

## Contributing
- Please open issues and pull requests for improvements or bug fixes.
- See [`TODOs.md`](./TODOs.md) for features you can help implement!

---

**API documentation:** [http://localhost:3000/docs](http://localhost:3000/docs)

**Maintained by:** [malyalavenu](https://github.com/malyalavenu)
