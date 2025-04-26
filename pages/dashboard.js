import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import PatientSummary from '../components/dashboard/PatientSummary';
import StatsCard from '../components/dashboard/StatsCard';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import RecentMeasurements from '../components/dashboard/RecentMeasurements';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeAlerts: 0,
    criticalPatients: 0,
    todayMeasurements: 0
  });
  
  const [criticalPatients, setCriticalPatients] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!storedUser || !token) {
      router.push('/login');
      return;
    }
    
    setUser(JSON.parse(storedUser));
    
    // Charger les statistiques
    const fetchDashboardData = async () => {
      try {
        // Récupérer les statistiques
        const fetchStats = async () => {
          // Total des patients
          const patientsRes = await fetch('/api/patients', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const patients = await patientsRes.json();
          
          // Total des alertes actives
          const alertsRes = await fetch('/api/alerts?status=nouvelle', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const alerts = await alertsRes.json();
          
          // Total des mesures d'aujourd'hui
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const measurementsRes = await fetch(`/api/measurements?since=${today.toISOString()}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const measurements = await measurementsRes.json();
          
          // Patients avec des alertes critiques
          const criticalAlertsRes = await fetch('/api/alerts?status=nouvelle&severite=haute', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const criticalAlerts = await criticalAlertsRes.json();
          
          // Nombre de patients uniques avec alertes critiques
          const criticalPatientIds = [...new Set(criticalAlerts.map(alert => alert.patientId))];
          
          // Mise à jour des statistiques
          setStats({
            totalPatients: patients.length,
            activeAlerts: alerts.length,
            criticalPatients: criticalPatientIds.length,
            todayMeasurements: measurements.length
          });
          
          // Récupérer les informations détaillées des patients critiques
          if (criticalPatientIds.length > 0) {
            const patientDetailsPromises = criticalPatientIds.map(async (patientId) => {
              const res = await fetch(`/api/patients/${patientId}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              
              if (res.ok) {
                const patient = await res.json();
                
                // Récupérer les dernières mesures vitales
                const vitalsRes = await fetch(`/api/measurements?patientId=${patientId}&limit=10`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                const vitals = await vitalsRes.json();
                
                // Extraire les dernières mesures par type
                const latestVitals = {};
                vitals.forEach(vital => {
                  if (!latestVitals[vital.type] || new Date(vital.timestamp) > new Date(latestVitals[vital.type].timestamp)) {
                    latestVitals[vital.type] = vital;
                  }
                });
                
                return {
                  ...patient,
                  vitals: {
                    temperature: latestVitals.temperature?.valeur || null,
                    heartRate: latestVitals.frequenceCardiaque?.valeur || null,
                    bloodPressure: latestVitals.tensionArterielle?.valeur || null,
                    o2Saturation: latestVitals.saturationOxygene?.valeur || null
                  },
                  status: 'danger'
                };
              }
              return null;
            });
            
            const patientDetails = await Promise.all(patientDetailsPromises);
            setCriticalPatients(patientDetails.filter(Boolean));
          }
        };
        
        await fetchStats();
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données du tableau de bord:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [router]);

  return (
    <Layout title="Tableau de bord - MediMonitor">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Bonjour, Dr. {user?.prenom} {user?.nom}
        </h1>
        <p className="text-gray-600">Voici un aperçu de vos patients aujourd'hui</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard 
              title="Total patients" 
              value={stats.totalPatients} 
              icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              color="blue"
            />
            <StatsCard 
              title="Alertes actives" 
              value={stats.activeAlerts} 
              icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              color="yellow"
            />
            <StatsCard 
              title="Patients critiques" 
              value={stats.criticalPatients} 
              icon="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              color="red"
            />
            <StatsCard 
              title="Mesures aujourd'hui" 
              value={stats.todayMeasurements} 
              icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              color="green"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <RecentAlerts />
            <RecentMeasurements />
          </div>

          {criticalPatients.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium mb-4">Patients nécessitant une attention</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {criticalPatients.map((patient) => (
                  <PatientSummary 
                    key={patient._id}
                    id={patient._id}
                    name={`${patient.nom}, ${patient.prenom}`}
                    age={new Date().getFullYear() - new Date(patient.dateNaissance).getFullYear()}
                    room={patient.chambre || 'Non assigné'}
                    vitals={patient.vitals}
                    status={patient.status}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}