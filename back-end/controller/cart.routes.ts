import express, { Request, Response } from 'express';
import cartService from '../service/cart.service';

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: number
 *                 format: int64
 *               quantityInCart:
 *                 type: number
 *                 format: int64
 *     CartResponse:
 *       type: object
 *       properties:
 *         carts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Cart'
 */

/**
 * @swagger
 * /carts:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve a list of all carts.
 *     responses:
 *       200:
 *         description: A list of carts.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 *       500:
 *         description: Failed to get carts.
 */
// router.get('/', async (req: Request, res: Response) => {
//     try {
//         const carts = await cartService.getAllCarts();
//         res.status(200).json(carts);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to get carts' });
//     }
// });

/**
 * @swagger
 * /carts/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve a cart by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the cart to retrieve.
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: The cart with the specified ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       500:
 *         description: Failed to get the cart.
 */
router.get('/:id', async (req: Request, res: Response) => {
    const stringId = req.params.id;
    const cartId = parseInt(stringId, 10);
    try {
        const cart = await cartService.getCartById(cartId);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get cart' });
    }
});

/**
 * @swagger
 * /carts/add/{cartId}/{bookId}:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add a book to the specified cart.
 *     parameters:
 *       - name: cartId
 *         in: path
 *         required: true
 *         description: The ID of the cart to which the book will be added.
 *         schema:
 *           type: integer
 *           format: int64
 *       - name: bookId
 *         in: path
 *         required: true
 *         description: The ID of the book to add.
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: The updated cart.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Failed to add book to cart.
 */
router.post('/add/:cartId/:bookId', async (req: Request, res: Response) => {
    const stringCartId = req.params.cartId;
    const cartId = parseInt(stringCartId, 10);
    if (isNaN(cartId)) {
        return res.status(400).json({ error: 'Invalid cart ID' });
      }      
    const stringBookId = req.params.bookId;
    const bookId = parseInt(stringBookId, 10);
    
    try {
        const updatedCart = await cartService.addBookToCart(cartId, bookId);
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error("Error adding book to cart:", error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to add book to cart';
        res.status(400).json({ error: errorMessage });
    }
});

/**
 * @swagger
 * /carts/remove/{cartId}/{bookId}:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Remove a book from the specified cart.
 *     parameters:
 *       - name: cartId
 *         in: path
 *         required: true
 *         description: The ID of the cart from which the book will be removed.
 *         schema:
 *           type: integer
 *           format: int64
 *       - name: bookId
 *         in: path
 *         required: true
 *         description: The ID of the book to remove.
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: The updated cart.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Failed to remove book from cart.
 */
router.post('/remove/:cartId/:bookId', async (req: Request, res: Response) => {
    const stringCartId = req.params.cartId;
    const cartId = parseInt(stringCartId, 10);
    const stringBookId = req.params.bookId;
    const bookId = parseInt(stringBookId, 10);
    
    try {
        const updatedCart = await cartService.removeBookFromCart(cartId, bookId);
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error("Error removing book from cart:", error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to remove book from cart';
        res.status(400).json({ error: errorMessage });
    }
});

/**
 * @swagger
 * /carts/decrease/{cartId}/{bookId}:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Decrease the quantity of a book in the specified cart.
 *     parameters:
 *       - name: cartId
 *         in: path
 *         required: true
 *         description: The ID of the cart in which the book quantity will be decreased.
 *         schema:
 *           type: integer
 *           format: int64
 *       - name: bookId
 *         in: path
 *         required: true
 *         description: The ID of the book whose quantity will be decreased.
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: The updated cart.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Failed to decrease book quantity in cart.
 */
router.post('/decrease/:cartId/:bookId', async (req: Request, res: Response) => {
    const stringCartId = req.params.cartId;
    const cartId = parseInt(stringCartId, 10);
    const stringBookId = req.params.bookId;
    const bookId = parseInt(stringBookId, 10);
    
    try {
        const updatedCart = await cartService.decreaseBookQuantityFromCart(cartId, bookId);
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error("Error decreasing quantity in cart:", error);
        const errorMessage = error instanceof Error ? error.message : 'Failed decreasing quantity in cart';
        res.status(400).json({ error: errorMessage });
    }
});

export default router;
