import React from 'react';
import { useRouter } from 'next/router';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';

const Header = ({ user, onMenuButtonClick }) => {
  const router = useRouter();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Déterminer le titre de la page
  const getPageTitle = () => {
    const path = router.pathname;
    
    if (path === '/dashboard') return 'Tableau de bord';
    if (path === '/patients') return 'Patients';
    if (path.startsWith('/patients/')) return 'Détails du patient';
    if (path === '/alerts') return 'Alertes';
    if (path === '/settings') return 'Paramètres';
    
    return '';
  };

  return (
    <header className="bg-white shadow z-10">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            className="md:hidden mr-2 text-gray-600"
            onClick={onMenuButtonClick}
          >
            <FaBars className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-medium">
            {getPageTitle()}
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <div className="hidden md:block">
                <span className="text-sm font-medium mr-1">Dr. {user.prenom} {user.nom}</span>
                {user.specialite && (
                  <span className="text-xs text-gray-500">({user.specialite})</span>
                )}
              </div>
              
              <div className="relative">
                <button 
                  onClick={handleLogout}
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none"
                  title="Déconnexion"
                >
                  <FaSignOutAlt className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
