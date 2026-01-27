import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    port: process.env.PORT || 5000,
    node_env: process.env.NODE_ENV || 'development',
    database_url: process.env.DATABASE_URL,
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expires_in: process.env.JWT_EXPIRES_IN || '7d',
    },
    admin: {
        email: process.env.ADMIN_EMAIL || 'admin@skillbridge.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
    },
};