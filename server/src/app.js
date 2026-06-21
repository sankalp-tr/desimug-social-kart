const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const usersRouter = require('./routes/users.routes');
const feedRouter = require('./routes/feed.routes');
const productsRouter = require('./routes/products.routes');
const ordersRouter = require('./routes/orders.routes');

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

// Interactive API docs (generated from @swagger comments in routes/*.js)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/users', usersRouter);
app.use('/api/feed', feedRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// 404 fallback
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

module.exports = app;
