
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("Initialisation de l'application Espace Équilibre...");

const renderApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Impossible de trouver l'élément racine #root");
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Application montée avec succès.");
  } catch (error) {
    console.error("Erreur lors du rendu React:", error);
  }
};

// S'assurer que le DOM est chargé
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
