import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiLogOut, FiSettings, FiChevronsLeft, FiChevronsRight, FiUser } from 'react-icons/fi';
import * as Tooltip from '@radix-ui/react-tooltip';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Tooltip.Provider>
      <aside
        className={`relative bg-gray-900 text-gray-100 transition-all duration-300 ease-in-out flex flex-col ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="p-4 flex items-center justify-center h-16">
          <h1 className={`text-xl font-bold text-white transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'opacity-100'}`}>
            VehicleLog
          </h1>
        </div>
        <nav className="mt-10 flex-grow">
          <ul>
            <SidebarItem
              to="/"
              icon={<FiHome size={24} />}
              text="Dashboard"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              to="/vehicle-logs"
              icon={<FiLogOut size={24} />}
              text="Vehicle Logs"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              to="/settings"
              icon={<FiSettings size={24} />}
              text="Settings"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              to="/account"
              icon={<FiUser size={24} />}
              text="My Account"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              to="/logout"
              icon={<FiLogOut size={24} />}
              text="Logout"
              isCollapsed={isCollapsed}
            />
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={toggleSidebar} className="p-3 rounded-md hover:bg-gray-700 text-white w-full flex items-center justify-center">
            {isCollapsed ? <FiChevronsRight size={24} /> : <FiChevronsLeft size={24} />}
          </button>
        </div>
      </aside>
    </Tooltip.Provider>
  );
};

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  isCollapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, text, isCollapsed }) => {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <li className="mx-2 my-1">
          <NavLink
            to={to}
            className={({ isActive }) =>
              `
              flex items-center p-3 rounded-lg cursor-pointer
              transition-colors duration-200
              ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
              ${isCollapsed ? 'justify-center' : ''}
            `
            }
          >
            <div className="flex-shrink-0">{icon}</div>
            <span
              className={`whitespace-nowrap transition-all duration-300 ${
                isCollapsed ? 'w-0 ml-0 opacity-0' : 'ml-4 opacity-100'
              }`}
            >
              {text}
            </span>
          </NavLink>
        </li>
      </Tooltip.Trigger>
      {isCollapsed && (
        <Tooltip.Portal>
          <Tooltip.Content
            side="right"
            sideOffset={5}
            className="bg-gray-800 text-white text-sm rounded-md px-3 py-1.5 shadow-lg"
          >
            {text}
            <Tooltip.Arrow className="fill-current text-gray-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      )}
    </Tooltip.Root>
  );
};

export default Sidebar;