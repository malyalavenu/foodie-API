## Detailed Requirements for Foodie-API

The backend for the Foodie-API project must meet the following requirements, incorporating Swagger for API documentation, Sequelize for migrations/models (but not queries), a `tsconfig.json` configuration without `.js` extensions in imports, no `module` field in `package.json`, and a complete project structure. Swagger documentation should have detailed description for each of the routes, methods, errors

### 1. Technology Stack

- **Server**: Node.js with TypeScript, Express for routing and middleware.
- **Database**: PostgreSQL, accessed via raw SQL queries using `pg` (no ORM for queries).
- **Database Migrations/Models**: Use Sequelize for creating database migrations and models, but perform all database queries using raw SQL via `pg`.
- **Authentication**: JWT for user authentication, stored in HTTP headers.
- **Validation**: Use Joi or Zod for request validation.
- **Testing**: Unit tests for controllers/services, integration tests for APIs using Jest and Supertest.
- **Logging**: Winston for request/error logging.
- **Environment**: Load environment variables (DB credentials, JWT secret) using `dotenv`.
- **API Documentation**: Use Swagger for API documentation, provisioned at a `/docs` endpoint.
- **Docker**: The app should be running in a dockerized environment.

### 2. Database

- Use PostgreSQL for relational data storage.
- Tables: `users`, `restaurants`, `dishes`, `orders`, `order_items`, `favorites`, `reviews`, `promotions`, `support_tickets`, `notifications`, `carts`, `cart_items`, `payments`, `tracking`.
- Migrations: Use Sequelize for schema migrations.
- Models: Define Sequelize models for type safety and schema reference, but do not use Sequelize for queries.
- Indexes on frequently queried fields (e.g., `userId`, `restaurantId`, `orderId`).
- Foreign key constraints for relational integrity.

### 3. API Features

- **RESTful Design**: Follow REST conventions for endpoints (GET, POST, PATCH, DELETE).
- **Error Handling**: Return standard HTTP status codes (200, 400, 401, 404, 500) with JSON error messages.
- **Pagination**: Support `page` and `limit` query params for list endpoints.
- **Rate Limiting**: Prevent abuse for all APIs.
- **Security**: Use HTTPS, sanitize inputs, hash passwords (bcrypt).
- **Real-Time**: Support Miracle for delivery tracking and notifications.
- **API Documentation**: Expose Swagger UI at `/docs` for interactive API documentation, generated from OpenAPI specifications.

### 4. Testing

- **Unit Tests**: Test controller logic and service functions (e.g., payment processing, JWT validation).
- **Integration Tests**: Test API endpoints with a mock PostgreSQL database.
- **Coverage**: Aim for 80%+ code coverage using Jest.
- **Mocking**: Mock external services (e.g., payment gateway) using `sinon`.

### 5. Performance

- Cache frequently accessed data (e.g., restaurant lists, menus) using Redis (optional).
- Optimize SQL queries to avoid N+1 problems and use indexes.
- Use connection pooling for PostgreSQL (`pg.Pool`).

### 6. Scalability

- Modular code structure for easy feature addition.
- Support horizontal scaling with load balancers.
- Use Docker for containerized deployment.

### 7. External Integrations

- Payment gateway (e.g., Stripe) for payments.
- Push notification service (e.g., Firebase) for notifications.
- Mapping API (e.g., Google Maps) for delivery tracking and location-based search.

### 8. TypeScript Configuration

- Use a `tsconfig.json` configuration that supports TypeScript without requiring `.js` extensions in imports.
- Ensure compatibility with Node.js and CommonJS modules, as `module` field is not used in `package.json`.

## Consolidated API List

Below is the complete list of APIs, grouped by functionality, including restaurant listings, dish information, order management, favorites, history, customer support, user management, reviews, promotions, delivery tracking, notifications, analytics, cart management, payments, and search/recommendations.

### Restaurant Management APIs

- **GET /restaurants**
  - Description: Fetch list of restaurants.
  - Parameters: `location` (optional), `cuisine` (optional), `page`, `limit`.
  - Response: List of restaurants (ID, name, address, rating, cuisine).
- **GET /restaurants/{restaurantId}**
  - Description: Fetch specific restaurant details.
  - Parameters: `restaurantId`.
  - Response: Restaurant details (name, address, rating, menu ID, hours).

### Dish Information APIs

