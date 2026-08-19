import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Sparkles,
    Calendar,
    Building2,
    Users,
    CheckCircle2,
    TrendingUp,
    ArrowUpRight,
    ChevronRight,
    ChevronLeft,
    ChevronDown,
    ChevronUp,
    Search,
    Filter,
    X,
    RefreshCw,
    Zap,
    HelpCircle,
    FileText
} from 'lucide-react';
import { Startup, Investor, MatchPair, EventStats } from '../types';

interface AdminDashboardProps {
    stats: EventStats;
    startups: Startup[];
    investors: Investor[];
    matches: MatchPair[];
    activeTab: 'overview' | 'startups' | 'investors' | 'matches';
    setActiveTab: (tab: 'overview' | 'startups' | 'investors' | 'matches') => void;
    onRunMatchmaking: (targetStartup?: Startup) => void;
    onGenerateSchedule: () => void;
    isMatchmakingLoading: boolean;
    isScheduleLoading: boolean;
    onInspectMatch: (pair: MatchPair) => void;
}

// Stagger container and item variants for list items
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 24,
        },
    },
};

const statCardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: 'easeOut' },
    },
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
    stats,
    startups,
    investors,
    matches,
    activeTab,
    setActiveTab,
    onRunMatchmaking,
    onGenerateSchedule,
    isMatchmakingLoading,
    isScheduleLoading,
    onInspectMatch,
}) => {
    const ITEMS_PER_PAGE = 8;

    // Startup Tab States
    const [startupSearch, setStartupSearch] = useState('');
    const [startupSector, setStartupSector] = useState('All');
    const [startupPage, setStartupPage] = useState(1);

    // Investor Tab States
    const [investorSearch, setInvestorSearch] = useState('');
    const [investorSector, setInvestorSector] = useState('All');
    const [investorPage, setInvestorPage] = useState(1);

    // Overview Sector Bar State
    const [showAllSectors, setShowAllSectors] = useState(false);

    // Dynamic Sectors list for Startups
    const startupSectors = ['All', ...Array.from(new Set(startups.map((s) => s.sector).filter(Boolean))).sort()];

    // Dynamic Sectors list for Investors
    const allInvestorSectors = new Set<string>();
    investors.forEach((inv) => {
        if (Array.isArray(inv.targetSectors)) {
            inv.targetSectors.forEach((sec) => sec && allInvestorSectors.add(sec.trim()));
        } else if (typeof inv.targetSectors === 'string' && inv.targetSectors) {
            (inv.targetSectors as string).split(',').forEach((sec) => sec && allInvestorSectors.add(sec.trim()));
        }
    });
    const investorSectors = ['All', ...Array.from(allInvestorSectors).sort()];

    // Filtered Startups with comprehensive search
    const filteredStartups = (startups || []).filter((s) => {
        if (!s) return false;
        const sName = s.name || '';
        const sDesc = s.description || s.tagline || '';
        const sFounder = s.founderName || '';
        const sSector = s.sector || '';
        const sStage = s.stage || '';
        const sAsk = s.targetAsk || '';
        const query = (startupSearch || '').toLowerCase().trim();

        const matchesSearch =
            !query ||
            sName.toLowerCase().includes(query) ||
            sDesc.toLowerCase().includes(query) ||
            sFounder.toLowerCase().includes(query) ||
            sSector.toLowerCase().includes(query) ||
            sStage.toLowerCase().includes(query) ||
            sAsk.toLowerCase().includes(query);

        const matchesSector = startupSector === 'All' || s.sector === startupSector;
        return matchesSearch && matchesSector;
    });

    const startupTotalPages = Math.max(1, Math.ceil(filteredStartups.length / ITEMS_PER_PAGE));
    const paginatedStartups = filteredStartups.slice(
        (startupPage - 1) * ITEMS_PER_PAGE,
        startupPage * ITEMS_PER_PAGE
    );

    // Filtered Investors with comprehensive search
    const filteredInvestors = (investors || []).filter((i) => {
        if (!i) return false;
        const iName = i.name || '';
        const iFirm = i.firm || '';
        const iRole = i.role || '';
        const iThesis = i.investmentPhilosophy || '';
        const iCountry = i.country || '';
        const iTicket = i.ticketSizeRange || '';
        const query = (investorSearch || '').toLowerCase().trim();

        const matchesSearch =
            !query ||
            iName.toLowerCase().includes(query) ||
            iFirm.toLowerCase().includes(query) ||
            iRole.toLowerCase().includes(query) ||
            iThesis.toLowerCase().includes(query) ||
            iCountry.toLowerCase().includes(query) ||
            iTicket.toLowerCase().includes(query);

        let matchesSector = investorSector === 'All';
        if (investorSector !== 'All') {
            if (Array.isArray(i.targetSectors)) {
                matchesSector = i.targetSectors.some((sec) => sec && sec.toLowerCase().includes(investorSector.toLowerCase()));
            } else if (typeof i.targetSectors === 'string') {
                matchesSector = (i.targetSectors as string).toLowerCase().includes(investorSector.toLowerCase());
            }
        }

        return matchesSearch && matchesSector;
    });

    const investorTotalPages = Math.max(1, Math.ceil(filteredInvestors.length / ITEMS_PER_PAGE));
    const paginatedInvestors = filteredInvestors.slice(
        (investorPage - 1) * ITEMS_PER_PAGE,
        investorPage * ITEMS_PER_PAGE
    );

    // Reusable Pagination Controller
    const renderPagination = (
        currentPage: number,
        totalPages: number,
        totalItems: number,
        onPageChange: (page: number) => void
    ) => {
        if (totalItems === 0) return null;

        const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
        const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

        // Dynamic smart page numbering
        const pages: (number | string)[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }

        return (
            <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="text-slate-400 text-xs">
                    Showing <span className="font-bold text-white">{startItem}</span> to{' '}
                    <span className="font-bold text-white">{endItem}</span> of{' '}
                    <span className="font-bold text-cyan-400">{totalItems}</span> entries
                    <span className="ml-2 text-[11px] text-slate-500 font-mono">
                        (Page {currentPage} of {totalPages})
                    </span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    <button
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 transition-all cursor-pointer font-medium text-xs shadow-sm"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Prev</span>
                    </button>

                    {pages.map((p, idx) => {
                        if (p === '...') {
                            return (
                                <span key={`ellipsis-${idx}`} className="px-2 py-1 text-slate-600 select-none">
                                    ...
                                </span>
                            );
                        }
                        const pageNum = Number(p);
                        const isActive = pageNum === currentPage;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`min-w-[32px] h-8 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${isActive
                                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white border-cyan-400/40 shadow-md shadow-indigo-500/25'
                                    : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 transition-all cursor-pointer font-medium text-xs shadow-sm"
                    >
                        <span>Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Dashboard Top Banner */}
            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="glass-panel p-6 rounded-3xl relative overflow-hidden border border-indigo-500/20"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-600/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                DAVAS 2026 Summit Operating System
                            </span>
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                            DavaSync Command Center
                        </h2>
                        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                            Automated 1:1 business matching & smart scheduling engine for Da Nang Venture and Angel Summit.
                        </p>
                    </div>

                    {/* Action Panel Buttons (Run AI Matchmaking & Generate Smart Schedule) */}
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                        {/* Button 1: Run AI Matchmaking */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onRunMatchmaking}
                            disabled={isMatchmakingLoading}
                            className={`relative group overflow-hidden px-5 py-3 rounded-2xl text-xs font-bold text-white transition-all duration-300 shadow-xl border cursor-pointer ${isMatchmakingLoading
                                ? 'bg-slate-800 border-slate-700 opacity-80 cursor-wait'
                                : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 border-cyan-400/30 shadow-purple-600/30'
                                }`}
                        >
                            <div className="flex items-center gap-2.5">
                                {isMatchmakingLoading ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 text-cyan-300 animate-spin" />
                                        <span>Analyzing Criteria...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 text-yellow-300 group-hover:rotate-12 transition-transform" />
                                        <span className="text-sm">Run AI Matchmaking</span>
                                    </>
                                )}
                            </div>
                        </motion.button>

                        {/* Button 2: Generate Smart Schedule */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onGenerateSchedule}
                            disabled={isScheduleLoading}
                            className={`relative px-5 py-3 rounded-2xl text-xs font-bold text-white transition-all duration-300 shadow-xl border cursor-pointer ${isScheduleLoading
                                ? 'bg-slate-800 border-slate-700 opacity-80 cursor-wait'
                                : 'bg-slate-900/90 hover:bg-slate-800 text-cyan-300 hover:text-white border-cyan-500/30 shadow-cyan-500/10'
                                }`}
                        >
                            <div className="flex items-center gap-2.5">
                                {isScheduleLoading ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                                        <span>Optimizing Table Slots...</span>
                                    </>
                                ) : (
                                    <>
                                        <Calendar className="w-4 h-4 text-cyan-400" />
                                        <span className="text-sm">Generate Smart Schedule</span>
                                    </>
                                )}
                            </div>
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Quick Stats Grid with Staggered Fade-in */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
            >
                {/* Total Startups */}
                <motion.div
                    variants={statCardVariants}
                    whileHover={{ y: -3 }}
                    className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all"
                >
                    <div className="flex items-center justify-between text-slate-400 mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider">Total Startups</span>
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                            <Building2 className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-white">{stats.totalStartups}</div>
                    <p className="text-[11px] text-emerald-400 font-medium mt-1.5 flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" /> 100% Vetted for DAVAS
                    </p>
                </motion.div>

                {/* Total Investors */}
                <motion.div
                    variants={statCardVariants}
                    whileHover={{ y: -3 }}
                    className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all"
                >
                    <div className="flex items-center justify-between text-slate-400 mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider">Total VCs / Angels</span>
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-white">{stats.totalInvestors}</div>
                    <p className="text-[11px] text-cyan-400 font-medium mt-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> $250M+ Total Capital
                    </p>
                </motion.div>

                {/* Scheduled Meetings */}
                <motion.div
                    variants={statCardVariants}
                    whileHover={{ y: -3 }}
                    className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all"
                >
                    <div className="flex items-center justify-between text-slate-400 mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider">1:1 Meetings</span>
                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                            <Calendar className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-white">{stats.scheduledMeetings}</div>
                    <p className="text-[11px] text-purple-400 font-medium mt-1.5">
                        across {Math.min(stats.scheduledMeetings, 12)} Summit Tables
                    </p>
                </motion.div>

                {/* Avg Match Score */}
                <motion.div
                    variants={statCardVariants}
                    whileHover={{ y: -3 }}
                    className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all"
                >
                    <div className="flex items-center justify-between text-slate-400 mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider">Avg AI Match Score</span>
                        <div className="p-2 rounded-xl bg-yellow-500/10 text-yellow-400">
                            <Sparkles className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-white">
                        {stats.scheduledMeetings === 0 || stats.avgMatchScore === 0 ? '--' : `${stats.avgMatchScore}%`}
                    </div>
                    <p className="text-[11px] text-yellow-400 font-medium mt-1.5">
                        {stats.scheduledMeetings === 0 || stats.avgMatchScore === 0 ? 'Awaiting Match Execution' : 'Gemini Flash Criteria'}
                    </p>
                </motion.div>

                {/* Deal Success Rate */}
                <motion.div
                    variants={statCardVariants}
                    whileHover={{ y: -3 }}
                    className="glass-panel p-5 rounded-2xl border border-indigo-500/30 hover:border-indigo-500/50 transition-all bg-indigo-950/20"
                >
                    <div className="flex items-center justify-between text-slate-400 mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Deal Success Rate</span>
                        <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-gradient">{stats.dealSuccessRate}%</div>
                    <p className="text-[11px] text-indigo-300 font-medium mt-1.5">
                        Post-Event Term Sheets
                    </p>
                </motion.div>
            </motion.div>

            {/* Main Tabs Navigation */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 w-full">
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1 w-full">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('overview')}
                        className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'overview'
                            ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                            : 'text-slate-400 hover:text-white bg-slate-900/40 hover:bg-slate-800/80 border border-transparent hover:border-slate-800'
                            }`}
                    >
                        📊 Analytics & Deal Flow
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('matches')}
                        className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'matches'
                            ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40 shadow-md shadow-purple-500/10'
                            : 'text-slate-400 hover:text-white bg-slate-900/40 hover:bg-slate-800/80 border border-transparent hover:border-slate-800'
                            }`}
                    >
                        ✨ AI Match Pairings ({matches.length})
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('startups')}
                        className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'startups'
                            ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                            : 'text-slate-400 hover:text-white bg-slate-900/40 hover:bg-slate-800/80 border border-transparent hover:border-slate-800'
                            }`}
                    >
                        🚀 Startups ({startups.length})
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('investors')}
                        className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'investors'
                            ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                            : 'text-slate-400 hover:text-white bg-slate-900/40 hover:bg-slate-800/80 border border-transparent hover:border-slate-800'
                            }`}
                    >
                        💼 VCs & Angels ({investors.length})
                    </motion.button>
                </div>
            </div>

            {/* AnimatePresence for Page / Tab Transitions */}
            <AnimatePresence mode="wait">
                {/* TAB 1: OVERVIEW & POST-EVENT ANALYTICS */}
                {activeTab === 'overview' && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    >
                        {/* Post-Event Deal Success Chart Panel */}
                        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                                        <span>Post-Event Analytics: Deal Success & Term Sheet Conversion</span>
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Real-time conversion rate from 1:1 business matching to term sheets issued at DAVAS
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bar & Success Gauge */}
                            <div className="space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-slate-300">Overall Matching-to-Term Sheet Velocity</span>
                                    <span className="font-mono font-bold text-cyan-400">{stats.dealSuccessRate}% Target Achieved</span>
                                </div>
                                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stats.dealSuccessRate}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full shadow-lg shadow-cyan-500/50"
                                    />
                                </div>

                                {/* Conversion Funnel Breakdown */}
                                <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                                        <div className="text-[11px] text-slate-400">1:1 Meetings Scheduled</div>
                                        <div className="text-lg font-bold text-white mt-0.5">{stats.scheduledMeetings} Meetings</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                                        <div className="text-[11px] text-slate-400">AI Matches Generated</div>
                                        <div className="text-lg font-bold text-purple-300 mt-0.5">{matches.length} Matches</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                                        <div className="text-[11px] text-slate-400">Term Sheets Target</div>
                                        <div className="text-lg font-bold text-emerald-400 mt-0.5">$18.4M Total</div>
                                    </div>
                                </div>
                            </div>

                            {/* Sector Breakdown Bars */}
                            <div>
                                {(() => {
                                    if (startups.length === 0) {
                                        return (
                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                                    Deal Flow Density by Industry Sector (0 Startups)
                                                </h4>
                                                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
                                                    No startups loaded yet. Data will appear once fetched from Google Sheets API.
                                                </div>
                                            </div>
                                        );
                                    }

                                    const sectorCounts: Record<string, number> = {};
                                    startups.forEach((s) => {
                                        const sec = (s.sector || 'General Tech').trim();
                                        sectorCounts[sec] = (sectorCounts[sec] || 0) + 1;
                                    });

                                    // Sort sectors descending by startup count
                                    const sortedSectors = Object.entries(sectorCounts).sort((a, b) => b[1] - a[1]);
                                    const totalUniqueSectors = sortedSectors.length;
                                    const colorPalette = [
                                        'bg-purple-500',
                                        'bg-cyan-500',
                                        'bg-emerald-500',
                                        'bg-blue-500',
                                        'bg-yellow-500',
                                        'bg-indigo-500',
                                        'bg-rose-500',
                                        'bg-amber-500',
                                        'bg-teal-500',
                                    ];

                                    // Top 5 sectors vs Remaining
                                    const topCount = 5;
                                    const topSectors = sortedSectors.slice(0, topCount);
                                    const remainingSectors = sortedSectors.slice(topCount);
                                    const remainingStartupsCount = remainingSectors.reduce((acc, curr) => acc + curr[1], 0);

                                    const itemsToRender = showAllSectors
                                        ? sortedSectors
                                        : [
                                            ...topSectors,
                                            ...(remainingSectors.length > 0
                                                ? [
                                                    [
                                                        `Other Sectors (${remainingSectors.length} categories)`,
                                                        remainingStartupsCount,
                                                    ] as [string, number],
                                                ]
                                                : []),
                                        ];

                                    return (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                                    Deal Flow Density by Industry Sector ({startups.length} Startups • {totalUniqueSectors} Sectors)
                                                </h4>
                                                {totalUniqueSectors > topCount && (
                                                    <button
                                                        onClick={() => setShowAllSectors(!showAllSectors)}
                                                        className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                                                    >
                                                        <span>{showAllSectors ? 'Show Top 5' : `View All (${totalUniqueSectors})`}</span>
                                                        {showAllSectors ? (
                                                            <ChevronUp className="w-3.5 h-3.5" />
                                                        ) : (
                                                            <ChevronDown className="w-3.5 h-3.5" />
                                                        )}
                                                    </button>
                                                )}
                                            </div>

                                            <div
                                                className={`space-y-2.5 ${showAllSectors
                                                    ? 'max-h-64 overflow-y-auto pr-2 custom-scrollbar'
                                                    : ''
                                                    }`}
                                            >
                                                {itemsToRender.map(([sector, count], idx) => {
                                                    const percent = Math.round((count / startups.length) * 100);
                                                    const isOther = sector.startsWith('Other Sectors');
                                                    const color = isOther
                                                        ? 'bg-slate-500'
                                                        : colorPalette[idx % colorPalette.length];

                                                    return (
                                                        <div key={sector} className="space-y-1">
                                                            <div className="flex justify-between text-xs text-slate-300">
                                                                <span className={`font-medium truncate max-w-[220px] sm:max-w-xs ${isOther ? 'text-slate-400 italic' : ''}`}>
                                                                    {sector}
                                                                </span>
                                                                <span className="text-slate-400 text-[11px] shrink-0 ml-2 font-mono">
                                                                    {count} Startup{count > 1 ? 's' : ''} ({percent}%)
                                                                </span>
                                                            </div>
                                                            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${Math.max(percent, 2)}%` }}
                                                                    transition={{ duration: 0.6, delay: Math.min(idx * 0.05, 0.4) }}
                                                                    className={`h-full ${color} rounded-full`}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Quick AI Match Engine Highlights */}
                        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
                                        <Zap className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <h3 className="text-base font-bold text-white">AI Matchmaking Logic</h3>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    DavaSync evaluates 4 core investment pillars with Gemini 3.6 Flash:
                                </p>

                                <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                                        <span><strong className="text-slate-200">Sector Fit:</strong> Maps startup taxonomy directly against VC focus areas.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                                        <span><strong className="text-slate-200">Funding Stage:</strong> Pre-Seed, Seed, Series A check size compatibility.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                                        <span><strong className="text-slate-200">Ticket Size:</strong> Aligns startup ask with VC minimum/maximum checks.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                                        <span><strong className="text-slate-200">Investment Thesis:</strong> Contextual alignment with founder background & SEA moat.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* TAB 2: AI MATCH PAIRINGS LIST with Staggered & Hover Card Animations */}
                {activeTab === 'matches' && (
                    <motion.div
                        key="matches"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-yellow-400" />
                                <span>Recommended High-Conviction Match Pairs</span>
                            </h3>
                            <span className="text-xs text-slate-400">
                                Showing {matches.length} AI evaluated pairs
                            </span>
                        </div>

                        {matches.length === 0 ? (
                            <div className="glass-panel p-10 rounded-3xl border border-dashed border-slate-800 text-center space-y-4 max-w-xl mx-auto my-8">
                                <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 shadow-lg shadow-purple-500/10">
                                    <Sparkles className="w-7 h-7" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-base font-bold text-white">No AI Match Pairings Generated Yet</h4>
                                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                                        Click the "Run AI Matchmaking" button to pair startups and VCs with 4-pillar compatibility analysis powered by Gemini AI.
                                    </p>
                                </div>
                                <button
                                    onClick={onRunMatchmaking}
                                    disabled={isMatchmakingLoading || startups.length === 0 || investors.length === 0}
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Sparkles className="w-4 h-4 text-yellow-300" />
                                    <span>{isMatchmakingLoading ? 'Evaluating compatibility...' : 'Run First AI Match'}</span>
                                </button>
                            </div>
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                            >
                                {matches.map((pair) => (
                                    <motion.div
                                        key={pair.id}
                                        variants={itemVariants}
                                        whileHover={{
                                            y: -4,
                                            boxShadow: '0px 10px 20px rgba(124, 58, 237, 0.2)',
                                        }}
                                        className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition-colors group relative"
                                    >
                                        {/* Match Score Badge */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                                                    <Sparkles className="w-3 h-3 text-yellow-400" />
                                                    {pair.analysis.matching_score}% Match Score
                                                </span>
                                                <span className="text-xs text-slate-400 font-mono">
                                                    {pair.recommendedTable || 'Table A1'}
                                                </span>
                                            </div>
                                            <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                                                {pair.status}
                                            </span>
                                        </div>

                                        {/* Match Pair Bridge */}
                                        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 mb-4">
                                            {/* Startup Side */}
                                            <div className="space-y-1">
                                                <div className="text-[10px] uppercase font-bold text-slate-500">Startup</div>
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={pair.startup.logo}
                                                        alt={pair.startup.name}
                                                        className="w-7 h-7 rounded-lg object-cover border border-slate-700"
                                                    />
                                                    <div>
                                                        <h4 className="text-xs font-bold text-white truncate">{pair.startup.name}</h4>
                                                        <p className="text-[10px] text-cyan-400 font-medium">{pair.startup.stage} • {pair.startup.targetAsk}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Investor Side */}
                                            <div className="space-y-1 border-l border-slate-800 pl-3">
                                                <div className="text-[10px] uppercase font-bold text-slate-500">Investor VC</div>
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={pair.investor.avatar}
                                                        alt={pair.investor.name}
                                                        className="w-7 h-7 rounded-full object-cover border border-slate-700"
                                                    />
                                                    <div>
                                                        <h4 className="text-xs font-bold text-white truncate">{pair.investor.firm}</h4>
                                                        <p className="text-[10px] text-purple-300 font-medium">{pair.investor.name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* AI Analytical Reason */}
                                        <div className="space-y-2 mb-4">
                                            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                                                <span>AI Synergy Analysis:</span>
                                            </div>
                                            <p className="text-xs text-slate-400 italic bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
                                                "{pair.analysis.reason}"
                                            </p>
                                        </div>

                                        {/* Ice Breakers Preview */}
                                        <div className="space-y-1.5">
                                            <div className="text-[11px] font-bold text-cyan-300 flex items-center gap-1">
                                                <HelpCircle className="w-3 h-3 text-cyan-400" />
                                                <span>Suggested Ice Breaker:</span>
                                            </div>
                                            <p className="text-[11px] text-slate-300 line-clamp-1 bg-cyan-950/20 px-2.5 py-1 rounded border border-cyan-500/20">
                                                "{pair.analysis.ice_breakers[0] || 'How do you plan to scale in SEA?'}"
                                            </p>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-end">
                                            <motion.button
                                                whileHover={{ x: 2 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => onInspectMatch(pair)}
                                                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
                                            >
                                                <span>View Full Match Breakdown</span>
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* TAB 3: STARTUPS TABLE */}
                {activeTab === 'startups' && (
                    <motion.div
                        key="startups"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl"
                    >
                        {/* Table Header: Search & Filter Toolbar */}
                        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/60 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                        <Building2 className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                                        DAVAS Participating Startups
                                    </h3>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                                        {filteredStartups.length} {filteredStartups.length !== startups.length ? `/ ${startups.length}` : 'Total'}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    Vetted startups pitching for Seed & Series A capital at DAVAS 2026 Summit
                                </p>
                            </div>

                            {/* Search and Sector Filter Controls */}
                            <div className="flex flex-wrap items-center gap-2.5">
                                {/* Search Box */}
                                <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                        type="text"
                                        value={startupSearch}
                                        onChange={(e) => {
                                            setStartupSearch(e.target.value);
                                            setStartupPage(1);
                                        }}
                                        placeholder="Search name, founder, stage..."
                                        className="w-full pl-8 pr-8 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
                                    />
                                    {startupSearch && (
                                        <button
                                            onClick={() => {
                                                setStartupSearch('');
                                                setStartupPage(1);
                                            }}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded-full cursor-pointer"
                                            title="Clear search"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>

                                {/* Sector Dropdown */}
                                <div className="relative">
                                    <select
                                        value={startupSector}
                                        onChange={(e) => {
                                            setStartupSector(e.target.value);
                                            setStartupPage(1);
                                        }}
                                        className="bg-slate-950/80 border border-slate-800 text-xs text-slate-200 rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none shadow-inner"
                                    >
                                        <option value="All">All Sectors ({startups.length} Startups)</option>
                                        {startupSectors.filter((sec) => sec !== 'All').map((sec) => (
                                            <option key={sec} value={sec}>{sec}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>

                                {/* Reset Filters */}
                                {(startupSearch || startupSector !== 'All') && (
                                    <button
                                        onClick={() => {
                                            setStartupSearch('');
                                            setStartupSector('All');
                                            setStartupPage(1);
                                        }}
                                        className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-all cursor-pointer shadow-sm"
                                    >
                                        <RefreshCw className="w-3 h-3" />
                                        <span>Reset</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Table Content */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-300">
                                <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
                                    <tr>
                                        <th className="py-3 px-4">Startup & Founder</th>
                                        <th className="py-3 px-4">Sector</th>
                                        <th className="py-3 px-4">Stage</th>
                                        <th className="py-3 px-4">Target Ask</th>
                                        <th className="py-3 px-4">Key Metrics</th>
                                        <th className="py-3 px-4">Action</th>
                                    </tr>
                                </thead>
                                <motion.tbody
                                    key={`startups-page-${startupPage}-${startupSector}-${startupSearch}`}
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="divide-y divide-slate-800/60"
                                >
                                    {paginatedStartups.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <Building2 className="w-8 h-8 text-slate-600" />
                                                    <p className="font-semibold text-slate-300">No startups found matching your filter</p>
                                                    <p className="text-[11px] text-slate-500">Try adjusting your search query or sector filter</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedStartups.map((s) => (
                                            <motion.tr
                                                key={s.id}
                                                variants={itemVariants}
                                                className="hover:bg-slate-800/30 transition-colors"
                                            >
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={s.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80'} alt={s.name} className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0" />
                                                        <div className="min-w-0">
                                                            <div className="font-bold text-white text-sm truncate">{s.name}</div>
                                                            <div className="text-[11px] text-slate-400 truncate">{s.founderName} {s.founderTitle ? `(${s.founderTitle})` : ''}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 whitespace-nowrap">
                                                        {s.sector || 'General Tech'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 font-semibold text-cyan-300 whitespace-nowrap">{s.stage || 'Seed'}</td>
                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    <span className="font-bold text-emerald-400">{s.targetAsk || 'TBD'}</span>
                                                    <div className="text-[10px] text-slate-500">Val: {s.valuation || 'TBD'}</div>
                                                </td>
                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    <div className="text-slate-200 font-medium">{s.metrics?.mrr || s.metrics?.arr || 'N/A'}</div>
                                                    <div className="text-[10px] text-emerald-400">{s.metrics?.growthRate || ''}</div>
                                                </td>
                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => onRunMatchmaking(s)}
                                                        disabled={isMatchmakingLoading}
                                                        className="px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Match VC
                                                    </motion.button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </motion.tbody>
                            </table>
                        </div>

                        {/* Pagination Navigation Footer */}
                        {renderPagination(startupPage, startupTotalPages, filteredStartups.length, setStartupPage)}
                    </motion.div>
                )}

                {/* TAB 4: INVESTORS TABLE */}
                {activeTab === 'investors' && (
                    <motion.div
                        key="investors"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl"
                    >
                        {/* Table Header: Search & Filter Toolbar */}
                        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/60 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        <Users className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                                        DAVAS Attending VCs & Angel Investors
                                    </h3>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                        {filteredInvestors.length} {filteredInvestors.length !== investors.length ? `/ ${investors.length}` : 'Total'}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    Institutional funds, venture partners, and angel investors ready for 1:1 speed matching
                                </p>
                            </div>

                            {/* Search and Mandate Filter Controls */}
                            <div className="flex flex-wrap items-center gap-2.5">
                                {/* Search Box */}
                                <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                        type="text"
                                        value={investorSearch}
                                        onChange={(e) => {
                                            setInvestorSearch(e.target.value);
                                            setInvestorPage(1);
                                        }}
                                        placeholder="Search name, fund, thesis..."
                                        className="w-full pl-8 pr-8 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
                                    />
                                    {investorSearch && (
                                        <button
                                            onClick={() => {
                                                setInvestorSearch('');
                                                setInvestorPage(1);
                                            }}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded-full cursor-pointer"
                                            title="Clear search"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>

                                {/* Mandate / Sector Dropdown */}
                                {investorSectors.length > 1 && (
                                    <div className="relative">
                                        <select
                                            value={investorSector}
                                            onChange={(e) => {
                                                setInvestorSector(e.target.value);
                                                setInvestorPage(1);
                                            }}
                                            className="bg-slate-950/80 border border-slate-800 text-xs text-slate-200 rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none shadow-inner"
                                        >
                                            <option value="All">All Sectors ({investors.length} VCs)</option>
                                            {investorSectors.filter((sec) => sec !== 'All').map((sec) => (
                                                <option key={sec} value={sec}>{sec}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                )}

                                {/* Reset Filters */}
                                {(investorSearch || investorSector !== 'All') && (
                                    <button
                                        onClick={() => {
                                            setInvestorSearch('');
                                            setInvestorSector('All');
                                            setInvestorPage(1);
                                        }}
                                        className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-all cursor-pointer shadow-sm"
                                    >
                                        <RefreshCw className="w-3 h-3" />
                                        <span>Reset</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Table Content */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-300">
                                <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
                                    <tr>
                                        <th className="py-3 px-4">Investor Representative</th>
                                        <th className="py-3 px-4">Firm / Fund</th>
                                        <th className="py-3 px-4">Target Sectors</th>
                                        <th className="py-3 px-4">Ticket Size</th>
                                        <th className="py-3 px-4">Investment Thesis</th>
                                    </tr>
                                </thead>
                                <motion.tbody
                                    key={`investors-page-${investorPage}-${investorSector}-${investorSearch}`}
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="divide-y divide-slate-800/60"
                                >
                                    {paginatedInvestors.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <Users className="w-8 h-8 text-slate-600" />
                                                    <p className="font-semibold text-slate-300">No investors found matching your search</p>
                                                    <p className="text-[11px] text-slate-500">Try adjusting your search query or mandate filter</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedInvestors.map((inv) => {
                                            const sectorsList = Array.isArray(inv.targetSectors)
                                                ? inv.targetSectors
                                                : typeof inv.targetSectors === 'string'
                                                    ? (inv.targetSectors as string).split(',').map((x: string) => x.trim())
                                                    : [];

                                            return (
                                                <motion.tr
                                                    key={inv.id}
                                                    variants={itemVariants}
                                                    className="hover:bg-slate-800/30 transition-colors"
                                                >
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={inv.avatar || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80'}
                                                                alt={inv.name}
                                                                className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                                                            />
                                                            <div className="min-w-0">
                                                                <div className="font-bold text-white text-sm truncate">{inv.name}</div>
                                                                <div className="text-[11px] text-slate-400 truncate">{inv.role || 'Partner'}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 whitespace-nowrap">
                                                        <span className="font-bold text-purple-300 text-sm">{inv.firm}</span>
                                                        <div className="text-[10px] text-slate-500">{inv.country || 'Vietnam'}</div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex flex-wrap gap-1 max-w-xs">
                                                            {sectorsList.map((sec, i) => (
                                                                <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700/60">
                                                                    {sec}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                                                        {inv.ticketSizeRange || '$50k - $250k'}
                                                    </td>
                                                    <td className="py-3 px-4 text-slate-400 text-[11px] max-w-sm line-clamp-2">
                                                        {inv.investmentPhilosophy || 'Active VC and Angel investor in SEA.'}
                                                    </td>
                                                </motion.tr>
                                            );
                                        })
                                    )}
                                </motion.tbody>
                            </table>
                        </div>

                        {/* Pagination Navigation Footer */}
                        {renderPagination(investorPage, investorTotalPages, filteredInvestors.length, setInvestorPage)}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
