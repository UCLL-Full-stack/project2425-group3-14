import express, { Request, Response } from 'express';
import bookService from '../service/book.service'; 

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         quantity:
 *           type: number
 *         price:
 *           type: number
 *           format: float
 *     BookResponse:
 *       type: object
 *       properties:
 *         books:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Book'
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Retrieve a list of all books.
 *     responses:
 *       200:
 *         description: A list of books.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookResponse'
 *       500:
 *         description: Failed to get books.
 */
router.get('/', (req: Request, res: Response) => {
    try {
        const books = bookService.getAllBooks();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get books' });
    }
});

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Retrieve a book by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the book to retrieve.
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: The book with the specified ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Failed to get the book.
 */
router.get('/:id', (req: Request, res: Response) => {
    const stringId = req.params.id;
    const bookId = parseInt(stringId, 10);
    try {
        const book = bookService.getBookById(bookId);
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get books' });
    }
});

export default router;
