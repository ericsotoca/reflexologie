
import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Info } from 'lucide-react';

const BreathingRoom: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [seconds, setSeconds] = useState(5);
  const [cycles, setCycles] = useState(0);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setPhase((p) => {
              if (p === 'inhale') return 'exhale';
              setCycles(c => c + 1);
              return 'inhale';
            });
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setSeconds(5);
      setPhase('inhale');
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const toggleBreathing = () => {
    setIsActive(!isActive);
    if (!isActive) setCycles(0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-serif text-sage mb-2">Cohérence Cardiaque</h2>
        <p className="text-gray-400 italic">Trouvez votre rythme intérieur (5s / 5s)</p>
      </div>

      <div className="relative flex items-center justify-center w-72 h-72">
        {/* Background Ripple Effect */}
        <div className={`absolute inset-0 bg-sage rounded-full opacity-5 transition-transform duration-5000 ease-in-out transform ${
          isActive && phase === 'inhale' ? 'scale-150' : 'scale-100'
        }`}></div>
        
        {/* Main Breathing Circle */}
        <div 
          className={`relative z-10 w-48 h-48 rounded-full bg-white shadow-xl flex flex-col items-center justify-center border-4 border-beige transition-all duration-5000 ease-in-out transform ${
            isActive && phase === 'inhale' ? 'scale-[1.3] bg-beige/20' : 'scale-100'
          }`}
          style={{ transitionDuration: isActive ? '5000ms' : '500ms' }}
        >
          <span className="text-sage font-serif text-2xl font-bold transition-opacity">
            {isActive ? (phase === 'inhale' ? 'Inspirer' : 'Expirer') : 'Prêt ?'}
          </span>
          {isActive && <span className="text-4xl text-sage mt-2 font-light">{seconds}</span>}
        </div>
      </div>

      <div className="flex flex-col items-center space-y-6 w-full max-w-sm">
        <div className="flex items-center space-x-12">
          <div className="text-center">
            <span className="block text-2xl font-serif text-sage">{cycles}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Cycles</span>
          </div>
          <button 
            onClick={toggleBreathing}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isActive 
              ? 'bg-red-50 text-red-500 hover:bg-red-100 shadow-red-100' 
              : 'bg-sage text-white hover:scale-105 shadow-sage/20'
            }`}
          >
            {isActive ? <Square size={28} /> : <Play size={28} className="ml-1" />}
          </button>
          <div className="text-center">
             <span className="block text-2xl font-serif text-sage">{(cycles * 10 / 60).toFixed(1)}</span>
             <span className="text-[10px] text-gray-400 uppercase tracking-widest">Minutes</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-start space-x-3 w-full">
          <Info className="text-sage shrink-0 mt-1" size={18} />
          <p className="text-[11px] text-gray-500 leading-relaxed italic">
            La cohérence cardiaque réduit le stress et l'anxiété. Pratiquez 5 minutes, 3 fois par jour pour des bénéfices optimaux sur votre santé nerveuse.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BreathingRoom;
