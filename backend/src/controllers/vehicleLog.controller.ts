import { Request, Response } from 'express';
import { VehicleLogModel } from '../models/VehicleLog';
import { jsonToCsv } from '../utils/csv';

export const logVehicleEntry = async (req: Request, res: Response) => {
  try {
    const { vehicle_type_id, license_plate, notes } = req.body;
    // @ts-ignore
    const logged_by = req.user.id;
    const newLog = await VehicleLogModel.create({
      vehicle_type_id,
      entry_time: new Date(),
      // @ts-ignore
      logged_by,
      license_plate,
      notes,
    });
    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json({ message: 'Error logging vehicle entry', error });
  }
};

export const logVehicleExit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { timezone } = req.body; // Assuming timezone is sent from the client

    const log = await VehicleLogModel.findById(parseInt(id));

    if (!log) {
      return res.status(404).json({ message: 'Vehicle log not found' });
    }

    const exit_time = new Date();
    const entry_time = new Date(log.entry_time);
    const duration = Math.round((exit_time.getTime() - entry_time.getTime()) / 60000); // Duration in minutes

    const parking_fee = Math.ceil(duration / 60) * 2; // $2 per hour

    const updatedLog = await VehicleLogModel.updateExitTime(parseInt(id), exit_time, duration, parking_fee, timezone);

    if (updatedLog) {
      res.status(200).json(updatedLog);
    } else {
      res.status(404).json({ message: 'Vehicle log not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging vehicle exit', error });
  }
};

export const getCurrentVehicles = async (req: Request, res: Response) => {
  try {
    const activeVehicles = await VehicleLogModel.findActive();
    res.status(200).json(activeVehicles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active vehicles', error });
  }
};

export const getVehicleLogs = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, startDate, endDate, vehicleType, search } = req.query;
    const logs = await VehicleLogModel.findWithFilters({
      startDate: startDate as string,
      endDate: endDate as string,
      vehicleType: vehicleType ? parseInt(vehicleType as string) : undefined,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      search: search as string,
    });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicle logs', error });
  }
};

export const getVehicleLogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const log = await VehicleLogModel.findById(parseInt(id));
    if (log) {
      res.status(200).json(log);
    } else {
      res.status(404).json({ message: 'Vehicle log not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicle log', error });
  }
};

export const deleteVehicleLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = await VehicleLogModel.softDelete(parseInt(id));
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Vehicle log not found or cannot be deleted' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting vehicle log', error });
  }
};

export const exportVehicleLogs = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, vehicleType, search } = req.query;
    const logs = await VehicleLogModel.findWithFilters({
      startDate: startDate as string,
      endDate: endDate as string,
      vehicleType: vehicleType ? parseInt(vehicleType as string) : undefined,
      search: search as string,
    });

    const csv = jsonToCsv(logs);
    res.header('Content-Type', 'text/csv');
    res.attachment('vehicle-logs.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting vehicle logs', error });
  }
};