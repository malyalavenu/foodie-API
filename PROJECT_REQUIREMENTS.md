# foodie-API — Project Brief

## Overview

A standalone food ordering REST API built in Node.js. Primary purpose is a reference implementation for **MCPgen** — a tool that generates MCP tools, schemas, and resources from a swagger file. The API should be clean, well-typed, and produce a high-quality OpenAPI/Swagger spec.

This API is also the foundation of a larger vision — a **universal commerce platform** where users order food via any messaging interface (WhatsApp, iMessage, RCS, Slack, etc.) through AI agents.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Fastify |
| Swagger | @fastify/swagger + @fastify/swagger-ui |
| Database | PostgreSQL (raw `pg` driver — no ORM) |
| Auth | BetterAuth |
| Containerization | Docker |
| Infra | AWS EKS + Pulumi (TypeScript) |
| Payment | Cash on Delivery only |

---

## Data Model

### User
```
id              uuid PK
email           string unique
phone           string
name            string
role            enum: customer | restaurant_admin
created_at      timestamp
updated_at      timestamp
```

### DeliveryAddress
```
id              uuid PK
user_id         uuid FK → User
label           string (e.g. "Home", "Work")
street          string
city            string
state           string
pincode         string
is_default      boolean
created_at      timestamp
```

### Restaurant
```
id              uuid PK
name            string
description     string
cuisine_type    string
address         string
city            string
phone           string
is_active       boolean
created_at      timestamp
updated_at      timestamp
```

### MenuItem
```
id              uuid PK
restaurant_id   uuid FK → Restaurant
name            string
description     string
price           numeric(10,2)
category        string
is_available    boolean
created_at      timestamp
updated_at      timestamp
```

### Order
```
id              uuid PK
user_id         uuid FK → User
restaurant_id   uuid FK → Restaurant
delivery_address_id  uuid FK → DeliveryAddress
status          enum: placed | confirmed | preparing | out_for_delivery | delivered | cancelled
payment_method  enum: cash_on_delivery
total_amount    numeric(10,2)
estimated_delivery_time  timestamp
notes           string nullable
created_at      timestamp
updated_at      timestamp
```

### OrderItem
```
id              uuid PK
order_id        uuid FK → Order
menu_item_id    uuid FK → MenuItem
quantity        integer
unit_price      numeric(10,2)
subtotal        numeric(10,2)
```

### Favorite
```
id              uuid PK
user_id         uuid FK → User
restaurant_id   uuid FK → Restaurant
menu_item_ids   uuid[]
nickname        string (e.g. "my usual", "friday night order")
created_at      timestamp
```

---

## Auth

- Provider: **BetterAuth**
- Roles: `customer`, `restaurant_admin`
- Strategy: JWT via BetterAuth session
- Role-based route guards via Fastify preHandler hooks

---

## API Endpoints

### Auth
```
POST   /auth/register
POST   /auth/login
POST   /auth/logout
GET    /auth/me
```

### Restaurants
```
GET    /restaurants                        # list all active restaurants
GET    /restaurants/:id                    # get restaurant details
POST   /restaurants                        # create (restaurant_admin only)
PUT    /restaurants/:id                    # update (restaurant_admin only)
DELETE /restaurants/:id                    # deactivate (restaurant_admin only)
```

### Menu Items
```
GET    /restaurants/:id/menu               # list menu for a restaurant
GET    /restaurants/:id/menu/:itemId       # get single menu item
POST   /restaurants/:id/menu               # add item (restaurant_admin only)
PUT    /restaurants/:id/menu/:itemId       # update item (restaurant_admin only)
DELETE /restaurants/:id/menu/:itemId       # remove item (restaurant_admin only)
```

### Delivery Addresses
```
GET    /addresses                          # list user's addresses
POST   /addresses                          # add address
PUT    /addresses/:id                      # update address
DELETE /addresses/:id                      # remove address
PATCH  /addresses/:id/default              # set as default
```

### Orders
```
POST   /orders                             # place order (customer)
GET    /orders                             # list user's orders (customer)
GET    /orders/:id                         # get order details
PATCH  /orders/:id/status                  # update status (restaurant_admin)
DELETE /orders/:id                         # cancel order (customer, only if placed)
```

### Favorites
```
GET    /favorites                          # list user's favorites
POST   /favorites                          # save a favorite
PUT    /favorites/:id                      # update favorite
DELETE /favorites/:id                      # remove favorite
POST   /favorites/:id/reorder              # place order from favorite
```

---

## Folder Structure

