import React from 'react';
import Link from 'next/link';

const PatientSummary = ({ name, age, room, vitals, status }) => {
  const statusClasses = {
    normal: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="border-b px-4 py-3 flex justify-between items-center">
        <div>
          <h3 className="font-medium">{name}</h3>
          <div className="text-sm text-gray-500">
            {age} ans • Chambre {room}
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
          {status === 'danger' ? 'Critique' : status === 'warning' ? 'Attention' : 'Normal'}
        </span>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Temp:</span> {vitals.temperature}°C
          </div>
          <div>
            <span className="text-gray-500">FC:</span> {vitals.heartRate} bpm
          </div>
          <div>
            <span className="text-gray-500">TA:</span> {vitals.bloodPressure} mmHg
          </div>
          <div>
            <span className="text-gray-500">SpO2:</span> {vitals.o2Saturation}%
          </div>
        </div>
        
        <div className="mt-4">
          <Link href={`/patients/details?id=${name.split(',')[1].trim()}-${name.split(',')[0].trim()}`}>
            <a className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Voir les détails →
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientSummary;