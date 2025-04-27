import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaThermometerHalf, FaHeartbeat, FaLungs } from 'react-icons/fa';

const RecentMeasurements = () => {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/measurements?limit=10', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // Pour chaque mesure, récupérer les informations du patient
          const measurementsWithPatients = await Promise.all(
            data.map(async (measurement) => {
              const patientRes = await fetch(`/api/patients/${measurement.patientId}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              
              if (patientRes.ok) {
                const patient = await patientRes.json();
                return {
                  ...measurement,
                  patient: {
                    nom: patient.nom,
                    prenom: patient.prenom
                  }
                };
              }
              
              return measurement;
            })
          );
          
          setMeasurements(measurementsWithPatients);
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

  // Formater l'heure au format HH:MM
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

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

  // Icône pour le type de mesure
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
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-medium">Mesures récentes</h2>
        <Link href="/measurements" legacyBehavior>
          <a className="text-sm text-blue-600 hover:text-blue-800">Voir toutes les mesures</a>
        </Link>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: '320px' }}>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : measurements.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Aucune mesure récente
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valeur</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {measurements.map(measurement => (
                <tr key={measurement._id} className={`hover:bg-gray-50 ${measurement.anomalie ? 'bg-red-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {measurement.patient 
                      ? `${measurement.patient.nom}, ${measurement.patient.prenom}`
                      : `Patient ID: ${measurement.patientId}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTime(measurement.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      {getMeasurementIcon(measurement.type)}
                      <span className="ml-2">{translateMeasurementType(measurement.type)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {measurement.valeur} {measurement.unite || ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RecentMeasurements;