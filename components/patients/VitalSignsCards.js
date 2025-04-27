import React from 'react';
import { FaThermometerHalf, FaHeartbeat, FaLungs, FaTachometerAlt } from 'react-icons/fa';

const VitalSignsCards = ({ vitals }) => {
  // Vérifier la validité des signes vitaux
  const isTemperatureValid = (temp) => {
    if (!temp || temp < 35 || temp > 39) return false;
    return true;
  };
  
  const isHeartRateValid = (hr) => {
    if (!hr || hr < 60 || hr > 100) return false;
    return true;
  };
  
  const isO2SaturationValid = (o2) => {
    if (!o2 || o2 < 95) return false;
    return true;
  };
  
  const isBloodPressureValid = (bp) => {
    if (!bp) return false;
    const [systolic, diastolic] = bp.split('/').map(Number);
    if (systolic < 90 || systolic > 140 || diastolic < 60 || diastolic > 90) return false;
    return true;
  };
  
  // Obtenir la classe CSS en fonction de la validité
  const getStatusClass = (isValid) => {
    return isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Température */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${getStatusClass(isTemperatureValid(vitals.temperature))}`}>
              <FaThermometerHalf className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Température</p>
              <p className="text-lg font-semibold">
                {vitals.temperature ? `${vitals.temperature} °C` : 'N/A'}
              </p>
            </div>
          </div>
          <div className={`h-2 w-2 rounded-full ${isTemperatureValid(vitals.temperature) ? 'bg-green-500' : 'bg-red-500'}`}></div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {isTemperatureValid(vitals.temperature) 
            ? 'Normal' 
            : vitals.temperature 
              ? 'Anormal' 
              : 'Donnée manquante'}
        </div>
      </div>
      
      {/* Fréquence cardiaque */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${getStatusClass(isHeartRateValid(vitals.heartRate))}`}>
              <FaHeartbeat className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Fréquence cardiaque</p>
              <p className="text-lg font-semibold">
                {vitals.heartRate ? `${vitals.heartRate} bpm` : 'N/A'}
              </p>
            </div>
          </div>
          <div className={`h-2 w-2 rounded-full ${isHeartRateValid(vitals.heartRate) ? 'bg-green-500' : 'bg-red-500'}`}></div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {isHeartRateValid(vitals.heartRate) 
            ? 'Normal' 
            : vitals.heartRate 
              ? 'Anormal' 
              : 'Donnée manquante'}
        </div>
      </div>
      
      {/* Saturation en oxygène */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${getStatusClass(isO2SaturationValid(vitals.o2Saturation))}`}>
              <FaLungs className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Saturation O₂</p>
              <p className="text-lg font-semibold">
                {vitals.o2Saturation ? `${vitals.o2Saturation} %` : 'N/A'}
              </p>
            </div>
          </div>
          <div className={`h-2 w-2 rounded-full ${isO2SaturationValid(vitals.o2Saturation) ? 'bg-green-500' : 'bg-red-500'}`}></div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {isO2SaturationValid(vitals.o2Saturation) 
            ? 'Normal' 
            : vitals.o2Saturation 
              ? 'Anormal' 
              : 'Donnée manquante'}
        </div>
      </div>
      
      {/* Tension artérielle */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${getStatusClass(isBloodPressureValid(vitals.bloodPressure))}`}>
              <FaTachometerAlt className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tension artérielle</p>
              <p className="text-lg font-semibold">
                {vitals.bloodPressure || 'N/A'}
              </p>
            </div>
          </div>
          <div className={`h-2 w-2 rounded-full ${isBloodPressureValid(vitals.bloodPressure) ? 'bg-green-500' : 'bg-red-500'}`}></div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {isBloodPressureValid(vitals.bloodPressure) 
            ? 'Normal' 
            : vitals.bloodPressure 
              ? 'Anormal' 
              : 'Donnée manquante'}
        </div>
      </div>
    </div>
  );
};

export default VitalSignsCards;