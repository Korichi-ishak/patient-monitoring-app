import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import { FaUser, FaEnvelope, FaLock, FaMedkit, FaHospital, FaIdCard, FaSave } from 'react-icons/fa';

export default function Settings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    specialite: '',
    service: '',
    numeroOrdre: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData(prev => ({
        ...prev,
        nom: userData.nom || '',
        prenom: userData.prenom || '',
        email: userData.email || '',
        specialite: userData.specialite || '',
        service: userData.service || '',
        numeroOrdre: userData.numeroOrdre || ''
      }));
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement utilisateur:', error);
      setLoading(false);
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nom: formData.nom,
          prenom: formData.prenom,
          specialite: formData.specialite,
          service: formData.service,
          numeroOrdre: formData.numeroOrdre
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Erreur mise à jour profil');

      const updatedUser = { ...user, ...data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSuccess('Profil mis à jour avec succès');
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${user.id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Erreur changement mot de passe');

      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      setSuccess('Mot de passe changé avec succès');
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title="Paramètres - MediMonitor">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="font-medium text-gray-700">Options</h2>
            </div>
            <div className="p-2">
              {['profile', 'password'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    activeTab === tab ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab === 'profile' ? 'Profil' : 'Mot de passe'}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 bg-white rounded-lg shadow p-6">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}

            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Profile form fields */}
                {[{name: 'nom', icon: FaUser}, {name: 'prenom', icon: FaUser}, {name: 'specialite', icon: FaMedkit}, {name: 'service', icon: FaHospital}, {name: 'numeroOrdre', icon: FaIdCard}].map(field => (
                  <div key={field.name} className="relative">
                    <field.icon className="absolute left-3 top-3 text-gray-400" />
                    <input
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      type="text"
                      placeholder={field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                      className="pl-10 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                    />
                  </div>
                ))}

                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="pl-10 py-2 w-full border bg-gray-100 rounded-lg"
                  />
                </div>

                <div className="flex justify-end">
                  <button type="submit" className="btn-primary">{saving ? 'Enregistrement...' : 'Mettre à jour'}</button>
                </div>
              </form>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                {/* Password form fields */}
                {[{name: 'currentPassword', label: 'Mot de passe actuel'}, {name: 'newPassword', label: 'Nouveau mot de passe'}, {name: 'confirmPassword', label: 'Confirmer le mot de passe'}].map(field => (
                  <div key={field.name} className="relative">
                    <FaLock className="absolute left-3 top-3 text-gray-400" />
                    <input
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      type="password"
                      placeholder={field.label}
                      className="pl-10 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                      required
                    />
                  </div>
                ))}

                <div className="flex justify-end">
                  <button type="submit" className="btn-primary">{saving ? 'Enregistrement...' : 'Changer le mot de passe'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
