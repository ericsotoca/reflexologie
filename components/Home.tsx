
import React from 'react';
import { ModuleType } from '../types';

interface HomeProps {
  onStart: (module: ModuleType) => void;
}

const Home: React.FC<HomeProps> = ({ onStart }) => {
  return (
    <div className="animate-fadeIn">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-50 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sage opacity-5 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-beige opacity-40 rounded-tr-full"></div>
        
        <h2 className="text-4xl md:text-5xl font-serif text-sage mb-6 leading-tight">
          Bienvenue dans votre <br/>Espace Équilibre
        </h2>
        
        <p className="text-gray-600 max-w-lg mx-auto mb-10 leading-relaxed text-lg italic">
          "Le bien-être commence par l'écoute de soi. Prenez un instant pour respirer, noter votre progression et cultiver votre harmonie intérieure."
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          <button 
            onClick={() => onStart('journal')}
            className="p-6 bg-sage text-white rounded-2xl shadow-lg shadow-sage/20 hover:scale-[1.02] transition-transform text-left group"
          >
            <h3 className="text-xl font-serif mb-2">Mon Journal</h3>
            <p className="text-sm opacity-90">Notez vos ressentis quotidiens et suivez votre évolution.</p>
          </button>
          
          <button 
            onClick={() => onStart('breathing')}
            className="p-6 bg-beige text-sage rounded-2xl hover:scale-[1.02] transition-transform text-left"
          >
            <h3 className="text-xl font-serif mb-2">Respiration</h3>
            <p className="text-sm text-gray-600">Un exercice simple de 5 minutes pour s'ancrer.</p>
          </button>
        </div>
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-beige rounded-full flex items-center justify-center mb-4 text-sage">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </div>
          <h4 className="font-serif text-xl mb-2">Constance</h4>
          <p className="text-sm text-gray-500">La régularité est la clé d'un changement durable.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-beige rounded-full flex items-center justify-center mb-4 text-sage">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <h4 className="font-serif text-xl mb-2">Équilibre</h4>
          <p className="text-sm text-gray-500">Harmonisez corps et esprit via nos exercices.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-beige rounded-full flex items-center justify-center mb-4 text-sage">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </div>
          <h4 className="font-serif text-xl mb-2">Bienveillance</h4>
          <p className="text-sm text-gray-500">Écoutez votre corps sans jugement.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
