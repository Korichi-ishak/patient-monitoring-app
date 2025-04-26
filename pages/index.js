import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>MediMonitor - Suivi des patients</title>
        <meta name="description" content="Application de monitoring des patients" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-grow flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
        <div className="text-center px-6 py-12 max-w-md mx-auto bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">MediMonitor</h1>
          <p className="text-gray-600 mb-8">
            Plateforme de suivi en temps réel des patients pour les professionnels de santé
          </p>
          <div className="space-y-4">
            <Link href="/login">
              <a className="block w-full px-5 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Connexion
              </a>
            </Link>
          </div>
        </div>
      </main>

      <footer className="text-center py-4 bg-white shadow">
        <p className="text-sm text-gray-600">© {new Date().getFullYear()} MediMonitor. Tous droits réservés.</p>
      </footer>
    </div>
  );
}