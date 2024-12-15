import { Cart } from '../model/cart';
import { Book } from '../model/book';
import database from './database';
import userDb from './user.db';

const carts = [
    new Cart({id: 1,}),
]
let nextCartId = 2;

const createCart = async ({user}: Cart): Promise<Cart> => {
    const existingCart = await findCartByUserId(user.id);
    if (existingCart) {
        return existingCart; 
    }
    try {
        const cartPrisma = await database.cart.create({
            data: {
                userId: user.id,
                totalPrice: 0,
            },
            include: {
                user: true,
                items: { include: { book: true } },
            },
                // user: {
                //     create: {
                //         username: user.username,
                //         email: user.email,
                //         password: user.password,
                //         role: user.role,
                //     },
                // },
 
        });
        return Cart.from(cartPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};
// const createCart = (): Cart => {
//     const cart = new Cart({id: nextCartId}); 
//     carts.push(cart); 
//     nextCartId++;
//     return cart; 
// }
const findCartById = async ( id: number): Promise<Cart | null> => {
    try {
        const cartPrisma = await database.cart.findUnique({
            where: { id },
            include: {
                user: true,
                items: {
                    include: { 
                        book: true,
                        cart: true,
                    },
                },
            },
        });
        console.log('Cart retrieved from DB:', cartPrisma);
        // return cartPrisma ? cartPrisma.map((cartPrisma) => Cart.from(cartPrisma)) : null;

        return cartPrisma ? Cart.from(cartPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
}

const findCartByUserId = async (userId: number): Promise<Cart | null> => {
    try {
        const cartPrisma = await database.cart.findUnique({
            where: { userId },
            include: { items: { include: { book: true, } } },
        });
        if (!cartPrisma) {
            console.warn(`No cart found for user ID: ${userId}`);
        }
        return cartPrisma ? Cart.from(cartPrisma) : null;
    } catch (error) {
        console.error(`Failed to find cart for user ID ${userId}:`, error);
        throw new Error('Database error. See server log for details.');
    }
};

// const findCartByUserId = async (userId: number): Promise<Cart | null> => {
//     try {
//         const cartPrisma = await database.cart.findUnique({
//             where: { userId },
//             include: {
//                 items: {
//                     include: { book: true},
//                 },
//             },
//         });
        
//         return cartPrisma ? Cart.from(cartPrisma) : null;
//     } catch (error) {
//         console.error(error);
//         throw new Error('Database error. See server log for details');
//     }
// }
// const findCartById = (id: number): Cart | undefined => {
//     return carts.find(cart => cart.getId() === id);
// };

const addBookToCart = async (cart: Cart, book: Book): Promise<Cart> => {
    console.log(cart)
    console.log(book)
    try {
        const cartId = cart.getId();
        const bookId = book.getId();
        if (!cartId || !bookId) {
            throw new Error('Cart or Book does not have a valid ID.');
        }
        const existingItem = await database.cartItem.findFirst({
            where: { cartId, bookId },
        });

        if (existingItem) {
            await database.cartItem.update({
                where: { id: existingItem.id },
                data: { quantityInCart: { increment: 1}},
            });
        } else {
            await database.cartItem.create({
                data: {
                    cartId,
                    bookId,
                    quantityInCart: 1,
                },
            });
        }
        
        return await recalculateCartTotal(cartId);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};

// const getAllCarts = async (): Promise<Cart[]> => {
//     try {
//         const cartsPrisma = await database.cart.findMany({
//             include: {
//                 user: true,
//                 items: { include: { book: true}},
//             },
//         });
//         return cartsPrisma.map((cart) => Cart.from(cart));
//     } catch (error) {
//         console.error(error);
//         throw new Error('Database error. See server log for details');
//     }
// };

const removeBookFromCart = async (cart: Cart, bookId: number): Promise<Cart> => {
    try {
        const cartId = cart.getId();
        await database.cartItem.deleteMany({
            where: { cartId, bookId },
        });
        return await recalculateCartTotal(cartId);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};

const decreaseBookQuantityInCart = async (cart: Cart, bookId: number): Promise<Cart> => {
    try {
        const cartId = cart.getId();
        const cartItem = await database.cartItem.findFirst({
            where: { cartId, bookId },
        });

        if (!cartItem) {
            throw new Error(`Book with ID ${bookId} not found in cart.`);
        }

        if (cartItem.quantityInCart > 1) {
            await database.cartItem.update({
                where: { id: cartItem.id },
                data: {
                    quantityInCart: { decrement: 1},
                },
            });
        } else {
            await database.cartItem.delete({
                where: { id: cartItem.id },
            });
        }
        return await recalculateCartTotal(cartId);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details');
    }
};
const recalculateCartTotal = async (cartId?: number): Promise<Cart> => {
    try {
        const cartItems = await database.cartItem.findMany({
            where: { cartId },
            include: { book: true },
        });

        const totalPrice = cartItems.reduce(
            (total, item) => total + item.book.price * item.quantityInCart,
            0
        );

        const updatedCart = await database.cart.update({
            where: { id: cartId },
            data: { totalPrice },
            include: {
                user: true,
                items: { include: { book: true } },
            },
        });

        return Cart.from(updatedCart);
    } catch (error) {
        console.error(error);
        throw new Error('Failed to recalculate cart total.');
    }
};

export default {
    addBookToCart,
    removeBookFromCart,
    findCartById,
    createCart,
    // getAllCarts,
    decreaseBookQuantityInCart,
    findCartByUserId,
};
