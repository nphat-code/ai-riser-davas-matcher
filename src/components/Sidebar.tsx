import React from 'react';
import { LayoutDashboard, UserCheck, Sparkles, Building2, TrendingUp, Grid } from 'lucide-react';

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
            <div className="flex flex-col gap-6">
                {/* Summit Meta Card */}
                <div className="p-3 rounded-lg bg-[#0f1011] border border-[#23252a] relative">
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-medium text-[#d0d6e0] uppercase tracking-wider">
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

                {/* View Switcher */}
                <div>
                    <div className="px-2 mb-2 text-[11px] font-medium uppercase tracking-wider text-[#62666d]">
                        Views
                    </div>
                    <div className="space-y-1">
                        <button
                            onClick={() => setActiveView('admin')}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${activeView === 'admin'
                                    ? 'bg-[#141516] text-[#f7f8f8] border border-[#23252a]'
                                    : 'text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#0f1011] border border-transparent'
                                }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <LayoutDashboard className="w-4 h-4 text-[#8a8f98]" />
                                <span>Admin Command Center</span>
                            </div>
                            <span className="text-[10px] text-[#62666d] font-mono">
                                Desktop
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveView('participant')}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${activeView === 'participant'
                                    ? 'bg-[#141516] text-[#f7f8f8] border border-[#23252a]'
                                    : 'text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#0f1011] border border-transparent'
                                }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <UserCheck className="w-4 h-4 text-[#8a8f98]" />
                                <span>Participant Portal</span>
                            </div>
                            <span className="text-[10px] text-[#62666d] font-mono">
                                Mobile
                            </span>
                        </button>
                    </div>
                </div>

                {/* Admin Navigation Sections */}
                {activeView === 'admin' && (
                    <div>
                        <div className="px-2 mb-2 text-[11px] font-medium uppercase tracking-wider text-[#62666d]">
                            Navigation
                        </div>
                        <div className="space-y-1">
                            <button
                                onClick={() => setActiveAdminTab('overview')}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${activeAdminTab === 'overview'
                                        ? 'bg-[#141516] text-[#f7f8f8] border border-[#23252a]'
                                        : 'text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#0f1011] border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <TrendingUp className="w-4 h-4 text-[#8a8f98]" />
                                    <span>Overview & Deal Flow</span>
                                </div>
                            </button>

                            <button
                                onClick={() => setActiveAdminTab('startups')}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${activeAdminTab === 'startups'
                                        ? 'bg-[#141516] text-[#f7f8f8] border border-[#23252a]'
                                        : 'text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#0f1011] border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <Building2 className="w-4 h-4 text-[#8a8f98]" />
                                    <span>Startups</span>
                                </div>
                                <span className="text-[11px] text-[#62666d]">{startupsCount}</span>
                            </button>

                            <button
                                onClick={() => setActiveAdminTab('investors')}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${activeAdminTab === 'investors'
                                        ? 'bg-[#141516] text-[#f7f8f8] border border-[#23252a]'
                                        : 'text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#0f1011] border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <UserCheck className="w-4 h-4 text-[#8a8f98]" />
                                    <span>VCs & Angels</span>
                                </div>
                                <span className="text-[11px] text-[#62666d]">{investorsCount}</span>
                            </button>

                            <button
                                onClick={() => setActiveAdminTab('matches')}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${activeAdminTab === 'matches'
                                        ? 'bg-[#141516] text-[#f7f8f8] border border-[#23252a]'
                                        : 'text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#0f1011] border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <Sparkles className="w-4 h-4 text-[#5e6ad2]" />
                                    <span>Match Pairings</span>
                                </div>
                                <span className="text-[11px] text-[#62666d]">{matchesCount}</span>
                            </button>

                            <button
                                onClick={() => setActiveAdminTab('tables')}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${activeAdminTab === 'tables'
                                        ? 'bg-[#141516] text-[#f7f8f8] border border-[#23252a]'
                                        : 'text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#0f1011] border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <Grid className="w-4 h-4 text-[#8a8f98]" />
                                    <span>Summit Tables</span>
                                </div>
                                <span className="text-[11px] text-[#62666d]">12</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};
