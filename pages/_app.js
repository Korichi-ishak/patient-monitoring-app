import '../styles/globals.css';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  // Assurer que les scripts côté client fonctionnent correctement
  useEffect(() => {
    // Ajoutez ici des initialisations globales si nécessaire
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;