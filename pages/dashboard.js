import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { FaUserInjured, FaBell, FaHeartbeat, FaChartLine, FaUserMd, FaSearch, FaBars, FaSignOutAlt } from 'react-icons/fa';

// Composants de tableau de bord
import PatientSummary from '../components/dashboard/PatientSummary';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import RecentMeasurements from '../components/dashboard/RecentMeasurements';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Stats du tableau de bord
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeAlerts: 0,
    criticalPatients: 0,
    todayMeasurements: 0
  });

  // Patients critiques
  const [criticalPatients, setCriticalPatients] = useState([]);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (!storedUser || !token) {
        router.push('/login');
        return false;
      }
      
      setUser(JSON.parse(storedUser));
      return true;
    };

    const isAuthenticated = checkAuth();
    
    if (isAuthenticated) {
      // Charger les données du tableau de bord
      fetchDashboardData();
    }
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Simulons la récupération des données pour la démo
      // Dans une application réelle, vous feriez des appels API ici
      
      // Attendre un peu pour simuler une requête asynchrone
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Définir les données fictives pour la démo
      setStats({
        totalPatients: 24,
        activeAlerts: 3,
        criticalPatients: 2,
        todayMeasurements: 78
      });
      
      // Données de patients critiques fictives
      setCriticalPatients([
        {
          id: '1',
          name: 'Dupont, Marie',
          age: 67,
          room: '304',
          vitals: {
            temperature: 38.9,
            heartRate: 110,
            bloodPressure: '160/95',
            o2Saturation: 92
          },
          status: 'danger'
        },
        {
          id: '2',
          name: 'Martin, Jean',
          age: 78,
          room: '212',
          vitals: {
            temperature: 37.2,
            heartRate: 55,
            bloodPressure: '100/65',
            o2Saturation: 90
          },
          status: 'danger'
        }
      ]);
      
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Tableau de bord - MediMonitor</title>
      </Head>

      {/* Barre latérale mobile */}
      <div 
        className={`fixed inset-0 z-40 bg-black bg-opacity-60 transition-opacity md:hidden ${
          sidebarOpen ? 'opacity-100 ease-out duration-300' : 'opacity-0 ease-in duration-200 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-blue-700 transition transform ease-in-out duration-300 md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 bg-blue-800 border-b border-blue-600">
            <h1 className="text-white text-2xl font-bold">MediMonitor</h1>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            <Link href="/dashboard" 
                  className="flex items-center px-4 py-3 text-white bg-blue-800 rounded-md">
              <FaChartLine className="mr-3 h-5 w-5" />
              <span>Tableau de bord</span>
            </Link>
            
            <Link href="/patients" 
                  className="flex items-center px-4 py-3 text-blue-100 hover:bg-blue-600 rounded-md">
              <FaUserInjured className="mr-3 h-5 w-5" />
              <span>Patients</span>
            </Link>
            
            <Link href="/alerts" 
                  className="flex items-center px-4 py-3 text-blue-100 hover:bg-blue-600 rounded-md">
              <FaBell className="mr-3 h-5 w-5" />
              <span>Alertes</span>
            </Link>

            <Link href="/settings" 
                  className="flex items-center px-4 py-3 text-blue-100 hover:bg-blue-600 rounded-md">
              <FaUserMd className="mr-3 h-5 w-5" />
              <span>Paramètres</span>
            </Link>
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-blue-600 text-sm text-blue-300">
            <p>© {new Date().getFullYear()} MediMonitor</p>
            <p>Version 1.0.0</p>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* En-tête */}
        <header className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <button
                className="md:hidden mr-4 text-gray-600"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <FaBars className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-medium text-gray-800">Tableau de bord</h2>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Barre de recherche */}
              <div className="hidden md:block relative">
                <input
                  type="text"
                  placeholder="Rechercher un patient..."
                  className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <FaSearch className="h-4 w-4" />
                </div>
              </div>
              
              {/* Informations utilisateur */}
              {user && (
                <div className="flex items-center">
                  <div className="hidden md:block mr-4">
                    <div className="text-sm font-medium text-gray-700">Dr. {user.prenom} {user.nom}</div>
                    <div className="text-xs text-gray-500">{user.specialite || 'Médecin'}</div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none"
                    title="Déconnexion"
                  >
                    <FaSignOutAlt className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Contenu */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Bonjour, Dr. {user?.prenom} {user?.nom}
            </h1>
            <p className="text-gray-600 mt-1">
              Voici un aperçu de vos patients aujourd'hui
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Widgets de statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total patients */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 rounded-md bg-blue-100 p-3">
                        <FaUserInjured className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-5">
                        <h3 className="text-sm font-medium text-gray-500">Total patients</h3>
                        <div className="mt-1 flex items-baseline">
                          <p className="text-2xl font-semibold text-gray-900">{stats.totalPatients}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 px-5 py-2">
                    <Link href="/patients" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      Voir tous les patients
                    </Link>
                  </div>
                </div>

                {/* Alertes actives */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 rounded-md bg-yellow-100 p-3">
                        <FaBell className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-5">
                        <h3 className="text-sm font-medium text-gray-500">Alertes actives</h3>
                        <div className="mt-1 flex items-baseline">
                          <p className="text-2xl font-semibold text-gray-900">{stats.activeAlerts}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 px-5 py-2">
                    <Link href="/alerts" className="text-sm font-medium text-yellow-600 hover:text-yellow-800">
                      Voir toutes les alertes
                    </Link>
                  </div>
                </div>

                {/* Patients critiques */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 rounded-md bg-red-100 p-3">
                        <FaHeartbeat className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="ml-5">
                        <h3 className="text-sm font-medium text-gray-500">Patients critiques</h3>
                        <div className="mt-1 flex items-baseline">
                          <p className="text-2xl font-semibold text-gray-900">{stats.criticalPatients}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-50 px-5 py-2">
                    <a href="#critical-patients" className="text-sm font-medium text-red-600 hover:text-red-800">
                      Voir les patients critiques
                    </a>
                  </div>
                </div>

                {/* Mesures aujourd'hui */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 rounded-md bg-green-100 p-3">
                        <FaChartLine className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-5">
                        <h3 className="text-sm font-medium text-gray-500">Mesures aujourd'hui</h3>
                        <div className="mt-1 flex items-baseline">
                          <p className="text-2xl font-semibold text-gray-900">{stats.todayMeasurements}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 px-5 py-2">
                    <Link href="/measurements" className="text-sm font-medium text-green-600 hover:text-green-800">
                      Voir toutes les mesures
                    </Link>
                  </div>
                </div>
              </div>

              {/* Widgets d'alertes récentes et mesures récentes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Alertes récentes */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">Alertes récentes</h2>
                    <Link href="/alerts" className="text-sm text-blue-600 hover:text-blue-800">
                      Voir toutes les alertes
                    </Link>
                  </div>
                  <div className="p-6">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FaBell className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            <span className="font-medium">Dupont, Marie</span> - Température élevée: 38.9°C
                          </p>
                          <p className="text-xs text-yellow-600 mt-1">Il y a 25 min</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FaBell className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">
                            <span className="font-medium">Martin, Jean</span> - Saturation d'oxygène basse: 90%
                          </p>
                          <p className="text-xs text-red-600 mt-1">Il y a 42 min</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FaBell className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            <span className="font-medium">Dubois, Sophie</span> - Tension artérielle élevée: 160/95 mmHg
                          </p>
                          <p className="text-xs text-yellow-600 mt-1">Il y a 1h</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Mesures récentes */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">Mesures récentes</h2>
                    <Link href="/measurements" className="text-sm text-blue-600 hover:text-blue-800">
                      Voir toutes les mesures
                    </Link>
                  </div>
                  <div className="px-6 py-4">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                          <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valeur</th>
                          <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Dupont, Marie</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">Température</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">38.9 °C</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">10:15</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Martin, Jean</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">O₂ Saturation</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">90 %</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">10:02</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Petit, Thomas</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">Fréq. cardiaque</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">72 bpm</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">09:47</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Dubois, Sophie</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">Tension art.</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">160/95 mmHg</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">09:35</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Lefebvre, Alice</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">Température</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">37.1 °C</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">09:28</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              {/* Patients critiques */}
              <div id="critical-patients" className="bg-white rounded-lg shadow overflow-hidden mb-8">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-medium text-gray-900">Patients nécessitant une attention</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {criticalPatients.map((patient) => (
                      <div key={patient.id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="border-b px-4 py-3 flex justify-between items-center">
                          <div>
                            <h3 className="font-medium text-gray-900">{patient.name}</h3>
                            <div className="text-sm text-gray-500">
                              {patient.age} ans • Chambre {patient.room}
                            </div>
                          </div>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Critique
                          </span>
                        </div>
                        
                        <div className="p-4">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500">Temp:</span> {patient.vitals.temperature}°C
                            </div>
                            <div>
                              <span className="text-gray-500">FC:</span> {patient.vitals.heartRate} bpm
                            </div>
                            <div>
                              <span className="text-gray-500">TA:</span> {patient.vitals.bloodPressure} mmHg
                            </div>
                            <div>
                              <span className="text-gray-500">SpO2:</span> {patient.vitals.o2Saturation}%
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                              Voir le dossier
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} MediMonitor. Tous droits réservés.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}