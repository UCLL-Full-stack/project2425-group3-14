const getAllOrders = (id: String) => {
    if (typeof window !== "undefined") {
        const token = JSON.parse(sessionStorage.getItem("loggedInUser")!).token;
        return fetch(process.env.NEXT_PUBLIC_API_URL + '/orders/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
    }
    
};





const OrderService = {
    getAllOrders,

};
export default OrderService;