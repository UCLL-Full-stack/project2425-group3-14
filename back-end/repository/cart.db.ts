import { Cart } from '../model/cart';
import { Book } from '../model/book';

const carts = [
    new Cart({id: 1,}),
]
let nextCartId = 2;

const createCart = (): Cart => {
    const cart = new Cart({id: nextCartId}); 
    carts.push(cart); 
    nextCartId++;
    return cart; 
}

const findCartById = (id: number): Cart | undefined => {
    return carts.find(cart => cart.getId() === id);
};

const addBookToCart = (cart: Cart, book: Book): Cart => {
    cart.addBook(book); 
    return cart;
};

const getAllCarts = (): Cart[] => {
    return carts;
};

const removeBookFromCart = (cart: Cart, bookId: number): Cart => {
    cart.removeCartItem(bookId); 
    return cart;

};

const decreaseBookQuantityInCart = (cart: Cart, bookId: number): Cart => {
    cart.removeBook(bookId); 
    return cart;

};

export default {
    addBookToCart,
    removeBookFromCart,
    findCartById,
    createCart,
    getAllCarts,
    decreaseBookQuantityInCart,

};
