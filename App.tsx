
import React, { useState } from 'react';
import { ModuleType } from './types.ts';
import Layout from './components/Layout.tsx';
import Home from './components/Home.tsx';
import Journal from './components/Journal.tsx';
import Program from './components/Program.tsx';
import ScoreAssessment from './components/ScoreAssessment.tsx';
import SessionFollowUp from './components/SessionFollowUp.tsx';
import BreathingRoom from './components/BreathingRoom.tsx';

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
