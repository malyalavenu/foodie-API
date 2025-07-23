import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, loginUser, getUserById, updateUser } from '../../src/services/users';

// Mock the database
jest.mock('../../src/utils/db', () => ({
  query: jest.fn(),
}));

import db from '../../src/utils/db';

const mockDb = db as jest.Mocked<typeof db>;

describe('Users Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock bcrypt
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashed-password'));
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
    // Mock jwt
    jest.spyOn(jwt, 'sign').mockImplementation(() => 'jwt-token');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createUser', () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '1234567890'
    };

    it('should create a new user successfully', async () => {
      const mockResult = {
        rows: [{ id: 'user-123' }],
        command: 'INSERT',
        rowCount: 1,
        oid: 0,
        fields: []
      };
      mockDb.query.mockResolvedValue(mockResult);

      const result = await createUser(userData);

      expect(result).toEqual({ id: 'user-123' });
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        expect.arrayContaining([
          expect.any(String), // id
          userData.name,
          userData.email,
          'hashed-password',
          userData.phone,
          expect.any(Date), // createdAt
          expect.any(Date)  // updatedAt
        ])
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
    });

    it('should throw error when database query fails', async () => {
      mockDb.query.mockRejectedValue(new Error('Database error'));

      await expect(createUser(userData)).rejects.toThrow('Database error');
    });
  });

  describe('loginUser', () => {
    const loginData = {
      email: 'john@example.com',
      password: 'password123'
    };

    it('should login user with valid credentials', async () => {
      const mockResult = {
        rows: [{
          id: 'user-123',
          password: 'hashed-password'
        }],
        command: 'SELECT',
        rowCount: 1,
        oid: 0,
        fields: []
      };
      mockDb.query.mockResolvedValue(mockResult);

      const result = await loginUser(loginData.email, loginData.password);

      expect(result).toEqual({
        token: 'jwt-token',
        userId: 'user-123'
      });
      expect(mockDb.query).toHaveBeenCalledWith(
        'SELECT id, password FROM users WHERE email = $1',
        [loginData.email]
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, 'hashed-password');
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 'user-123' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
    });

    it('should throw error when user not found', async () => {
      const mockResult = {
        rows: [],
        command: 'SELECT',
        rowCount: 0,
        oid: 0,
        fields: []
      };
      mockDb.query.mockResolvedValue(mockResult);

      await expect(loginUser(loginData.email, loginData.password))
        .rejects.toThrow('Invalid email or password');
    });

    it('should throw error when password is invalid', async () => {
      const mockResult = {
        rows: [{
          id: 'user-123',
          password: 'hashed-password'
        }],
        command: 'SELECT',
        rowCount: 1,
        oid: 0,
        fields: []
      };
      mockDb.query.mockResolvedValue(mockResult);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(loginUser(loginData.email, loginData.password))
        .rejects.toThrow('Invalid email or password');
    });

    it('should throw error when database query fails', async () => {
      mockDb.query.mockRejectedValue(new Error('Database error'));

      await expect(loginUser(loginData.email, loginData.password))
        .rejects.toThrow('Database error');
    });
  });

  describe('getUserById', () => {
    const userId = 'user-123';

    it('should get user by ID successfully', async () => {
      const mockUser = {
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };
      const mockResult = {
        rows: [mockUser],
        command: 'SELECT',
        rowCount: 1,
        oid: 0,
        fields: []
      };
      mockDb.query.mockResolvedValue(mockResult);

      const result = await getUserById(userId);

      expect(result).toEqual(mockUser);
      expect(mockDb.query).toHaveBeenCalledWith(
        'SELECT id, name, email, phone, "createdAt", "updatedAt" FROM users WHERE id = $1',
        [userId]
      );
    });

    it('should throw error when user not found', async () => {
      const mockResult = {
        rows: [],
        command: 'SELECT',
        rowCount: 0,
        oid: 0,
        fields: []
      };
      mockDb.query.mockResolvedValue(mockResult);

      await expect(getUserById(userId)).rejects.toThrow('User not found');
    });

    it('should throw error when database query fails', async () => {
      mockDb.query.mockRejectedValue(new Error('Database error'));

      await expect(getUserById(userId)).rejects.toThrow('Database error');
    });
  });

  describe('updateUser', () => {
    const userId = 'user-123';
    const updates = {
      name: 'Jane Doe',
      phone: '0987654321'
    };

    it('should update user successfully', async () => {
      const mockUpdatedUser = {
        id: userId,
        name: 'Jane Doe',
        email: 'john@example.com',
        phone: '0987654321',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };
      const mockResult = {
        rows: [mockUpdatedUser],
        command: 'UPDATE',
        rowCount: 1,
        oid: 0,
        fields: []
      };
      mockDb.query.mockResolvedValue(mockResult);

      const result = await updateUser(userId, updates);

      expect(result).toEqual(mockUpdatedUser);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users SET name = $1, phone = $2'),
        ['Jane Doe', '0987654321', userId]
      );
    });

    it('should hash password when password is updated', async () => {
      const updatesWithPassword = {
        ...updates,
        password: 'newpassword123'
      };
      const mockUpdatedUser = {
        id: userId,
        name: 'Jane Doe',
        email: 'john@example.com',
        phone: '0987654321',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };
      const mockResult = {
        rows: [mockUpdatedUser],
        command: 'UPDATE',
        rowCount: 1,
        oid: 0,
        fields: []
      };
      mockDb.query.mockResolvedValue(mockResult);

      await updateUser(userId, updatesWithPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users SET name = $1, phone = $2, password = $3'),
        ['Jane Doe', '0987654321', 'hashed-password', userId]
      );
    });

    it('should throw error when no updates provided', async () => {
      await expect(updateUser(userId, {})).rejects.toThrow('No updates provided');
      expect(mockDb.query).not.toHaveBeenCalled();
    });

    it('should throw error when user not found', async () => {
      const mockResult = {
        rows: [],
        command: 'UPDATE',
        rowCount: 0,
        oid: 0,
        fields: []
      };
      mockDb.query.mockResolvedValue(mockResult);

      await expect(updateUser(userId, updates)).rejects.toThrow('User not found');
    });

    it('should throw error when database query fails', async () => {
      mockDb.query.mockRejectedValue(new Error('Database error'));

      await expect(updateUser(userId, updates)).rejects.toThrow('Database error');
    });
  });
}); 