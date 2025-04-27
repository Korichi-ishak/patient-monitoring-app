import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import { FaCheck, FaEye, FaFilter, FaExclamationTriangle, FaSearch } from 'react-icons/fa';

export default function Alerts() {
  const router = useRouter();
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    fetchAlerts();
  }, [router]);

  // Récupérer les alertes
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/alerts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des alertes');
      }
      
      const data = await response.json();
      setAlerts(data);
      setFilteredAlerts(data);
      
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Filtrer les alertes
  useEffect(() => {
    let result = [...alerts];
    
    // Filtrer par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(alert => 
        (alert.patientId.nom?.toLowerCase() || '').includes(term) || 
        (alert.patientId.prenom?.toLowerCase() || '').includes(term) || 
        (alert.description?.toLowerCase() || '').includes(term)
      );
    }
    
    // Filtrer par statut
    if (filterStatus !== 'all') {
      result = result.filter(alert => alert.status === filterStatus);
    }
    
    // Filtrer par sévérité
    if (filterSeverity !== 'all') {
      result = result.filter(alert => alert.severite === filterSeverity);
    }
    
    setFilteredAlerts(result);
  }, [alerts, searchTerm, filterStatus, filterSeverity]);

  // Mettre à jour le statut d'une alerte
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
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'alerte');
      }
      
      // Mettre à jour la liste des alertes
      fetchAlerts();
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  // Déterminer la classe de couleur en fonction de la sévérité
  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'basse':
        return 'bg-yellow-100 text-yellow-800';
      case 'moyenne':
        return 'bg-orange-100 text-orange-800';
      case 'haute':
      case 'critique':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Déterminer la classe de couleur en fonction du statut
  const getStatusClass = (status) => {
    switch (status) {
      case 'nouvelle':
        return 'bg-blue-100 text-blue-800';
      case 'vue':
        return 'bg-gray-100 text-gray-800';
      case 'resolue':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout title="Alertes - MediMonitor">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Gestion des alertes</h1>
          <p className="text-gray-600">
            {filteredAlerts.length} alerte{filteredAlerts.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <button
          onClick={fetchAlerts}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Actualiser
        </button>
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-1/3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="w-full md:w-1/3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="nouvelle">Nouvelles</option>
                <option value="vue">Vues</option>
                <option value="resolue">Résolues</option>
              </select>
            </div>
          </div>
          
          <div className="w-full md:w-1/3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaExclamationTriangle className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Toutes les sévérités</option>
                <option value="basse">Basse</option>
                <option value="moyenne">Moyenne</option>
                <option value="haute">Haute</option>
                <option value="critique">Critique</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">Aucune alerte trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sévérité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAlerts.map((alert) => (
                  <tr key={alert._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(alert.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link 
                        href={`/patients/${alert.patientId._id || alert.patientId}`}
                        className="hover:text-blue-600"
                      >
                        {alert.patientId.nom}, {alert.patientId.prenom}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {alert.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {alert.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityClass(alert.severite)}`}>
                        {alert.severite === 'basse' ? 'Basse' : 
                         alert.severite === 'moyenne' ? 'Moyenne' : 
                         alert.severite === 'haute' ? 'Haute' : 'Critique'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(alert.status)}`}>
                        {alert.status === 'nouvelle' ? 'Nouvelle' : 
                         alert.status === 'vue' ? 'Vue' : 'Résolue'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <Link 
                          href={`/patients/${alert.patientId._id || alert.patientId}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Voir le patient"
                        >
                          <FaEye className="h-5 w-5" />
                        </Link>
                        
                        {alert.status === 'nouvelle' && (
                          <button
                            onClick={() => updateAlertStatus(alert._id, 'vue')}
                            className="text-gray-600 hover:text-gray-900"
                            title="Marquer comme vue"
                          >
                            <FaEye className="h-5 w-5" />
                          </button>
                        )}
                        
                        {(alert.status === 'nouvelle' || alert.status === 'vue') && (
                          <button
                            onClick={() => updateAlertStatus(alert._id, 'resolue')}
                            className="text-green-600 hover:text-green-900"
                            title="Marquer comme résolue"
                          >
                            <FaCheck className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}