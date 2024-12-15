import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Head from "next/head.js";
import Header from "../../components/header";
import { Book } from "@/types";
import LibraryService from "@/services/LibraryService";
import styles from "../../styles/Book.module.css"; 
import CartService from "@/services/CartService";
import { useCart } from "@/context/cartContext";

const ReadBookById = () => {
    const [book, setBook] = useState<Book>(null);
    const router = useRouter();
    const {bookId} = router.query;
    const { cartId, setCartId } = useCart();
    const isLoggedIn = typeof window !== 'undefined' && sessionStorage.getItem('loggedInUser');


    const getBookById = async () => {
        if (!bookId) return;
        const [bookResponse] = await Promise.all([LibraryService.getBookById(bookId)]);
        const [bbook] = await Promise.all([bookResponse.json()]);
        setBook(bbook);
    }

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
    
    useEffect( () => {
        if (bookId) {
            getBookById();
        }
    }, [bookId]);

    return (
        <>
            <Head>
                <title>Book info</title>
            </Head>
            <Header />
            <h1 className= {styles.title}>
                    info of {book && book.name}
                </h1>
            <main className= {styles.bookMain} >
                
                {!book && <p>Loading...</p>}
                {book && (
                    <section className={styles.bookSection}>
                        <img src={book.imageUrl} alt={book.name} className={styles.bookImage}/>
                        <div className={styles.bookDetails}>
                            <h3 className={styles.bookTitle}>{book.name}</h3>
                            <p className={styles.bookAuthor}>by {book.author}</p>
                            <p className={styles.bookPrice}>${book.price.toFixed(2)}</p>
                            {isLoggedIn && (
                                <button
                                    className={styles.addToCart}
                                    onClick={() => addToCart(book.id)}
                                >
                                    Add to Cart
                                </button>
                            )}
                        </div>
                    </section>
                )}
            </main>
        </>
    );
};
export default ReadBookById;