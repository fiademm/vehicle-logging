import React, { useState } from 'react';
import { FaAmbulance, FaMotorcycle, FaBus, FaTruck } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { FiEdit, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import Modal from '../general/Modal';
import { useResponsive } from '../../hooks/useResponsive';
import type { Log } from '../../types/Log';

const iconMap: { [key: string]: IconType } = {
  ambulance: FaAmbulance,
  police: FaTruck,
  fire: FaTruck,
  guest: FaBus,
  minibus: FaBus,
  bikes: FaMotorcycle,
  default: FaTruck,
};

const getVehicleIcon = (type: string) => {
    const lowerCaseType = type.toLowerCase();
    return React.createElement(iconMap[lowerCaseType] || iconMap.default);
};

interface RecentLogsProps {
  logs: Log[];
  onEdit: (log: Log) => void;
  onDelete: (id: string) => void;
}

const RecentLogs: React.FC<RecentLogsProps> = ({ logs, onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const breakpoint = useResponsive();
  const isMobile = breakpoint === 'mobile';

  const openModal = (log: Log) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLog(null);
  };

  const confirmDelete = () => {
    if (selectedLog) {
      onDelete(selectedLog.id);
      handleCloseModal();
    }
  };

  const renderLogItem = (log: Log) => (
    <div key={log.id} className="flex items-center justify-between p-4 bg-white dark:bg-textDark rounded-lg shadow mb-2">
      <div className="flex items-center">
        <div className="mr-4 text-2xl">
          {getVehicleIcon(log.vehicle.vehicleType)}
        </div>
        <div>
          <p className="font-semibold text-textDark dark:text-white">{log.vehicle.licensePlate}</p>
          <p className="text-sm text-textLight dark:text-textLight">{log.action} at {new Date(log.timestamp).toLocaleTimeString()}</p>
        </div>
      </div>
      <button onClick={() => openModal(log)} className="p-2 rounded-full hover:bg-neutralLight dark:hover:bg-textLight">
        <FiMoreVertical />
      </button>
    </div>
  );

  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Recent Logs</h2>
      {isMobile ? (
        <div>
          {logs.map(renderLogItem)}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg">
            <thead>
              <tr className="w-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Vehicle</th>
                <th className="py-3 px-6 text-left">License Plate</th>
                <th className="py-3 px-6 text-center">Action</th>
                <th className="py-3 px-6 text-center">Timestamp</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-200 text-sm font-light">
              {logs.map((log) => (
                <div className="bg-neutralLight dark:bg-black p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-textDark dark:text-white">Recent Logs</h2>
      {isMobile ? (
        <div>
          {logs.map(renderLogItem)}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-textDark rounded-lg">
            <thead>
              <tr className="w-full bg-neutralMedium dark:bg-textLight text-textLight dark:text-neutralMedium uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Vehicle</th>
                <th className="py-3 px-6 text-left">License Plate</th>
                <th className="py-3 px-6 text-center">Action</th>
                <th className="py-3 px-6 text-center">Timestamp</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-textLight dark:text-neutralLight text-sm font-light">
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-neutralMedium dark:border-textLight hover:bg-neutralLight dark:hover:bg-textLight">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="mr-2 text-2xl">
                        {getVehicleIcon(log.vehicle.vehicleType)}
                      </div>
                      <span className="font-medium">{log.vehicle.vehicleType}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span>{log.vehicle.licensePlate}</span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span className={`py-1 px-3 rounded-full text-xs ${log.action === 'entry' ? 'bg-primary text-white' : 'bg-accent2 text-white'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <button onClick={() => onEdit(log)} className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white hover:bg-accent1 mr-2">
                        <FiEdit />
                      </button>
                      <button onClick={() => openModal(log)} className="w-8 h-8 flex items-center justify-center rounded-full bg-accent2 text-white hover:bg-accent2">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedLog && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Confirm Deletion">
          <div className="p-4">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete the log for vehicle {selectedLog.vehicle.licensePlate}?</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button onClick={handleCloseModal} className="px-4 py-2 rounded-lg bg-neutralMedium hover:bg-neutralMedium">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded-lg bg-accent2 text-white hover:bg-accent2">Delete</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedLog && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Confirm Deletion">
          <div className="p-4">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete the log for vehicle {selectedLog.vehicle.licensePlate}?</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button onClick={handleCloseModal} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">Delete</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RecentLogs;