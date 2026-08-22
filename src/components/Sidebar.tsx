import React from 'react';
import { LayoutDashboard, Smartphone, UserCheck, Sparkles, Building2, TrendingUp, Grid, Calendar } from 'lucide-react';

interface SidebarProps {
    activeView: 'admin' | 'participant';
    setActiveView: (view: 'admin' | 'participant') => void;
    activeAdminTab: 'overview' | 'startups' | 'investors' | 'matches' | 'tables';
    setActiveAdminTab: (tab: 'overview' | 'startups' | 'investors' | 'matches' | 'tables') => void;
    onRunMatchmaking?: () => void;
    startupsCount: number;
    investorsCount: number;
    matchesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
    activeView,
    setActiveView,
    activeAdminTab,
    setActiveAdminTab,
    startupsCount,
    investorsCount,
    matchesCount,
}) => {
    return (
        <aside className="w-full lg:w-64 bg-[#010102] border-r border-[#23252a] shrink-0 p-4 flex flex-col justify-between gap-6 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] overflow-y-auto">
            <div className="flex flex-col gap-5">
                {/* Summit Meta Card */}
                <div className="p-3 rounded-lg bg-[#0f1011] border border-[#23252a] relative">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[11px] font-mono font-medium text-[#d0d6e0] uppercase tracking-wider">
                            DAVAS 2026 Engine
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#27a644]" />
                    </div>
                    <p className="text-xs text-[#8a8f98] font-normal leading-relaxed">
                        Da Nang Venture & Angel Summit
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-[#23252a] flex items-center justify-between text-[11px] text-[#8a8f98]">
                        <span>Venue</span>
                        <span className="text-[#f7f8f8] font-medium">Furama Resort</span>
                    </div>
                </div>

                {/* View Mode Indicator / Switcher */}
                <div>
                    <div className="px-2 mb-1.5 text-[11px] font-mono font-medium uppercase tracking-wider text-[#62666d]">
                        Mode
                    </div>
                    <div className="grid grid-cols-2 gap-1 bg-[#0f1011] p-1 rounded-lg border border-[#23252a]">
                        <button
                            onClick={() => setActiveView('admin')}
                            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${activeView === 'admin'
                                    ? 'bg-[#141516] text-[#f7f8f8] border border-[#23252a] shadow-sm'
                                    : 'text-[#8a8f98] hover:text-[#f7f8f8] border border-transparent'
                                }`}
                        >
                            <LayoutDashboard className="w-3.5 h-3.5" />
                            <span>Admin</span>
                        </button>

                        <button
                            onClick={() => setActiveView('participant')}
                            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${activeView === 'participant'
                                    ? 'bg-[#141516] text-[#f7f8f8] border border-[#23252a] shadow-sm'
                                    : 'text-[#8a8f98] hover:text-[#f7f8f8] border border-transparent'
                                }`}
                        >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>Portal</span>
                        </button>
                    </div>
                </div>

                {/* Admin Navigation Sections */}
                {activeView === 'admin' ? (
                    <div>
                        <div className="px-2 mb-1.5 text-[11px] font-mono font-medium uppercase tracking-wider text-[#62666d]">
                            Admin Navigation
                        </div>
                        <div className="space-y-1">
                            <button
                                onClick={() => setActiveAdminTab('overview')}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${activeAdminTab === 'overview'
                                        ? 'bg-[#141516] text-[#f7f8f8] border border-[#23252a] shadow-sm'
                                        : 'text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#0f1011] border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <TrendingUp className="w-4 h-4 text-[#8a8f98]" />
                                    <span>Overview & Analytics</span>
                                </div>
                            </button>

                            <button
                                onClick={() => setActiveAdminTab('startups')}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${activeAdminTab === 'startups'
                                        ? 'bg-[#141516] text-[#f7f8f8] border border-[#23252a] shadow-sm'
                                        : 'text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#0f1011] border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <Building2 className="w-4 h-4 text-[#8a8f98]" />
                                    <span>Startups</span>
                                </div>
                                <span className="text-[11px] font-mono text-[#8a8f98] bg-[#0f1011] px-1.5 py-0.5 rounded border border-[#23252a]">
                                    {startupsCount}
                                </span>
                            </button>

                            <button
                                onClick={() => setActiveAdminTab('investors')}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${activeAdminTab === 'investors'
                                        ? 'bg-[#141516] text-[#f7f8f8] border border-[#23252a] shadow-sm'
                                        : 'text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#0f1011] border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <UserCheck className="w-4 h-4 text-[#8a8f98]" />
                                    <span>VCs & Angels</span>
                                </div>
                                <span className="text-[11px] font-mono text-[#8a8f98] bg-[#0f1011] px-1.5 py-0.5 rounded border border-[#23252a]">
                                    {investorsCount}
                                </span>
                            </button>

                            <button
                                onClick={() => setActiveAdminTab('matches')}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${activeAdminTab === 'matches'
                                        ? 'bg-[#141516] text-[#828fff] border border-[#5e6ad2]/40 shadow-sm'
                                        : 'text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#0f1011] border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <Sparkles className="w-4 h-4 text-[#828fff]" />
                                    <span>Match Pairings</span>
                                </div>
                                <span className="text-[11px] font-mono text-[#828fff] bg-[#5e6ad2]/10 px-1.5 py-0.5 rounded border border-[#5e6ad2]/30">
                                    {matchesCount}
                                </span>
                            </button>

                            <button
                                onClick={() => setActiveAdminTab('tables')}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${activeAdminTab === 'tables'
                                        ? 'bg-[#141516] text-[#f7f8f8] border border-[#23252a] shadow-sm'
                                        : 'text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#0f1011] border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <Grid className="w-4 h-4 text-[#8a8f98]" />
                                    <span>Summit Tables</span>
                                </div>
                                <span className="text-[11px] font-mono text-[#8a8f98] bg-[#0f1011] px-1.5 py-0.5 rounded border border-[#23252a]">
                                    12
                                </span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="px-2 mb-1.5 text-[11px] font-mono font-medium uppercase tracking-wider text-[#62666d]">
                            Participant Hub
                        </div>
                        <div className="p-3 rounded-lg bg-[#0f1011] border border-[#23252a] text-xs text-[#8a8f98] space-y-2">
                            <div className="flex items-center gap-2 text-[#d0d6e0] font-medium">
                                <Calendar className="w-4 h-4 text-[#828fff]" />
                                <span>1:1 Schedule Hub</span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-[#8a8f98]">
                                Switch between Founder, Investor, and Organizer profiles to view personalized agendas and table assignments.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};
