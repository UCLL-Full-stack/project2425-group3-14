import { User } from "../../model/user";
import { Role } from "../../types";

const userName = "JohnDoe";
const userEmail = "johndoe@example.com";
const userPassword = "securePassword123";
const userRole = "customer";

// Valid User Test

test('given: valid values for user, when: user is created, then: user is created with those values', () => {
    // when
    const user = new User({
        username: userName,
        email: userEmail,
        password: userPassword,
        role: userRole
    });

    // then
    expect(user.getUsername()).toEqual(userName);
    expect(user.getEmail()).toEqual(userEmail);
    expect(user.getPassword()).toEqual(userPassword);
    expect(user.getRole()).toEqual(userRole);
});

// Invalid Username Test

test('given: invalid username for user, when: user is created, then: an error is thrown', () => {
    const invalidUserName = "";
    
    const createUser = () => new User({
        username: invalidUserName,
        email: userEmail,
        password: userPassword,
        role: userRole
    });

    expect(createUser).toThrow("Username is required");
});

// Invalid Email Test

test('given: invalid email for user, when: user is created, then: an error is thrown', () => {
    const invalidEmail = "";

    const createUser = () => new User({
        username: userName,
        email: invalidEmail,
        password: userPassword,
        role: userRole
    });

    expect(createUser).toThrow("Email is required");
});

// Invalid Password Test

test('given: invalid password for user, when: user is created, then: an error is thrown', () => {
    const invalidPassword = "";

    const createUser = () => new User({
        username: userName,
        email: userEmail,
        password: invalidPassword,
        role: userRole
    });

    expect(createUser).toThrow("Password is required");
});

// Missing Role Test

test('given: missing role for user, when: user is created, then: an error is thrown', () => {
    const createUser = () => new User({
        username: userName,
        email: userEmail,
        password: userPassword,
        role: undefined as unknown as Role
    });

    expect(createUser).toThrow("Role is required");
});
