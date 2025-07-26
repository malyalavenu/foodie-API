import db from '../utils/db';
import { v4 as uuidv4 } from 'uuid';

export const getRestaurants = async (
  filters: { location?: string; cuisine?: string } = {},
  page = 1,
  limit = 10
) => {
  const offset = (page - 1) * limit;
  const whereClauses: string[] = [];
  const params: any[] = [];

  if (filters.location) {
    params.push(`%${filters.location}%`);
    whereClauses.push(`address ILIKE $${params.length}`);
  }
  if (filters.cuisine) {
    params.push(filters.cuisine);
    whereClauses.push(`cuisine = $${params.length}`);
  }

  const where = whereClauses.length
    ? `WHERE ${whereClauses.join(' AND ')}`
    : '';

  const dataQuery = `SELECT * FROM restaurants ${where} ORDER BY name LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);
  const countQuery = `SELECT COUNT(*) FROM restaurants ${where}`;
  const [dataResult, countResult] = await Promise.all([
    db.query(dataQuery, params),
    db.query(countQuery, params.slice(0, params.length - 2)),
  ]);
  return {
    count: Number(countResult.rows[0].count),
    rows: dataResult.rows,
  };
};

export const getRestaurantById = async (restaurantId: string) => {
  const result = await db.query('SELECT * FROM restaurants WHERE id = $1', [
    restaurantId,
  ]);
  return result.rows[0] || null;
};

export const createRestaurant = async (restaurantData: {
  name: string;
  address: string;
  rating: number;
  cuisine: string;
  hours: string;
}) => {
  const id = uuidv4();
  const now = new Date();
  const query = `
    INSERT INTO restaurants (id, name, address, rating, cuisine, hours, "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;

  const values = [
    id,
    restaurantData.name,
    restaurantData.address,
    restaurantData.rating,
    restaurantData.cuisine,
    restaurantData.hours,
    now,
    now,
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};
