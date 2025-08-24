import { Pool } from 'pg';
import { User } from '../models/User';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export class UserService {
  static async findByUsername(username: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return null;
  }

  static async create(user: User): Promise<User> {
    const result = await pool.query(
      'INSERT INTO users (username, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [user.username, user.password_hash, user.full_name, user.role || 'security']
    );
    return result.rows[0];
  }
}