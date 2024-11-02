import { Book } from "../model/book";

type Role = 'admin' | 'customer';

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

type UserInput = {
    id?: number;
    username: string;
    email: string;
    password: string;
    role: Role;
};


export { Role, UserInput, Genre, CartItem };