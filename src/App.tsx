import React, { useState } from 'react';
import { Header } from './components/Header';
import { EduBotEvaluationCard } from './components/EduBotEvaluationCard';
import { MatchEvaluator } from './components/MatchEvaluator';
import { BatchMatrix } from './components/BatchMatrix';
import { JsonInspectorModal } from './components/JsonInspectorModal';
import { AddProfileModal } from './components/AddProfileModal';
import { Startup, Investor } from './types';
import { PRESET_STARTUPS, PRESET_INVESTORS } from './data/presetData';
import { Sparkles, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'edubot' | 'custom' | 'matrix' | 'json'>('edubot');
  const [modalType, setModalType] = useState<'startup' | 'investor' | null>(null);

  const [startups, setStartups] = useState<Startup[]>(PRESET_STARTUPS);
  const [investors, setInvestors] = useState<Investor[]>(PRESET_INVESTORS);

  const handleAddStartup = (s: Startup) => {
    setStartups((prev) => [s, ...prev]);
  };

  const handleAddInvestor = (i: Investor) => {
    setInvestors((prev) => [i, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-16">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={(type) => setModalType(type)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Tab 1: Direct EduBot x Global Ventures Evaluation View */}
        {activeTab === 'edubot' && (
          <EduBotEvaluationCard
            onRunCustomMatch={() => setActiveTab('custom')}
            onOpenJsonView={() => setActiveTab('json')}
          />
        )}

        {/* Tab 2: Custom 1:1 Match Evaluator Tool */}
        {activeTab === 'custom' && <MatchEvaluator />}

        {/* Tab 3: DAVAS Batch Matrix */}
        {activeTab === 'matrix' && <BatchMatrix />}

        {/* Tab 4: Raw JSON Output Inspector */}
        {activeTab === 'json' && <JsonInspectorModal />}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">
              DAVAS 2026 Deal Matching Engine
            </span>
          </div>

          <p className="text-slate-400">
            Hệ thống phân tích Venture Capital AI powered by Google Gemini 3.6 Flash
          </p>

          <div className="flex items-center space-x-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Phân tích định dạng JSON chuẩn</span>
          </div>
        </div>
      </footer>

      {/* Modal for adding profiles */}
      {modalType && (
        <AddProfileModal
          type={modalType}
          onClose={() => setModalType(null)}
          onAddStartup={handleAddStartup}
          onAddInvestor={handleAddInvestor}
        />
      )}
    </div>
  );
}
