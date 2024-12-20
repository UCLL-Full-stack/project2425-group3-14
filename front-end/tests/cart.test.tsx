import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CartBookList from '@/components/CartBookList';
import { useTranslation } from 'next-i18next';
import CartService from '@/services/CartService';

jest.mock('@/services/CartService', () => ({
  removeFromCart: jest.fn(() => Promise.resolve()),
}));

jest.mock('next-i18next', () => ({
  useTranslation: jest.fn(),
}));

window.React = React
const mockOnAdjustQuantity = jest.fn();
const mockOnRemoveFromCart = jest.fn();
const mockOnBookClick = jest.fn();
const mockOnOrderCart = jest.fn();

describe('CartBookList Component', () => {
  const mockCartItems = [
    {
      book: {
        id: 1,
        name: 'Book One',
        author: 'Author One',
        price: 10,
        imageUrl: '/book-one.jpg',
      },
      quantityInCart: 2,
    },
    {
      book: {
        id: 2,
        name: 'Book Two',
        author: 'Author Two',
        price: 15,
        imageUrl: '/book-two.jpg',
      },
      quantityInCart: 3,
    },
  ];

  const totalPrice = mockCartItems.reduce(
    (acc, item) => acc + item.book.price * item.quantityInCart,
    0
  );

  beforeEach(() => {
    jest.clearAllMocks();

    (useTranslation as jest.Mock).mockReturnValue({
        t: (key: string) => {
            switch (key) {
              case 'cart.by':
                return 'by';
              case 'cart.total-amount':
                return 'Total:';
              default:
                return key;
            }
        },
    });
  });

  test('given items in the cart - when you view the cart - then the books and their details are shown', () => {
    render(
      <CartBookList
        items={mockCartItems}
        onAdjustQuantity={mockOnAdjustQuantity}
        onRemoveFromCart={mockOnRemoveFromCart}
        onBookClick={mockOnBookClick}
        onOrderCart={mockOnOrderCart}
        totalPrice={totalPrice}
        isLoading={false}
        cartId={1}
      />
    );

    mockCartItems.forEach((item) => {
      expect(screen.getByText(item.book.name));
      expect(screen.getByText(`by ${item.book.author}`));
      expect(screen.getByText(`$${item.book.price.toFixed(2)}`));
      expect(screen.getByText(item.quantityInCart));
    });
  });

  test('given items in the cart - when you click on remove from cart - then onRemoveFromCart is called and item is removed', () => {
    render(
      <CartBookList
        items={mockCartItems}
        onAdjustQuantity={mockOnAdjustQuantity}
        onRemoveFromCart={mockOnRemoveFromCart}
        onBookClick={mockOnBookClick}
        onOrderCart={mockOnOrderCart}
        totalPrice={totalPrice}
        isLoading={false}
        cartId={1}
      />
    );

    const removeButtons = screen.getAllByText('cart.remove');
    fireEvent.click(removeButtons[0]);

    expect(mockOnRemoveFromCart).toHaveBeenCalledWith(mockCartItems[0].book.id);
    expect(mockOnRemoveFromCart).toHaveBeenCalledTimes(1);

  });

  test('given items in the cart - when you adjust quantity - then onAdjustQuantity is called', () => {
    render(
      <CartBookList
        items={mockCartItems}
        onAdjustQuantity={mockOnAdjustQuantity}
        onRemoveFromCart={mockOnRemoveFromCart}
        onBookClick={mockOnBookClick}
        onOrderCart={mockOnOrderCart}
        totalPrice={totalPrice}
        isLoading={false}
        cartId={1}
      />
    );

    const increaseButtons = screen.getAllByText('+');
    const initialQuantity = mockCartItems[0].quantityInCart;
    fireEvent.click(increaseButtons[0]);

    expect(mockOnAdjustQuantity).toHaveBeenCalledWith(mockCartItems[0].book.id, 'increase');
    expect(mockOnAdjustQuantity).toHaveBeenCalledTimes(1);
    expect(screen.getByText((initialQuantity + 1).toString()));

    const decreaseButtons = screen.getAllByText('-');
    fireEvent.click(decreaseButtons[0]);

    expect(mockOnAdjustQuantity).toHaveBeenCalledWith(mockCartItems[0].book.id, 'decrease');
    expect(mockOnAdjustQuantity).toHaveBeenCalledTimes(2);
    expect(screen.getByText(initialQuantity.toString()));
  });

  test('given no items in the cart - when viewing the cart - then empty cart message is shown', () => {
    render(
      <CartBookList
        items={[]}
        onAdjustQuantity={mockOnAdjustQuantity}
        onRemoveFromCart={mockOnRemoveFromCart}
        onBookClick={mockOnBookClick}
        onOrderCart={mockOnOrderCart}
        totalPrice={0}
        isLoading={false}
        cartId={1}
      />
    );

    expect(screen.getByText('cart.empty')); // Translation key for empty cart
  });

  test('given items in the cart - when you click order - then onOrderCart is called', () => {
    render(
      <CartBookList
        items={mockCartItems}
        onAdjustQuantity={mockOnAdjustQuantity}
        onRemoveFromCart={mockOnRemoveFromCart}
        onBookClick={mockOnBookClick}
        onOrderCart={mockOnOrderCart}
        totalPrice={totalPrice}
        isLoading={false}
        cartId={1}
      />
    );

    const orderButton = screen.getByText('cart.order'); // Translation key for order
    fireEvent.click(orderButton);

    expect(mockOnOrderCart).toHaveBeenCalled();
    expect(mockOnOrderCart).toHaveBeenCalledTimes(1);
  });
});
