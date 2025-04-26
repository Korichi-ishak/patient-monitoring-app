import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import PatientSummary from '../components/dashboard/PatientSummary';
import StatsCard from '../components/dashboard/StatsCard';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import RecentMeasurements from '../components/dashboard/RecentMeasurements';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeAlerts: 0,
    criticalPatients: 0,
    todayMeasurements: 0
  });
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setStats({
        totalPatients: 154,
        activeAlerts: 8,
        criticalPatients: 3,
        todayMeasurements: 78
      });
      setLoading(false);
    }, 1000);
    
    // Plus tard, nous implémenterons le vrai appel API ici
  }, []);

  return (
    <Layout title="Tableau de bord - MediMonitor">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Bonjour, Dr. Dupont</h1>
        <p className="text-gray-600">Voici un aperçu de vos patients aujourd'hui</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader">Chargement...</div>
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

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Patients nécessitant une attention</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <PatientSummary 
                name="Martin, Robert" 
                age={67} 
                room="312"
                vitals={{
                  temperature: 38.6,
                  heartRate: 94,
                  bloodPressure: "145/90",
                  o2Saturation: 93
                }}
                status="warning"
              />
              <PatientSummary 
                name="Dubois, Marie" 
                age={72} 
                room="208"
                vitals={{
                  temperature: 38.1,
                  heartRate: 102,
                  bloodPressure: "165/95",
                  o2Saturation: 91
                }}
                status="danger"
              />
              <PatientSummary 
                name="Petit, Jean" 
                age={58} 
                room="115"
                vitals={{
                  temperature: 37.2,
                  heartRate: 88,
                  bloodPressure: "140/85",
                  o2Saturation: 94
                }}
                status="warning"
              />
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}