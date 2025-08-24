import React from 'react';
import { FaAmbulance, FaMotorcycle, FaBus, FaUserFriends, FaFireExtinguisher, FaShieldAlt, FaTaxi } from 'react-icons/fa';
import useHapticFeedback from '../../hooks/useHapticFeedback';

const vehicleTypes = [
  { name: 'Ambulance', icon: <FaAmbulance /> },
  { name: 'Police', icon: <FaShieldAlt /> },
  { name: 'Army', icon: <FaShieldAlt /> },
  { name: 'Fire', icon: <FaFireExtinguisher /> },
  { name: 'Guest', icon: <FaUserFriends /> },
  { name: 'Minibus', icon: <FaBus /> },
  { name: 'Uber', icon: <FaTaxi /> },
  { name: 'Taxi', icon: <FaTaxi /> },
  { name: 'Bikes', icon: <FaMotorcycle /> },
];

const VehicleTypeSelector: React.FC = () => {
  const triggerFeedback = useHapticFeedback();

  const handleClick = () => {
    triggerFeedback();
    // Add logic to handle vehicle selection
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {vehicleTypes.map((vehicle) => (
        <button
          key={vehicle.name}
          onClick={handleClick}
          className="flex flex-col items-center justify-center p-4 bg-neutralMedium rounded-lg hover:bg-neutralMedium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <div className="text-4xl mb-2">{vehicle.icon}</div>
          <span className="text-sm font-medium">{vehicle.name}</span>
        </button>
      ))}
    </div>
  );
};

export default VehicleTypeSelector;