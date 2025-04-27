import React from 'react';
import { FaUserInjured, FaBell, FaHeartbeat, FaChartLine } from 'react-icons/fa';

const StatsCard = ({ title, value, type, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    red: 'bg-red-100 text-red-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800'
  };
  
  const getIcon = () => {
    switch (type) {
      case 'patients':
        return <FaUserInjured className="w-5 h-5" />;
      case 'alerts':
        return <FaBell className="w-5 h-5" />;
      case 'critical':
        return <FaHeartbeat className="w-5 h-5" />;
      case 'measurements':
        return <FaChartLine className="w-5 h-5" />;
      default:
        return <FaChartLine className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex items-center">
        <div className={`${colorClasses[color]} p-3 rounded-full`}>
          {getIcon()}
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;