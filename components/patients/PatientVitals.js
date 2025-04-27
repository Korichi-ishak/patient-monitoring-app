import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaThermometerHalf, FaHeartbeat, FaLungs, FaTachometerAlt } from 'react-icons/fa';

const PatientVitals = ({ patientId }) => {
  const [vitalsData, setVitalsData] = useState({
    temperature: [],
    frequenceCardiaque: [],
    saturationOxygene: [],
    tensionArterielle: []
  });
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('temperature');

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const types = ['temperature', 'frequenceCardiaque', 'saturationOxygene', 'tensionArterielle'];
        const promises = types.map(type => 
          fetch(`/api/measurements?patientId=${patientId}&type=${type}&limit=30`, {
            headers: { Authorization: `Bearer ${token}` }
          }).then(res => res.json())
        );
        
        const results = await Promise.all(promises);
        
        const formattedData = {
          temperature: formatChartData(results[0], '°C'),
          frequenceCardiaque: formatChartData(results[1], 'bpm'),
          saturationOxygene: formatChartData(results[2], '%'),
          tensionArterielle: formatChartData(results[3], 'mmHg')
        };
        
        setVitalsData(formattedData);
      } catch (error) {
        console.error('Erreur lors de la récupération des signes vitaux:', error);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchVitals();
    }
  }, [patientId]);

  // Formater les données pour le graphique
  const formatChartData = (data, unit) => {
    return data.map(item => ({
      date: new Date(item.timestamp).toLocaleDateString('fr-FR'),
      time: new Date(item.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      value: item.valeur,
      unit: unit,
      anomalie: item.anomalie
    })).reverse(); // Inverser pour avoir l'ordre chronologique
  };

  // Traduire les types de signes vitaux
  const translateVitalType = (type) => {
    const translations = {
      temperature: 'Température',
      frequenceCardiaque: 'Fréquence cardiaque',
      saturationOxygene: 'Saturation en oxygène',
      tensionArterielle: 'Tension artérielle'
    };
    
    return translations[type] || type;
  };

  // Obtenir l'icône appropriée
  const getVitalIcon = (type) => {
    switch (type) {
      case 'temperature':
        return <FaThermometerHalf className="w-5 h-5" />;
      case 'frequenceCardiaque':
        return <FaHeartbeat className="w-5 h-5" />;
      case 'saturationOxygene':
        return <FaLungs className="w-5 h-5" />;
      case 'tensionArterielle':
        return <FaTachometerAlt className="w-5 h-5" />;
      default:
        return null;
    }
  };

  // Obtenir l'unité appropriée
  const getUnit = (type) => {
    const units = {
      temperature: '°C',
      frequenceCardiaque: 'bpm',
      saturationOxygene: '%',
      tensionArterielle: 'mmHg'
    };
    
    return units[type] || '';
  };

  // Formater la date pour l'affichage dans le tooltip
  const formatDateForTooltip = (date, time) => {
    return `${date} ${time}`;
  };

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow rounded border">
          <p className="text-sm font-medium">{formatDateForTooltip(label, payload[0].payload.time)}</p>
          <p className="text-sm text-gray-600">
            {`${translateVitalType(activeChart)}: ${payload[0].value} ${payload[0].payload.unit}`}
          </p>
          {payload[0].payload.anomalie && (
            <p className="text-sm text-red-600 font-medium">Anomalie détectée</p>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-medium mb-4">Signes vitaux</h2>
      
      <div className="mb-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {Object.keys(vitalsData).map(type => (
            <button
              key={type}
              onClick={() => setActiveChart(type)}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                activeChart === type 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{getVitalIcon(type)}</span>
              {translateVitalType(type)}
            </button>
          ))}
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : vitalsData[activeChart].length === 0 ? (
        <div className="flex justify-center items-center h-64 text-gray-500">
          Aucune donnée disponible pour ce signe vital
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={vitalsData[activeChart]} margin={{ top: 5, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis 
                label={{ 
                  value: getUnit(activeChart), 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' } 
                }} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value"
                name={translateVitalType(activeChart)}
                stroke="#2563EB" 
                strokeWidth={2}
                dot={{ fill: '#2563EB', r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      
      <div className="mt-4">
        <h3 className="text-md font-medium mb-2">Dernières mesures</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valeur</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vitalsData[activeChart].slice(0, 5).map((item, index) => (
                <tr key={index} className={item.anomalie ? 'bg-red-50' : ''}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{item.date} {item.time}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{item.value} {item.unit}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    {item.anomalie ? (
                      <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">Anomalie</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">Normal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientVitals;