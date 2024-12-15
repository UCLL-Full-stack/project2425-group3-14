const addToCart = (cartId: number | null, bookId: number) => {
    if (typeof window !== "undefined") {
        const token = JSON.parse(sessionStorage.getItem("loggedInUser")!).token;
        console.log("Cart ID: b", cartId);
        if (!token) {
            throw new Error("Authorization token is missing.");
        } 
        console.log(cartId);
        console.log(bookId);
        console.log(token);
        return fetch(process.env.NEXT_PUBLIC_API_URL + `/carts/add/${cartId}/${bookId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
    }
};

const allBooksInCart = (cartId: number) => {
    if (typeof window !== "undefined") {
        const token = JSON.parse(sessionStorage.getItem("loggedInUser")!).token;
        console.log(token);
        return fetch(process.env.NEXT_PUBLIC_API_URL + `/carts/${cartId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
    };
}

const adjustQuantity = (cartId: number, bookId: number, action: string) => {
    if (typeof window !== "undefined") {
        const token = JSON.parse(sessionStorage.getItem("loggedInUser")!).token;
        const endpoint = action === "increase" 
        ? process.env.NEXT_PUBLIC_API_URL + `/carts/add/${cartId}/${bookId}` 
        : process.env.NEXT_PUBLIC_API_URL + `/carts/decrease/${cartId}/${bookId}`;
        
        return fetch(endpoint, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`,     
            },
            
        });
    }
}

const removeFromCart = (cartId: number, bookId: number) => {
    if (typeof window !== "undefined") {
        const token = JSON.parse(sessionStorage.getItem("loggedInUser")!).token;
        return fetch(`http://localhost:3000/carts/remove/${cartId}/${bookId}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
    }
}

const CartService = {
    addToCart,
    allBooksInCart,
    adjustQuantity,
    removeFromCart,
};
export default CartService;