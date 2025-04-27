import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaHome, FaUserInjured, FaBell, FaCog } from 'react-icons/fa';

const Sidebar = () => {
  const router = useRouter();
  
  const menuItems = [
    { path: '/dashboard', icon: <FaHome className="w-5 h-5" />, label: 'Tableau de bord' },
    { path: '/patients', icon: <FaUserInjured className="w-5 h-5" />, label: 'Patients' },
    { path: '/alerts', icon: <FaBell className="w-5 h-5" />, label: 'Alertes' },
    { path: '/settings', icon: <FaCog className="w-5 h-5" />, label: 'Paramètres' },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return router.pathname === '/dashboard';
    }
    
    return router.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-full bg-blue-800 text-white">
      <div className="p-4 border-b border-blue-700">
        <h1 className="text-2xl font-bold">MediMonitor</h1>
      </div>
      
      <nav className="mt-8 flex-1">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="mb-2 px-4">
              <Link href={item.path} className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path) 
                    ? 'bg-blue-700 text-white' 
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }`}>
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 mt-auto text-xs text-blue-200">
        <p>© {new Date().getFullYear()} MediMonitor</p>
        <p>Version 1.0.0</p>
      </div>
    </div>
  );
};

export default Sidebar;