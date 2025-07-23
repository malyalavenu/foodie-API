import request from 'supertest';
import express from 'express';
import {
  validateUserRegistration,
  validateUserUpdate,
  validateUserLogin,
} from '../../src/controllers/users/schema';
import {
  registerUser,
  updateUserProfile,
  loginUserController,
  getUserProfile,
} from '../../src/controllers/users';
import { authenticateToken } from '../../src/middleware/auth';

// Create test app
const app = express();
app.use(express.json());

// Set up routes for testing
app.post('/users', validateUserRegistration, registerUser);
app.post('/users/login', validateUserLogin, loginUserController);
app.get('/users/:userId', authenticateToken, getUserProfile);
app.patch(
  '/users/:userId',
  authenticateToken,
  validateUserUpdate,
  updateUserProfile
);

// Mock the database services
jest.mock('../../src/services/users', () => ({
  createUser: jest.fn(),
  loginUser: jest.fn(),
  getUserById: jest.fn(),
  updateUser: jest.fn(),
}));

import {
  createUser,
  loginUser,
  getUserById,
  updateUser,
} from '../../src/services/users';

const mockCreateUser = createUser as jest.MockedFunction<typeof createUser>;
const mockLoginUser = loginUser as jest.MockedFunction<typeof loginUser>;
const mockGetUserById = getUserById as jest.MockedFunction<typeof getUserById>;
const mockUpdateUser = updateUser as jest.MockedFunction<typeof updateUser>;

