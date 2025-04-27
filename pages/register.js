import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaUser, FaEnvelope, FaLock, FaMedkit, FaHospital, FaIdCard } from 'react-icons/fa';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialite: '',
    service: '',
    numeroOrdre: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription');
      }

      router.push('/login?message=Compte cr\u00e9\u00e9 avec succ\u00e8s. Veuillez vous connecter.');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-gray-50 min-h-screen flex items-center justify-center px-4">
      <Head>
        <title>Inscription - MediMonitor</title>
      </Head>

      <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-blue-50 to-indigo-100 opacity-30"></div>

      <div className="max-w-2xl w-full bg-white p-10 rounded-3xl shadow-2xl z-10">
        <h2 className="text-4xl font-extrabold text-center text-blue-600">Créer votre compte</h2>
        <p className="mt-4 text-center text-sm text-gray-600">
          Déjà inscrit ?{' '}
          <Link href="/login" className="text-blue-500 font-semibold hover:underline">
            Connectez-vous ici
          </Link>
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                name="nom"
                type="text"
                placeholder="Nom"
                required
                value={formData.nom}
                onChange={handleChange}
                className="pl-10 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                name="prenom"
                type="text"
                placeholder="Prénom"
                required
                value={formData.prenom}
                onChange={handleChange}
                className="pl-10 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              name="email"
              type="email"
              placeholder="Adresse email"
              required
              value={formData.email}
              onChange={handleChange}
              className="pl-10 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FaMedkit className="absolute left-3 top-3 text-gray-400" />
              <input
                name="specialite"
                type="text"
                placeholder="Spécialité"
                value={formData.specialite}
                onChange={handleChange}
                className="pl-10 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <FaHospital className="absolute left-3 top-3 text-gray-400" />
              <input
                name="service"
                type="text"
                placeholder="Service"
                value={formData.service}
                onChange={handleChange}
                className="pl-10 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="relative">
            <FaIdCard className="absolute left-3 top-3 text-gray-400" />
            <input
              name="numeroOrdre"
              type="text"
              placeholder="Numéro d'ordre (optionnel)"
              value={formData.numeroOrdre}
              onChange={handleChange}
              className="pl-10 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                name="password"
                type="password"
                placeholder="Mot de passe"
                required
                value={formData.password}
                onChange={handleChange}
                className="pl-10 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirmer mot de passe"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-10 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-semibold ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'} transition duration-300`}
            disabled={loading}
          >
            {loading ? 'Inscription en cours...' : 'S\'inscrire'}
          </button>
        </form>
      </div>
    </div>
  );
}
