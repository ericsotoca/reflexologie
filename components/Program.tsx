
import React, { useState } from 'react';
import { Play, Book, CheckCircle, Music } from 'lucide-react';

const Program: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stress' | 'sleep' | 'digestion'>('stress');

  const content = {
    stress: {
      title: "Gestion du Stress",
      advice: "Apprenez à identifier les signaux d'alerte de votre corps. Le stress se loge souvent dans les trapèzes ou le diaphragme.",
      routines: ["10 min de méditation le matin", "Respiration ventrale 3x/jour", "Masser la zone réflexe du plexus solaire"],
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    sleep: {
      title: "Améliorer le Sommeil",
      advice: "Instaurez un rituel de coucher sans écrans 1h avant. Favorisez l'obscurité totale et une température fraîche.",
      routines: ["Lecture inspirante le soir", "Masser les points de détente sur les pieds", "Éviter la caféine après 14h"],
      video: "https://www.youtube.com/embed/5qap5aO4i9A",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    digestion: {
      title: "Équilibre Digestif",
      advice: "La digestion commence dans la bouche. Mâchez lentement. Massez votre ventre dans le sens des aiguilles d'une montre.",
      routines: ["Verre d'eau tiède citronnée le matin", "Marche digestive de 15 min", "Zones réflexes digestives du pied"],
      video: "https://www.youtube.com/embed/zP12zM2796Y",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-serif text-sage mb-6">Votre Programme</h2>

      {/* Tabs */}
      <div className="flex bg-beige/50 p-1 rounded-2xl">
        {(['stress', 'sleep', 'digestion'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === tab ? 'bg-white text-sage shadow-sm' : 'text-gray-500 hover:text-sage'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="animate-fadeIn">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-2xl font-serif text-sage mb-3 flex items-center space-x-2">
                  <Book className="text-sage" size={24} />
                  <span>{content[activeTab].title}</span>
                </h3>
                <p className="text-gray-600 leading-relaxed italic border-l-4 border-beige pl-4">
                  {content[activeTab].advice}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                  <CheckCircle className="text-sage" size={20} />
                  <span>Routine suggérée</span>
                </h4>
                <ul className="space-y-2">
                  {content[activeTab].routines.map((r, i) => (
                    <li key={i} className="flex items-center space-x-3 text-sm text-gray-600 bg-beige/20 p-3 rounded-lg">
                      <span className="w-5 h-5 bg-sage text-white text-[10px] rounded-full flex items-center justify-center font-bold">{i+1}</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-beige rounded-2xl flex items-center space-x-4">
                <div className="p-3 bg-white rounded-full text-sage">
                  <Music size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-sage uppercase tracking-wider mb-1">Ambiance Sonore</p>
                  <audio controls className="w-full h-8 opacity-70">
                    <source src={content[activeTab].audio} type="audio/mpeg" />
                  </audio>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={content[activeTab].video}
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center italic">Vidéo recommandée pour approfondir</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Program;
