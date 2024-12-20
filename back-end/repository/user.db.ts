import { User } from '../model/user';
import database from './database';

const users = [
    new User({
        id: 1,
        username: 'Jefje',
        email: 'jef@gmail.com',
        password: 'jefje123',
        role: 'admin'
    }),
    new User({
        id: 2,
        username: 'Maria',
        email: 'maria@gmail.com',
        password: 'maria123',
        role: 'customer'
    }),
];

const createUser = async ({ username, email, password, role}: User): Promise<User> => {
    try {
        const userPrisma = await database.user.create({
            data: {
                username,
                email,
                password,
                role,
                cart: { create: { totalPrice: 0 } }, 
            },
            include: { cart: true },

        });
        // createCart(userPrisma.id);
        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.')
    }
}

const findUserByUsername = async ({ username}: { username: string }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: { username },
        });
        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}
const findUserById = async ( id: number): Promise<User | null> => {
    console.log(id + 1);
    try {
        const userPrisma = await database.user.findFirst({
            where: { id },
        });
        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}

const findUserByEmail = async ({ email }: { email: string }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findUnique({
            where: { email },
        });

        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};
// const findUserByEmail = (email: string): User | undefined => {
//     return users.find((user) => user.getEmail() === email);
// }

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany();
        const users = await Promise.all(usersPrisma.map((userPrisma) => User.from(userPrisma)));
        return users
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};
// const getAllUsers = (): User[] => {
//     return users;
// };

const deleteUser = async (id: number): Promise<User> => {
    try {
        const user = await database.user.findUnique({
            where: { id },
            include: { cart: true },
        });

        if (!user) {
            throw new Error(`User with id ${id} was not found.`);
        }

        await database.orderItem.deleteMany({
            where: { orderId: { in: (await database.order.findMany({ where: { userId: id } })).map(order => order.id) } },
        });

        await database.order.deleteMany({
            where: { userId: id },
        });

        if (user.cart) {
            await database.cartItem.deleteMany({
                where: { cartId: user.cart.id },
            });
            await database.cart.delete({
                where: { id: user.cart.id },
            });
        }

        await database.user.delete({
            where: { id },
        });

        return User.from(user);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
}

export default { createUser, getAllUsers, findUserByUsername, findUserByEmail, findUserById, deleteUser, };