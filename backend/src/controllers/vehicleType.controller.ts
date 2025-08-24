import { Request, Response } from 'express';
import { VehicleTypeModel } from '../models/VehicleType';

export const getVehicleTypes = async (req: Request, res: Response) => {
  const vehicleTypes = await VehicleTypeModel.getAll();
  res.json(vehicleTypes);
};