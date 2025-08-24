import request from 'supertest';
import { app } from '../index';

describe('Vehicle API', () => {

  describe('GET /api/vehicles/types', () => {
    it('should return a list of vehicle types', async () => {
      const response = await request(app).get('/api/vehicles/types');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
    });
  });
});