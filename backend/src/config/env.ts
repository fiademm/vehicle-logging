import dotenv from 'dotenv';

dotenv.config();

const env = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
};

if (!env.databaseUrl || !env.jwtSecret) {
  throw new Error('Missing essential environment variables: DATABASE_URL and JWT_SECRET');
}

export default env;