- **GET /restaurants/{restaurantId}/menu**
  - Description: Fetch restaurant’s menu.
  - Parameters: `restaurantId`, `category` (optional).
  - Response: List of dishes (ID, name, description, price, image).
- **GET /dishes/{dishId}**
  - Description: Fetch specific dish details.
  - Parameters: `dishId`.
  - Response: Dish details (name, description, price, ingredients).

### Order Management APIs

- **POST /orders**
  - Description: Create a new order.
  - Parameters (body): `userId`, `restaurantId`, `items` (dish IDs, quantities), `deliveryAddress`, `paymentMethod`.
  - Response: Order ID, estimated delivery time, total.
- **GET /orders/{orderId}**
  - Description: Fetch specific order details.
  - Parameters: `orderId`.
  - Response: Order details (status, items, total, address).
- **GET /users/{userId}/orders**
  - Description: Fetch user’s orders (history).
  - Parameters: `userId`, `status` (optional), `page`, `limit`.
  - Response: List of orders (ID, restaurant, status, total, date).
- **PATCH /orders/{orderId}**
  - Description: Update order status (e.g., cancel, deliver).
  - Parameters: `orderId`, `status`.
  - Response: Updated order status.

### Favorites APIs

- **POST /users/{userId}/favorites**
  - Description: Add restaurant/dish to favorites.
  - Parameters: `userId`, `itemId`, `itemType` (restaurant/dish).
  - Response: Success message.
- **GET /users/{userId}/favorites**
  - Description: Fetch user’s favorites.
  - Parameters: `userId`, `itemType` (optional).
  - Response: List of favorites (ID, name, type).
- **DELETE /users/{userId}/favorites/{itemId}**
  - Description: Remove item from favorites.
  - Parameters: `userId`, `itemId`.
  - Response: Success message.

### Order History APIs

- **GET /users/{userId}/history**
  - Description: Fetch user’s order history.
  - Parameters: `userId`, `page`, `limit`.
  - Response: List of past orders (ID, restaurant, status, total, date).

### Customer Support APIs

- **POST /support/tickets**
  - Description: Create support ticket.
  - Parameters (body): `userId`, `orderId` (optional), `issue`, `contact`.
  - Response: Ticket ID, success message.
- **GET /users/{userId}/support/tickets**
  - Description: Fetch user’s support tickets.
  - Parameters: `userId`, `status` (optional).
  - Response: List of tickets (ID, issue, status, date).
- **GET /support/tickets/{ticketId}**
  - Description: Fetch specific ticket details.
  - Parameters: `ticketId`.
  - Response: Ticket details (issue, status, responses).

### User Management APIs

- **POST /users**
  - Description: Register new user.
  - Parameters (body): `name`, `email`, `password`, `phone`.
  - Response: User ID, success message.
- **PATCH /users/{userId}**
  - Description: Update user profile.
  - Parameters: `userId`, `updates` (e.g., name, address).
  - Response: Updated user details.
- **POST /users/login**
  - Description: Authenticate user and generate JWT.
  - Parameters (body): `email`, `password`.
  - Response: JWT token, user ID.

### Reviews and Ratings APIs

- **POST /restaurants/{restaurantId}/reviews**
  - Description: Submit restaurant review.
  - Parameters: `restaurantId`, `userId`, `rating`, `comment`.
  - Response: Review ID, success message.
- **GET /restaurants/{restaurantId}/reviews**
  - Description: Fetch restaurant reviews.
  - Parameters: `restaurantId`, `page`, `limit`.
  - Response: List of reviews (user, rating, comment, date).
- **POST /dishes/{dishId}/reviews**
  - Description: Submit dish review.
  - Parameters: `dishId`, `userId`, `rating`, `comment`.
  - Response: Review ID, success message.

### Promotions and Discounts APIs

- **GET /promotions**
  - Description: Fetch active promotions.
  - Parameters: `restaurantId` (optional), `location` (optional).
  - Response: List of promotions (ID, description, discount, validity).
- **POST /orders/{orderId}/apply-promotion**
  - Description: Apply promotion to order.
  - Parameters: `orderId`, `promoCode`.
  - Response: Updated order total, success message.

### Delivery Tracking APIs

- **GET /orders/{orderId}/tracking**
  - Description: Fetch delivery status and location.
  - Parameters: `orderId`.
  - Response: Status, driver location (lat, long), estimated time.
