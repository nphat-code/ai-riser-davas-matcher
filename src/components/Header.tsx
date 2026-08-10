import React from 'react';
import { Sparkles, Building2, UserCheck, Grid, Code, Calendar } from 'lucide-react';

interface HeaderProps {
  activeTab: 'edubot' | 'custom' | 'matrix' | 'json';
  setActiveTab: (tab: 'edubot' | 'custom' | 'matrix' | 'json') => void;
  onOpenAddModal: (type: 'startup' | 'investor') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenAddModal }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Event Tag */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                  DAVAS Match AI
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  DAVAS 2026
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Hệ thống Chấm điểm & Ghép đôi 1:1 Startup - Investor
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('edubot')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'edubot'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>EduBot x Global</span>
            </button>

            <button
              onClick={() => setActiveTab('custom')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'custom'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Ghép đôi 1:1</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'matrix'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span className="hidden md:inline">Ma trận DAVAS</span>
              <span className="md:hidden">Ma trận</span>
            </button>

            <button
              onClick={() => setActiveTab('json')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'json'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Code className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">JSON Output</span>
              <span className="md:hidden">JSON</span>
            </button>
          </nav>

          {/* Action buttons */}
          <div className="hidden lg:flex items-center space-x-2">
            <button
              onClick={() => onOpenAddModal('startup')}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 transition-all"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>+ Startup</span>
            </button>
            <button
              onClick={() => onOpenAddModal('investor')}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>+ Quỹ VC</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
