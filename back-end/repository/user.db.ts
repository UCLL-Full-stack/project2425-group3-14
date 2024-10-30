import { User } from '../model/user';

const users = [
    new User({
        id: 1,
        username: 'Jefje',
        email: 'jef@gmail.com',
        password: 'jefje123',
        role: 'admin'
    }),
    new User({
        id: 2,
        username: 'Maria',
        email: 'maria@gmail.com',
        password: 'maria123',
        role: 'customer'
    }),
];

const createUser = (user: User): User => {
    user.id = users.length + 1;
    users.push(user);
    return user;
};

const findUserByUsername = (username: string): User | undefined => {
    return users.find((user) => user.getUsername() === username);
}

const findUserByEmail = (email: string): User | undefined => {
    return users.find((user) => user.getEmail() === email);
}

const getAllUsers = (): User[] => {
    return users;
};

export default { createUser, getAllUsers, findUserByUsername, findUserByEmail };