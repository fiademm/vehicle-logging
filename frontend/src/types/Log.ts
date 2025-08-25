export type Log = {
  id: string;
  action: 'entry' | 'exit';
  timestamp: number;
  vehicle: {
    vehicleType: string;
    licensePlate: string;
  };
}