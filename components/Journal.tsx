
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { storage } from '../services/storageService';
import { JournalEntry } from '../types';
import { Save, History } from 'lucide-react';

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [current, setCurrent] = useState<JournalEntry>({
    date: new Date().toISOString().split('T')[0],
    stress: 5,
    energy: 5,
    sleep: 5,
    mood: 5,
    notes: '',
  });
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setEntries(storage.getJournal());
  }, []);

  const handleSave = () => {
    const newEntries = [...entries.filter(e => e.date !== current.date), current];
    setEntries(newEntries);
    storage.saveJournal(newEntries);
    alert('Journal enregistré avec succès !');
  };

  const sliders = [
    { label: 'Stress', key: 'stress' as keyof JournalEntry, color: '#f87171' },
    { label: 'Énergie', key: 'energy' as keyof JournalEntry, color: '#fbbf24' },
    { label: 'Sommeil', key: 'sleep' as keyof JournalEntry, color: '#60a5fa' },
    { label: 'Humeur', key: 'mood' as keyof JournalEntry, color: '#34d399' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-serif text-sage">Journal Bien-Être</h2>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center space-x-2 text-sage bg-beige px-4 py-2 rounded-lg hover:bg-sage/10 transition-colors"
        >
          <History size={18} />
          <span>{showHistory ? 'Masquer historique' : 'Voir historique'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-serif mb-6 border-b border-gray-50 pb-2">Entrée du jour</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Date</label>
              <input 
                type="date" 
                value={current.date}
                onChange={(e) => setCurrent({...current, date: e.target.value})}
                className="w-full p-2 bg-beige/50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-sage focus:outline-none"
              />
            </div>

            {sliders.map(s => (
              <div key={s.key}>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">{s.label}</label>
                  <span className="text-sm text-sage font-bold">{current[s.key as keyof JournalEntry]} / 10</span>
                </div>
                <input 
                  type="range" min="0" max="10" 
                  value={current[s.key as keyof JournalEntry] as number}
                  onChange={(e) => setCurrent({...current, [s.key]: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-sage"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Notes libres</label>
              <textarea 
                rows={3}
                value={current.notes}
                placeholder="Comment vous sentez-vous aujourd'hui ?"
                onChange={(e) => setCurrent({...current, notes: e.target.value})}
                className="w-full p-3 bg-beige/50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-sage focus:outline-none text-sm"
              />
            </div>

            <button 
              onClick={handleSave}
              className="w-full bg-sage text-white py-3 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-sage/10 hover:bg-sage/90 transition-all"
            >
              <Save size={18} />
              <span>Enregistrer</span>
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
          <h3 className="text-xl font-serif mb-6 border-b border-gray-50 pb-2">Évolution</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={entries.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickFormatter={(val) => val.split('-').slice(1).reverse().join('/')} />
                <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 10]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#8da399' }}
                />
                <Legend />
                <Line type="monotone" dataKey="stress" stroke="#f87171" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="energy" stroke="#fbbf24" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="sleep" stroke="#60a5fa" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="mood" stroke="#34d399" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-center text-gray-400 mt-4 italic">Données des 7 dernières entrées</p>
        </div>
      </div>

      {showHistory && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fadeIn">
          <h3 className="text-xl font-serif mb-4">Historique complet</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-400 border-b border-gray-50">
                <tr>
                  <th className="py-2">Date</th>
                  <th>Stress</th>
                  <th>Énergie</th>
                  <th>Sommeil</th>
                  <th>Humeur</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {entries.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry, idx) => (
                  <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-beige/20">
                    <td className="py-3 font-medium text-sage">{entry.date}</td>
                    <td>{entry.stress}</td>
                    <td>{entry.energy}</td>
                    <td>{entry.sleep}</td>
                    <td>{entry.mood}</td>
                    <td className="max-w-xs truncate text-gray-500">{entry.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;
