import Head from "next/head.js";
import Header from "../../components/header";
import styles from "../../styles/Cart.module.css"; 
import React, { useEffect, useState } from "react";
import { useCart } from '../../context/cartContext';
import { CartItem } from "@/types";
import CartService from "@/services/CartService";
import { useRouter } from "next/router";
import CartBookList from "@/components/cartBookList";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Cart: React.FC = () => {
    const [items, setItems] = useState<CartItem[]>([]); 
    const [totalPrice, setTotalPrice] = useState<number>(0); 
    const [isLoading, setIsLoading] = useState(true);
    const [cartId, setCartId] = useState<string | null>(null);
    const [cartAmount, setCartAmount] = useState<number>(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    const fetchBooksInCart = async () => {
        if (typeof window === "undefined") {
            console.error("Session storage issue");
            return;
        }

        const storedCartId = JSON.parse(sessionStorage.getItem("loggedInUser")!)?.cartId;
        if (!storedCartId) {
            console.warn("No cart ID found, resetting items and totalPrice");
            setItems([]); 
            setTotalPrice(0);
            return;
        }

        try {
            const response = await CartService.allBooksInCart(storedCartId);

            if (!response.ok) {
                console.error("Failed to fetch cart data:", response.statusText);
                return;
            }

            const data = await response.json();
            console.log("Cart Data Fetched:", data);
            const sortedItems = data.items.sort((a: CartItem, b: CartItem) => a.book.id - b.book.id);

            if (data.items && Array.isArray(data.items)) {
                const totalQuantity = data.items.reduce((total: number, cartItem: CartItem) => total + cartItem.quantityInCart, 0);
            
                setCartAmount(totalQuantity);
                sessionStorage.setItem('cartAmount', totalQuantity.toString());
                } else {
                console.error("cartItems.items is not an array:", data.items);
                }

            setItems(sortedItems || []);
            setTotalPrice(data.totalPrice || 0);
        } catch (error) {
            console.error("Failed to fetch books in cart:", error);
        }
    };


    const adjustQuantity = async (bookId: number, action: "increase" | "decrease") => {

        if (typeof window !== "undefined") {
            const storedCartId = JSON.parse(sessionStorage.getItem("loggedInUser")!)?.cartId;
            if (!storedCartId) return;

            try {
                const response = await CartService.adjustQuantity(storedCartId, bookId, action);

                if (response.ok) {
                    await fetchBooksInCart(); 
                } else {
                    const errorData = await response.json();
                    console.error(`Failed to ${action} quantity:`, errorData.error);
                }
            } catch (error) {
                console.error(`Error adjusting quantity (${action}):`, error);
            } 
        }
    };

    const removeFromCart = async (bookId: number) => {

        if (typeof window !== "undefined") {
            const storedCartId = JSON.parse(sessionStorage.getItem("loggedInUser")!)?.cartId;
            if (!storedCartId) return;

            try {
                const response = await CartService.removeFromCart(storedCartId, bookId);

                if (response.ok) {
                    await fetchBooksInCart();
                } else {
                    const errorData = await response.json();
                    console.error("Failed to remove book from cart:", errorData.error);
                }
            } catch (error) {
                console.error("Error removing book from cart:", error);
            }
        }
    };

    const handleBookClick = (bookId: number) => {
        router.push(`/books/${bookId}`); 
    };

    const handleOrderClick = async () => {

        if (typeof window !== "undefined") {
            const storedCartId = JSON.parse(sessionStorage.getItem("loggedInUser")!)?.cartId;
            if (!storedCartId) return;

            try { 
                const response = await CartService.orderCart(cartId);
                
                if (response.ok) {
                    await fetchBooksInCart();
                } else {
                    const errorData = await response.json();
                    console.error("Failed to order cart:", errorData.error);
                }
            } catch (error) {
                console.error("Error ordering cart:", error);
            }
        }
        
    };

    useEffect(() => {
            if (typeof window !== "undefined") {
                const savedCartAmount = sessionStorage.getItem('cartAmount');
            const storedUser = sessionStorage.getItem('loggedInUser');
            if (storedUser) {
                setIsLoggedIn(true);
            }
            const storedCartId = JSON.parse(sessionStorage.getItem("loggedInUser")!)?.cartId;
            console.log("Cart ID:", storedCartId);
            setCartId(storedCartId);
            const cartAmount = sessionStorage.getItem('cartAmount');
            if (cartAmount){
                setCartAmount(Number(cartAmount));
            }
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (cartId) {
            fetchBooksInCart();
        }
    }, [cartId]);

    if (isLoading) {
        return (
            <>
                <Head>
                    <title>Books - BookMarkt</title>
                    <meta name="description" content="List of all available books" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
            </>
        )
    }
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
                <title>Cart - BookMarkt</title>
                <meta name="description" content="Your shopping cart" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header cartAmount={cartAmount}/>
            <div className={styles.container}>
                <h2 className={styles.title}>Your Cart</h2>
                <main className={styles.main}>
                    <CartBookList
                        items={items}
                        onAdjustQuantity={adjustQuantity}
                        onRemoveFromCart={removeFromCart}
                        onBookClick={handleBookClick}
                        onOrderCart={handleOrderClick}
                        totalPrice={totalPrice}
                        isLoading={isLoading}
                    />
                </main>
            </div>
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

export default Cart;
