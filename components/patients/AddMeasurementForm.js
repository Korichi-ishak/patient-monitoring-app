import React, { useState } from 'react';

const AddMeasurementForm = ({ patientId, onClose, onMeasurementAdded }) => {
  const [formData, setFormData] = useState({
    type: 'temperature',
    valeur: '',
    unite: '',
    methode: '',
    commentaire: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Définir les unités par défaut selon le type
  const defaultUnits = {
    temperature: '°C',
    frequenceCardiaque: 'bpm',
    saturationOxygene: '%',
    tensionArterielle: 'mmHg',
    respiratoire: 'resp/min',
    glucose: 'mmol/L'
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setFormData({
      ...formData,
      type,
      unite: defaultUnits[type] || ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      const measurementData = {
        ...formData,
        patientId,
        personnel: user ? `${user.prenom} ${user.nom}` : 'Médecin'
      };
      
      const response = await fetch('/api/measurements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(measurementData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'ajout de la mesure');
      }

      const newMeasurement = await response.json();
      
      // Informer le composant parent que la mesure a été ajoutée
      if (onMeasurementAdded) {
        onMeasurementAdded(newMeasurement);
      }
      
      // Fermer le formulaire
      onClose();
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Ajouter une mesure</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Type de mesure
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleTypeChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="temperature">Température</option>
              <option value="frequenceCardiaque">Fréquence cardiaque</option>
              <option value="saturationOxygene">Saturation en oxygène</option>
              <option value="tensionArterielle">Tension artérielle</option>
              <option value="respiratoire">Fréquence respiratoire</option>
              <option value="glucose">Glycémie</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Valeur
            </label>
            <div className="flex">
              <input
                type="number"
                name="valeur"
                value={formData.valeur}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.1"
                required
              />
              <span className="px-3 py-2 bg-gray-100 text-gray-700 border-t border-r border-b rounded-r-lg">
                {formData.unite}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Méthode (optionnel)
            </label>
            <input
              type="text"
              name="methode"
              value={formData.methode}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Commentaire (optionnel)
            </label>
            <textarea
              name="commentaire"
              value={formData.commentaire}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMeasurementForm;