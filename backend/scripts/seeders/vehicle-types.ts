import { PoolClient } from 'pg';

const vehicleTypes = [
  { name: 'Ambulance', color: '#FFD700' },
  { name: 'Police', color: '#0000FF' },
  { name: 'Army', color: '#008000' },
  { name: 'Fire', color: '#FF0000' },
  { name: 'Guest', color: '#808080' },
  { name: 'Minibus', color: '#FFA500' },
  { name: 'Uber', color: '#000000' },
  { name: 'Taxi', color: '#FFFF00' },
  { name: 'Bikes', color: '#A52A2A' },
];

export async function seedVehicleTypes(client: PoolClient) {
  for (const type of vehicleTypes) {
    await client.query(
      'INSERT INTO vehicle_types (name, color) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
      [type.name, type.color]
    );
  }
}