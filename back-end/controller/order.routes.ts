import express, { NextFunction, Request, Response } from 'express';
import orderService from '../service/order.service';
import { UnauthorizedError } from "express-jwt";

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *         userId:
 *           type: number
 *           format: int64
 *         status:
 *           type: string
 *         totalAmount:
 *           type: number
 *           format: float
 *         createdAt:
 *           type: string
 *           format: date-time
 *     OrderResponse:
 *       type: object
 *       properties:
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Order'
 */

/**
 * @swagger
 * /orders/{userId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve a list of orders for a specific user.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user whose orders are to be retrieved.
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: A list of orders for the specified user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       500:
 *         description: Failed to get orders.
 */
router.get('/:userId?', async (req: Request & { auth: any }, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    try {
        const { username, role } = req.auth;
        const orders = await orderService.getAllOrders({ username, role }, userId);
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error in GET /orders/:userId:", error);
        if (error instanceof UnauthorizedError) {
            return res.status(401).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to get orders' });
    }
});

export default router;
