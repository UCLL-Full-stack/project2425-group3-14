type Role = 'admin' | 'customer';

type UserInput = {
    id?: number;
    username: string;
    email: string;
    password: string;
    role: Role;
};

export { Role, UserInput, };