```
foodie-api/
├── src/
│   ├── app.ts                    # Fastify instance setup, plugins registration
│   ├── server.ts                 # Entry point, listen
│   ├── config/
│   │   └── env.ts                # Env vars with validation
│   ├── db/
│   │   ├── client.ts             # pg Pool setup
│   │   ├── models/               # TypeScript types mirroring DB tables
│   │   │   ├── user.model.ts
│   │   │   ├── restaurant.model.ts
│   │   │   ├── menu-item.model.ts
│   │   │   ├── order.model.ts
│   │   │   ├── order-item.model.ts
│   │   │   ├── address.model.ts
│   │   │   └── favorite.model.ts
│   │   ├── migrations/           # Raw SQL migration files
│   │   │   ├── 001_create_users.sql
│   │   │   ├── 002_create_restaurants.sql
│   │   │   ├── 003_create_menu_items.sql
│   │   │   ├── 004_create_addresses.sql
│   │   │   ├── 005_create_orders.sql
│   │   │   ├── 006_create_order_items.sql
│   │   │   └── 007_create_favorites.sql
│   │   ├── migrate.ts            # Migration runner script
│   │   └── seeds/                # Seed data for restaurants, menu items
│   │       ├── restaurants.seed.sql
│   │       └── menu-items.seed.sql
│   ├── plugins/
│   │   ├── auth.ts               # BetterAuth plugin
│   │   ├── swagger.ts            # @fastify/swagger setup
│   │   └── sensible.ts           # @fastify/sensible
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.schema.ts
│   │   │   └── auth.service.ts
│   │   ├── restaurants/
│   │   │   ├── restaurants.routes.ts
│   │   │   ├── restaurants.schema.ts
│   │   │   └── restaurants.service.ts
│   │   ├── menu/
│   │   │   ├── menu.routes.ts
│   │   │   ├── menu.schema.ts
│   │   │   └── menu.service.ts
│   │   ├── orders/
│   │   │   ├── orders.routes.ts
│   │   │   ├── orders.schema.ts
│   │   │   └── orders.service.ts
│   │   ├── addresses/
│   │   │   ├── addresses.routes.ts
│   │   │   ├── addresses.schema.ts
│   │   │   └── addresses.service.ts
│   │   └── favorites/
│   │       ├── favorites.routes.ts
│   │       ├── favorites.schema.ts
│   │       └── favorites.service.ts
│   ├── middleware/
│   │   ├── requireAuth.ts        # Auth guard preHandler
│   │   └── requireRole.ts        # Role guard preHandler
│   └── types/
│       └── index.ts              # Shared TypeScript types
├── infra/                        # Pulumi IaC
│   ├── index.ts                  # Pulumi entrypoint
│   ├── eks.ts                    # EKS cluster + node group
│   ├── rds.ts                    # PostgreSQL on RDS
│   ├── ecr.ts                    # ECR registry
│   └── k8s.ts                    # K8s deployment + service
├── tests/
│   ├── helpers/
│   │   ├── seed.ts               # Seed/teardown helpers for test db
│   │   ├── auth.helper.ts        # Create test users, generate tokens
│   │   └── request.helper.ts     # Fastify inject wrapper
│   ├── unit/
│   │   ├── orders.service.test.ts       # Order status transition logic
│   │   ├── favorites.service.test.ts    # Reorder logic
│   │   └── addresses.service.test.ts    # Default address logic
│   └── integration/
│       ├── auth.test.ts
│       ├── restaurants.test.ts
│       ├── menu.test.ts
│       ├── orders.test.ts
│       ├── addresses.test.ts
│       └── favorites.test.ts
├── Dockerfile
├── docker-compose.yml            # Local dev with Postgres
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## Key Implementation Notes

### Schema-first routes
Every Fastify route must define a `schema` object with `body`, `params`, `querystring`, and `response` — this drives auto-generated swagger output. No schema = no swagger = bad MCPgen input.

```typescript
fastify.post('/orders', {
  schema: {
    body: CreateOrderSchema,
    response: { 201: OrderResponseSchema }
  },
  preHandler: [requireAuth, requireRole('customer')]
}, handler)
```

### Raw SQL pattern
Use `pg` Pool directly. No ORM. Services call `db.query()` with parameterized queries.

```typescript
const result = await db.query(
  'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
  [userId]
)
```

### Order status transitions
Only valid transitions are allowed:
```
placed → confirmed → preparing → out_for_delivery → delivered
placed → cancelled (customer only)
confirmed → cancelled (restaurant_admin only)
```

### Favorite reorder
`POST /favorites/:id/reorder` creates a new Order using the saved restaurant + menu_item_ids from the Favorite, with the user's default delivery address. Returns the new Order object.

---

## Environment Variables

```
DATABASE_URL=postgresql://user:pass@localhost:5432/foodie
PORT=3000
NODE_ENV=development
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
```

---

## GitHub Issues — Chronological Order

Create these in order before writing any code. Each issue should be created before the work begins.

| # | Title | Description |
|---|---|---|
| 1 | Project bootstrap | Init repo, tsconfig, package.json, eslint, prettier, .env.example, .gitignore |
| 2 | Docker + local dev setup | Dockerfile, docker-compose with Postgres, health check endpoint |
| 3 | Database client setup | pg Pool setup, connection config, graceful shutdown |
| 4 | Migration runner | migrate.ts script to run numbered SQL migrations in order |
| 5 | DB migrations — users | SQL migration for users table with roles enum |
| 6 | DB migrations — restaurants | SQL migration for restaurants table |
| 7 | DB migrations — menu items | SQL migration for menu_items table |
| 8 | DB migrations — addresses | SQL migration for delivery_addresses table |
| 9 | DB migrations — orders | SQL migration for orders table with status enum |
| 10 | DB migrations — order items | SQL migration for order_items table |
| 11 | DB migrations — favorites | SQL migration for favorites table |
| 12 | Seed data | Seed SQL for sample restaurants and menu items |
| 13 | DB models — TypeScript types | One interface per table mirroring raw SQL results |
| 14 | Fastify app setup | App instance, plugin registration, error handler, graceful shutdown |
| 15 | Swagger plugin | @fastify/swagger + @fastify/swagger-ui configured with full API metadata |
| 16 | BetterAuth setup | BetterAuth plugin, session config, JWT strategy |
| 17 | Auth middleware | requireAuth and requireRole preHandler hooks |
| 18 | Test infrastructure | Vitest config, test db setup, seed/teardown helpers, request + auth helpers |
| 19 | Auth module — tests | Failing tests for register, login, logout, /me |
| 20 | Auth module — implementation | Route handlers, schema, service for auth endpoints |
| 21 | Restaurants module — tests | Failing tests for CRUD, role guards, validation |
| 22 | Restaurants module — implementation | Routes, schema, service for restaurant endpoints |
| 23 | Menu module — tests | Failing tests for menu CRUD, availability toggle |
| 24 | Menu module — implementation | Routes, schema, service for menu item endpoints |
| 25 | Addresses module — tests | Failing tests for CRUD, default address logic |
| 26 | Addresses module — implementation | Routes, schema, service for delivery address endpoints |
| 27 | Orders module — tests | Failing tests for placement, status transitions, cancellation |
| 28 | Orders module — implementation | Routes, schema, service, status transition guard |
| 29 | Favorites module — tests | Failing tests for save, reorder, nickname |
| 30 | Favorites module — implementation | Routes, schema, service, reorder from favorite |
| 31 | Pulumi — ECR registry | ECR repo for foodie-api Docker images |
| 32 | Pulumi — EKS cluster | EKS cluster + managed node group |
| 33 | Pulumi — RDS PostgreSQL | RDS Postgres instance, security groups, subnet group |
| 34 | Pulumi — K8s deployment | K8s deployment, service, configmap, secrets for foodie-api |
| 35 | CI/CD pipeline | GitHub Actions — test, build, push to ECR, deploy to EKS |
| 36 | Swagger spec validation | Verify generated swagger covers all endpoints, schemas, tags, descriptions |
| 37 | README | Setup instructions, env vars, how to run locally, how to run tests |



### TDD — Test First
Every feature follows this order — no exceptions:
1. GitHub issue created (manually or via AI)
2. Write failing tests (unit first, then integration)
3. Implement the feature until tests pass
4. Commit + PR

### GitHub Issues
Each unit of work gets an issue before any code is written:
- One issue per module (e.g. "Orders module", "Favorites module")
- One issue per infra concern (e.g. "EKS stack", "RDS setup")
- One issue per cross-cutting concern (e.g. "Auth middleware", "Swagger setup")

Issues can be created manually or via GitHub CLI:
```bash
gh issue create --title "Orders module" --body "Implement order routes, schema, service, and tests"
```

### Commit Convention
```
[#issue_number] short description
```
- Description must be **under 50 characters**
- Use imperative mood ("add", "fix", "implement", not "added", "fixed")
- Examples:
  ```
  [#12] add order placement route
  [#12] add order status transition logic
  [#12] add orders integration tests
  [#15] fix default address on reorder
  ```

### PR Convention
- One PR per issue (or per logical chunk of an issue)
- PR title follows same format as commit: `[#12] implement orders module`
- PR description includes: what was built, how to test it, any decisions made

---

## Test Suite

- Framework: **Vitest**
- Tests are written **before** implementation (TDD)
- Tests use a test database (separate from dev)
- Seed helpers in `tests/helpers/seed.ts`
- Unit tests: pure logic, no DB, no HTTP
- Integration tests: full HTTP via Fastify `inject()`, real test DB

---

## Swagger Output

The swagger spec generated by this API will be used as input to **MCPgen** to auto-generate MCP tools, schemas, and resources. Quality of the swagger spec directly impacts MCPgen output quality.

Ensure:
- All routes have `summary` and `description`
- All schemas have `description` on each field
- Response schemas are fully defined including error responses (400, 401, 403, 404)
- Tags are used per module (auth, restaurants, menu, orders, addresses, favorites)

---

## Downstream Projects

| Project | Dependency on foodie-API |
|---|---|
| MCPgen | Consumes foodie-API swagger file |
| Agentgen | Orchestrates MCPgen-generated tools to handle orders |
| agentgen-ui | End user uploads swagger, tests agents against foodie-API |
| Channel adapters | WhatsApp/iMessage/Slack → Agentgen → foodie-API |