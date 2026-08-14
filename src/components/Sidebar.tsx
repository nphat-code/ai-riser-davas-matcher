import React from 'react';
import { LayoutDashboard, UserCheck, Calendar, Sparkles, Building2, TrendingUp, HelpCircle } from 'lucide-react';

interface SidebarProps {
    activeView: 'admin' | 'participant';
    setActiveView: (view: 'admin' | 'participant') => void;
    activeAdminTab: 'overview' | 'startups' | 'investors' | 'matches';
    setActiveAdminTab: (tab: 'overview' | 'startups' | 'investors' | 'matches') => void;
    onRunMatchmaking: () => void;
    startupsCount: number;
    investorsCount: number;
    matchesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
    activeView,
    setActiveView,
    activeAdminTab,
    setActiveAdminTab,
    onRunMatchmaking,
    startupsCount,
    investorsCount,
    matchesCount,
}) => {
    return (
        <aside className="w-full lg:w-64 glass-panel border-r border-slate-800 shrink-0 p-4 flex flex-col justify-between gap-6">
            <div className="space-[#121826] flex flex-col gap-6">
                {/* Summit Info Box */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-indigo-500/20 shadow-inner">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">DAVAS 2026 Engine</span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">
                        Da Nang Venture & Angel Summit
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Location:</span>
                        <span className="text-slate-200 font-semibold">Furama Resort</span>
                    </div>
                </div>

                {/* View Selection */}
                <div>
                    <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Platform Views
                    </div>
                    <div className="space-y-1">
                        <button
                            onClick={() => setActiveView('admin')}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${activeView === 'admin'
                                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                                }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                                <span>Admin Command Center</span>
                            </div>
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                                Desktop
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveView('participant')}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${activeView === 'participant'
                                    ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                                }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <UserCheck className="w-4 h-4 text-cyan-400" />
                                <span>Participant Portal</span>
                            </div>
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                                Mobile
                            </span>
                        </button>
                    </div>
                </div>

                {/* Admin Navigation Links */}
                {activeView === 'admin' && (
                    <div>
                        <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Admin Sections
                        </div>
                        <div className="space-y-1">
                            <button
                                onClick={() => setActiveAdminTab('overview')}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${activeAdminTab === 'overview'
                                        ? 'bg-slate-800 text-white font-semibold'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                                    }`}
                            >
                                <TrendingUp className="w-4 h-4 text-purple-400" />
                                <span>Overview & Analytics</span>
                            </button>

                            <button
                                onClick={() => setActiveAdminTab('startups')}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${activeAdminTab === 'startups'
                                        ? 'bg-slate-800 text-white font-semibold'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                                    }`}
                            >
                                <Building2 className="w-4 h-4 text-blue-400" />
                                <span>Startups Profiles ({startupsCount})</span>
                            </button>

                            <button
                                onClick={() => setActiveAdminTab('investors')}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${activeAdminTab === 'investors'
                                        ? 'bg-slate-800 text-white font-semibold'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                                    }`}
                            >
                                <UserCheck className="w-4 h-4 text-emerald-400" />
                                <span>Investors / VCs ({investorsCount})</span>
                            </button>

                            <button
                                onClick={() => setActiveAdminTab('matches')}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${activeAdminTab === 'matches'
                                        ? 'bg-slate-800 text-white font-semibold'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                                    }`}
                            >
                                <Sparkles className="w-4 h-4 text-yellow-400" />
                                <span>AI Matches ({matchesCount})</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* AI Trigger Card */}
            <div className="p-3.5 rounded-2xl glass-panel-glow text-center flex flex-col gap-2">
                <div className="w-8 h-8 mx-auto rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <h4 className="text-xs font-bold text-white">Smart Match Engine</h4>
                <p className="text-[11px] text-slate-400 leading-tight">
                    Evaluate compatibility using Gemini 3.6 Flash VC criteria.
                </p>
                <button
                    onClick={onRunMatchmaking}
                    className="mt-1 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 border border-purple-400/30 transition-all active:scale-95"
                >
                    ✨ Run AI Matchmaking
                </button>
            </div>
        </aside>
    );
};
