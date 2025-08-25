import { supabase } from '../db'; // Import the Supabase client
import { User } from '../models/user-model';

export class UserService {
  static async findByUsername(username: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users') // Assuming your table name is 'users'
      .select('*')
      .eq('username', username)
      .single(); // Use .single() if you expect at most one row

    if (error) {
      console.error('Error finding user by username:', error);
      return null;
    }

    return data as User | null;
  }

  static async create(user: User): Promise<User> {
    const { data, error } = await supabase
      .from('users') // Assuming your table name is 'users'
      .insert([
        {
          username: user.username,
          password_hash: user.password_hash,
          full_name: user.full_name,
          role: user.role || 'security',
        },
      ])
      .select() // Use .select() to return the inserted data
      .single(); // Use .single() if you expect one inserted row

    if (error) {
      console.error('Error creating user:', error);
      throw error; // Or handle the error as appropriate
    }

    return data as User;
  }
}