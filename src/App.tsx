import React, { useState, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const url = "https://script.google.com/macros/s/AKfycbxwY6c_N-fPpv54FCKYCqeULzUEbaSMKWgDNtr3gTkqE5S8m_EWK7q1-9_6ePmdaktf/exec";
        const response = await fetch(url);
        const data = await response.json();

        if (data.startups && data.startups.length > 0) {
          const mappedStartups: Startup[] = data.startups.map((s: any, index: number) => ({
            id: `api-startup-${index}`,
            name: s["Startup Name"] || `Startup ${index + 1}`,
            sector: s["Primary Industry"] || "Tech",
            stage: s["Current Funding Stage"] || "Seed",
            fundingNeeded: `$${(Number(s["Target Funding Amount in USD"])||0).toLocaleString()}`,
            fundingNeededVal: Number(s["Target Funding Amount in USD"]) || 0,
            description: "Dữ liệu được lấy tự động từ Google Sheets (Form Đăng Ký).",
            logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80',
            location: 'Việt Nam',
            founder: s["Email Address"] || 'Founder',
            traction: 'Đang cập nhật'
          }));
          setStartups(mappedStartups);
        }

        if (data.investors && data.investors.length > 0) {
          const mappedInvestors: Investor[] = data.investors.map((i: any, index: number) => ({
            id: `api-investor-${index}`,
            name: i["Investor or Fund Name"] || `Investor ${index + 1}`,
            targetSectors: (i["Interested Industries"] || "Tech").split(",").map((s: string) => s.trim()),
            investmentStages: ["Seed", "Pre-Seed", "Series A"],
            ticketSize: `Up to $${(Number(i["Maximum Ticket Size (USD)"])||0).toLocaleString()}`,
            ticketMin: 0,
            ticketMax: Number(i["Maximum Ticket Size (USD)"]) || 0,
            thesis: i["Investment Philosophy and matching criteria"] || "N/A",
            logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
            firmType: 'Quỹ VC / Angel',
            representative: i["Representative Name"] || 'N/A',
          }));
          setInvestors(mappedInvestors);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thật:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealData();
  }, []);

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
        {activeTab === 'custom' && (
          isLoading ? (
            <div className="flex justify-center items-center h-64 text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mr-3"></div>
              Đang đồng bộ dữ liệu thật từ Google Sheets...
            </div>
          ) : (
            <MatchEvaluator startups={startups} investors={investors} />
          )
        )}

        {/* Tab 3: DAVAS Batch Matrix */}
        {activeTab === 'matrix' && (
          isLoading ? (
            <div className="flex justify-center items-center h-64 text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mr-3"></div>
              Đang đồng bộ dữ liệu thật từ Google Sheets...
            </div>
          ) : (
            <BatchMatrix startups={startups} investors={investors} />
          )
        )}

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
