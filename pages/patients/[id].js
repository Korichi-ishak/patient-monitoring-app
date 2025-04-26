import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import PatientVitals from '../../components/patients/PatientVitals';
import PatientAlerts from '../../components/patients/PatientAlerts';
import PatientMeasurements from '../../components/patients/PatientMeasurements';
import AddMeasurementForm from '../../components/patients/AddMeasurementForm';

export default function PatientDetails() {
  const router = useRouter();
  const { id } = router.query;
  
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('vitals');
  const [showAddMeasurement, setShowAddMeasurement] = useState(false);
  
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    if (id) {
      fetchPatient();
    }
  }, [id, router]);

  const fetchPatient = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPatient(data);
      } else {
        console.error('Erreur lors de la récupération du patient');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculer l'âge à partir de la date de naissance
  const calculateAge = (dateNaissance) => {
    if (!dateNaissance) return '';
    
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return `${age} ans`;
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Gérer l'ajout d'une nouvelle mesure
  const handleMeasurementAdded = () => {
    // Actualiser les données du patient
    fetchPatient();
  };

  return (
    <Layout title={patient ? `${patient.nom} ${patient.prenom} - MediMonitor` : 'Patient - MediMonitor'}>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : patient ? (
        <>
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{patient.nom}, {patient.prenom}</h1>
              <p className="text-gray-600">
                {calculateAge(patient.dateNaissance)} • N° {patient.numeroPatient}
              </p>
            </div>
            <button 
              onClick={() => setShowAddMeasurement(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ajouter une mesure
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium mb-4">Informations du patient</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500">Date de naissance:</span> {formatDate(patient.dateNaissance)}
                </div>
                <div>
                  <span className="text-gray-500">Service:</span> {patient.service || '-'}
                </div>
                <div>
                  <span className="text-gray-500">Chambre:</span> {patient.chambre || '-'}
                </div>
                <div>
                  <span className="text-gray-500">Téléphone:</span> {patient.contact?.telephone || '-'}
                </div>
                <div>
                  <span className="text-gray-500">Adresse:</span> {patient.contact?.adresse || '-'}
                </div>
                <div>
                  <span className="text-gray-500">Contact d'urgence:</span> {patient.contact?.personneUrgence || '-'}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium mb-4">Pathologies</h2>
              {patient.pathologies && patient.pathologies.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {patient.pathologies.map((pathologie, index) => (
                    <li key={index} className="text-gray-700">{pathologie}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Aucune pathologie enregistrée</p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium mb-4">Médicaments</h2>
              {patient.medicaments && patient.medicaments.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {patient.medicaments.map((medicament, index) => (
                    <li key={index} className="text-gray-700">{medicament}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Aucun médicament enregistré</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('vitals')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'vitals'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Signes vitaux
                </button>
                <button
                  onClick={() => setActiveTab('measurements')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'measurements'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Historique des mesures
                </button>
                <button
                  onClick={() => setActiveTab('alerts')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'alerts'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Alertes
                </button>
              </nav>
            </div>
          </div>

          <div className="mb-6">
            {activeTab === 'vitals' && <PatientVitals patientId={id} />}
            {activeTab === 'measurements' && <PatientMeasurements patientId={id} />}
            {activeTab === 'alerts' && <PatientAlerts patientId={id} />}
          </div>

          {showAddMeasurement && (
            <AddMeasurementForm 
              patientId={id} 
              onClose={() => setShowAddMeasurement(false)}
              onMeasurementAdded={handleMeasurementAdded}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Patient non trouvé</h2>
          <p className="text-gray-600 mb-4">Le patient que vous recherchez n'existe pas ou a été supprimé.</p>
          <button
            onClick={() => router.push('/patients')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour à la liste des patients
          </button>
        </div>
      )}
    </Layout>
  );
}