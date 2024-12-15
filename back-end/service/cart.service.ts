import { Cart } from '../model/cart';
import cartDb from '../repository/cart.db';
import { User } from '../model/user';
import bookDb from '../repository/book.db';


// const getAllCarts = async (): Promise<Cart[]> => {
//     return await cartDb.getAllCarts();
// };

const getCartById = async (cartId: number): Promise<Cart | null> => {
    const cart = await cartDb.findCartById(cartId);
    if (!cart){
        throw new Error("Cart with this id does not exist!");
    }
    console.log('Cart retrieved from SERVICE:', cart);

    return await cart;
}

const addBookToCart = async (cartId: number | undefined, bookId: number): Promise<Cart> => {
    // const cart = cartId ? await cartDb.findCartById(cartId) : await cartDb.createCart();
    const cart = await cartDb.findCartById(cartId);
    const book = await bookDb.findBookById(bookId);

    if (!book) {
        throw new Error("Book with this id does not exist!");
    }

    if (!cart) {
        throw new Error(`Cart with this id does not exist!`);
    }

    return await cartDb.addBookToCart(cart, book);
    
};

const removeBookFromCart = async (cartId: number, bookId: number): Promise<Cart> => {
    const cart = await cartDb.findCartById(cartId);

    if (!cart) {
        throw new Error("Cart with this id does not exist!");
    }

    return await cartDb.removeBookFromCart(cart, bookId);
    
};

const decreaseBookQuantityFromCart = async (cartId: number, bookId: number): Promise<Cart> => {
    const cart = await cartDb.findCartById(cartId);

    if (!cart) {
        throw new Error("Cart with this id does not exist!");
    }


    return await cartDb.decreaseBookQuantityInCart(cart, bookId);
};


export default {
    addBookToCart,
    removeBookFromCart,
    // getAllCarts,
    getCartById,
    decreaseBookQuantityFromCart,
    
};
