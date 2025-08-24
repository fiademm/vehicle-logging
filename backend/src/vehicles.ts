
import { Request, Response } from 'express';
import { vehicleLogs } from './sse';

export const exportVehicles = (req: Request, res: Response) => {
  const { format } = req.query;

  if (format === 'csv') {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="vehicles.csv"');
    const csvData = [
      ['ID', 'Vehicle Type', 'Entry Time', 'Exit Time', 'Logged By', 'License Plate', 'Notes'],
      ...vehicleLogs.map((log) => [
        log.id,
        log.vehicle_type,
        log.entry_time,
        log.exit_time || '',
        log.logged_by,
        log.license_plate,
        log.notes,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');
    res.status(200).send(csvData);
  } else {
    res.status(400).send('Invalid format');
  }
};