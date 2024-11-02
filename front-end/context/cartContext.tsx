import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartContextType {
    cartId: number | null;
    setCartId: (id: number | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartId, setCartId] = useState<number | null>(null);

    useEffect(() => {
        const savedCartId = sessionStorage.getItem('cartId');
        if (savedCartId) {
            setCartId(Number(savedCartId));
        }
    }, []);

    useEffect(() => {
        if (cartId !== null) {
            sessionStorage.setItem('cartId', cartId.toString());
        }
    }, [cartId]);

    return (
        <CartContext.Provider value={{ cartId, setCartId }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

export default CartProvider;
