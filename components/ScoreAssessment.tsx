
import React, { useState } from 'react';
import { QUESTIONS } from '../constants';
import { Trophy, RefreshCw, AlertCircle, Info } from 'lucide-react';

const ScoreAssessment: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState<number | null>(null);

  const calculateScore = () => {
    // Fixed: Operator '+' cannot be applied to types 'unknown' and 'unknown'
    // by explicitly typing the reduce parameters.
    const total = Object.values(answers).reduce((acc: number, val: number) => acc + val, 0);
    setScore(total);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getInterpretation = (val: number) => {
    if (val <= 35) return {
      label: "Faible équilibre",
      color: "text-red-500",
      bg: "bg-red-50",
      advice: "Votre corps vous envoie des signaux de fatigue. Il est important de ralentir et de vous accorder des moments de repos profond."
    };
    if (val <= 60) return {
      label: "Équilibre modéré",
      color: "text-amber-500",
      bg: "bg-amber-50",
      advice: "Vous avez une base solide mais certaines zones de tension persistent. Continuez vos routines et écoutez vos besoins."
    };
    return {
      label: "Bon équilibre",
      color: "text-sage",
      bg: "bg-sage/10",
      advice: "Excellent ! Votre hygiène de vie et votre écoute intérieure portent leurs fruits. Continuez de cultiver cette harmonie."
    };
  };

  const isComplete = Object.keys(answers).length === QUESTIONS.length;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-serif text-sage mb-6">Score d'Équilibre</h2>

      {score !== null ? (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fadeIn text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${getInterpretation(score).bg}`}>
             <span className={`text-4xl font-serif font-bold ${getInterpretation(score).color}`}>{score}</span>
             <span className="text-gray-400 text-xs mt-4 ml-1">/ 75</span>
          </div>
          
          <h3 className={`text-2xl font-serif mb-2 ${getInterpretation(score).color}`}>
            {getInterpretation(score).label}
          </h3>
          
          <p className="text-gray-600 max-w-lg mx-auto mb-8">
            {getInterpretation(score).advice}
          </p>
          
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => {setScore(null); setAnswers({});}}
              className="flex items-center space-x-2 text-gray-500 hover:text-sage transition-colors px-6 py-2"
            >
              <RefreshCw size={18} />
              <span>Recommencer</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 bg-sage/5 border-b border-gray-100 flex items-start space-x-3">
            <Info className="text-sage mt-1" size={20} />
            <p className="text-sm text-gray-600">Répondez sincèrement à ces 15 questions pour évaluer votre état actuel. <br/><span className="italic">1 = Pas du tout d'accord, 5 = Tout à fait d'accord.</span></p>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {QUESTIONS.map((q) => (
              <div key={q.id} className="space-y-3">
                <p className="text-gray-800 font-medium">{q.id}. {q.text}</p>
                <div className="flex justify-between items-center max-w-sm">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <label key={val} className="flex flex-col items-center cursor-pointer group">
                      <input 
                        type="radio" 
                        name={`q-${q.id}`} 
                        className="hidden" 
                        onChange={() => setAnswers({...answers, [q.id]: val})}
                      />
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${
                        answers[q.id] === val ? 'bg-sage text-white border-sage scale-110 shadow-md' : 'bg-beige/40 text-gray-400 border-transparent hover:border-sage/30'
                      }`}>
                        {val}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-gray-50 flex justify-center sticky bottom-0 bg-white">
            <button
              onClick={calculateScore}
              disabled={!isComplete}
              className={`px-12 py-4 rounded-2xl font-serif text-xl transition-all ${
                isComplete 
                ? 'bg-sage text-white shadow-xl shadow-sage/20 hover:scale-105' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Voir mon résultat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreAssessment;
