import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Head from "next/head.js";
import Header from "../../components/header";
import { Book } from "@/types";
import LibraryService from "@/services/LibraryService";
import styles from "../../styles/Book.module.css"; 
import CartService from "@/services/CartService";
import { CartItem } from "@/types";
import { useCart } from "@/context/cartContext";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const ReadBookById = () => {
    const [book, setBook] = useState<Book>(null);
    const router = useRouter();
    const {bookId} = router.query;
    const [cartId, setCartId] = useState<string | null>(null);
    const [cartAmount, setCartAmount] = useState<number>(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);


    const getBookById = async () => {

        if (!bookId) return;
        const [bookResponse] = await Promise.all([LibraryService.getBookById(bookId)]);
        const [bbook] = await Promise.all([bookResponse.json()]);
        setBook(bbook);
    }

    const getCartAmount = async () => {
            if (typeof window !== "undefined" && isLoggedIn) {
                const cartId = JSON.parse(sessionStorage.getItem("loggedInUser")!).cartId;
                const response = await CartService.allBooksInCart(cartId);
                const cartItems = await response.json();
                console.log("Cart Items:", cartItems);
                if (cartItems.items && Array.isArray(cartItems.items)) {
                    const totalQuantity = cartItems.items.reduce((total: number, cartItem: CartItem) => total + cartItem.quantityInCart, 0);
                
                    setCartAmount(totalQuantity);
                    sessionStorage.setItem('cartAmount', totalQuantity.toString());
                    } else {
                    console.error("cartItems.items is not an array:", cartItems.items);
                    }
            }
        }

    const addToCart = async (bookId: number) => {
        try {
            const response = await CartService.addToCart(cartId, bookId);

            if (response.ok) {
                const updatedCart = await response.json();
                setCartId(updatedCart.id);
                getCartAmount();
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
            getCartAmount();
            
        }
    }, [bookId]);

    useEffect(() => {
            if (typeof window !== "undefined") {
               
                const cartAmount = sessionStorage.getItem('cartAmount');
                if (cartAmount){
                    setCartAmount(Number(cartAmount));
                }
                const loggedInUser = sessionStorage.getItem("loggedInUser");
                if (loggedInUser) {
                    setIsLoggedIn(true)
                    const storedUser = JSON.parse(loggedInUser);
                    const storedCartId = storedUser.cartId;
                    const role = storedUser.role;
                    setCartId(storedCartId);
                    setUserRole(role);
                }
                
            }
        }, []);

        if (!isLoggedIn) {
            return (
                <>
                    <Head>
                        <title>Books - BookMarkt</title>
                        <meta name="description" content="List of all available books" />
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        <link rel="icon" href="/favicon.ico" />
                    </Head>
                 <div className={styles.container}>
                    <Header cartAmount={cartAmount}/>
                    <main>
                        <p className={styles.errorMessage}>You need to log in or continue as a guest to view the books.</p>
                    </main>
                </div>
    
                </>
            );
        }

    return (
        <>
            <Head>
                <title>Book info</title>
            </Head>
            <Header cartAmount={cartAmount}/>
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
                            {userRole !== "guest" && (
                                <button
                                    className={styles.addToCart}
                                    onClick={() => addToCart(book.id)}
                                >
                                    Add to Cart
                                </button>
                            )}
                            {userRole === "guest" && (
                                <p className={styles.guestMessage}>
                                    Guests cannot add books to the cart. Please log in to continue.
                                </p>
                            )}
                        </div>
                    </section>
                )}
            </main>
        </>
    );
};

export const getServerSideProps = async (context) => {
    const { locale } = context;
    return {
        props: {
            ...(await serverSideTranslations(locale ?? "en", ["common"])),
        },
    };
  };
export default ReadBookById;