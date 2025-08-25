import { supabase } from '../db';
import bcrypt from 'bcrypt';

export interface User {
  id?: number;
  username: string;
  password_hash: string;
  full_name: string;
  role?: string;
  created_at?: Date;
  last_login?: Date;
}

const saltRounds = 10;

export const createUser = async (username: string, password: string, fullName: string, role = 'security') => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const { data, error } = await supabase
    .from('users')
    .insert([{ username, password_hash: hashedPassword, full_name: fullName, role }])
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    throw error;
  }

  return data;
};

export const findUserByUsername = async (username: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116: "The result contains 0 rows"
    console.error('Error finding user by username:', error);
    throw error;
  }

  return data;
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};