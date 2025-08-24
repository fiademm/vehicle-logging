import { pool } from '../config/database';

export interface VehicleType {
  id: number;
  name: string;
  color: string;
}

export const VehicleTypeModel = {
  async getAll(): Promise<VehicleType[]> {
    const result = await pool.query('SELECT * FROM vehicle_types');
    return result.rows;
  },

  async getById(id: number): Promise<VehicleType | null> {
    const result = await pool.query('SELECT * FROM vehicle_types WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async create(name: string, color: string): Promise<VehicleType> {
    const result = await pool.query(
      'INSERT INTO vehicle_types (name, color) VALUES ($1, $2) RETURNING *',
      [name, color]
    );
    return result.rows[0];
  },

  async update(id: number, name: string, color: string): Promise<VehicleType | null> {
    const result = await pool.query(
      'UPDATE vehicle_types SET name = $1, color = $2 WHERE id = $3 RETURNING *',
      [name, color, id]
    );
    return result.rows[0] || null;
  },

  async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM vehicle_types WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },
};