# Test Suite Documentation

This directory contains comprehensive tests for the Foodie API.

## Test Files

### 1. `auth.test.ts` - Authentication Middleware Tests

Tests the JWT authentication middleware functionality:

- ✅ Valid token acceptance
- ❌ Missing token handling (401)
- ❌ Invalid token handling (403)
- ❌ Expired token handling (403)

**Coverage**: 100% for authentication middleware

### 2. `users.test.ts` - User API Endpoint Tests

Tests all user-related API endpoints with full authentication coverage:

#### Registration (`POST /users`)

- ✅ Valid user registration
- ❌ Missing required fields validation
- ❌ Invalid email format validation
- ❌ Password too short validation
- ❌ Name too short validation
- ❌ Phone too short validation

#### Login (`POST /users/login`)

- ✅ Valid login with credentials
- ❌ Missing email validation
- ❌ Missing password validation
- ❌ Invalid email format validation
- ❌ Password too short validation

#### Get Profile (`GET /users/:userId`)

- ✅ Valid token with matching userId
- ❌ No token provided (401)
- ❌ Invalid token (403)
- ❌ Token userId mismatch (403)
- ❌ User not found (404)

#### Update Profile (`PATCH /users/:userId`)

- ✅ Valid token with matching userId
- ❌ No token provided (401)
- ❌ Invalid token (403)
- ❌ Token userId mismatch (403)
- ❌ Invalid update data validation
- ❌ Empty update data validation
- ❌ Password too short validation
- ❌ User not found (404)

**Coverage**: 96% for user controllers and 100% for validation schemas

### 3. `services.test.ts` - Business Logic Tests

Tests the service layer functions that handle business logic:

#### User Creation (`createUser`)

- ✅ Successful user creation with password hashing
- ❌ Database error handling

#### User Login (`loginUser`)

- ✅ Successful login with JWT token generation
- ❌ User not found error
- ❌ Invalid password error
- ❌ Database error handling

#### Get User by ID (`getUserById`)

- ✅ Successful user retrieval
- ❌ User not found error
- ❌ Database error handling

#### Update User (`updateUser`)

- ✅ Successful user update
- ✅ Password hashing when password is updated
- ❌ No updates provided error
- ❌ User not found error
- ❌ Database error handling

**Coverage**: 100% for user services

## Test Statistics

- **Total Test Suites**: 3
- **Total Tests**: 42
- **All Tests Passing**: ✅
- **Overall Coverage**: 59.88%

## Key Features Tested

### Authentication & Authorization

- JWT token validation
- User isolation (users can only access their own data)
- Token expiration handling
- Proper error responses for authentication failures

### Input Validation

- Email format validation
- Password length requirements
- Name length requirements
- Phone number length requirements
- Required field validation

### Error Handling

- Database error handling
- User not found scenarios
- Invalid input scenarios
- Authentication failure scenarios

### Security

- Password hashing verification
- JWT token generation and validation
- User authorization checks

## Running Tests

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test --coverage

# Run specific test file
yarn test tests/users.test.ts

# Run tests in watch mode
yarn test --watch
```

## Test Structure

The tests follow a layered approach:

1. **Unit Tests**: Test individual functions in isolation
2. **Integration Tests**: Test API endpoints with mocked dependencies
3. **Middleware Tests**: Test authentication and validation middleware

## Mocking Strategy

- **Database**: Mocked using Jest to avoid actual database connections
- **External Libraries**: bcrypt and jsonwebtoken are mocked for predictable testing
- **Services**: User services are mocked in API tests to focus on controller logic

## Best Practices Followed

1. **Isolation**: Each test is independent and doesn't rely on other tests
2. **Clear Naming**: Test descriptions clearly indicate what is being tested
3. **Comprehensive Coverage**: Tests cover both success and failure scenarios
4. **Proper Mocking**: External dependencies are properly mocked
5. **Error Scenarios**: All error conditions are tested
6. **Security Testing**: Authentication and authorization are thoroughly tested
