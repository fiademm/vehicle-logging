/**
 * @swagger
 * components:
 *   schemas:
 *     VehicleType:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         color:
 *           type: string
 */
export interface VehicleType {
  id?: number;
  name: string;
  color: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     VehicleLog:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         vehicle_type_id:
 *           type: integer
 *         entry_time:
 *           type: string
 *           format: date-time
 *         exit_time:
 *           type: string
 *           format: date-time
 *         logged_by:
 *           type: integer
 *         license_plate:
 *           type: string
 *         notes:
 *           type: string
 *         is_deleted:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 */
export interface VehicleLog {
  id?: number;
  vehicle_type_id: number;
  entry_time: Date;
  exit_time?: Date;
  logged_by: number;
  license_plate: string;
  notes?: string;
  is_deleted?: boolean;
  created_at?: Date;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     VehicleLogEntry:
 *       type: object
 *       properties:
 *         vehicle_type_id:
 *           type: integer
 *         license_plate:
 *           type: string
 *         notes:
 *           type: string
 */
export interface VehicleLogEntry {
  vehicle_type_id: number;
  license_plate: string;
  notes?: string;
}