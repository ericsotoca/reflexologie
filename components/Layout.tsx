
import React from 'react';
import { NAV_ITEMS } from '../constants.tsx';
import { ModuleType } from '../types.ts';

interface LayoutProps {
  children: React.ReactNode;
  activeModule: ModuleType;
  onNavigate: (module: ModuleType) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeModule, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#faf9f6]">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 p-6 fixed h-full shadow-sm">
        <div className="mb-10">
          <h1 className="text-3xl font-serif text-sage font-bold">Espace Équilibre</h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Bien-être & Réflexologie</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as ModuleType)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeModule === item.id 
                  ? 'bg-sage text-white shadow-md' 
                  : 'text-gray-500 hover:bg-beige hover:text-sage'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-100 text-xs text-gray-400 text-center">
          © 2024 Espace Équilibre
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Bottom Nav - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around p-2 z-50 shadow-lg">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as ModuleType)}
            className={`flex flex-col items-center p-2 rounded-lg ${
              activeModule === item.id ? 'text-sage' : 'text-gray-400'
            }`}
          >
            {item.icon}
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
