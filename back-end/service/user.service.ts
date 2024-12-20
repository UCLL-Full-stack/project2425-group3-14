import { User } from '../model/user';
import userDb from '../repository/user.db';
import { AuthenticationResponse, Role, UserInput } from '../types';
import bcrypt from 'bcrypt';
import { generateJwtToken } from '../util/jwt';
import { UnauthorizedError } from 'express-jwt';
import cartDb from '../repository/cart.db';
import { Cart } from '../model/cart';

const getUserByUsername = async ({ username }: { username: string}): Promise<User> =>{
    const user = await userDb.findUserByUsername({ username });
    if (!user) {
        throw new Error(`User with username: ${username} does not exist.`);
    };
    return user;
};

const authenticate = async ({ username, password }: UserInput ): Promise<AuthenticationResponse> => {
    const user = await getUserByUsername({ username });
    // if (!user) {
    //     throw new Error(`User with username: ${username} does not exist.`);
    // }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw new Error(`Incorrect password.`);
    }
    const cart = await cartDb.findCartByUserId(user.id);

    return {
        token: generateJwtToken({ username, role: user.role }),
        username: username,
        email: user.email,
        userId: user.id,
        role: user.role,
        cartId: cart.id,
    };
};
const registerUser = async ({username, email, password, role}: UserInput): Promise<User> => {
    if (await userDb.findUserByUsername({username})) {
        throw new Error("Username is already taken!");
    }

    if (await userDb.findUserByEmail({email})) {
        throw new Error("Email is already taken!");
    }
    
    const newUser = new User({ username, email, password, role });
    const newCart = new Cart({id: newUser.getId()});
    await cartDb.createCart(newCart);

    return await userDb.createUser(newUser);
};

const createUser = async ({ username, email, password, role}: UserInput): Promise<User> => {
    const existing_email = await userDb.findUserByEmail({email});
    const existing_username = await userDb.findUserByUsername({username});
    if (existing_email) {
        throw new Error(`User with email: ${email} already exists.`)
    }
    if (existing_username) {
        throw new Error(`User with username: ${username} already exists.`)
    }
    console.log(password);
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({username, email, password: hashedPassword, role});

    return await userDb.createUser(user);
};

const getAllUsers = async ({role}): Promise<User[]> => {
    if (role === 'admin' || role === 'ADMIN') {
        return await userDb.getAllUsers();
    } else {
        throw new UnauthorizedError('credentials_required', {message: 'You are not authorized to access this resource.'});
    }
};

const getUserById = async (id: number): Promise<User> => {
    const user = await userDb.findUserById(id);
    console.log(id);
    if (!user) {
        throw new Error("User with this id does not exist (anymore)!");
    }
    return user;

}

const deleteUser = async (id): Promise<User> => {
    const user = await userDb.findUserById(id);

    if (!user) {
        throw new Error("User with this id does not exist (anymore)!");
    }

    return await userDb.deleteUser(id);
}

export default { registerUser, getAllUsers, createUser, authenticate, deleteUser, getUserById };