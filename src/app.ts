import express from 'express';
import swaggerUi from 'swagger-ui-express';
import yamljs from 'yamljs';
import path from 'path';
import usersRouter from './routes/users';
import restaurantsRouter from './routes/restaurants';
import { errorHandler } from './middleware/error';
import { loggerMiddleware } from './middleware/logger';

const app = express();

// Middleware
app.use(express.json());
app.use(loggerMiddleware);

// Swagger documentation
const swaggerDocument = yamljs.load(path.join(__dirname, '../swagger.yaml'));

// @ts-ignore - swagger-ui-express type conflicts
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/docs/swagger.yaml', (req, res) => {
  res.setHeader('Content-Type', 'text/yaml');
  res.sendFile(path.join(__dirname, '../swagger.yaml'));
});

// Routes
app.use('/users', usersRouter);
app.use('/restaurants', restaurantsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

export default app;
