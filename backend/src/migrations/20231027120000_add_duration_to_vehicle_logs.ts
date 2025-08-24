import { Pool } from 'pg';

export async function up(pool: Pool): Promise<void> {
  await pool.query(`
    ALTER TABLE vehicle_logs
    ADD COLUMN duration INTEGER,
    ADD COLUMN parking_fee NUMERIC(10, 2),
    ADD COLUMN timezone VARCHAR(50);
  `);
}

export async function down(pool: Pool): Promise<void> {
  await pool.query(`
    ALTER TABLE vehicle_logs
    DROP COLUMN duration,
    DROP COLUMN parking_fee,
    DROP COLUMN timezone;
  `);
}