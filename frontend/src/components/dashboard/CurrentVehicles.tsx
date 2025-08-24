import React from 'react';
import { FaAmbulance, FaMotorcycle, FaBus, FaTruck } from 'react-icons/fa';
import { IconType } from 'react-icons';

// A more robust icon mapping
const iconMap: { [key: string]: IconType } = {
  ambulance: FaAmbulance,
  police: FaTruck, // Changed to FaTruck as an example
  fire: FaTruck,
  guest: FaBus, // Changed to FaBus as an example
  minibus: FaBus,
  bikes: FaMotorcycle,
  Default: FaTruck, // Changed to FaTruck as an example
};

interface Vehicle {
  id: string;
  type: string;
  entryTime: string; // Assuming ISO string from backend
}

interface CurrentVehiclesProps {
  vehicles: Vehicle[];
}

const CurrentVehicles: React.FC<CurrentVehiclesProps> = ({ vehicles }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Current Vehicles on Premises</h2>
      {vehicles.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {vehicles.map((vehicle) => {
            const Icon = iconMap[vehicle.type.toLowerCase()] || iconMap.Default;
            return (
              <div key={vehicle.id} className="bg-neutralLight p-4 rounded-lg flex flex-col items-center justify-center text-center">
                <Icon className="text-4xl text-textLight mb-2" />
                <p className="font-semibold">{vehicle.type}</p>
                <p className="text-sm text-textLight">{new Date(vehicle.entryTime).toLocaleTimeString()}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No vehicles currently on the premises.</p>
      )}
    </div>
  );
};

export default CurrentVehicles;