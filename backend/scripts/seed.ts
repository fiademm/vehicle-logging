import { Pool } from 'pg';
import dotenv from 'dotenv';
import { seedVehicleTypes } from './seeders/vehicle-types';
import { seedUsers } from './seeders/user-seeder';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const seed = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await seedVehicleTypes(client);
    await seedUsers(client);
    await client.query('COMMIT');
    console.log('Seeding completed successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error running seeding:', error);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
};

if (require.main === module) {
  seed();
}