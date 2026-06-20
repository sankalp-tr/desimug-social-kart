const swaggerJsdoc = require('swagger-jsdoc');

// This definition is the "shell" of the docs (title, version, server URL).
// The actual endpoint details come from the @swagger comments above each
// route handler in routes/*.js — swagger-jsdoc scans those files and merges
// everything into one spec.
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DesiMug Social Kart API',
      version: '1.0.0',
      description:
        'REST API for the DesiMug Social Kart marketplace + social feed app.',
    },
    servers: [{ url: 'http://localhost:5000', description: 'Local dev server' }],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            avatar: { type: 'string' },
            role: { type: 'string', enum: ['buyer', 'seller', 'admin'] },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            imageUrl: { type: 'string' },
            category: { type: 'string' },
            stock: { type: 'number' },
            seller: { type: 'string', description: 'User ID of the seller' },
            rating: {
              type: 'object',
              properties: {
                average: { type: 'number' },
                count: { type: 'number' },
              },
            },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            buyer: { type: 'string', description: 'User ID of the buyer' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: { type: 'string' },
                  name: { type: 'string' },
                  quantity: { type: 'number' },
                  priceAtPurchase: { type: 'number' },
                },
              },
            },
            totalAmount: { type: 'number' },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
            },
            shippingAddress: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                postalCode: { type: 'string' },
                country: { type: 'string' },
              },
            },
            paymentStatus: { type: 'string', enum: ['unpaid', 'paid', 'refunded'] },
          },
        },
        WallPost: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            author: { type: 'string', description: 'User ID of the author' },
            content: { type: 'string' },
            imageUrl: { type: 'string' },
            likes: { type: 'array', items: { type: 'string' } },
            comments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  user: { type: 'string' },
                  text: { type: 'string' },
                },
              },
            },
            tags: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);
