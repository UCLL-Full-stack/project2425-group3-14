import { User } from '../model/user';
import userDb from '../repository/user.db';
import { UserInput } from '../types';

const registerUser = ({username, email, password, role}: UserInput): User => {
    if (userDb.findUserByUsername(username)) {
        throw new Error("Username is already taken!");
    }

    if (userDb.findUserByEmail(email)) {
        throw new Error("Email is already taken!");
    }

    const newUser = new User({ username, email, password, role });

    return userDb.createUser(newUser);
};

const getAllUsers = (): User[] => {
    return userDb.getAllUsers();
};

export default { registerUser, getAllUsers };