- **POST /orders/{orderId}/tracking**
  - Description: Update delivery status.
  - Parameters: `orderId`, `status`, `location` (optional).
  - Response: Success message.

### Notifications APIs

- **POST /users/{userId}/notifications**
  - Description: Send notification to user.
  - Parameters: `userId`, `message`, `type`.
  - Response: Notification ID, success message.
- **GET /users/{userId}/notifications**
  - Description: Fetch user’s notifications.
  - Parameters: `userId`, `page`, `limit`.
  - Response: List of notifications (ID, message, type, date).

### Analytics APIs (Admin)

- **GET /analytics/restaurants**
  - Description: Fetch restaurant performance metrics.
  - Parameters: `restaurantId` (optional), `dateRange`.
  - Response: Metrics (orders, revenue, ratings).
- **GET /analytics/orders**
  - Description: Fetch order analytics.
  - Parameters: `restaurantId` (optional), `dateRange`.
  - Response: Metrics (order count, revenue, status breakdown).

### Cart Management APIs

- **POST /users/{userId}/cart**
  - Description: Add items to cart.
  - Parameters: `userId`, `restaurantId`, `items` (dish IDs, quantities).
  - Response: Cart ID, updated cart contents.
- **GET /users/{userId}/cart**
  - Description: Fetch user’s cart.
  - Parameters: `userId`.
  - Response: Cart contents (restaurant, items, total).
- **DELETE /users/{userId}/cart**
  - Description: Clear user’s cart.
  - Parameters: `userId`.
  - Response: Success message.

### Payment APIs

- **POST /orders/{orderId}/payment**
  - Description: Process order payment.
  - Parameters: `orderId`, `paymentMethod`, `paymentDetails`.
  - Response: Payment status, transaction ID.
- **GET /users/{userId}/payment-methods**
  - Description: Fetch user’s saved payment methods.
  - Parameters: `userId`.
  - Response: List of payment methods (ID, type, last 4 digits).

### Search and Recommendations APIs

- **GET /search**
  - Description: Search restaurants or dishes.
  - Parameters: `query`, `location` (optional), `page`, `limit`.
  - Response: List of matching restaurants/dishes.
- **GET /users/{userId}/recommendations**
  - Description: Fetch personalized recommendations.
  - Parameters: `userId`, `location` (optional).
  - Response: List of recommended restaurants/dishes.

## Notes

- **Authentication**: Secure user-specific and admin APIs with JWT or OAuth.
- **Error Handling**: Use standard HTTP status codes with JSON error messages.
- **Rate Limiting**: Apply to all APIs to prevent abuse.
- **Real-Time**: Use WebSockets for delivery tracking and notifications.
- **Testing**: Ensure 80%+ code coverage with Jest for unit and integration tests.
- **Performance**: Optimize SQL queries, use indexes, and consider Redis caching.
- **External Integrations**: Stripe for payments, Firebase for notifications, Google Maps for tracking.
- **API Documentation**: Swagger UI available at `/docs`, auto-generated from OpenAPI specs.
- **TypeScript**: Use `tsconfig.json` to support imports without `.js` extensions, compatible with CommonJS.
- **Package.json**: Do not include the `module` field; use CommonJS modules.

## TypeScript Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "resolveJsonModule": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

