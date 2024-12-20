import express, { NextFunction, Request, Response } from 'express';
import bookService from '../service/book.service'; 
import { BookInput } from '../types';
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
 *     security:
 *       - bearerAuth: []
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
router.get('/', async (req: Request, res: Response) => {
    try {
        const books = await bookService.getAllBooks();
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
router.get('/:id', async (req: Request, res: Response) => {
    console.log("test");
    const stringId = req.params.id;
    const bookId = parseInt(stringId, 10);
    try {
        const book = await bookService.getBookById(bookId);
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get books' });
    }
});

router.post('/add', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookInput = <BookInput>req.body;
        const response = await bookService.addBook(bookInput);
        res.status(200).json({message: "Authentication succesful", ...response});
    } catch (error) {
        next(error);   
    };
});

router.post('/remove/:bookId', async (req: Request, res: Response) => {
    const stringBookId = req.params.bookId;
    const bookId = parseInt(stringBookId, 10);

    try {
        const deletedBook = await bookService.removeBook(bookId);
        res.status(200).json(deletedBook);
    } catch (error) {
        console.error("Error removing this book:", error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to remove book';
        res.status(400).json({ error: errorMessage });
    };
});

export default router;
