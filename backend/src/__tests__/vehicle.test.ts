
import request from 'supertest';
import { app } from '../index'; // Assuming your Express app is exported from index.ts
import { supabase } from '../db';

describe('Vehicle API', () => {
  afterAll(async () => {
    // Clean up any created test data
  });

  it('should get all vehicle types', async () => {
    const res = await request(app).get('/api/vehicles/types');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});