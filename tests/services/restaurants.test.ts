import {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
} from '../../src/services/restaurants';
import db from '../../src/utils/db';

jest.mock('../../src/utils/db', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

describe('Restaurant Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get restaurants with filters', async () => {
    (db.query as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          rows: [{ id: '1', name: 'Testaurant' }],
          rowCount: 1,
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          rows: [{ count: '1' }],
          rowCount: 1,
        })
      );
    const result = await getRestaurants({ location: 'NYC' }, 1, 10);
    expect(result).toHaveProperty('rows');
    expect(result.rows[0].name).toBe('Testaurant');
  });

  it('should get restaurant by ID', async () => {
    (db.query as jest.Mock).mockResolvedValueOnce({
      rows: [{ id: '1', name: 'Testaurant' }],
      rowCount: 1,
    });
    const restaurant = await getRestaurantById('1');
    expect(restaurant).toHaveProperty('name', 'Testaurant');
  });

  it('should create a new restaurant', async () => {
    const restaurantData = {
      name: 'New Restaurant',
      address: '123 Main St, City, State',
      rating: 4.5,
      cuisine: 'Italian',
      menuId: 'menu-123',
      hours: 'Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-11PM',
    };

    const mockCreatedRestaurant = {
      id: expect.any(String),
      ...restaurantData,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    };

    (db.query as jest.Mock).mockResolvedValueOnce({
      rows: [mockCreatedRestaurant],
      rowCount: 1,
    });

    const result = await createRestaurant(restaurantData);

    expect(result).toEqual(mockCreatedRestaurant);
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO restaurants'),
      expect.any(Array)
    );
  });
});
