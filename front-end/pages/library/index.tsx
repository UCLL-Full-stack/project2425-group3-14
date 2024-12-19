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

    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [genress, setGenress] = useState<string[]>([]);
    const [author, setAuthor] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    // const { cartId, setCartId } = useCart();
    const router = useRouter();
    
    const genres = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Biography' ,'Mystery', 'Horror', 'Adventure', 'Action', 'Romance'];
    
      useEffect(() => {
        const user = sessionStorage.getItem('loggedInUser');
        if (user) {
          const parsedUser = JSON.parse(user);
          setIsLoggedIn(true);
          setIsAdmin(parsedUser.role === 'admin' || parsedUser.role === 'ADMIN');
        }
      }, []);

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
            // const response = 
            if (typeof window !== "undefined") {
                const cartId = JSON.parse(sessionStorage.getItem("loggedInUser")!).cartId;
                console.log("Cart ID: a", cartId);
                await CartService.addToCart(cartId, bookId);
              }
            
            // if (response.ok) {
            //     const updatedCart = await response.json();
            //     setCartId(updatedCart.id);
            //     console.log("Book added to cart:", updatedCart);
            // } else {
            //     const errorData = await response.json();
            //     console.error("Failed to add book to cart:", errorData.error);
            // }
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
    // const handleAddBook = async (event: React.FormEvent) => {
    //     event.preventDefault();

    // };
    const handleAddBook = async (event: React.FormEvent) => {
        event.preventDefault();
    
        const newBook = {
            name: title,
            author,
            genres: genress, // Array of selected genres
            price: parseFloat(price),
            quantity: 0,
            imageUrl: '/Book1.png'
        };
    
        try {
            await LibraryService.addBook(newBook);
            fetchBooks();
            setTitle("");
            setAuthor("");
            setGenress([]);
            setPrice("");
            console.log("Book added succesfully!")
        } catch (error) {
            console.error("Error adding book:", error);
        }
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
                    {!isAdmin && <Searchbar
                         searchTerm={searchTerm}
                         onSearch={handleSearch}
                         resultsCount={filteredBooks.length}
                         /> }
                    {isAdmin && 
                        <section>
                            <h2>Add a book</h2>
                            <form className="form" onSubmit={handleAddBook}>
                                <label htmlFor="title">Title:</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    required
                                />
                                <label htmlFor="author">Author:</label>
                                <input
                                    type="text"
                                    id="author"
                                    name="author"
                                    value={author}
                                    onChange={(event) => setAuthor(event.target.value)}
                                    required
                                />
                                <label htmlFor="genres">Genres:</label>
                                <div className="genres-checkboxes">
                                    {genres.map((genre) => (
                                        <div key={genre}>
                                            <input
                                                type="checkbox"
                                                id={genre}
                                                name="genres"
                                                value={genre}
                                                checked={genress.includes(genre)} // Check if the genre is already selected
                                                onChange={(event) => {
                                                    if (event.target.checked) {
                                                        // Add the genre to the state
                                                        setGenress([...genress, genre]);
                                                    } else {
                                                        // Remove the genre from the state
                                                        setGenress(genress.filter((g) => g !== genre));
                                                    }
                                                }}
                                            />
                                            <label htmlFor={genre}>{genre}</label>
                                        </div>
                                    ))}
                                </div>

                                <label htmlFor="price">Price:</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={price}
                                    onChange={(event) => setPrice(event.target.value)}
                                    required
                                    />

                                <button type="submit" className="form-button">
                                    Add Book
                                </button>
                            </form>
                        </section>
                        }
                </div>
                <h2 className="h2">Available Books</h2>
                <main className={styles.main}>
                    {!isAdmin && <GenreSideBar
                        genres={genres}
                        selectedGenre={selectedGenre}
                        onGenreChange={handleGenreChange}
                    /> }
                    <LibraryBookList
                        books={filteredBooks}
                        // onAddToCart={handleBookClick}
                        onAddToCart={addToCart}
                    />    
                </main>
            </div>
        </>
    );
};

export default Books;