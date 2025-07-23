import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import db from '../utils/db';
import jwt from 'jsonwebtoken';

export async function createUser({
  name,
  email,
  password,
  phone,
}: {
  name: string;
  email: string;
  password: string;
  phone: string;
}) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const id = uuidv4();
  const now = new Date();
  const query = `INSERT INTO users (id, name, email, password, phone, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;
  const values = [id, name, email, hashedPassword, phone, now, now];
  const result = await db.query(query, values);
  return { id: result.rows[0].id };
}

export async function getUserById(userId: string) {
  const query = `SELECT id, name, email, phone, "createdAt", "updatedAt" FROM users WHERE id = $1`;
  const result = await db.query(query, [userId]);
  if (result.rows.length === 0) {
    throw new Error('User not found');
  }
  return result.rows[0];
}

export async function updateUser(
  userId: string,
  updates: Partial<{
    name: string;
    email: string;
    password: string;
    phone: string;
  }>
) {
  const fields = [];
  const values = [];
  let idx = 1;
  for (const key of Object.keys(updates)) {
    if (key === 'password') {
      updates.password = await bcrypt.hash(updates.password!, 10);
    }
    fields.push(`${key} = $${idx}`);
    values.push((updates as any)[key]);
    idx++;
  }
  if (fields.length === 0) {
    throw new Error('No updates provided');
  }
  values.push(userId);
  const query = `UPDATE users SET ${fields.join(', ')}, "updatedAt" = NOW() WHERE id = $${idx} RETURNING id, name, email, phone, "createdAt", "updatedAt"`;
  const result = await db.query(query, values);
  if (result.rows.length === 0) {
    throw new Error('User not found');
  }
  return result.rows[0];
}

export async function loginUser(email: string, password: string) {
  const query = `SELECT id, password FROM users WHERE email = $1`;
  const result = await db.query(query, [email]);
  if (result.rows.length === 0) {
    throw new Error('Invalid email or password');
  }
  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error('Invalid email or password');
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '1d',
  });
  return { token, userId: user.id };
}
