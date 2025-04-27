import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import { FaUserInjured, FaBell, FaHeartbeat, FaChartLine, FaEye } from 'react-icons/fa';
import StatsCard from '../components/dashboard/StatsCard';
import PatientSummary from '../components/dashboard/PatientSummary';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import RecentMeasurements from '../components/dashboard/RecentMeasurements';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeAlerts: 0,
    criticalPatients: 0,
    todayMeasurements: 0
  });
  const [criticalPatients, setCriticalPatients] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [recentMeasurements, setRecentMeasurements] = useState([]);
  const [error, setError] = useState('');

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
      fetchDashboardData();
    }
  }, [router]);

  // Fonction pour récupérer les données du tableau de bord
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      
      // Requêtes parallèles pour optimiser le chargement
      const [patientsResponse, alertsResponse, measurementsResponse] = await Promise.all([
        fetch('/api/patients', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/alerts?status=nouvelle', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/measurements?limit=10', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      // Vérifier les réponses
      if (!patientsResponse.ok || !alertsResponse.ok || !measurementsResponse.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }
      
      // Récupérer les données des réponses
      const patients = await patientsResponse.json();
      const alerts = await alertsResponse.json();
      const measurements = await measurementsResponse.json();
      
      // Identifier les patients critiques (ceux avec des alertes actives)
      const patientIdsWithAlerts = [...new Set(alerts.map(alert => alert.patientId._id || alert.patientId))];
      const critical = patients.filter(patient => patientIdsWithAlerts.includes(patient._id));
      
      // Compter les mesures d'aujourd'hui
      const today = new Date().toISOString().split('T')[0];
      const todayMeasurements = measurements.filter(m => {
        const measureDate = new Date(m.timestamp).toISOString().split('T')[0];
        return measureDate === today;
      });
      
      // Mettre à jour les statistiques
      setStats({
        totalPatients: patients.length,
        activeAlerts: alerts.length,
        criticalPatients: critical.length,
        todayMeasurements: todayMeasurements.length
      });
      
      // Récupérer les données des patients critiques
      if (critical.length > 0) {
        const criticalData = await Promise.all(
          critical.slice(0, 2).map(async patient => {
            // Récupérer les dernières mesures pour chaque patient critique
            const vitalsResponse = await fetch(`/api/measurements?patientId=${patient._id}&limit=5`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            if (!vitalsResponse.ok) {
              return {
                id: patient._id,
                name: `${patient.nom}, ${patient.prenom}`,
                age: calculateAge(patient.dateNaissance),
                room: patient.chambre || 'N/A',
                vitals: {
                  temperature: 'N/A',
                  heartRate: 'N/A',
                  bloodPressure: 'N/A',
                  o2Saturation: 'N/A'
                },
                status: 'danger'
              };
            }
            
            const vitals = await vitalsResponse.json();
            
            // Extraire les valeurs vitales
            const temperature = vitals.find(v => v.type === 'temperature');
            const heartRate = vitals.find(v => v.type === 'frequenceCardiaque');
            const bloodPressure = vitals.find(v => v.type === 'tensionArterielle');
            const o2Saturation = vitals.find(v => v.type === 'saturationOxygene');
            
            return {
              id: patient._id,
              name: `${patient.nom}, ${patient.prenom}`,
              age: calculateAge(patient.dateNaissance),
              room: patient.chambre || 'N/A',
              vitals: {
                temperature: temperature ? temperature.valeur : 'N/A',
                heartRate: heartRate ? heartRate.valeur : 'N/A',
                bloodPressure: bloodPressure ? bloodPressure.valeur : 'N/A',
                o2Saturation: o2Saturation ? o2Saturation.valeur : 'N/A'
              },
              status: 'danger'
            };
          })
        );
        
        setCriticalPatients(criticalData);
      }
      
      // Mise à jour des alertes récentes
      setRecentAlerts(alerts.slice(0, 5));
      
      // Mise à jour des mesures récentes
      setRecentMeasurements(measurements.slice(0, 5));
      
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setError('Erreur lors de la récupération des données. Veuillez réessayer.');
      setLoading(false);
    }
  };

  // Fonction de rafraîchissement périodique des données
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (user) {
        fetchDashboardData();
      }
    }, 60000); // Rafraîchissement toutes les 60 secondes
    
    return () => clearInterval(intervalId);
  }, [user]);

  // Calculer l'âge à partir de la date de naissance
  const calculateAge = (dateNaissance) => {
    if (!dateNaissance) return 'N/A';
    
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Formatage de la date relative
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `Il y a ${diffDays}j`;
  };

  return (
    <Layout title="Tableau de bord - MediMonitor">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Bonjour, Dr. {user?.prenom} {user?.nom}
        </h1>
        <p className="text-gray-600 mt-1">
          Voici un aperçu de vos patients aujourd'hui
        </p>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button 
                onClick={fetchDashboardData}
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Widgets de statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="Total patients"
              value={stats.totalPatients}
              type="patients"
              color="blue"
            />
            <StatsCard 
              title="Alertes actives"
              value={stats.activeAlerts}
              type="alerts"
              color="yellow"
            />
            <StatsCard 
              title="Patients critiques"
              value={stats.criticalPatients}
              type="critical"
              color="red"
            />
            <StatsCard 
              title="Mesures aujourd'hui"
              value={stats.todayMeasurements}
              type="measurements"
              color="green"
            />
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
                {recentAlerts.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    Aucune alerte active
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentAlerts.map(alert => (
                      <div key={alert._id} className={`border-l-4 p-4 rounded ${
                        alert.severite === 'haute' || alert.severite === 'critique' 
                          ? 'bg-red-50 border-red-400' 
                          : alert.severite === 'moyenne'
                            ? 'bg-orange-50 border-orange-400'
                            : 'bg-yellow-50 border-yellow-400'
                      }`}>
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <FaBell className={`h-5 w-5 ${
                              alert.severite === 'haute' || alert.severite === 'critique' 
                                ? 'text-red-400' 
                                : alert.severite === 'moyenne'
                                  ? 'text-orange-400'
                                  : 'text-yellow-400'
                            }`} />
                          </div>
                          <div className="ml-3 flex-1">
                            <p className={`text-sm ${
                              alert.severite === 'haute' || alert.severite === 'critique' 
                                ? 'text-red-700' 
                                : alert.severite === 'moyenne'
                                  ? 'text-orange-700'
                                  : 'text-yellow-700'
                            }`}>
                              <span className="font-medium">
                                {alert.patientId.nom}, {alert.patientId.prenom}
                              </span> - {alert.description}
                            </p>
                            <div className="mt-1 flex justify-between items-center">
                              <p className="text-xs text-gray-600">
                                {formatRelativeTime(alert.timestamp)}
                              </p>
                              <Link 
                                href={`/patients/${alert.patientId._id || alert.patientId}`}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                              >
                                <FaEye className="mr-1 h-4 w-4" />
                                Voir patient
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                {recentMeasurements.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    Aucune mesure récente
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valeur</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentMeasurements.map(measurement => (
                        <tr key={measurement._id} className={measurement.anomalie ? 'bg-red-50' : ''}>
                          <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            <Link 
                              href={`/patients/${measurement.patientId}`}
                              className="hover:text-blue-600"
                            >
                              {measurement.patientId.nom}, {measurement.patientId.prenom}
                            </Link>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                            {measurement.type === 'temperature' ? 'Température' :
                             measurement.type === 'frequenceCardiaque' ? 'Fréq. cardiaque' :
                             measurement.type === 'saturationOxygene' ? 'Saturation O₂' :
                             measurement.type === 'tensionArterielle' ? 'Tension art.' :
                             measurement.type === 'respiratoire' ? 'Fréq. resp.' :
                             measurement.type === 'glucose' ? 'Glycémie' :
                             measurement.type}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                            {measurement.valeur} {measurement.unite || ''}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                            {new Date(measurement.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
          
          {/* Patients critiques */}
          <div id="critical-patients" className="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-medium text-gray-900">Patients nécessitant une attention</h2>
            </div>
            <div className="p-6">
              {criticalPatients.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  Aucun patient critique actuellement
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {criticalPatients.map((patient) => (
                    <PatientSummary 
                      key={patient.id}
                      name={patient.name}
                      age={patient.age}
                      room={patient.room}
                      vitals={patient.vitals}
                      status="danger"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}