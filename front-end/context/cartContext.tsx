import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartAmount, setCartAmount] = useState(0);

  const updateCartAmount = (amount) => {
    setCartAmount(amount);
  };

  return (
    <CartContext.Provider value={{ cartAmount, updateCartAmount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
