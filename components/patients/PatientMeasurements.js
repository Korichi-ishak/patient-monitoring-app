import React, { useEffect, useState } from 'react';

const PatientMeasurements = ({ patientId }) => {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/measurements?patientId=${patientId}&limit=50`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setMeasurements(data);
        } else {
          console.error('Erreur lors de la récupération des mesures');
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchMeasurements();
    }
  }, [patientId]);

  // Traduire les types de mesures
  const translateMeasurementType = (type) => {
    const translations = {
      temperature: 'Température',
      frequenceCardiaque: 'Fréquence cardiaque',
      saturationOxygene: 'Saturation en O₂',
      tensionArterielle: 'Tension artérielle',
      respiratoire: 'Fréquence respiratoire',
      glucose: 'Glycémie'
    };
    
    return translations[type] || type;
  };

  // Formatage de la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  // Filtrer les mesures
  const filteredMeasurements = filter === 'all' 
    ? measurements 
    : filter === 'anomalies' 
      ? measurements.filter(m => m.anomalie)
      : measurements.filter(m => m.type === filter);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-medium mb-4">Historique des mesures</h2>
      
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'all' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter('anomalies')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'anomalies' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Anomalies
          </button>
          <button
            onClick={() => setFilter('temperature')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'temperature' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Température
          </button>
          <button
            onClick={() => setFilter('frequenceCardiaque')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'frequenceCardiaque' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Fréquence cardiaque
          </button>
          <button
            onClick={() => setFilter('saturationOxygene')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'saturationOxygene' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Saturation O₂
          </button>
          <button
            onClick={() => setFilter('tensionArterielle')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'tensionArterielle' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tension artérielle
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredMeasurements.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucune mesure correspondant aux critères
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valeur</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personnel</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commentaire</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMeasurements.map(measurement => (
                <tr key={measurement._id} className={measurement.anomalie ? 'bg-red-50' : 'hover:bg-gray-50'}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(measurement.timestamp)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {translateMeasurementType(measurement.type)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    {measurement.valeur} {measurement.unite || ''}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {measurement.personnel || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {measurement.anomalie ? (
                      <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">Anomalie</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">Normal</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {measurement.commentaire || '-'}
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

export default PatientMeasurements;