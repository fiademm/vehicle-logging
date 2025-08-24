import { pool } from '../config/database';

export interface VehicleLog {
  id: number;
  vehicle_type_id: number;
  entry_time: Date;
  exit_time: Date | null;
  logged_by: number;
  license_plate: string | null;
  notes: string | null;
  is_deleted: boolean;
  duration: number | null;
  parking_fee: number | null;
  timezone: string | null;
}

export const VehicleLogModel = {
  async create(log: Omit<VehicleLog, 'id' | 'is_deleted' | 'duration' | 'parking_fee' | 'timezone' | 'exit_time'>): Promise<VehicleLog> {
    const result = await pool.query(
      'INSERT INTO vehicle_logs (vehicle_type_id, entry_time, logged_by, license_plate, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [log.vehicle_type_id, log.entry_time, log.logged_by, log.license_plate, log.notes]
    );
    return result.rows[0];
  },

  async findById(id: number): Promise<VehicleLog | null> {
    const result = await pool.query('SELECT * FROM vehicle_logs WHERE id = $1 AND is_deleted = false', [id]);
    return result.rows[0] || null;
  },

  async updateExitTime(id: number, exit_time: Date, duration: number, parking_fee: number, timezone: string): Promise<VehicleLog | null> {
    const result = await pool.query(
      'UPDATE vehicle_logs SET exit_time = $1, duration = $2, parking_fee = $3, timezone = $4 WHERE id = $5 AND is_deleted = false RETURNING *',
      [exit_time, duration, parking_fee, timezone, id]
    );
    return result.rows[0] || null;
  },

  async softDelete(id: number): Promise<boolean> {
    const result = await pool.query('UPDATE vehicle_logs SET is_deleted = true WHERE id = $1 AND exit_time IS NULL', [id]);
    return (result.rowCount ?? 0) > 0;
  },

  async findActive(): Promise<VehicleLog[]> {
    const result = await pool.query('SELECT * FROM vehicle_logs WHERE exit_time IS NULL AND is_deleted = false ORDER BY entry_time DESC');
    return result.rows;
  },

  async findWithFilters(filters: { startDate?: string; endDate?: string; vehicleType?: number, page?: number, limit?: number, search?: string }): Promise<VehicleLog[]> {
    let query = 'SELECT * FROM vehicle_logs WHERE is_deleted = false';
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.startDate) {
      query += ` AND entry_time >= $${paramIndex++}`;
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ` AND entry_time <= $${paramIndex++}`;
      params.push(filters.endDate);
    }

    if (filters.vehicleType) {
      query += ` AND vehicle_type_id = $${paramIndex++}`;
      params.push(filters.vehicleType);
    }

    if (filters.search) {
      query += ` AND (license_plate ILIKE $${paramIndex++} OR notes ILIKE $${paramIndex++})`
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY entry_time DESC';

    if (filters.limit && filters.page) {
        const offset = (filters.page - 1) * filters.limit;
        query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
        params.push(filters.limit, offset);
    }

    const result = await pool.query(query, params);
    return result.rows;
  },
};