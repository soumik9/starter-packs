import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    PORT: process.env.PORT,
    MONGO_CONNECTION: process.env.MONGO_CONNECTION,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    TOKEN_SECRET_EXP: process.env.TOKEN_SECRET_EXP,
};