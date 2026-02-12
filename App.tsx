
import React, { useState } from 'react';
import { ModuleType } from './types';
import Layout from './components/Layout';
import Home from './components/Home';
import Journal from './components/Journal';
import Program from './components/Program';
import ScoreAssessment from './components/ScoreAssessment';
import SessionFollowUp from './components/SessionFollowUp';
import BreathingRoom from './components/BreathingRoom';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>('home');

  const renderModule = () => {
    switch (activeModule) {
      case 'home': return <Home onStart={setActiveModule} />;
      case 'journal': return <Journal />;
      case 'program': return <Program />;
      case 'score': return <ScoreAssessment />;
      case 'followup': return <SessionFollowUp />;
      case 'breathing': return <BreathingRoom />;
      default: return <Home onStart={setActiveModule} />;
    }
  };

  return (
    <Layout activeModule={activeModule} onNavigate={setActiveModule}>
      {renderModule()}
    </Layout>
  );
};

export default App;