foodie-API/
├── src/
│ ├── config/
│ │ ├── database.ts # Database connection setup (pg.Pool)
│ │ ├── swagger.ts # Swagger configuration for /docs endpoint
│ │ └── env.ts # Environment variable loading (dotenv)
│ ├── controllers/ # Request handlers for API endpoints
│ │ ├── restaurants/
│ │ │ ├── index.ts # Restaurant-related controllers
│ │ │ └── schema.ts # Joi/Zod validation schemas
│ │ ├── dishes/
│ │ │ ├── index.ts
│ │ │ └── schema.ts
│ │ ├── orders/
│ │ │ ├── index.ts
│ │ │ └── schema.ts
│ │ ├── favorites/
│ │ │ ├── index.ts
│ │ │ └── schema.ts
│ │ ├── history/
│ │ │ ├── index.ts
│ │ │ └── schema.ts
│ │ ├── support/
│ │ │ ├── index.ts
│ │ │ └── schema.ts
│ │ ├── users/
│ │ │ ├── index.ts
│ │ │ └── schema.ts
│ │ ├── reviews/
│ │ │ ├── index.ts
│ │ │ └── schema.ts
│ │ ├── promotions/
│ │ │ ├── index.ts
│ │ │ └── schema.ts
│ │ ├── tracking/
│ │ │ ├── index.ts
│ │ │ └── schema.ts
│ │ ├── notifications/
│ │ │ ├── index.ts
│ │ │ └── schema.ts
│ │ ├── analytics/
│ │ │ ├── index.ts
│ │ recommandations/
│ │ │ ├── index.ts
│ │ │ └── schema.ts
│ │ ├── cart/
│ │ │ ├── index.ts
│ │ │ └── schema.ts
│ │ ├── payments/
│ │ │ ├── index.ts
│ │ │ └── schema.ts
│ │ └── search/
│ │ ├── index.ts
│ │ └── schema.ts
│ ├── services/ # Business logic
│ │ ├── restaurants.ts
│ │ ├── dishes.ts
│ │ ├── orders.ts
│ │ ├── favorites.ts
│ │ ├── history.ts
│ │ ├── support.ts
│ │ ├── users.ts
│ │ ├── reviews.ts
│ │ ├── promotions.ts
│ │ ├── tracking.ts
│ │ ├── notifications.ts
│ │ ├── analytics.ts
│ │ ├── recommendations.ts
│ │ ├── cart.ts
│ │ ├── payments.ts
│ │ ├── search.ts
│ │ └── auth.ts # JWT handling
│ ├── models/ # Sequelize model definitions
│ │ ├── User.ts
│ │ ├── Restaurant.ts
│ │ ├── Dish.ts
│ │ ├── Order.ts
│ │ ├── OrderItem.ts
│ │ ├── Favorite.ts
│ │ ├── Review.ts
│ │ ├── Promotion.ts
│ │ ├── SupportTicket.ts
│ │ ├── Notification.ts
│ │ ├── Cart.ts
│ │ ├── CartItem.ts
│ │ ├── Payment.ts
│ │ └── Tracking.ts
│ ├── migrations/ # Sequelize migrations
│ │ ├── 20250101-create-users.ts
│ │ ├── 20250102-create-restaurants.ts
│ │ └── ... # Other migration files
│ ├── routes/
│ │ ├── index.ts # Main router combining all routes
│ │ ├── restaurants.ts
│ │ ├── dishes.ts
│ │ ├── orders.ts
│ │ ├── favorites.ts
│ │ ├── history.ts
│ │ ├── support.ts
│ │ ├── users.ts
│ │ ├── reviews.ts
│ │ ├── promotions.ts
│ │ ├── tracking.ts
│ │ ├── notifications.ts
│ │ ├── analytics.ts
│ │ ├── recommendations.ts
│ │ ├── cart.ts
│ │ ├── payments.ts
│ │ └── search.ts
│ ├── middleware/
│ │ ├── auth.ts # JWT authentication middleware
│ │ ├── rateLimit.ts # Rate limiting middleware
│ │ ├── validate.ts # Joi/Zod validation middleware
│ │ ├── error.ts # Error handling middleware
│ │ └── logger.ts # Winston logging middleware
│ ├── utils/
│ │ ├── db.ts # Raw SQL query helpers (using pg)
│ │ ├── redis.ts # Redis client setup (optional)
│ │ ├── websocket.ts # WebSocket setup for real-time features
│ │ └── constants.ts # App-wide constants
│ ├── types/
│ │ ├── index.ts # Custom TypeScript types/interfaces
│ │ └── swagger.yaml # OpenAPI specification for Swagger
│ ├── tests/
│ │ ├── unit/
│ │ │ ├── controllers/
│ │ │ ├── services/
│ │ │ └── mocks/ # Mock data and services (sinon)
│ │ ├── integration/
│ │ │ ├── restaurants.test.ts
│ │ │ ├── orders.test.ts
│ │ │ └── ... # Other integration tests
│ │ └── setup.ts # Test setup (mock DB, Jest config)
│ └── app.ts # Express app setup and entry point
├── .env # Environment variables (not committed)
├── .env.example # Example environment variables
├── .gitignore # Git ignore file
├── Dockerfile # Docker configuration
├── docker-compose.yml # Docker Compose for local dev
├── package.json # Project dependencies (no "module" field)
├── tsconfig.json # TypeScript configuration
├── jest.config.ts # Jest configuration
├── README.md # Project documentation
└── swagger.yaml # Base OpenAPI specification
