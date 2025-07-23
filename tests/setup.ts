import dotenv from 'dotenv';

// Load environment variables for testing
dotenv.config({ path: '.env.test' });

// Set default test environment variables if not provided
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
process.env.DB_HOST = process.env.DB_HOST || 'localhost';
process.env.DB_PORT = process.env.DB_PORT || '5432';
process.env.DB_USER = process.env.DB_USER || 'foodie';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'secret';
process.env.DB_NAME = process.env.DB_NAME || 'foodie_db_test';
