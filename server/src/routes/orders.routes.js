const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders.controller');

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: List all orders (admin use)
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Array of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Order' }
 */
router.get('/', ordersController.getAllOrders);

/**
 * @swagger
 * /api/orders/buyer/{buyerId}:
 *   get:
 *     summary: List orders placed by a specific buyer
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: buyerId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Array of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Order' }
 */
router.get('/buyer/:buyerId', ordersController.getOrdersByBuyer);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get a single order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: The order
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Order' }
 *       404:
 *         description: Order not found
 */
router.get('/:id', ordersController.getOrderById);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [buyer, items, shippingAddress]
 *             properties:
 *               buyer: { type: string, description: 'User ID of the buyer' }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product: { type: string }
 *                     name: { type: string }
 *                     quantity: { type: number }
 *                     priceAtPurchase: { type: number }
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   street: { type: string }
 *                   city: { type: string }
 *                   state: { type: string }
 *                   postalCode: { type: string }
 *                   country: { type: string }
 *     responses:
 *       201:
 *         description: Order created (totalAmount is calculated from items)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Order' }
 *       400:
 *         description: Validation error
 */
router.post('/', ordersController.createOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update an order's status and/or payment status
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string, enum: [pending, confirmed, shipped, delivered, cancelled] }
 *               paymentStatus: { type: string, enum: [unpaid, paid, refunded] }
 *     responses:
 *       200:
 *         description: Updated order
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Order' }
 *       400:
 *         description: Validation error
 *       404:
 *         description: Order not found
 */
router.patch('/:id/status', ordersController.updateOrderStatus);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order deleted
 *       404:
 *         description: Order not found
 */
router.delete('/:id', ordersController.deleteOrder);

module.exports = router;
