import { Cart } from '../model/cart';
import cartDb from '../repository/cart.db';
import { User } from '../model/user';
import bookDb from '../repository/book.db';


const getAllCarts = (): Cart[] => {
    return cartDb.getAllCarts();
};

const getCartById = (cartId: number): Cart=> {
    const cart = cartDb.findCartById(cartId);
    if (!cart){
        throw new Error("Cart with this id does not exist!");
    }
    return cart
}

const addBookToCart = (cartId: number | undefined, bookId: number): Cart => {
    const cart = cartId ? cartDb.findCartById(cartId) : cartDb.createCart();
    const book = bookDb.findBookById(bookId);

    if (!book) {
        throw new Error("Book with this id does not exist!");
    }

    if (!cart) {
        throw new Error(`Cart with this id does not exist!`);
    }

    return cartDb.addBookToCart(cart, book);
    
};

const removeBookFromCart = (cartId: number, bookId: number): Cart => {
    const cart = cartDb.findCartById(cartId);

    if (!cart) {
        throw new Error("Cart with this id does not exist!");
    }

    return cartDb.removeBookFromCart(cart, bookId);
    
};

const decreaseBookQuantityFromCart = (cartId: number, bookId: number): Cart => {
    const cart = cartDb.findCartById(cartId);

    if (!cart) {
        throw new Error("Cart with this id does not exist!");
    }


    return cartDb.decreaseBookQuantityInCart(cart, bookId);
    
};


export default {
    addBookToCart,
    removeBookFromCart,
    getAllCarts,
    getCartById,
    decreaseBookQuantityFromCart,
    
};
