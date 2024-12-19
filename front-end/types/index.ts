export type Book = {
    id: number;
    name: string;
    quantity: number;
    author: string;
    genres: string[];
    price: number;
    imageUrl: string;
}

export type Order = {
    id: number;
    userId: number;
    items: OrderItem[];
    totalPrice: number;
}

export type OrderItem = {
    book: Book;
    quantityInCart: number;
}


export type CartItem = {
    book: Book;
    quantityInCart: number;
}

export type SearchBarProps = {
    searchTerm: string;
    onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    resultsCount: number;
}

export type GenreProps = {
    genres: string[];
    selectedGenre: string | null;
    onGenreChange: (genre: string) => void;
}

export type LibraryBookListProps = {
    books: Book[];
    onAddToCart: (bookId: number) => void;
}

export type Role = 'admin' | 'customer' | 'manager';

export type User = {
    id?: number;
    username: string;
    email: string;
    password: string;
    role: Role;
};