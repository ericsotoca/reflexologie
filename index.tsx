
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const startApp = () => {
  const container = document.getElementById('root');
  if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Espace Équilibre : Application lancée.");
  }
};

if (document.readyState === 'complete') {
  startApp();
} else {
  window.addEventListener('load', startApp);
}
