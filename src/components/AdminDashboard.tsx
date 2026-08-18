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
    Search,
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
    onRunMatchmaking: () => void;
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
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSectorFilter, setSelectedSectorFilter] = useState('All');

    const sectors = ['All', 'EdTech & AI', 'AgriTech & Climate', 'FinTech', 'HealthTech & AI', 'CleanTech & Hardware'];

    const filteredStartups = (startups || []).filter((s) => {
        if (!s) return false;
        const sName = s.name || '';
        const sDesc = s.description || s.tagline || '';
        const sFounder = s.founderName || '';
        const query = (searchTerm || '').toLowerCase();
        const matchesSearch =
            sName.toLowerCase().includes(query) ||
            sDesc.toLowerCase().includes(query) ||
            sFounder.toLowerCase().includes(query);
        const matchesSector = selectedSectorFilter === 'All' || s.sector === selectedSectorFilter;
        return matchesSearch && matchesSector;
    });

    const filteredInvestors = (investors || []).filter((i) => {
        if (!i) return false;
        const iName = i.name || '';
        const iFirm = i.firm || '';
        const iThesis = i.investmentPhilosophy || '';
        const query = (searchTerm || '').toLowerCase();
        const matchesSearch =
            iName.toLowerCase().includes(query) ||
            iFirm.toLowerCase().includes(query) ||
            iThesis.toLowerCase().includes(query);
        return matchesSearch;
    });

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
                                        <span className="text-sm">✨ Run AI Matchmaking</span>
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
                                        <span className="text-sm">📅 Generate Smart Schedule</span>
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
                    <div className="text-2xl font-black text-white">{stats.avgMatchScore}%</div>
                    <p className="text-[11px] text-yellow-400 font-medium mt-1.5">
                        Gemini Flash Criteria
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
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'overview'
                                ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                                : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        📊 Analytics & Deal Flow
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('matches')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'matches'
                                ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40 shadow-md shadow-purple-500/10'
                                : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        ✨ AI Match Pairings ({matches.length})
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('startups')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'startups'
                                ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                                : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        🚀 Startups ({startups.length})
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('investors')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'investors'
                                ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                                : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        💼 VCs & Angels ({investors.length})
                    </motion.button>
                </div>

                {/* Filter / Search Bar */}
                <div className="hidden sm:flex items-center gap-2">
                    <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                        <input
                            type="text"
                            placeholder="Search startup, VC or thesis..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-52"
                        />
                    </div>
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
                                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                    +14.2% vs DAVAS 2025
                                </span>
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
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                    Deal Flow Density by Industry Sector ({startups.length} Startups)
                                </h4>
                                <div className="space-y-3">
                                    {(() => {
                                        if (startups.length === 0) {
                                            return (
                                                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
                                                    No startups loaded yet. Data will appear once fetched from Google Sheets API.
                                                </div>
                                            );
                                        }
                                        const sectorCounts: Record<string, number> = {};
                                        startups.forEach((s) => {
                                            const sec = s.sector || 'General Tech';
                                            sectorCounts[sec] = (sectorCounts[sec] || 0) + 1;
                                        });
                                        const colorPalette = ['bg-purple-500', 'bg-blue-500', 'bg-emerald-500', 'bg-yellow-500', 'bg-cyan-500', 'bg-indigo-500'];
                                        return Object.entries(sectorCounts).map(([sector, count], idx) => {
                                            const percent = Math.round((count / startups.length) * 100);
                                            const color = colorPalette[idx % colorPalette.length];
                                            return (
                                                <div key={sector} className="space-y-1">
                                                    <div className="flex justify-between text-xs text-slate-300">
                                                        <span className="font-medium">{sector}</span>
                                                        <span className="text-slate-400">{count} Startup{count > 1 ? 's' : ''} ({percent}%)</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${percent}%` }}
                                                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                                                            className={`h-full ${color} rounded-full`}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
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
                        className="glass-panel rounded-2xl border border-slate-800 overflow-hidden"
                    >
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4">
                            <h3 className="text-sm font-bold text-white">
                                DAVAS Participating Startups ({filteredStartups.length})
                            </h3>
                            {/* Sector Dropdown */}
                            <select
                                value={selectedSectorFilter}
                                onChange={(e) => setSelectedSectorFilter(e.target.value)}
                                className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
                            >
                                {sectors.map((sec) => (
                                    <option key={sec} value={sec}>{sec}</option>
                                ))}
                            </select>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-300">
                                <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
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
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="divide-y divide-slate-800/60"
                                >
                                    {filteredStartups.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                                                No startups found matching your filter. Data will populate automatically from Google Sheets.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredStartups.map((s) => (
                                            <motion.tr
                                                key={s.id}
                                                variants={itemVariants}
                                                className="hover:bg-slate-800/30 transition-colors"
                                            >
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={s.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80'} alt={s.name} className="w-9 h-9 rounded-xl object-cover border border-slate-700" />
                                                        <div>
                                                            <div className="font-bold text-white text-sm">{s.name}</div>
                                                            <div className="text-[11px] text-slate-400">{s.founderName} {s.founderTitle ? `(${s.founderTitle})` : ''}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                                        {s.sector || 'General Tech'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 font-semibold text-cyan-300">{s.stage || 'Seed'}</td>
                                                <td className="py-3 px-4">
                                                    <span className="font-bold text-emerald-400">{s.targetAsk || 'TBD'}</span>
                                                    <div className="text-[10px] text-slate-500">Val: {s.valuation || 'TBD'}</div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="text-slate-200 font-medium">{s.metrics?.mrr || s.metrics?.arr || 'N/A'}</div>
                                                    <div className="text-[10px] text-emerald-400">{s.metrics?.growthRate || ''}</div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={onRunMatchmaking}
                                                        className="px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold transition-all cursor-pointer"
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
                        className="glass-panel rounded-2xl border border-slate-800 overflow-hidden"
                    >
                        <div className="p-4 border-b border-slate-800">
                            <h3 className="text-sm font-bold text-white">
                                DAVAS Attending VCs & Angel Investors ({filteredInvestors.length})
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-300">
                                <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
                                    <tr>
                                        <th className="py-3 px-4">Investor Representative</th>
                                        <th className="py-3 px-4">Firm / Fund</th>
                                        <th className="py-3 px-4">Target Sectors</th>
                                        <th className="py-3 px-4">Ticket Size</th>
                                        <th className="py-3 px-4">Investment Thesis</th>
                                    </tr>
                                </thead>
                                <motion.tbody
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="divide-y divide-slate-800/60"
                                >
                                    {filteredInvestors.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                                                No investors found matching your search. Data will populate automatically from Google Sheets.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredInvestors.map((inv) => {
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
                                                                className="w-9 h-9 rounded-full object-cover border border-slate-700"
                                                            />
                                                            <div>
                                                                <div className="font-bold text-white text-sm">{inv.name}</div>
                                                                <div className="text-[11px] text-slate-400">{inv.role || 'Partner'}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="font-bold text-purple-300 text-sm">{inv.firm}</span>
                                                        <div className="text-[10px] text-slate-500">{inv.country || 'Vietnam'}</div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex flex-wrap gap-1 max-w-xs">
                                                            {sectorsList.map((sec, i) => (
                                                                <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                                                                    {sec}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
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
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