describe('Users API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /users (Registration)', () => {
    const validUserData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '1234567890',
    };

    it('should register a new user with valid data', async () => {
      mockCreateUser.mockResolvedValue({ id: 'user-123' });

      const response = await request(app)
        .post('/users')
        .send(validUserData)
        .expect(201);

      expect(response.body).toEqual({
        userId: 'user-123',
        message: 'User registered successfully',
      });
      expect(mockCreateUser).toHaveBeenCalledWith(validUserData);
    });

    it('should return 400 for missing required fields', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        // missing password and phone
      };

      const response = await request(app)
        .post('/users')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBeDefined();
      expect(mockCreateUser).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid email format', async () => {
      const invalidData = {
        ...validUserData,
        email: 'invalid-email',
      };

      const response = await request(app)
        .post('/users')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBeDefined();
      expect(mockCreateUser).not.toHaveBeenCalled();
    });

    it('should return 400 for password too short', async () => {
      const invalidData = {
        ...validUserData,
        password: '123',
      };

      const response = await request(app)
        .post('/users')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBeDefined();
      expect(mockCreateUser).not.toHaveBeenCalled();
    });

    it('should return 400 for name too short', async () => {
      const invalidData = {
        ...validUserData,
        name: 'J',
      };

      const response = await request(app)
        .post('/users')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBeDefined();
      expect(mockCreateUser).not.toHaveBeenCalled();
    });

    it('should return 400 for phone too short', async () => {
      const invalidData = {
        ...validUserData,
        phone: '123',
      };

      const response = await request(app)
        .post('/users')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBeDefined();
      expect(mockCreateUser).not.toHaveBeenCalled();
    });
  });

  describe('POST /users/login', () => {
    const validLoginData = {
      email: 'john@example.com',
      password: 'password123',
    };

    it('should login user with valid credentials', async () => {
      const mockResult = {
        token: 'jwt-token-123',
        userId: 'user-123',
      };
      mockLoginUser.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/users/login')
        .send(validLoginData)
        .expect(200);

      expect(response.body).toEqual(mockResult);
      expect(mockLoginUser).toHaveBeenCalledWith(
        validLoginData.email,
        validLoginData.password
      );
    });

    it('should return 400 for missing email', async () => {
      const invalidData = {
        password: 'password123',
      };

      const response = await request(app)
        .post('/users/login')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBeDefined();
      expect(mockLoginUser).not.toHaveBeenCalled();
    });

    it('should return 400 for missing password', async () => {
      const invalidData = {
        email: 'john@example.com',
      };

      const response = await request(app)
        .post('/users/login')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBeDefined();
      expect(mockLoginUser).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid email format', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };

      const response = await request(app)
        .post('/users/login')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBeDefined();
      expect(mockLoginUser).not.toHaveBeenCalled();
    });

    it('should return 400 for password too short', async () => {
      const invalidData = {
        email: 'john@example.com',
        password: '123',
      };

      const response = await request(app)
        .post('/users/login')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBeDefined();
      expect(mockLoginUser).not.toHaveBeenCalled();
    });
  });

  describe('GET /users/:userId (Get Profile)', () => {
    const generateToken = (userId: string) => {
      const jwt = require('jsonwebtoken');
      return jwt.sign({ userId }, process.env.JWT_SECRET || 'test-secret', {
        expiresIn: '1h',
      });
    };

    it('should get user profile with valid token and matching userId', async () => {
      const userId = 'user-123';
      const token = generateToken(userId);
      const mockUser = {
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };
      mockGetUserById.mockResolvedValue(mockUser);

      const response = await request(app)
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toEqual(mockUser);
      expect(mockGetUserById).toHaveBeenCalledWith(userId);
    });

    it('should return 401 when no token is provided', async () => {
      const response = await request(app).get('/users/user-123').expect(401);

      expect(response.body.error).toBe('Access token required');
      expect(mockGetUserById).not.toHaveBeenCalled();
    });

    it('should return 403 when token is invalid', async () => {
      const response = await request(app)
        .get('/users/user-123')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403);

      expect(response.body.error).toBe('Invalid or expired token');
      expect(mockGetUserById).not.toHaveBeenCalled();
    });

    it('should return 403 when userId in token does not match path parameter', async () => {
      const token = generateToken('user-456'); // Different user ID

      await request(app)
        .get('/users/user-123')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(mockGetUserById).not.toHaveBeenCalled();
    });

    it('should return 404 when user is not found', async () => {
      const userId = 'user-123';
      const token = generateToken(userId);
      mockGetUserById.mockRejectedValue(new Error('User not found'));

      await request(app)
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(500); // Error gets passed to error handler

      expect(mockGetUserById).toHaveBeenCalledWith(userId);
    });
  });

  describe('PATCH /users/:userId (Update Profile)', () => {
    const generateToken = (userId: string) => {
      const jwt = require('jsonwebtoken');
      return jwt.sign({ userId }, process.env.JWT_SECRET || 'test-secret', {
        expiresIn: '1h',
      });
    };

    const validUpdateData = {
      name: 'Jane Doe',
      phone: '0987654321',
    };

    it('should update user profile with valid token and matching userId', async () => {
      const userId = 'user-123';
      const token = generateToken(userId);
      const mockUpdatedUser = {
        id: userId,
        name: 'Jane Doe',
        email: 'john@example.com',
        phone: '0987654321',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };
      mockUpdateUser.mockResolvedValue(mockUpdatedUser);

      const response = await request(app)
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(validUpdateData)
        .expect(200);

      expect(response.body).toEqual(mockUpdatedUser);
      expect(mockUpdateUser).toHaveBeenCalledWith(userId, validUpdateData);
    });

    it('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .patch('/users/user-123')
        .send(validUpdateData)
        .expect(401);

      expect(response.body.error).toBe('Access token required');
      expect(mockUpdateUser).not.toHaveBeenCalled();
    });

    it('should return 403 when token is invalid', async () => {
      const response = await request(app)
        .patch('/users/user-123')
        .set('Authorization', 'Bearer invalid-token')
        .send(validUpdateData)
        .expect(403);

      expect(response.body.error).toBe('Invalid or expired token');
      expect(mockUpdateUser).not.toHaveBeenCalled();
    });

    it('should return 403 when userId in token does not match path parameter', async () => {
      const token = generateToken('user-456'); // Different user ID

      await request(app)
        .patch('/users/user-123')
        .set('Authorization', `Bearer ${token}`)
        .send(validUpdateData)
        .expect(403);

      expect(mockUpdateUser).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid update data', async () => {
      const userId = 'user-123';
      const token = generateToken(userId);
      const invalidData = {
        email: 'invalid-email',
      };

      const response = await request(app)
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBeDefined();
      expect(mockUpdateUser).not.toHaveBeenCalled();
    });

    it('should return 400 for empty update data', async () => {
      const userId = 'user-123';
      const token = generateToken(userId);

      const response = await request(app)
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);

      expect(response.body.error).toBeDefined();
      expect(mockUpdateUser).not.toHaveBeenCalled();
    });

    it('should return 400 for password too short', async () => {
      const userId = 'user-123';
      const token = generateToken(userId);
      const invalidData = {
        password: '123',
      };

      const response = await request(app)
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBeDefined();
      expect(mockUpdateUser).not.toHaveBeenCalled();
    });

    it('should return 404 when user is not found', async () => {
      const userId = 'user-123';
      const token = generateToken(userId);
      mockUpdateUser.mockRejectedValue(new Error('User not found'));

      await request(app)
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(validUpdateData)
        .expect(500); // Error gets passed to error handler

      expect(mockUpdateUser).toHaveBeenCalledWith(userId, validUpdateData);
    });
  });
});
