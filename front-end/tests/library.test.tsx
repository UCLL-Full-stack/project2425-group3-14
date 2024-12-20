


import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LibraryBookList from '@/components/LibraryBookList';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/services/LibraryService', () => ({
  removeBook: jest.fn(() => Promise.resolve()),
}));
window.React = React
const mockOnAddToCart = jest.fn();

describe('LibraryBookList Component', () => {
  const mockBooks = [
    {
      id: 1,
      name: 'Book One',
      author: 'Author One',
      genres: ['Fiction'],
      price: 10,
      imageUrl: '/book-one.jpg',
    },
    {
      id: 2,
      name: 'Book Two',
      author: 'Author Two',
      genres: ['Non-Fiction'],
      price: 15,
      imageUrl: '/book-two.jpg',
    },
  ];

  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  test('given books - when you want to see the library of books - then the books are shown', () => {
    render(<LibraryBookList books={mockBooks} onAddToCart={mockOnAddToCart} />);

    mockBooks.forEach((book) => {
      expect(screen.getByText(book.name));
      expect(screen.getByText(`by ${book.author}`));
      expect(screen.getByText(`$${book.price}`));
    });
  });

  test('given a logged-in user - when clicking add to cart - then onAddToCart is called', () => {
    sessionStorage.setItem(
      'loggedInUser',
      JSON.stringify({ role: 'user' })
    );

    render(<LibraryBookList books={mockBooks} onAddToCart={mockOnAddToCart} />);

    const addToCartButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addToCartButtons[0]);

    expect(mockOnAddToCart).toHaveBeenCalledWith(1);
    expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
  });

  test('given an admin user - when clicking delete book - then removeBook is called', async () => {
    const { removeBook } = require('@/services/LibraryService');
    sessionStorage.setItem(
      'loggedInUser',
      JSON.stringify({ role: 'admin' })
    );

    render(<LibraryBookList books={mockBooks} onAddToCart={mockOnAddToCart} />);

    const deleteButtons = screen.getAllByText('Delete book');
    fireEvent.click(deleteButtons[0]);

    expect(removeBook).toHaveBeenCalledWith(1);
    expect(removeBook).toHaveBeenCalledTimes(1);
  });

  test('given a guest user - when viewing books - then Add to Cart button is not shown', () => {
    sessionStorage.setItem(
      'loggedInUser',
      JSON.stringify({ role: 'guest' })
    );

    render(<LibraryBookList books={mockBooks} onAddToCart={mockOnAddToCart} />);

    expect(screen.queryByText('Add to Cart')).toBeNull();
  });

  test('given an admin user - when viewing books - then Delete book button is shown', () => {
    sessionStorage.setItem(
      'loggedInUser',
      JSON.stringify({ role: 'admin' })
    );

    render(<LibraryBookList books={mockBooks} onAddToCart={mockOnAddToCart} />);

    const deleteButtons = screen.getAllByText('Delete book');
    expect(deleteButtons).toHaveLength(mockBooks.length);
  });

  test('given no logged-in user - when viewing books - then Add to Cart and Delete book buttons are not shown', () => {
    render(<LibraryBookList books={mockBooks} onAddToCart={mockOnAddToCart} />);

    expect(screen.queryByText('Add to Cart')).toBeNull();
    expect(screen.queryByText('Delete book')).toBeNull();
  });
});