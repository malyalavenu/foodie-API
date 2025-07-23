import request from 'supertest';
import express from 'express';
import { authenticateToken } from '../../src/middleware/auth';

interface AuthenticatedRequest extends express.Request {
  user?: {
    userId: string;
  };
}

// Create a simple test app
const app = express();
app.use(express.json());

// Test route that requires authentication
app.get('/protected', authenticateToken, (req: AuthenticatedRequest, res) => {
  res.json({ message: 'Access granted', userId: req.user?.userId });
});

describe('Authentication Middleware', () => {
  it('should return 401 when no token is provided', async () => {
    const response = await request(app).get('/protected').expect(401);

    expect(response.body.error).toBe('Access token required');
  });

  it('should return 403 when invalid token is provided', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalid-token')
      .expect(403);

    expect(response.body.error).toBe('Invalid or expired token');
  });

  it('should return 403 when expired token is provided', async () => {
    const jwt = require('jsonwebtoken');
    const expiredToken = jwt.sign(
      { userId: 'test-user-id' },
      process.env.JWT_SECRET,
      { expiresIn: '-1h' }
    );

    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${expiredToken}`)
      .expect(403);

    expect(response.body.error).toBe('Invalid or expired token');
  });

  it('should allow access with valid token', async () => {
    const jwt = require('jsonwebtoken');
    const validToken = jwt.sign(
      { userId: 'test-user-id' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200);

    expect(response.body.message).toBe('Access granted');
    expect(response.body.userId).toBe('test-user-id');
  });
});
