import request from 'supertest';
import { app } from '../index';
import { VehicleType } from '../models/vehicle';
import { Request, Response, NextFunction } from 'express';

// Mock the authentication middleware
jest.mock('../middleware/auth.middleware', () => ({
  authMiddleware: (req: Request, res: Response, next: NextFunction) => {
    (req as any).user = { id: 1 }; // Mock user
    next();
  },
}));

describe('Vehicle API', () => {
  let vehicleTypes: VehicleType[];

  beforeAll(async () => {
    const res = await request(app).get('/api/vehicles/types');
    vehicleTypes = res.body;
  });

  it('should fetch all vehicle logs', async () => {
    const res = await request(app).get('/api/vehicles/logs');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a new vehicle log entry', async () => {
    const res = await request(app)
      .post('/api/vehicles/entry')
      .send({
        vehicle_type_id: vehicleTypes[0].id,
        license_plate: 'TEST1234',
        notes: 'Test entry',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.license_plate).toEqual('TEST1234');
  });
});