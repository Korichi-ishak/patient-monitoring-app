import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FaUserMd, FaChartLine, FaBell, FaLaptopMedical } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>MediMonitor - Suivi des patients en temps réel</title>
        <meta name="description" content="Plateforme de monitoring des patients pour les professionnels de santé" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation */}
      <header className="bg-white shadow-sm fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-blue-600 text-2xl font-bold">MediMonitor</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" 
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Connexion
            </Link>
            <Link href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150">
              S'inscrire
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Monitoring patient</span>
                <span className="block text-blue-600">en temps réel</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-3xl">
                Plateforme complète pour surveiller les données vitales des patients, gérer les alertes et améliorer les soins médicaux.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/register"
                      className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                  Commencer
                </Link>
                <Link href="#features"
                      className="flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                  En savoir plus
                </Link>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Fonctionnalités principales
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Tout ce dont vous avez besoin pour un monitoring efficace des patients
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition duration-300">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                <FaUserMd className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Suivi des patients</h3>
              <p className="mt-2 text-base text-gray-500">
                Visualisez toutes les données vitales des patients en temps réel sur une interface intuitive.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition duration-300">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                <FaChartLine className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Analyse des tendances</h3>
              <p className="mt-2 text-base text-gray-500">
                Analysez l'évolution des paramètres vitaux grâce à des graphiques interactifs.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition duration-300">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                <FaBell className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Système d'alertes</h3>
              <p className="mt-2 text-base text-gray-500">
                Recevez des notifications instantanées en cas d'anomalies détectées sur les constantes vitales.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition duration-300">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                <FaLaptopMedical className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Multi-plateformes</h3>
              <p className="mt-2 text-base text-gray-500">
                Accessible sur tous les appareils : ordinateurs, tablettes et smartphones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Prêt à améliorer le suivi de vos patients?</span>
            <span className="block text-blue-200">Créez votre compte dès maintenant.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/register"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50">
                S'inscrire gratuitement
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MediMonitor</h3>
              <p className="text-gray-300">
                Solution moderne de monitoring patient pour les professionnels de santé.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-300 hover:text-white">Accueil</Link></li>
                <li><Link href="/login" className="text-gray-300 hover:text-white">Connexion</Link></li>
                <li><Link href="/register" className="text-gray-300 hover:text-white">Inscription</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-300">support@medimonitor.com</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© {new Date().getFullYear()} MediMonitor. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}