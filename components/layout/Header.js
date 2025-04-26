import React from 'react';
import { useRouter } from 'next/router';

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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
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
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
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