import express, { NextFunction, Request, Response } from 'express';
import userDb from '../repository/user.db';
import UserService from '../service/user.service';
import { User } from '../model/user';
import userService from '../service/user.service';
import { UserInput } from '../types';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    try {
        const users = UserService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get users' });
    }
});

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

export default router;