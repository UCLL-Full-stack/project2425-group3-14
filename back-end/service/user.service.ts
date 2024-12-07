import { User } from '../model/user';
import userDb from '../repository/user.db';
import { UserInput } from '../types';

const registerUser = async ({username, email, password, role}: UserInput): Promise<User> => {
    if (await userDb.findUserByUsername({username})) {
        throw new Error("Username is already taken!");
    }

    if (await userDb.findUserByEmail({email})) {
        throw new Error("Email is already taken!");
    }

    const newUser = new User({ username, email, password, role });

    return await userDb.createUser(newUser);
};

const getAllUsers = async (): Promise<User[]> => {
    return await userDb.getAllUsers();
};

export default { registerUser, getAllUsers };