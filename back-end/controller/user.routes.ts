import express, { NextFunction, Request, Response } from 'express';
import userDb from '../repository/user.db';
import UserService from '../service/user.service';
import { User } from '../model/user';
import userService from '../service/user.service';
import { UserInput, Role } from '../types';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *         role:
 *           type: string
 *           enum: [admin, customer]
 *     UserInput:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *         role:
 *           type: string
 *           enum: [admin, customer]
 *     AuthenticationRequest:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *     AuthenticationResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 */

/**
 * @swagger
 * /users:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve a list of all users.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Failed to get users.
 */
router.get('/', async (req: Request & { auth: any }, res: Response, next: NextFunction) => {
    try {
        const { role } = req.auth;
        const users = await UserService.getAllUsers({ role });
        res.status(200).json(users);
    } catch (error) {
        next(error);
        // res.status(500).json({ error: 'Failed to get users' });
    }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login using username/password. Returns an object with JWT token and user name when succesful.
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/AuthenticationRequest'
 *     responses:
 *       200:
 *          description: The created user object
 *          content:
 *             application/json:
 *               schema:
 *               $ref: '#/components/schemas/AuthenticationResponse'
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput = <UserInput>req.body;
        const response = await userService.authenticate(userInput);
        res.status(200).json({message: "Authentication succesful", ...response});
    } catch (error) {
        next(error);   
    }
})

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: User successfully registered.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Failed to register user.
 */
router.post('/register', async (req: Request, res: Response) => {
    const newUser = <UserInput>req.body;

    try {
        const result = await userService.registerUser(newUser);
        res.status(201).json(result);
    } catch (error) {
        console.error("User creation error:", error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to register user';
        res.status(400).json({ error: errorMessage});
    }
});

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Create a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: User successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Failed to create user.
 */
router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput = <UserInput>req.body;
        const user = await userService.createUser(userInput);
        res.status(200).json(user);    
    } catch (error) {
        next(error);
    }
});

router.post('/remove/:userId', async (req: Request, res: Response) => {
    const stringUserId = req.params.userId;
    const userId = parseInt(stringUserId, 10);

    try {
        const deletedUser = await userService.deleteUser(userId);
        res.status(200).json(deletedUser);
    } catch (error) {
        console.error("Error removing this user:", error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to remove user';
        res.status(400).json({ error: errorMessage });
    };
});

export default router;