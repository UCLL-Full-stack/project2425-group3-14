// components/CartBookList.tsx
import React from "react";
import styles from "../styles/Cart.module.css";
import { CartItem } from "@/types";

interface CartBookListProps {
    items: CartItem[];
    onAdjustQuantity: (bookId: number, action: "increase" | "decrease") => void;
    onRemoveFromCart: (bookId: number) => void;
    onBookClick: (bookId: number) => void;
    totalPrice: number;
    isLoading: boolean;
}

const CartBookList: React.FC<CartBookListProps> = ({
    items,
    onAdjustQuantity,
    onRemoveFromCart,
    onBookClick,
    totalPrice,
    isLoading
}) => {
    return (
        <section className={styles.bookSection}>
            <div className={styles.bookList}>
                {items.length > 0 ? (
                    <>
                        <div className={styles.headers}>
                            <h3 className={styles.productHeader}>Product</h3>
                            <h4 className={styles.priceHeader}>Price</h4>
                            <h4 className={styles.quantityHeader}>Quantity</h4>
                            <h4 className={styles.priceTotalHeader}>Total</h4>
                        </div>
                        {items.map((item) => (
                            <div key={item.book.id} className={styles.bookItem}>
                                <div className={styles.bookProduct}>
                                    <img src={item.book.imageUrl} alt={item.book.name} className={styles.bookImage} />
                                    <div className={styles.bookDetails}>
                                        <h3 className={styles.bookTitle} onClick={() => onBookClick(item.book.id)} style={{ cursor: "pointer" }}>
                                            {item.book.name}
                                        </h3>
                                        <p className={styles.bookAuthor}>by {item.book.author}</p>
                                        <button 
                                            className={styles.removeFromCart}
                                            onClick={() => onRemoveFromCart(item.book.id)}
                                            disabled={isLoading}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                                <p className={styles.bookPrice}>${item.book.price.toFixed(2)}</p>
                                <div className={styles.quantityActions}>
                                    <button 
                                        className={styles.quantityButton} 
                                        onClick={() => onAdjustQuantity(item.book.id, "decrease")}
                                        disabled={isLoading}
                                    > - </button>
                                    <p className={styles.bookQuantity}>{item.quantityInCart}</p>
                                    <button 
                                        className={styles.quantityButton} 
                                        onClick={() => onAdjustQuantity(item.book.id, "increase")}
                                        disabled={isLoading}
                                    > + </button>
                                </div>
                                <p className={styles.bookTotalPrice}>${(item.book.price * item.quantityInCart).toFixed(2)}</p>
                            </div>
                        ))}
                    </>
                ) : (
                    <p>Your cart is empty</p>
                )}
            </div>
            {items.length > 0 && (
                <div className={styles.totalPrice}>
                    <h3>Total Amount: ${totalPrice.toFixed(2)}</h3>
                </div>
            )}
        </section>
    );
};

export default CartBookList;
