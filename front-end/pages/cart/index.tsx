import Head from "next/head.js";
import Header from "../../components/header";
import styles from "../../styles/Cart.module.css"; 
import React, { useEffect, useState } from "react";
import { useCart } from '../../context/cartContext';
import { CartItem } from "@/types";
import CartService from "@/services/CartService";
import { useRouter } from "next/router";
import CartBookList from "@/components/cartBookList";

const Cart: React.FC = () => {
    const [items, setItems] = useState<CartItem[]>([]);
    const { cartId } = useCart();
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const fetchBooksInCart = async () => {
        if (!cartId) {
            setItems([]);
            return;
        }

        try {
            const response = await CartService.allBooksInCart(cartId)
            const data = await response.json();
            
            setItems(data.items || []); 
            setTotalPrice(data.totalPrice || 0);
        } catch (error) {
            console.error("Failed to fetch books in cart:", error);
        }
    };

    const adjustQuantity = async (bookId: number, action: "increase" | "decrease") => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const response = await CartService.adjustQuantity(cartId, bookId, action)

            if (response.ok) {
                fetchBooksInCart(); 
            } else {
                const errorData = await response.json();
                console.error(`Failed to ${action} quantity:`, errorData.error);
            }
        } catch (error) {
            console.error(`Error adjusting quantity (${action}):`, error);
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromCart = async (bookId: number) => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const response = await CartService.removeFromCart(cartId, bookId)

            if (response.ok) {
                fetchBooksInCart();
            } else {
                const errorData = await response.json();
                console.error("Failed to remove book from cart:", errorData.error);
            }
        } catch (error) {
            console.error("Error removing book from cart:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBookClick = (bookId: number) => {
        router.push(`/books/${bookId}`); 
    };

    useEffect(() => {
        fetchBooksInCart();
    }, [cartId]); 

    return (
        <>
            <Head>
                <title>Cart - BookMarkt</title>
                <meta name="description" content="Your shopping cart" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.container}>
                <Header />
                <h2 className={styles.title}>Your Cart</h2>
                <main className={styles.main}>
                <CartBookList
                        items={items}
                        onAdjustQuantity={adjustQuantity}
                        onRemoveFromCart={removeFromCart}
                        onBookClick={handleBookClick}
                        totalPrice={totalPrice}
                        isLoading={isLoading}
                    />
                </main>
            </div>
        </>
    );
};

export default Cart;
