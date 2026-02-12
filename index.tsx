
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("Espace Équilibre : Démarrage du moteur React...");

const init = () => {
  const container = document.getElementById('root');
  if (container) {
    try {
      const root = ReactDOM.createRoot(container);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      console.log("Espace Équilibre : Application chargée avec succès.");
    } catch (err) {
      console.error("Espace Équilibre : Erreur lors du rendu :", err);
    }
  } else {
    console.error("Espace Équilibre : Élément #root introuvable.");
  }
};

// Exécution immédiate ou après chargement du DOM
if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}
