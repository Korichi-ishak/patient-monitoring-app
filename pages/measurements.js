import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { FaThermometerHalf, FaHeartbeat, FaLungs } from 'react-icons/fa';

const Measurements = () => {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/measurements', {
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

    fetchMeasurements();
  }, []);

  const getMeasurementIcon = (type) => {
    switch (type) {
      case 'temperature':
        return <FaThermometerHalf className="w-4 h-4 text-blue-500" />;
      case 'frequenceCardiaque':
        return <FaHeartbeat className="w-4 h-4 text-red-500" />;
      case 'saturationOxygene':
      case 'respiratoire':
        return <FaLungs className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <Layout title="Mesures - MediMonitor">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Toutes les mesures</h1>
        <p className="text-gray-600 mt-1">Consultez les mesures enregistrées pour vos patients</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : measurements.length === 0 ? (
        <div className="text-center py-6 text-gray-500">Aucune mesure disponible</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valeur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {measurements.map((measurement) => (
              <tr key={measurement._id} className={measurement.anomalie ? 'bg-red-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {measurement.patientId.nom}, {measurement.patientId.prenom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {measurement.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {measurement.valeur} {measurement.unite || ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(measurement.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
};

export default Measurements;