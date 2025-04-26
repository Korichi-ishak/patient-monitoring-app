import React, { useEffect, useState } from 'react';

const PatientAlerts = ({ patientId }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/alerts?patientId=${patientId}`, {
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

    if (patientId) {
      fetchAlerts();
    }
  }, [patientId]);

  const severityClasses = {
    basse: "bg-yellow-100 text-yellow-800",
    moyenne: "bg-orange-100 text-orange-800",
    haute: "bg-red-100 text-red-800",
    critique: "bg-red-100 text-red-800"
  };

  const statusClasses = {
    nouvelle: "bg-blue-100 text-blue-800",
    vue: "bg-gray-100 text-gray-800",
    resolue: "bg-green-100 text-green-800"
  };

  // Formatage de la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  // Mise à jour du statut d'une alerte
  const updateAlertStatus = async (alertId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          accuseReception: {
            personnel: JSON.parse(localStorage.getItem('user')).id,
            timestamp: new Date()
          }
        })
      });
      
      if (response.ok) {
        // Mettre à jour la liste des alertes
        setAlerts(alerts.map(alert => {
          if (alert._id === alertId) {
            return { ...alert, status: newStatus };
          }
          return alert;
        }));
      } else {
        console.error('Erreur lors de la mise à jour de l\'alerte');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-medium mb-4">Alertes du patient</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucune alerte pour ce patient
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sévérité</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alerts.map(alert => (
                <tr key={alert._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(alert.timestamp)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {alert.type}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {alert.description}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${severityClasses[alert.severite]}`}>
                      {alert.severite === 'basse' ? 'Basse' : 
                        alert.severite === 'moyenne' ? 'Moyenne' : 
                        alert.severite === 'haute' ? 'Haute' : 'Critique'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${statusClasses[alert.status]}`}>
                      {alert.status === 'nouvelle' ? 'Nouvelle' : 
                        alert.status === 'vue' ? 'Vue' : 'Résolue'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {alert.status === 'nouvelle' && (
                      <button
                        onClick={() => updateAlertStatus(alert._id, 'vue')}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        Marquer vue
                      </button>
                    )}
                    {(alert.status === 'nouvelle' || alert.status === 'vue') && (
                      <button
                        onClick={() => updateAlertStatus(alert._id, 'resolue')}
                        className="text-green-600 hover:text-green-800"
                      >
                        Résoudre
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientAlerts;