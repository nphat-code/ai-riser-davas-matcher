import React from 'react';
import { Sparkles, Calendar, Layers, Smartphone, Monitor } from 'lucide-react';

interface HeaderProps {
    activeView: 'admin' | 'participant';
    setActiveView: (view: 'admin' | 'participant') => void;
    isMobileFrame: boolean;
    setIsMobileFrame: (val: boolean) => void;
    onRunMatchmaking: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    activeView,
    setActiveView,
    isMobileFrame,
    setIsMobileFrame,
    onRunMatchmaking,
}) => {
    return (
        <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 px-4 lg:px-8 py-3">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Brand & DAVAS Title */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-davas p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
                        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                                DavaSync <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">AI MATCHING</span>
                            </h1>
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                            <span>Da Nang Venture & Angel Summit (DAVAS 2026)</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1" />
                            <span className="text-emerald-400 font-medium text-[11px]">LIVE</span>
                        </p>
                    </div>
                </div>

                {/* View Switcher & Actions */}
                <div className="flex items-center flex-wrap justify-center md:justify-end gap-3 w-full md:w-auto">
                    {/* Main View Switcher Tabs */}
                    <div className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800">
                        <button
                            onClick={() => setActiveView('admin')}
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${activeView === 'admin'
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                }`}
                        >
                            <Monitor className="w-3.5 h-3.5" />
                            <span>Admin Dashboard</span>
                            <span className="text-[10px] opacity-75 font-mono px-1 rounded bg-black/20 hidden sm:inline">DESKTOP</span>
                        </button>

                        <button
                            onClick={() => setActiveView('participant')}
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${activeView === 'participant'
                                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-500/25'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                }`}
                        >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>Participant Portal</span>
                            <span className="text-[10px] opacity-75 font-mono px-1 rounded bg-black/20 hidden sm:inline">MOBILE</span>
                        </button>
                    </div>

                    {/* Quick AI Trigger button in header */}
                    <button
                        onClick={() => onRunMatchmaking()}
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 transition-all duration-300 shadow-md shadow-indigo-500/20 active:scale-95 cursor-pointer border border-cyan-400/30"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
                        <span>Match Engine</span>
                    </button>
                </div>
            </div>
        </header>
    );
};
