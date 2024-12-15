import React from 'react';
import styles from '../styles/LibraryBookList.module.css';
import { Book } from '@/types';
import { useRouter } from 'next/router';
import { LibraryBookListProps } from '@/types';



const LibraryBookList: React.FC<LibraryBookListProps> = ({ books, onAddToCart }) => {
    const router = useRouter();

    const isLoggedIn = typeof window !== 'undefined' && sessionStorage.getItem('loggedInUser');

    const handleBookClick = (bookId: number) => {
        router.push(`/books/${bookId}`);
    };

    return (
        <section className={styles.bookSection}>
            <div className={styles.bookList}>
                {books.map((book: Book) => (
                    <div key={book.id} className={styles.bookItem}>
                        <img src={book.imageUrl} alt={book.name} className={styles.bookImage} />
                        <div className={styles.bookDetails}>
                            <h3
                                className={styles.bookTitle}
                                onClick={() => handleBookClick(book.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                {book.name}
                            </h3>
                            <p className={styles.bookAuthor}>by {book.author}</p>
                            <div className={styles.bookGenres}>
                                {book.genres.map((genre: string) => (
                                    <span key={genre} className={styles.genre}>{genre}</span>
                                ))}
                            </div>
                        </div>
                        <div className={styles.bookActions}>
                            <p className={styles.bookPrice}>${book.price}</p>
                            {isLoggedIn && (
                                <button
                                    className={styles.addToCart}
                                    onClick={() => onAddToCart(book.id)}
                                >
                                    Add to Cart
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default LibraryBookList;