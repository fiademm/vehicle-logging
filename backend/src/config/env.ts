import dotenv from 'dotenv';

dotenv.config();

const env = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_ANON_KEY,
};

if (!env.jwtSecret || !env.supabaseUrl || !env.supabaseKey) {
  throw new Error('Missing essential environment variables: JWT_SECRET, SUPABASE_URL, SUPABASE_ANON_KEY');
}

export default env;