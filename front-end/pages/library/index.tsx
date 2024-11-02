import Head from "next/head.js";
import Header from "../../components/header";
import Searchbar from "../../components/searchbar" 
import GenreSideBar from "../../components/genreSideBar" 
import styles from "../../styles/Library.module.css";
import React, { useEffect, useState } from "react";
import { useCart } from '../../context/cartContext';
import { Book } from "@/types";
import LibraryService from "@/services/LibraryService";
import CartService from "@/services/CartService";
import { useRouter } from "next/router";
import LibraryBookList from "@/components/libraryBookList";

const Books: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const { cartId, setCartId } = useCart();
    const router = useRouter();

    const genres = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Biography' ,'Mystery', 'Horror', 'Adventure', 'Action', 'Romance'];

    const fetchBooks = async () => {
        try {
            const response = await LibraryService.getAllBooks(); 
            const data = await response.json();
            setBooks(data);
            setFilteredBooks(data);
        } catch (error) {
            console.error("Failed to fetch books:", error);
        }
    };

    const addToCart = async (bookId: number) => {
        try {
            const response = await CartService.addToCart(cartId, bookId);

            if (response.ok) {
                const updatedCart = await response.json();
                setCartId(updatedCart.id);
                console.log("Book added to cart:", updatedCart);
            } else {
                const errorData = await response.json();
                console.error("Failed to add book to cart:", errorData.error);
            }
        } catch (error) {
            console.error("Error adding book to cart:", error);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value;
        setSearchTerm(search);
        filterBooks(search, selectedGenre);
    };

    const handleGenreChange = (genre: string) => {
        setSelectedGenre(selectedGenre === genre ? null : genre);
        filterBooks(searchTerm, selectedGenre === genre ? null : genre);
    };

    const filterBooks = (search: string, genre: string | null) => {
        let results = books;

        if (search) {
            results = results.filter(book =>
                book.name.toLowerCase().includes(search.toLowerCase()) ||
                book.author.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (genre) {
            results = results.filter(book =>
                book.genres.includes(genre)
            );
        }

        setFilteredBooks(results);
    };

    const handleBookClick = (bookId: number) => {
        router.push(`/books/${bookId}`);
    };


    return (
        <>
            <Head>
                <title>Books - BookMarkt</title>
                <meta name="description" content="List of all available books" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.container}>
                <Header />
                <div className={styles.searchContainer}>
                    <h2 className={styles.title}>Available Books</h2>
                    <Searchbar
                         searchTerm={searchTerm}
                         onSearch={handleSearch}
                         resultsCount={filteredBooks.length}
                     />
                </div>
                <main className={styles.main}>
                    <GenreSideBar
                        genres={genres}
                        selectedGenre={selectedGenre}
                        onGenreChange={handleGenreChange}
                    />
                    <LibraryBookList
                        books={filteredBooks}
                        onAddToCart={addToCart}
                    />
                </main>
            </div>
        </>
    );
};

export default Books;