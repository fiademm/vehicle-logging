
import { Request, Response, NextFunction } from 'express';
import redisClient from './config/redisClient';

const clients = new Set<Response>();

function sendToAll(data: any) {
  for (const client of clients) {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}

interface Vehicle {
  id: string;
  vehicle_type: string;
  entry_time: string;
  exit_time: string | null;
  logged_by: string;
  license_plate: string;
  notes: string;
}

export let vehicleLogs: Vehicle[] = [];
let nextVehicleId = 1;

const vehicleTypes = ['ambulance', 'police', 'army', 'fire', 'guest', 'minibus', 'uber', 'taxi', 'bike'];

function getRandomVehicleType() {
  return vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
}

function updateVehicles() {
  if (Math.random() > 0.5 && vehicleLogs.length < 15) {
    const newVehicle: Vehicle = {
      id: (nextVehicleId++).toString(),
      vehicle_type: getRandomVehicleType(),
      entry_time: new Date().toISOString(),
      exit_time: null,
      logged_by: 'System',
      license_plate: `ABC-${Math.floor(Math.random() * 900) + 100}`,
      notes: 'Randomly generated vehicle'
    };
    vehicleLogs.push(newVehicle);
  } else if (vehicleLogs.length > 0 && Math.random() > 0.5) {
    const indexToRemove = Math.floor(Math.random() * vehicleLogs.length);
    vehicleLogs.splice(indexToRemove, 1);
  }
  sendToAll({ vehicles: vehicleLogs });
  redisClient.del('/api/vehicles/export?format=csv');
}

export function sseMiddleware(req: Request, res: Response, next: NextFunction) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  res.write('data: Connected\n\n');
  clients.add(res);

  req.on('close', () => {
    clients.delete(res);
  });

  sendToAll({ vehicles: vehicleLogs });
}

setInterval(updateVehicles, 2000);