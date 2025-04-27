import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Sidebar from './Sidebar';
import Header from './Header';
import { useRouter } from 'next/router';

const Layout = ({ children, title = 'Monitoring Patients' }) => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!storedUser || !token) {
      // Ne pas rediriger si on est déjà sur la page d'accueil ou de connexion
      if (router.pathname !== '/' && router.pathname !== '/login' && router.pathname !== '/register') {
        router.push('/login');
      }
      return;
    }
    
    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      console.error('Erreur lors du parsing des données utilisateur:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, [router]);

  // Ne pas afficher la mise en page pour les pages publiques
  if (router.pathname === '/' || router.pathname === '/login' || router.pathname === '/register') {
    return children;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>{title}</title>
      </Head>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar mobile - backdrop */}
        <div 
          className={`fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity md:hidden ${
            sidebarOpen ? 'opacity-100 ease-out duration-300' : 'opacity-0 ease-in duration-200 pointer-events-none'
          }`}
          onClick={() => setSidebarOpen(false)}
        ></div>
        
        {/* Sidebar mobile */}
        <div className={`fixed inset-y-0 left-0 z-40 w-64 transition transform md:hidden ${
          sidebarOpen ? 'translate-x-0 ease-out duration-300' : '-translate-x-full ease-in duration-200'
        }`}>
          <div className="h-full flex flex-col bg-blue-800 text-white">
            <Sidebar />
          </div>
        </div>
        
        {/* Sidebar desktop */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <Sidebar />
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header user={user} onMenuButtonClick={() => setSidebarOpen(true)} />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;