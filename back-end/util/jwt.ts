import jwt from 'jsonwebtoken';
import { Role } from '../types';

const generateJwtToken = ({ username, role }: {username: string, role: Role}): string => {
    const options = { expiresIn: `${process.env.JWT_EXPIRES_HOURS}h`, issuer: 'bookmart_app'};

    try {
        return jwt.sign({ username, role }, process.env.JWT_SECRET || 'default_secret', options);
    } catch (error) {
        console.log(error)
        throw new Error("Erro generating JWT token, see server log for details.");
    }
};

export { generateJwtToken}