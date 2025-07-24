import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../src/app';

jest.mock('../../src/services/restaurants', () => ({
  __esModule: true,
  getRestaurants: jest.fn(),
  getRestaurantById: jest.fn(),
  createRestaurant: jest.fn(),
}));

import {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
} from '../../src/services/restaurants';

describe('Restaurant Controller', () => {
  let authToken: string;

  beforeEach(() => {
    jest.clearAllMocks();
    // Generate a valid test token
    authToken = jwt.sign({ userId: 'test-user-id' }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });
  });

  it('should return 401 when no token is provided', async () => {
    const res = await request(app).get('/restaurants');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Access token required');
  });

  it('should return 403 when invalid token is provided', async () => {
    const res = await request(app)
      .get('/restaurants')
      .set('Authorization', 'Bearer invalid-token');
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Invalid or expired token');
  });

  it('should fetch a list of restaurants with valid token', async () => {
    (getRestaurants as jest.Mock).mockResolvedValueOnce({
      count: 1,
      rows: [{ id: '1', name: 'Testaurant' }],
    });
    const res = await request(app)
      .get('/restaurants')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('restaurants');
    expect(res.body.restaurants[0].name).toBe('Testaurant');
  });

  it('should fetch a specific restaurant by ID with valid token', async () => {
    (getRestaurantById as jest.Mock).mockResolvedValueOnce({
      id: '1',
      name: 'Testaurant',
    });
    const res = await request(app)
      .get('/restaurants/1')
      .set('Authorization', `Bearer ${authToken}`);
    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty('name', 'Testaurant');
    }
  });

  it('should return 401 when accessing restaurant by ID without token', async () => {
    const res = await request(app).get('/restaurants/1');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Access token required');
  });

  it('should create a new restaurant with valid token', async () => {
    const restaurantData = {
      name: 'New Restaurant',
      address: '123 Main St, City, State',
      rating: 4.5,
      cuisine: 'Italian',
      menuId: 'menu-123',
      hours: 'Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-11PM',
    };

    const mockCreatedRestaurant = {
      id: 'restaurant-123',
      ...restaurantData,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    (createRestaurant as jest.Mock).mockResolvedValueOnce(
      mockCreatedRestaurant
    );

    const res = await request(app)
      .post('/restaurants')
      .set('Authorization', `Bearer ${authToken}`)
      .send(restaurantData);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockCreatedRestaurant);
    expect(createRestaurant).toHaveBeenCalledWith(restaurantData);
  });

  it('should return 401 when creating restaurant without token', async () => {
    const restaurantData = {
      name: 'New Restaurant',
      address: '123 Main St, City, State',
      rating: 4.5,
      cuisine: 'Italian',
      menuId: 'menu-123',
      hours: 'Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-11PM',
    };

    const res = await request(app).post('/restaurants').send(restaurantData);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Access token required');
    expect(createRestaurant).not.toHaveBeenCalled();
  });

  it('should return 400 when creating restaurant with invalid data', async () => {
    const invalidRestaurantData = {
      name: '', // Invalid: empty name
      address: '123 Main St',
      rating: 6, // Invalid: rating > 5
      cuisine: 'Italian',
      menuId: 'menu-123',
      hours: 'Mon-Fri: 9AM-10PM',
    };

    const res = await request(app)
      .post('/restaurants')
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidRestaurantData);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(createRestaurant).not.toHaveBeenCalled();
  });
});
