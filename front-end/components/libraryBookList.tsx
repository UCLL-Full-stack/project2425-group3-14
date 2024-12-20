import React, { useEffect, useState } from 'react';
import styles from '../styles/LibraryBookList.module.css';
import { Book } from '@/types';
import { useRouter } from 'next/router';
import { LibraryBookListProps } from '@/types';
import LibraryService from '@/services/LibraryService';



const LibraryBookList: React.FC<LibraryBookListProps> = ({ books, onAddToCart, onRemoveBook }) => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);  
    const [isAdmin, setIsAdmin] = useState(false);
    const [isGuest, setIsGuest] = useState(false);
    

  useEffect(() => {
    const user = sessionStorage.getItem('loggedInUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      setIsLoggedIn(true);
      setIsAdmin(parsedUser.role === 'admin' || parsedUser.role === 'ADMIN');
      setIsGuest(parsedUser.role === 'guest');
    }
  }, []);
    // const isLoggedIn = typeof window !== 'undefined' && sessionStorage.getItem('loggedInUser');

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
                            {isLoggedIn && !isGuest && (
                                <button
                                className={styles.addToCart}
                                onClick={() => onAddToCart(book.id)}
                                >
                                    Add to Cart
                                </button>
                            )}
                            {isAdmin && (
                                <button
                                    onClick={() => onRemoveBook(book.id)}
                                    className={styles.deleteBook}
                                >
                                    Delete book
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