import { Book } from "../model/book";

type Role = 'admin' | 'customer' | 'manager';

type Genre = 
    | 'Fiction' 
    | 'Non-Fiction' 
    | 'Science Fiction' 
    | 'Fantasy' 
    | 'Biography' 
    | 'Mystery' 
    | 'Horror'
    | 'Adventure'
    | 'Action'
    | 'Romance'; 

type CartItem = {
    book: Book;
    quantityInCart: number;
};

type OrderItem = {
    book: Book;
    quantityInCart: number;
};

type UserInput = {
    id?: number;
    username: string;
    email: string;
    password: string;
    role: Role;
};

type AuthenticationResponse = {
    token: string;
    username: string;
    userId: number;
    email: string;
    role: Role;
    cartId: number;
};

type Cart = {
    userId: number,
    items: CartItem[],
    totalPrice: number,
}

export { Role, Cart, UserInput, Genre, CartItem, OrderItem, AuthenticationResponse };