import { Router } from 'express';
import { getVehicleTypes } from '../controllers/vehicleType.controller';
import { logVehicleEntry, logVehicleExit, getCurrentVehicles, getVehicleLogs, getVehicleLogById, deleteVehicleLog, exportVehicleLogs } from '../controllers/vehicleLog.controller';
import { vehicleEntryValidation } from '../validators/vehicle.validator';
import { validate } from '../middleware/validation.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Vehicle management
 */

/**
 * @swagger
 * /api/vehicles/types:
 *   get:
 *     summary: Get all vehicle types
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: A list of vehicle types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehicleType'
 */
router.get('/types', getVehicleTypes);
/**
 * @swagger
 * /api/vehicles/entry:
 *   post:
 *     summary: Log a vehicle entry
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleLogEntry'
 *     responses:
 *       201:
 *         description: Vehicle entry logged successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/entry', vehicleEntryValidation, validate, logVehicleEntry);
/**
 * @swagger
 * /api/vehicles/exit/{id}:
 *   put:
 *     summary: Log a vehicle exit
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vehicle exit logged successfully
 *       404:
 *         description: Vehicle log not found
 *       500:
 *         description: Internal server error
 */
router.put('/exit/:id', logVehicleExit);
/**
 * @swagger
 * /api/vehicles/current:
 *   get:
 *     summary: Get all vehicles currently in the facility
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: A list of current vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehicleLog'
 */
router.get('/current', getCurrentVehicles);
/**
 * @swagger
 * /api/vehicles/logs:
 *   get:
 *     summary: Get all vehicle logs
 *     tags: [Vehicles]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of vehicle logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehicleLog'
 */
router.get('/logs', getVehicleLogs);
/**
 * @swagger
 * /api/vehicles/logs/export:
 *   get:
 *     summary: Export vehicle logs to a CSV file
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: A CSV file of vehicle logs
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 */
router.get('/logs/export', exportVehicleLogs);
/**
 * @swagger
 * /api/vehicles/logs/{id}:
 *   get:
 *     summary: Get a vehicle log by ID
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A vehicle log
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleLog'
 *       404:
 *         description: Vehicle log not found
 */
router.get('/logs/:id', getVehicleLogById);
/**
 * @swagger
 * /api/vehicles/logs/{id}:
 *   delete:
 *     summary: Delete a vehicle log by ID
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Vehicle log deleted successfully
 *       404:
 *         description: Vehicle log not found
 */
router.delete('/logs/:id', deleteVehicleLog);

export default router;