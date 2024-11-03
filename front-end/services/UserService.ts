import { User } from "@/types";

const createUser = ({username, email, password, role}:User) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/users/register', {
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

const UserService = {
    createUser
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