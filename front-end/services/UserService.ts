import { User } from "../types";

const createUser = ({username, email, password, role}:User) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/users/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            email,
            password,
            role,
        }),
    });
};

const loginUser = (user: User) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });
};

const getAllUsers = () => {
    if (typeof window !== "undefined") {
        const token = JSON.parse(sessionStorage.getItem("loggedInUser")!).token;
        return fetch(process.env.NEXT_PUBLIC_API_URL + '/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
    }
};

const removeUser = (id: number) => {
    if (typeof window !== "undefined") {
        const token = JSON.parse(sessionStorage.getItem("loggedInUser")!).token;
        return fetch(process.env.NEXT_PUBLIC_API_URL + `/users/remove/${id}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
    }
}

const UserService = {
    createUser,
    loginUser,
    getAllUsers,
    removeUser,
};

export default UserService;
    // const response = await fetch("http://localhost:3000/users/register", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //         username,
    //         email,
    //         password,
    //         role,
    //     }),
    // });