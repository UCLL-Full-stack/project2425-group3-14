const addToCart = (cartId: number | null, bookId: number) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + `/carts/add/${cartId}/${bookId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

const allBooksInCart = (cartId: number) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + `/carts/${cartId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

const adjustQuantity = (cartId: number, bookId: number, action: string) => {
    const endpoint = action === "increase" 
            ? process.env.NEXT_PUBLIC_API_URL + `/carts/add/${cartId}/${bookId}` 
            : process.env.NEXT_PUBLIC_API_URL + `/carts/decrease/${cartId}/${bookId}`;

    return fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
 
    });
}

const removeFromCart = (cartId: number, bookId: number) => {
    return fetch(`http://localhost:3000/carts/remove/${cartId}/${bookId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
}

const CartService = {
    addToCart,
    allBooksInCart,
    adjustQuantity,
    removeFromCart,
};
export default CartService;