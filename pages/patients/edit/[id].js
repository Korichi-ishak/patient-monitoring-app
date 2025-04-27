import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/layout/Layout';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

export default function EditPatient() {
  const router = useRouter();
  const { id } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [patient, setPatient] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    dateNaissance: '',
    numeroPatient: '',
    service: '',
    chambre: '',
    telephone: '',
    adresse: '',
    personneUrgence: '',
    pathologies: '',
    medicaments: ''
  });

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

  // Récupérer les données du patient
  const fetchPatient = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données du patient');
      }
      
      const data = await response.json();
      setPatient(data);
      
      // Formater les données pour le formulaire
      setFormData({
        nom: data.nom || '',
        prenom: data.prenom || '',
        dateNaissance: data.dateNaissance ? new Date(data.dateNaissance).toISOString().split('T')[0] : '',
        numeroPatient: data.numeroPatient || '',
        service: data.service || '',
        chambre: data.chambre || '',
        telephone: data.contact?.telephone || '',
        adresse: data.contact?.adresse || '',
        personneUrgence: data.contact?.personneUrgence || '',
        pathologies: data.pathologies ? data.pathologies.join(', ') : '',
        medicaments: data.medicaments ? data.medicaments.join(', ') : ''
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // Formater les données pour correspondre au modèle
      const patientData = {
        nom: formData.nom,
        prenom: formData.prenom,
        dateNaissance: formData.dateNaissance,
        numeroPatient: formData.numeroPatient,
        service: formData.service,
        chambre: formData.chambre,
        contact: {
          telephone: formData.telephone,
          adresse: formData.adresse,
          personneUrgence: formData.personneUrgence
        },
        pathologies: formData.pathologies ? formData.pathologies.split(',').map(item => item.trim()) : [],
        medicaments: formData.medicaments ? formData.medicaments.split(',').map(item => item.trim()) : []
      };

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/patients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(patientData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la mise à jour du patient');
      }

      setSuccess('Patient mis à jour avec succès');
      
      // Actualiser les données après la mise à jour
      fetchPatient();
      
      // Rediriger après un court délai pour montrer le message de succès
      setTimeout(() => {
        router.push('/patients');
      }, 1500);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/patients');
  };

  return (
    <Layout title="Modifier patient - MediMonitor">
      <div className="mb-6 flex items-center">
        <button
          onClick={handleCancel}
          className="mr-3 text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Modifier un patient</h1>
          {patient && (
            <p className="text-gray-600">
              {patient.nom} {patient.prenom} - N° {patient.numeroPatient}
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom*
                  </label>
                  <input
                    type="text"
                    name="nom"
                    id="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom*
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    id="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="dateNaissance" className="block text-sm font-medium text-gray-700 mb-1">
                    Date de naissance*
                  </label>
                  <input
                    type="date"
                    name="dateNaissance"
                    id="dateNaissance"
                    value={formData.dateNaissance}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="numeroPatient" className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de patient*
                  </label>
                  <input
                    type="text"
                    name="numeroPatient"
                    id="numeroPatient"
                    value={formData.numeroPatient}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                    Service
                  </label>
                  <input
                    type="text"
                    name="service"
                    id="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="chambre" className="block text-sm font-medium text-gray-700 mb-1">
                    Chambre
                  </label>
                  <input
                    type="text"
                    name="chambre"
                    id="chambre"
                    value={formData.chambre}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    id="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="personneUrgence" className="block text-sm font-medium text-gray-700 mb-1">
                    Personne à contacter en cas d'urgence
                  </label>
                  <input
                    type="text"
                    name="personneUrgence"
                    id="personneUrgence"
                    value={formData.personneUrgence}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <textarea
                    name="adresse"
                    id="adresse"
                    rows="2"
                    value={formData.adresse}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="pathologies" className="block text-sm font-medium text-gray-700 mb-1">
                    Pathologies (séparées par des virgules)
                  </label>
                  <textarea
                    name="pathologies"
                    id="pathologies"
                    rows="2"
                    value={formData.pathologies}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="medicaments" className="block text-sm font-medium text-gray-700 mb-1">
                    Médicaments (séparés par des virgules)
                  </label>
                  <textarea
                    name="medicaments"
                    id="medicaments"
                    rows="2"
                    value={formData.medicaments}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Enregistrer
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}