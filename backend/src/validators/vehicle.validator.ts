import { body } from 'express-validator';

export const vehicleEntryValidation = [
  body('vehicle_type_id', 'Vehicle type ID must be an integer').isInt(),
  body('license_plate', 'License plate must be a string').optional().isString(),
  body('notes', 'Notes must be a string').optional().isString(),
];