import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const RecentAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/alerts?status=nouvelle&limit=5', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setAlerts(data);
        } else {
          console.error('Erreur lors de la récupération des alertes');
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const severityClasses = {
    basse: "bg-yellow-100 text-yellow-800",
    moyenne: "bg-orange-100 text-orange-800",
    haute: "bg-red-100 text-red-800"
  };

  // Format relatif du temps (il y a X minutes/heures)
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
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-medium">Alertes récentes</h2>
        <Link href="/alerts" legacyBehavior>
          <a className="text-sm text-blue-600 hover:text-blue-800">Voir toutes les alertes</a>
        </Link>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: '320px' }}>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Aucune alerte récente
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {alerts.map(alert => (
              <li key={alert._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 rounded-full w-2 h-2 mt-2 ${
                    severityClasses[alert.severite]
                  }`}></div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">
                        {alert.patientId.nom}, {alert.patientId.prenom}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatRelativeTime(alert.timestamp)}
                      </p>
                    </div>
                    <div className="mt-1 flex items-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        severityClasses[alert.severite]
                      }`}>
                        {alert.type}
                      </span>
                      <span className="ml-2 text-sm text-gray-700">{alert.description}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecentAlerts;