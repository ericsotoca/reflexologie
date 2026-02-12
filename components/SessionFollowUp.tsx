
import React, { useState, useEffect } from 'react';
import { storage } from '../services/storageService';
import { Session } from '../types';
import { Plus, Check, Calendar, ClipboardList } from 'lucide-react';

const SessionFollowUp: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [newSession, setNewSession] = useState({
    date: new Date().toISOString().split('T')[0],
    objective: '',
    advice: ''
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setSessions(storage.getSessions());
  }, []);

  const handleAddSession = () => {
    if (!newSession.objective || !newSession.advice) return;
    const session: Session = {
      ...newSession,
      id: Date.now().toString(),
      completed: false
    };
    const updated = [session, ...sessions];
    setSessions(updated);
    storage.saveSessions(updated);
    setIsAdding(false);
    setNewSession({
      date: new Date().toISOString().split('T')[0],
      objective: '',
      advice: ''
    });
  };

  const toggleComplete = (id: string) => {
    const updated = sessions.map(s => 
      s.id === id ? { ...s, completed: !s.completed } : s
    );
    setSessions(updated);
    storage.saveSessions(updated);
  };

  const deleteSession = (id: string) => {
    if (confirm('Supprimer cette séance ?')) {
      const updated = sessions.filter(s => s.id !== id);
      setSessions(updated);
      storage.saveSessions(updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-serif text-sage">Suivi Post-Séance</h2>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-sage text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <Plus size={24} />
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-sage/20 animate-fadeIn mb-10">
          <h3 className="text-xl font-serif mb-6 flex items-center space-x-2">
            <Calendar className="text-sage" size={20} />
            <span>Nouvelle Séance</span>
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Date de la séance</label>
              <input 
                type="date"
                value={newSession.date}
                onChange={e => setNewSession({...newSession, date: e.target.value})}
                className="w-full p-3 bg-beige/30 border border-gray-100 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Objectif défini</label>
              <input 
                type="text"
                placeholder="Ex: Détente profonde, amélioration transit..."
                value={newSession.objective}
                onChange={e => setNewSession({...newSession, objective: e.target.value})}
                className="w-full p-3 bg-beige/30 border border-gray-100 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Conseils reçus</label>
              <textarea 
                rows={3}
                placeholder="Massage d'un point précis, huiles essentielles..."
                value={newSession.advice}
                onChange={e => setNewSession({...newSession, advice: e.target.value})}
                className="w-full p-3 bg-beige/30 border border-gray-100 rounded-xl"
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <button 
                onClick={handleAddSession}
                className="flex-1 bg-sage text-white py-3 rounded-xl font-medium shadow-md shadow-sage/10"
              >
                Ajouter
              </button>
              <button 
                onClick={() => setIsAdding(false)}
                className="px-6 py-3 bg-gray-100 text-gray-500 rounded-xl font-medium"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {sessions.length === 0 && !isAdding ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <ClipboardList className="mx-auto text-gray-200 mb-4" size={48} />
          <p className="text-gray-400 italic">Aucune séance enregistrée pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map(session => (
            <div 
              key={session.id}
              className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${
                session.completed ? 'border-sage opacity-75' : 'border-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold bg-beige text-sage px-3 py-1 rounded-full">{session.date}</span>
                <button 
                  onClick={() => deleteSession(session.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors"
                >
                  ×
                </button>
              </div>
              
              <h4 className="font-serif text-xl mb-2 text-gray-800">{session.objective}</h4>
              <p className="text-sm text-gray-500 mb-6 italic">"{session.advice}"</p>
              
              <button 
                onClick={() => toggleComplete(session.id)}
                className={`w-full py-3 rounded-xl flex items-center justify-center space-x-2 transition-all ${
                  session.completed 
                  ? 'bg-sage text-white' 
                  : 'border border-sage text-sage hover:bg-sage/5'
                }`}
              >
                {session.completed ? <Check size={18} /> : null}
                <span>{session.completed ? 'Objectif atteint !' : 'Je l\'ai fait'}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionFollowUp;
