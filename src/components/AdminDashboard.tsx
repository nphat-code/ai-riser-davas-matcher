import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Sparkles,
    Calendar,
    Building2,
    Users,
    CheckCircle2,
    TrendingUp,
    ChevronRight,
    ChevronLeft,
    ChevronDown,
    ChevronUp,
    Search,
    X,
    RefreshCw,
    FileText,
    Grid,
    Clock,
    Loader2,
    Activity,
    Cpu,
    Database,
    Cloud,
    DollarSign
} from 'lucide-react';
import { Startup, Investor, MatchPair, MeetingSlot, EventStats } from '../types';
import { DEFAULT_TIME_SLOTS } from '../utils/scheduler';

interface AdminDashboardProps {
    stats: EventStats;
    startups: Startup[];
    investors: Investor[];
    matches: MatchPair[];
    scheduleSlots?: MeetingSlot[];
    activeTab: 'overview' | 'startups' | 'investors' | 'matches' | 'tables';
    setActiveTab: (tab: 'overview' | 'startups' | 'investors' | 'matches' | 'tables') => void;
    onRunMatchmaking: (targetStartup?: Startup) => void;
    onGenerateSchedule: () => void;
    isMatchmakingLoading: boolean;
    matchingStartupId?: string | null;
    isScheduleLoading: boolean;
    onInspectMatch: (pair: MatchPair) => void;
}

// Stagger container and item variants for list items
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.02,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.25,
        },
    },
};

const statCardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.25, ease: 'easeOut' },
    },
};

const SUMMIT_TIME_SLOTS = DEFAULT_TIME_SLOTS;

const SUMMIT_ZONES = [
    {
        id: 'zone-a',
        name: 'Zone A',
        subtitle: 'Alpha Suite (HealthTech & AI)',
        tables: ['Table A1', 'Table A2', 'Table A3'],
    },
    {
        id: 'zone-b',
        name: 'Zone B',
        subtitle: 'Beta Suite (FinTech & Enterprise SaaS)',
        tables: ['Table B1', 'Table B2', 'Table B3'],
    },
    {
        id: 'zone-c',
        name: 'Zone C',
        subtitle: 'Gamma Suite (GreenTech & Impact Climate)',
        tables: ['Table C1', 'Table C2', 'Table C3'],
    },
    {
        id: 'zone-d',
        name: 'Zone D',
        subtitle: 'Delta Suite (AgriTech, IoT & Hardware)',
        tables: ['Table D1', 'Table D2', 'Table D3'],
    },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
    stats,
    startups,
    investors,
    matches,
    scheduleSlots = [],
    activeTab,
    setActiveTab,
    onRunMatchmaking,
    onGenerateSchedule,
    isMatchmakingLoading,
    matchingStartupId,
    isScheduleLoading,
    onInspectMatch,
}) => {
    const ITEMS_PER_PAGE = 8;

    // Summit Tables Tab States
    const [selectedTableTimeSlot, setSelectedTableTimeSlot] = useState<string>(SUMMIT_TIME_SLOTS[0]);

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
    const allStartupSectors = new Set<string>();
    startups.forEach((s) => {
        if (s.sector) {
            s.sector.split(',').forEach((sec) => {
                const trimmed = sec.trim();
                if (trimmed) allStartupSectors.add(trimmed);
            });
        }
    });
    const startupSectors = ['All', ...Array.from(allStartupSectors).sort()];

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

        const matchesSector =
            startupSector === 'All' ||
            (s.sector && s.sector.toLowerCase().split(',').map((x) => x.trim()).includes(startupSector.toLowerCase()));
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

    // Calculate total funding ask from matched pairs dynamically
    const totalMatchFundingNumber = (matches || []).reduce((total, m) => {
        const askStr = m.startup?.targetAsk || '';
        const cleanStr = askStr.replace(/,/g, '').trim();
        const numMatch = cleanStr.match(/([\d.]+)\s*([KkMmBb])?/);
        if (!numMatch) return total;

        let val = parseFloat(numMatch[1]);
        if (isNaN(val)) return total;

        const unit = numMatch[2]?.toUpperCase();
        if (unit === 'K') val *= 1_000;
        else if (unit === 'M') val *= 1_000_000;
        else if (unit === 'B') val *= 1_000_000_000;
        else if (val < 1000) {
            val *= 1_000;
        }
        return total + val;
    }, 0);

    const formattedMatchFunding = (() => {
        if (!matches || matches.length === 0 || totalMatchFundingNumber === 0) return '$0 Total';
        if (totalMatchFundingNumber >= 1_000_000_000) {
            return `$${(totalMatchFundingNumber / 1_000_000_000).toFixed(1)}B Total`;
        }
        if (totalMatchFundingNumber >= 1_000_000) {
            return `$${(totalMatchFundingNumber / 1_000_000).toFixed(1)}M Total`;
        }
        if (totalMatchFundingNumber >= 1_000) {
            return `$${(totalMatchFundingNumber / 1_000).toFixed(0)}K Total`;
        }
        return `$${totalMatchFundingNumber.toLocaleString()} Total`;
    })();

    // Reusable Pagination Controller with Linear styling
    const renderPagination = (
        currentPage: number,
        totalPages: number,
        totalItems: number,
        onPageChange: (page: number) => void
    ) => {
        if (totalItems === 0) return null;

        const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
        const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

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
            <div className="p-4 border-t border-[#23252a] bg-[#0f1011] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="text-[#8a8f98] text-xs">
                    Showing <span className="font-medium text-[#f7f8f8]">{startItem}</span> to{' '}
                    <span className="font-medium text-[#f7f8f8]">{endItem}</span> of{' '}
                    <span className="font-medium text-[#828fff]">{totalItems}</span> entries
                    <span className="ml-2 text-[11px] text-[#62666d] font-mono">
                        (Page {currentPage} of {totalPages})
                    </span>
                </div>

                <div className="flex items-center gap-1 flex-wrap justify-center">
                    <button
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-2.5 py-1 rounded-md border border-[#23252a] bg-[#141516] text-[#8a8f98] hover:text-[#f7f8f8] hover:border-[#34343a] disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 transition-all cursor-pointer font-medium text-xs"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Prev</span>
                    </button>

                    {pages.map((p, idx) => {
                        if (p === '...') {
                            return (
                                <span key={`ellipsis-${idx}`} className="px-2 py-1 text-[#62666d] select-none">
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
                                className={`min-w-[28px] h-7 px-2 rounded-md text-xs font-medium transition-all cursor-pointer border ${isActive
                                    ? 'bg-[#141516] text-[#f7f8f8] border-[#5e6ad2] shadow-sm'
                                    : 'bg-[#010102] border-[#23252a] text-[#8a8f98] hover:text-[#f7f8f8] hover:border-[#34343a]'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-2.5 py-1 rounded-md border border-[#23252a] bg-[#141516] text-[#8a8f98] hover:text-[#f7f8f8] hover:border-[#34343a] disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 transition-all cursor-pointer font-medium text-xs"
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
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-[#0f1011] p-6 rounded-xl border border-[#23252a] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
            >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-medium bg-[#141516] text-[#d0d6e0] border border-[#23252a]">
                                DAVAS 2026 Summit Platform
                            </span>
                        </div>
                        <h2 className="text-xl lg:text-2xl font-semibold text-[#f7f8f8] tracking-tight">
                            DavaSync Command Center
                        </h2>
                        <p className="text-sm text-[#8a8f98] mt-1 max-w-2xl">
                            Automated 1:1 business matching and smart scheduling engine for Da Nang Venture and Angel Summit.
                        </p>
                    </div>

                    {/* Action Panel Buttons (Run AI Matchmaking & Generate Smart Schedule) */}
                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        {/* Button 1: Run Matchmaking (PRIMARY CTA) */}
                        <button
                            onClick={onRunMatchmaking}
                            disabled={isMatchmakingLoading}
                            className={`px-4 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-2 ${isMatchmakingLoading
                                    ? 'bg-[#5e6ad2]/50 text-white opacity-80 cursor-wait'
                                    : 'bg-[#5e6ad2] hover:bg-[#828fff] text-white shadow-sm'
                                }`}
                        >
                            {isMatchmakingLoading ? (
                                <>
                                    <RefreshCw className="w-3.5 h-3.5 text-white animate-spin" />
                                    <span>Evaluating...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-3.5 h-3.5 text-white" />
                                    <span>Run Matchmaking</span>
                                </>
                            )}
                        </button>

                        {/* Button 2: Generate Smart Schedule (SECONDARY CTA) */}
                        <button
                            onClick={onGenerateSchedule}
                            disabled={isScheduleLoading}
                            className={`px-4 py-2 rounded-md text-xs font-medium transition-colors border cursor-pointer flex items-center gap-2 ${isScheduleLoading
                                    ? 'bg-[#141516] border-[#23252a] text-[#8a8f98] opacity-80 cursor-wait'
                                    : 'bg-[#141516] hover:bg-[#18191a] text-[#f7f8f8] border-[#23252a] hover:border-[#34343a]'
                                }`}
                        >
                            {isScheduleLoading ? (
                                <>
                                    <RefreshCw className="w-3.5 h-3.5 text-[#8a8f98] animate-spin" />
                                    <span>Optimizing Slots...</span>
                                </>
                            ) : (
                                <>
                                    <Calendar className="w-3.5 h-3.5 text-[#8a8f98]" />
                                    <span>Generate Smart Schedule</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Quick Stats Grid - Linear KPI Cards */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
            >
                {/* Total Startups */}
                <motion.div
                    variants={statCardVariants}
                    className="bg-[#0f1011] border border-[#23252a] rounded-xl p-3.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
                >
                    <div className="flex items-center justify-between text-[#8a8f98] mb-1.5">
                        <span className="text-xs font-medium text-[#8a8f98] uppercase tracking-wider">Total Startups</span>
                        <Building2 className="w-4 h-4 text-[#8a8f98]" />
                    </div>
                    <div className="text-2xl font-semibold text-[#f7f8f8] tracking-tight">{stats.totalStartups}</div>
                </motion.div>

                {/* Total Investors */}
                <motion.div
                    variants={statCardVariants}
                    className="bg-[#0f1011] border border-[#23252a] rounded-xl p-3.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
                >
                    <div className="flex items-center justify-between text-[#8a8f98] mb-1.5">
                        <span className="text-xs font-medium text-[#8a8f98] uppercase tracking-wider">Total VCs / Angels</span>
                        <Users className="w-4 h-4 text-[#8a8f98]" />
                    </div>
                    <div className="text-2xl font-semibold text-[#f7f8f8] tracking-tight">{stats.totalInvestors}</div>
                </motion.div>

                {/* Scheduled Meetings */}
                <motion.div
                    variants={statCardVariants}
                    className="bg-[#0f1011] border border-[#23252a] rounded-xl p-3.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
                >
                    <div className="flex items-center justify-between text-[#8a8f98] mb-1.5">
                        <span className="text-xs font-medium text-[#8a8f98] uppercase tracking-wider">1:1 Meetings</span>
                        <Calendar className="w-4 h-4 text-[#8a8f98]" />
                    </div>
                    <div className="text-2xl font-semibold text-[#f7f8f8] tracking-tight">{stats.scheduledMeetings}</div>
                </motion.div>

                {/* Avg Match Score */}
                <motion.div
                    variants={statCardVariants}
                    className="bg-[#0f1011] border border-[#23252a] rounded-xl p-3.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
                >
                    <div className="flex items-center justify-between text-[#8a8f98] mb-1.5">
                        <span className="text-xs font-medium text-[#8a8f98] uppercase tracking-wider">Avg Match Score</span>
                        <Sparkles className="w-4 h-4 text-[#8a8f98]" />
                    </div>
                    <div className="text-2xl font-semibold text-[#f7f8f8] tracking-tight">
                        {stats.scheduledMeetings === 0 || stats.avgMatchScore === 0 ? '--' : `${stats.avgMatchScore}%`}
                    </div>
                </motion.div>

                {/* Deal Success Rate */}
                <motion.div
                    variants={statCardVariants}
                    className="bg-[#0f1011] border border-[#23252a] rounded-xl p-3.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
                >
                    <div className="flex items-center justify-between text-[#8a8f98] mb-1.5">
                        <span className="text-xs font-medium text-[#8a8f98] uppercase tracking-wider">Deal Conversion</span>
                        <TrendingUp className="w-4 h-4 text-[#8a8f98]" />
                    </div>
                    <div className="text-2xl font-semibold text-[#f7f8f8] tracking-tight">
                        {!stats.dealSuccessRate || stats.dealSuccessRate === 0 ? '--' : `${stats.dealSuccessRate}%`}
                    </div>
                </motion.div>
            </motion.div>

            {/* Main Tabs Navigation - Linear Tab Segment */}
            <div className="border-b border-[#23252a] pb-2">
                <div className="flex items-center gap-1 bg-[#0f1011] p-1 rounded-lg border border-[#23252a] overflow-x-auto no-scrollbar max-w-fit">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'overview'
                            ? 'bg-[#141516] text-[#f7f8f8] border border-[#34343a] shadow-sm'
                            : 'text-[#8a8f98] hover:text-[#f7f8f8]'
                            }`}
                    >
                        Analytics & Flow
                    </button>

                    <button
                        onClick={() => setActiveTab('startups')}
                        className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'startups'
                            ? 'bg-[#141516] text-[#f7f8f8] border border-[#34343a] shadow-sm'
                            : 'text-[#8a8f98] hover:text-[#f7f8f8]'
                            }`}
                    >
                        Startups ({startups.length})
                    </button>

                    <button
                        onClick={() => setActiveTab('investors')}
                        className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'investors'
                            ? 'bg-[#141516] text-[#f7f8f8] border border-[#34343a] shadow-sm'
                            : 'text-[#8a8f98] hover:text-[#f7f8f8]'
                            }`}
                    >
                        VCs & Angels ({investors.length})
                    </button>

                    <button
                        onClick={() => setActiveTab('matches')}
                        className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'matches'
                            ? 'bg-[#141516] text-[#828fff] border border-[#5e6ad2]/40 shadow-sm'
                            : 'text-[#8a8f98] hover:text-[#f7f8f8]'
                            }`}
                    >
                        Match Pairs ({matches.length})
                    </button>

                    <button
                        onClick={() => setActiveTab('tables')}
                        className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'tables'
                            ? 'bg-[#141516] text-[#f7f8f8] border border-[#34343a] shadow-sm'
                            : 'text-[#8a8f98] hover:text-[#f7f8f8]'
                            }`}
                    >
                        Summit Tables (12)
                    </button>
                </div>
            </div>

            {/* AnimatePresence for Page / Tab Transitions */}
            <AnimatePresence mode="wait">
                {/* TAB 1: OVERVIEW & POST-EVENT ANALYTICS */}
                {activeTab === 'overview' && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
                    >
                        {/* Left Column: Post-Event Analytics & Capital Pipeline */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Panel 1: Post-Event Deal Success & Deal Flow Density */}
                            <div className="bg-[#0f1011] p-5 rounded-xl border border-[#23252a] space-y-5">
                                <div>
                                    <h3 className="text-sm font-semibold text-[#f7f8f8] flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-[#8a8f98]" />
                                        <span>Post-Event Analytics: Deal Success & Term Sheet Conversion</span>
                                    </h3>
                                    <p className="text-xs text-[#8a8f98] mt-0.5">
                                        Conversion rate from 1:1 business matching to term sheets issued at DAVAS
                                    </p>
                                </div>

                                {/* Progress Bar & Success Gauge */}
                                <div className="space-y-3 bg-[#141516] p-4 rounded-lg border border-[#23252a]">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-medium text-[#d0d6e0]">Matching-to-Term Sheet Velocity</span>
                                        <span className="font-mono text-[#828fff]">
                                            {!stats.dealSuccessRate || stats.dealSuccessRate === 0
                                                ? 'Pending Data'
                                                : `${stats.dealSuccessRate}% Target Achieved`}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-[#010102] rounded-full overflow-hidden border border-[#23252a]">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stats.dealSuccessRate || 0}%` }}
                                            transition={{ duration: 0.6, ease: 'easeOut' }}
                                            className="h-full bg-[#5e6ad2] rounded-full"
                                        />
                                    </div>

                                    {/* Conversion Funnel Breakdown */}
                                    <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                                        <div className="p-2.5 rounded-md bg-[#010102] border border-[#23252a]">
                                            <div className="text-[10px] text-[#8a8f98] uppercase font-mono">Confirmed Slots</div>
                                            <div className="text-sm font-semibold text-[#f7f8f8] mt-0.5">{stats.scheduledMeetings} Slots</div>
                                        </div>
                                        <div className="p-2.5 rounded-md bg-[#010102] border border-[#23252a]">
                                            <div className="text-[10px] text-[#8a8f98] uppercase font-mono">Match Pairs</div>
                                            <div className="text-sm font-semibold text-[#828fff] mt-0.5">{matches.length}</div>
                                        </div>
                                        <div className="p-2.5 rounded-md bg-[#010102] border border-[#23252a]">
                                            <div className="text-[10px] text-[#8a8f98] uppercase font-mono">Target Capital</div>
                                            <div className="text-sm font-semibold text-[#27a644] mt-0.5">{formattedMatchFunding}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sector Breakdown Bars */}
                                <div>
                                    {(() => {
                                        if (startups.length === 0) {
                                            return (
                                                <div>
                                                    <h4 className="text-xs font-medium uppercase tracking-wider text-[#8a8f98] mb-2">
                                                        Deal Flow Density by Sector (0 Startups)
                                                    </h4>
                                                    <div className="p-4 rounded-lg bg-[#141516] border border-[#23252a] text-center text-xs text-[#8a8f98]">
                                                        No startups loaded yet. Data will appear once fetched.
                                                    </div>
                                                </div>
                                            );
                                        }

                                        const sectorCounts: Record<string, number> = {};
                                        startups.forEach((s) => {
                                            const rawSector = s.sector || 'General Tech';
                                            const secList = rawSector.split(',').map((sec) => sec.trim()).filter(Boolean);
                                            if (secList.length === 0) secList.push('General Tech');
                                            secList.forEach((sec) => {
                                                sectorCounts[sec] = (sectorCounts[sec] || 0) + 1;
                                            });
                                        });

                                        const sortedSectors = Object.entries(sectorCounts).sort((a, b) => b[1] - a[1]);
                                        const totalUniqueSectors = sortedSectors.length;

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
                                            <div className="space-y-2.5">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-xs font-medium uppercase tracking-wider text-[#8a8f98]">
                                                        Deal Flow Density by Industry Sector ({startups.length} Startups)
                                                    </h4>
                                                    {totalUniqueSectors > topCount && (
                                                        <button
                                                            onClick={() => setShowAllSectors(!showAllSectors)}
                                                            className="px-2 py-0.5 rounded bg-[#141516] hover:bg-[#18191a] text-[#8a8f98] hover:text-[#f7f8f8] border border-[#23252a] text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                                                        >
                                                            <span>{showAllSectors ? 'Show Top 5' : `View All (${totalUniqueSectors})`}</span>
                                                            {showAllSectors ? (
                                                                <ChevronUp className="w-3 h-3" />
                                                            ) : (
                                                                <ChevronDown className="w-3 h-3" />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>

                                                <div
                                                    className={`space-y-2 ${showAllSectors
                                                        ? 'max-h-64 overflow-y-auto pr-1'
                                                        : ''
                                                        }`}
                                                >
                                                    {itemsToRender.map(([sector, count], idx) => {
                                                        const percent = Math.min(100, Math.max(1, Math.round((count / startups.length) * 100)));
                                                        const isOther = sector.startsWith('Other Sectors');

                                                        return (
                                                            <div key={sector} className="space-y-1">
                                                                <div className="flex justify-between text-xs text-[#d0d6e0]">
                                                                    <span className={`truncate max-w-[220px] sm:max-w-xs ${isOther ? 'text-[#8a8f98] italic' : ''}`}>
                                                                        {sector}
                                                                    </span>
                                                                    <span className="text-[#8a8f98] text-[11px] shrink-0 ml-2 font-mono">
                                                                        {count} ({percent}%)
                                                                    </span>
                                                                </div>
                                                                <div className="w-full h-1.5 bg-[#010102] rounded-full overflow-hidden border border-[#23252a]">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${percent}%` }}
                                                                        transition={{ duration: 0.4, delay: Math.min(idx * 0.04, 0.3) }}
                                                                        className={`h-full ${isOther ? 'bg-[#34343a]' : 'bg-[#5e6ad2]'} rounded-full`}
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <p className="text-[11px] text-[#62666d] pt-1">
                                                    *Multi-sector taxonomy: Startups may operate across multiple overlapping domains.
                                                </p>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>

                            {/* Panel 2: Funding Stage & Capital Pipeline */}
                            <div className="bg-[#0f1011] p-4 rounded-xl border border-[#23252a] space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-[#8a8f98]" />
                                        <h4 className="text-xs font-semibold text-[#f7f8f8] uppercase tracking-wider">
                                            Funding Stage & Capital Pipeline
                                        </h4>
                                    </div>
                                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#141516] text-[#27a644] border border-[#27a644]/30">
                                        Total: $44.0M Ask
                                    </span>
                                </div>

                                {/* Stage Rows (3 interactive rows) */}
                                <div className="space-y-2.5">
                                    {[
                                        {
                                            stage: 'Seed',
                                            range: '$200k - $1M',
                                            count: 38,
                                            percent: 61,
                                            ask: '$18.2M',
                                        },
                                        {
                                            stage: 'Series A',
                                            range: '$1M - $3M',
                                            count: 16,
                                            percent: 26,
                                            ask: '$24.0M',
                                        },
                                        {
                                            stage: 'Pre-Seed',
                                            range: '< $200k',
                                            count: 8,
                                            percent: 13,
                                            ask: '$1.8M',
                                        },
                                    ].map((item, idx) => (
                                        <div
                                            key={item.stage}
                                            className="p-2.5 rounded-lg bg-[#141516] border border-[#23252a] space-y-1.5 hover:border-[#34343a] transition-colors"
                                        >
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-[#f7f8f8]">{item.stage}</span>
                                                    <span className="text-[11px] text-[#8a8f98] font-mono">({item.range})</span>
                                                </div>
                                                <div className="flex items-center gap-2 font-mono text-[11px]">
                                                    <span className="text-[#d0d6e0]">{item.count} Startups ({item.percent}%)</span>
                                                    <span className="text-[#62666d]">&bull;</span>
                                                    <span className="text-[#828fff]">Ask: {item.ask}</span>
                                                </div>
                                            </div>
                                            <div className="w-full h-1.5 bg-[#010102] rounded-full overflow-hidden border border-[#23252a]">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.percent}%` }}
                                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                                    className="h-full bg-[#5e6ad2] rounded-full"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Operational Column: High-Conviction Matches & Floor Telemetry */}
                        <div className="space-y-4">
                            {/* Widget 1: Top High-Conviction Matches */}
                            <div className="bg-[#0f1011] p-4 rounded-xl border border-[#23252a] space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-[#828fff]" />
                                        <h3 className="text-xs font-semibold text-[#f7f8f8] uppercase tracking-wider">
                                            Top High-Conviction Matches
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setActiveTab('matches')}
                                        className="text-xs font-mono text-[#828fff] hover:text-[#f7f8f8] flex items-center gap-1 cursor-pointer transition-colors"
                                    >
                                        <span>View All ({matches.length})</span>
                                        <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>

                                {(() => {
                                    const topMatches = [...matches]
                                        .sort((a, b) => (b.analysis?.matching_score || 0) - (a.analysis?.matching_score || 0))
                                        .slice(0, 3);

                                    if (topMatches.length === 0) {
                                        return (
                                            <div className="p-4 rounded-lg bg-[#141516] border border-[#23252a] text-center space-y-1.5">
                                                <p className="text-xs text-[#8a8f98]">No matches evaluated yet.</p>
                                                <button
                                                    onClick={() => onRunMatchmaking()}
                                                    className="text-xs text-[#828fff] hover:underline cursor-pointer"
                                                >
                                                    Run AI Matchmaking &rarr;
                                                </button>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="space-y-2">
                                            {topMatches.map((pair) => (
                                                <div
                                                    key={pair.id}
                                                    className="p-3 rounded-lg bg-[#141516] border border-[#23252a] hover:border-[#34343a] transition-all space-y-2"
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        {/* Startup & Investor Identity */}
                                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                                            <img
                                                                src={pair.startup?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80'}
                                                                alt={pair.startup?.name}
                                                                className="w-6 h-6 rounded-md object-cover border border-[#23252a] shrink-0"
                                                            />
                                                            <span className="text-xs font-medium text-[#f7f8f8] truncate max-w-[90px] sm:max-w-[120px]">
                                                                {pair.startup?.name}
                                                            </span>
                                                            <span className="text-[#62666d] text-xs font-mono">&times;</span>
                                                            <img
                                                                src={pair.investor?.avatar || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=80&q=80'}
                                                                alt={pair.investor?.name}
                                                                className="w-6 h-6 rounded-full object-cover border border-[#23252a] shrink-0"
                                                            />
                                                            <span className="text-xs font-medium text-[#d0d6e0] truncate max-w-[90px] sm:max-w-[120px]">
                                                                {pair.investor?.firm}
                                                            </span>
                                                        </div>

                                                        {/* Synergy Score Badge & Inspect */}
                                                        <div className="flex items-center gap-1.5 shrink-0">
                                                            <span className="font-mono text-xs text-[#828fff] bg-[#5e6ad2]/15 border border-[#5e6ad2]/30 px-2 py-0.5 rounded flex items-center gap-1">
                                                                <Sparkles className="w-3 h-3 text-[#828fff]" />
                                                                {pair.analysis?.matching_score || 0}%
                                                            </span>
                                                            <button
                                                                onClick={() => onInspectMatch(pair)}
                                                                className="text-[11px] font-medium text-[#828fff] hover:text-[#f7f8f8] bg-[#0f1011] hover:bg-[#18191a] border border-[#23252a] hover:border-[#34343a] px-2 py-0.5 rounded cursor-pointer transition-colors"
                                                            >
                                                                Inspect
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* 1-Line Reason Summary */}
                                                    <p className="text-[11px] text-[#8a8f98] truncate leading-relaxed">
                                                        {pair.analysis?.reason || 'Synergistic sector alignment & funding stage fit.'}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Widget 2: Summit Floor & Zone Telemetry */}
                            <div className="bg-[#0f1011] p-4 rounded-xl border border-[#23252a] space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Grid className="w-4 h-4 text-[#8a8f98]" />
                                        <h3 className="text-xs font-semibold text-[#f7f8f8] uppercase tracking-wider">
                                            Summit Floor & Zone Telemetry
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#141516] text-[#8a8f98] border border-[#23252a]">
                                            12 Designated Tables
                                        </span>
                                        <button
                                            onClick={() => setActiveTab('tables')}
                                            className="text-xs font-mono text-[#828fff] hover:text-[#f7f8f8] flex items-center gap-1 cursor-pointer transition-colors"
                                        >
                                            <span>Manage</span>
                                            <ChevronRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>

                                {/* 4 Zones Mini Grid */}
                                {(() => {
                                    const zoneTelemetry = [
                                        {
                                            name: 'Zone A',
                                            subtitle: 'Alpha Suite (HealthTech & AI)',
                                            tables: ['Table A1', 'Table A2', 'Table A3'],
                                        },
                                        {
                                            name: 'Zone B',
                                            subtitle: 'Beta Suite (FinTech & SaaS)',
                                            tables: ['Table B1', 'Table B2', 'Table B3'],
                                        },
                                        {
                                            name: 'Zone C',
                                            subtitle: 'Gamma Suite (GreenTech)',
                                            tables: ['Table C1', 'Table C2', 'Table C3'],
                                        },
                                        {
                                            name: 'Zone D',
                                            subtitle: 'Delta Suite (AgriTech & IoT)',
                                            tables: ['Table D1', 'Table D2', 'Table D3'],
                                        },
                                    ].map((zone) => {
                                        const occupiedCount = zone.tables.filter((t) =>
                                            scheduleSlots.some((s) => s.table === t)
                                        ).length;
                                        const availableCount = zone.tables.length - occupiedCount;
                                        return {
                                            ...zone,
                                            occupiedCount,
                                            availableCount,
                                        };
                                    });

                                    return (
                                        <div className="grid grid-cols-2 gap-2">
                                            {zoneTelemetry.map((z) => (
                                                <div
                                                    key={z.name}
                                                    className="p-2.5 rounded-lg bg-[#141516] border border-[#23252a] space-y-1"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-medium text-[#f7f8f8]">{z.name}</span>
                                                        <span
                                                            className={`w-1.5 h-1.5 rounded-full ${z.occupiedCount > 0 ? 'bg-[#27a644]' : 'bg-[#62666d]'
                                                                }`}
                                                        />
                                                    </div>
                                                    <p className="text-[10px] text-[#8a8f98] truncate">{z.subtitle}</p>
                                                    <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-[#23252a]/60">
                                                        <span className="text-[#8a8f98]">
                                                            Occupied: <strong className="text-[#828fff]">{z.occupiedCount}/3</strong>
                                                        </span>
                                                        <span className="text-[#8a8f98]">
                                                            Avail: <strong className="text-[#27a644]">{z.availableCount}</strong>
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}

                                {/* Next Upcoming Session Notification Bar */}
                                <div className="p-2.5 rounded-lg bg-[#141516] border border-[#23252a] flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 text-[#d0d6e0]">
                                        <Clock className="w-3.5 h-3.5 text-[#828fff]" />
                                        <span className="font-medium">Next Session: 13:00 - 13:30</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-[#8a8f98] bg-[#0f1011] px-2 py-0.5 rounded border border-[#23252a]">
                                        Grand Ballroom
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* TAB 2: MATCH PAIRINGS LIST */}
                {activeTab === 'matches' && (
                    <motion.div
                        key="matches"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-[#f7f8f8] flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-[#828fff]" />
                                <span>Recommended Match Pairs</span>
                            </h3>
                            <span className="text-xs text-[#8a8f98] font-mono">
                                {matches.length} pairs evaluated
                            </span>
                        </div>

                        {matches.length === 0 ? (
                            <div className="bg-[#0f1011] p-8 rounded-xl border border-dashed border-[#23252a] text-center space-y-3 max-w-md mx-auto my-6">
                                <div className="w-10 h-10 mx-auto rounded-lg bg-[#141516] text-[#8a8f98] flex items-center justify-center border border-[#23252a]">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-[#f7f8f8]">No Match Pairs Generated Yet</h4>
                                    <p className="text-xs text-[#8a8f98] max-w-sm mx-auto leading-relaxed">
                                        Run the matchmaking algorithm to pair startups and VCs across the 4 core compatibility pillars.
                                    </p>
                                </div>
                                <button
                                    onClick={onRunMatchmaking}
                                    disabled={isMatchmakingLoading || startups.length === 0 || investors.length === 0}
                                    className="px-4 py-2 rounded-md bg-[#5e6ad2] hover:bg-[#828fff] text-white text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>{isMatchmakingLoading ? 'Evaluating...' : 'Run Matchmaking'}</span>
                                </button>
                            </div>
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 lg:grid-cols-2 gap-3"
                            >
                                {matches.map((pair) => (
                                    <motion.div
                                        key={pair.id}
                                        variants={itemVariants}
                                        className="bg-[#0f1011] p-4 rounded-xl border border-[#23252a] hover:border-[#34343a] transition-all flex flex-col justify-between"
                                    >
                                        <div>
                                            {/* Match Score Badge */}
                                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#23252a]">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-[#5e6ad2]/15 text-[#828fff] border border-[#5e6ad2]/30 flex items-center gap-1">
                                                        <Sparkles className="w-3 h-3 text-[#828fff]" />
                                                        {pair.analysis.matching_score}% Match
                                                    </span>
                                                    <span className="text-xs text-[#8a8f98] font-mono">
                                                        {pair.recommendedTable || 'Table A1'}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141516] text-[#d0d6e0] border border-[#23252a]">
                                                    {pair.status}
                                                </span>
                                            </div>

                                            {/* Match Pair Entities */}
                                            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[#141516] border border-[#23252a] mb-3">
                                                {/* Startup Side */}
                                                <div className="space-y-1">
                                                    <div className="text-[10px] uppercase font-mono text-[#8a8f98]">Startup</div>
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src={pair.startup.logo}
                                                            alt={pair.startup.name}
                                                            className="w-7 h-7 rounded-md object-cover border border-[#23252a]"
                                                        />
                                                        <div className="min-w-0">
                                                            <h4 className="text-xs font-medium text-[#f7f8f8] truncate">{pair.startup.name}</h4>
                                                            <p className="text-[10px] text-[#8a8f98] font-mono">{pair.startup.stage} • {pair.startup.targetAsk}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Investor Side */}
                                                <div className="space-y-1 border-l border-[#23252a] pl-3">
                                                    <div className="text-[10px] uppercase font-mono text-[#8a8f98]">Investor</div>
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src={pair.investor.avatar}
                                                            alt={pair.investor.name}
                                                            className="w-7 h-7 rounded-full object-cover border border-[#23252a]"
                                                        />
                                                        <div className="min-w-0">
                                                            <h4 className="text-xs font-medium text-[#f7f8f8] truncate">{pair.investor.firm}</h4>
                                                            <p className="text-[10px] text-[#8a8f98] truncate">{pair.investor.name}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Analytical Reason */}
                                            <p className="text-xs text-[#8a8f98] bg-[#010102] p-2.5 rounded-md border border-[#23252a] leading-relaxed mb-3">
                                                "{pair.analysis.reason}"
                                            </p>
                                        </div>

                                        <div className="pt-2 border-t border-[#23252a] flex justify-end">
                                            <button
                                                onClick={() => onInspectMatch(pair)}
                                                className="text-xs font-medium text-[#828fff] hover:text-[#f7f8f8] flex items-center gap-1 transition-colors cursor-pointer"
                                            >
                                                <span>Inspect Breakdown</span>
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </button>
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
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="bg-[#0f1011] border border-[#23252a] rounded-xl overflow-hidden shadow-sm"
                    >
                        {/* Table Header: Search & Filter Toolbar */}
                        <div className="p-4 border-b border-[#23252a] bg-[#0f1011] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-semibold text-[#f7f8f8] tracking-tight">
                                        DAVAS Participating Startups
                                    </h3>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#141516] text-[#8a8f98] border border-[#23252a]">
                                        {filteredStartups.length} {filteredStartups.length !== startups.length ? `/ ${startups.length}` : 'Total'}
                                    </span>
                                </div>
                                <p className="text-xs text-[#8a8f98] mt-0.5">
                                    Vetted startups pitching for Seed & Series A capital
                                </p>
                            </div>

                            {/* Search and Sector Filter Controls */}
                            <div className="flex flex-wrap items-center gap-2">
                                {/* Search Box */}
                                <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                                    <Search className="w-3.5 h-3.5 text-[#8a8f98] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                        type="text"
                                        value={startupSearch}
                                        onChange={(e) => {
                                            setStartupSearch(e.target.value);
                                            setStartupPage(1);
                                        }}
                                        placeholder="Search name, founder..."
                                        className="w-full pl-8 pr-8 py-1.5 bg-[#010102] border border-[#23252a] rounded-md text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-[#5e6ad2] transition-colors"
                                    />
                                    {startupSearch && (
                                        <button
                                            onClick={() => {
                                                setStartupSearch('');
                                                setStartupPage(1);
                                            }}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a8f98] hover:text-[#f7f8f8] cursor-pointer"
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
                                        className="bg-[#010102] border border-[#23252a] text-xs text-[#f7f8f8] rounded-md pl-3 pr-8 py-1.5 focus:outline-none focus:border-[#5e6ad2] cursor-pointer appearance-none"
                                    >
                                        <option value="All">All Sectors ({startups.length})</option>
                                        {startupSectors.filter((sec) => sec !== 'All').map((sec) => (
                                            <option key={sec} value={sec} className="bg-[#0f1011] text-[#f7f8f8]">{sec}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="w-3.5 h-3.5 text-[#8a8f98] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>

                                {/* Reset Filters */}
                                {(startupSearch || startupSector !== 'All') && (
                                    <button
                                        onClick={() => {
                                            setStartupSearch('');
                                            setStartupSector('All');
                                            setStartupPage(1);
                                        }}
                                        className="px-2.5 py-1.5 rounded-md bg-[#141516] hover:bg-[#18191a] text-[#8a8f98] hover:text-[#f7f8f8] text-xs font-medium flex items-center gap-1 border border-[#23252a] transition-colors cursor-pointer"
                                    >
                                        <RefreshCw className="w-3 h-3" />
                                        <span>Reset</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Table Content */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-[#d0d6e0]">
                                <thead className="bg-[#141516] text-[#8a8f98] font-medium text-xs border-b border-[#23252a]">
                                    <tr>
                                        <th className="py-3 px-4">Startup & Founder</th>
                                        <th className="py-3 px-4">Sector</th>
                                        <th className="py-3 px-4">Stage</th>
                                        <th className="py-3 px-4">Target Ask</th>
                                        <th className="py-3 px-4">Key Metrics</th>
                                        <th className="py-3 px-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <motion.tbody
                                    key={`startups-page-${startupPage}-${startupSector}-${startupSearch}`}
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="divide-y divide-[#23252a]"
                                >
                                    {paginatedStartups.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-10 text-center text-[#8a8f98] text-xs">
                                                <div className="flex flex-col items-center justify-center gap-1.5">
                                                    <Building2 className="w-6 h-6 text-[#62666d]" />
                                                    <p className="font-medium text-[#f7f8f8]">No startups found matching filter</p>
                                                    <p className="text-[11px] text-[#8a8f98]">Try adjusting search or sector criteria</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedStartups.map((s) => (
                                            <motion.tr
                                                key={s.id}
                                                variants={itemVariants}
                                                className="hover:bg-[#141516]/60 transition-colors"
                                            >
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={s.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80'} alt={s.name} className="w-8 h-8 rounded-md object-cover border border-[#23252a] shrink-0" />
                                                        <div className="min-w-0">
                                                            <div className="font-medium text-[#f7f8f8] text-xs truncate">{s.name}</div>
                                                            <div className="text-[11px] text-[#8a8f98] truncate">{s.founderName} {s.founderTitle ? `(${s.founderTitle})` : ''}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#141516] text-[#d0d6e0] border border-[#23252a] whitespace-nowrap">
                                                        {s.sector || 'General Tech'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 font-mono text-xs text-[#828fff] whitespace-nowrap">{s.stage || 'Seed'}</td>
                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    <span className="font-mono font-medium text-[#27a644]">{s.targetAsk || 'TBD'}</span>
                                                    <div className="text-[10px] text-[#8a8f98] font-mono">Val: {s.valuation || 'TBD'}</div>
                                                </td>
                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    <div className="text-[#f7f8f8] font-mono text-xs">{s.metrics?.mrr || s.metrics?.arr || 'N/A'}</div>
                                                    <div className="text-[10px] text-[#8a8f98] font-mono">{s.metrics?.growthRate || ''}</div>
                                                </td>
                                                <td className="py-3 px-4 whitespace-nowrap text-right">
                                                    {(() => {
                                                        const isThisMatching = matchingStartupId === s.id;
                                                        return (
                                                            <button
                                                                onClick={() => onRunMatchmaking(s)}
                                                                disabled={isMatchmakingLoading}
                                                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5 disabled:cursor-not-allowed ${isThisMatching
                                                                        ? 'bg-[#5e6ad2] text-white opacity-80 animate-pulse'
                                                                        : 'bg-[#5e6ad2] hover:bg-[#828fff] text-white'
                                                                    }`}
                                                            >
                                                                {isThisMatching ? (
                                                                    <>
                                                                        <Loader2 className="w-3 h-3 animate-spin text-white" />
                                                                        <span>Matching...</span>
                                                                    </>
                                                                ) : (
                                                                    <span>Match VC</span>
                                                                )}
                                                            </button>
                                                        );
                                                    })()}
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
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="bg-[#0f1011] border border-[#23252a] rounded-xl overflow-hidden shadow-sm"
                    >
                        {/* Table Header: Search & Filter Toolbar */}
                        <div className="p-4 border-b border-[#23252a] bg-[#0f1011] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-semibold text-[#f7f8f8] tracking-tight">
                                        DAVAS Attending VCs & Angels
                                    </h3>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#141516] text-[#8a8f98] border border-[#23252a]">
                                        {filteredInvestors.length} {filteredInvestors.length !== investors.length ? `/ ${investors.length}` : 'Total'}
                                    </span>
                                </div>
                                <p className="text-xs text-[#8a8f98] mt-0.5">
                                    Institutional funds, venture partners, and angel investors
                                </p>
                            </div>

                            {/* Search and Mandate Filter Controls */}
                            <div className="flex flex-wrap items-center gap-2">
                                {/* Search Box */}
                                <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                                    <Search className="w-3.5 h-3.5 text-[#8a8f98] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                        type="text"
                                        value={investorSearch}
                                        onChange={(e) => {
                                            setInvestorSearch(e.target.value);
                                            setInvestorPage(1);
                                        }}
                                        placeholder="Search name, fund..."
                                        className="w-full pl-8 pr-8 py-1.5 bg-[#010102] border border-[#23252a] rounded-md text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-[#5e6ad2] transition-colors"
                                    />
                                    {investorSearch && (
                                        <button
                                            onClick={() => {
                                                setInvestorSearch('');
                                                setInvestorPage(1);
                                            }}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a8f98] hover:text-[#f7f8f8] cursor-pointer"
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
                                            className="bg-[#010102] border border-[#23252a] text-xs text-[#f7f8f8] rounded-md pl-3 pr-8 py-1.5 focus:outline-none focus:border-[#5e6ad2] cursor-pointer appearance-none"
                                        >
                                            <option value="All">All Sectors ({investors.length})</option>
                                            {investorSectors.filter((sec) => sec !== 'All').map((sec) => (
                                                <option key={sec} value={sec} className="bg-[#0f1011] text-[#f7f8f8]">{sec}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="w-3.5 h-3.5 text-[#8a8f98] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                                        className="px-2.5 py-1.5 rounded-md bg-[#141516] hover:bg-[#18191a] text-[#8a8f98] hover:text-[#f7f8f8] text-xs font-medium flex items-center gap-1 border border-[#23252a] transition-colors cursor-pointer"
                                    >
                                        <RefreshCw className="w-3 h-3" />
                                        <span>Reset</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Table Content */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-[#d0d6e0]">
                                <thead className="bg-[#141516] text-[#8a8f98] font-medium text-xs border-b border-[#23252a]">
                                    <tr>
                                        <th className="py-3 px-4">Representative</th>
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
                                    className="divide-y divide-[#23252a]"
                                >
                                    {paginatedInvestors.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-10 text-center text-[#8a8f98] text-xs">
                                                <div className="flex flex-col items-center justify-center gap-1.5">
                                                    <Users className="w-6 h-6 text-[#62666d]" />
                                                    <p className="font-medium text-[#f7f8f8]">No investors found</p>
                                                    <p className="text-[11px] text-[#8a8f98]">Try adjusting search criteria</p>
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
                                                    className="hover:bg-[#141516]/60 transition-colors"
                                                >
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={inv.avatar || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80'}
                                                                alt={inv.name}
                                                                className="w-8 h-8 rounded-full object-cover border border-[#23252a] shrink-0"
                                                            />
                                                            <div className="min-w-0">
                                                                <div className="font-medium text-[#f7f8f8] text-xs truncate">{inv.name}</div>
                                                                <div className="text-[11px] text-[#8a8f98] truncate">{inv.role || 'Partner'}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 whitespace-nowrap">
                                                        <span className="font-medium text-[#f7f8f8] text-xs">{inv.firm}</span>
                                                        <div className="text-[10px] text-[#8a8f98] font-mono">{inv.country || 'Vietnam'}</div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex flex-wrap gap-1 max-w-xs">
                                                            {sectorsList.map((sec, i) => (
                                                                <span key={i} className="px-1.5 py-0.5 rounded bg-[#141516] text-[10px] text-[#8a8f98] border border-[#23252a] font-mono">
                                                                    {sec}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 font-mono font-medium text-[#27a644] whitespace-nowrap">
                                                        {inv.ticketSizeRange || '$50k - $250k'}
                                                    </td>
                                                    <td className="py-3 px-4 text-[#8a8f98] text-[11px] max-w-sm line-clamp-2 leading-relaxed">
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

                {/* TAB 5: SUMMIT TABLES (12 TABLES ACROSS 4 ZONES) */}
                {activeTab === 'tables' && (
                    <motion.div
                        key="tables"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                    >
                        {/* Occupancy Rate & Telemetry Banner */}
                        <div className="bg-[#0f1011] p-5 rounded-xl border border-[#23252a]">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#141516] text-[#d0d6e0] border border-[#23252a] flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#27a644]" />
                                            Live Floor Plan
                                        </span>
                                        <span className="text-xs text-[#8a8f98] font-mono">
                                            Furama Resort Danang
                                        </span>
                                    </div>
                                    <h3 className="text-base font-semibold text-[#f7f8f8] tracking-tight flex items-center gap-2">
                                        <span>DAVAS 2026 Summit Tables</span>
                                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#141516] text-[#8a8f98] border border-[#23252a]">
                                            12 Tables / 4 Zones
                                        </span>
                                    </h3>
                                    <p className="text-xs text-[#8a8f98] mt-0.5 max-w-2xl">
                                        Track 1:1 business matching sessions in real-time across 8 daily session slots.
                                    </p>
                                </div>

                                {/* Slot Occupancy Gauge */}
                                {(() => {
                                    const occupiedInCurrentSlot = SUMMIT_ZONES.flatMap((z) => z.tables).filter((tableId) =>
                                        scheduleSlots.some((s) => s.table === tableId && s.time === selectedTableTimeSlot)
                                    ).length;
                                    const occupancyRate = Math.round((occupiedInCurrentSlot / 12) * 100);

                                    return (
                                        <div className="bg-[#141516] p-3.5 rounded-lg border border-[#23252a] flex flex-col sm:flex-row items-center gap-4 shrink-0">
                                            <div className="text-center sm:text-left">
                                                <div className="text-[10px] font-medium uppercase tracking-wider text-[#8a8f98] font-mono">
                                                    Slot Occupancy
                                                </div>
                                                <div className="text-xl font-semibold text-[#f7f8f8] font-mono mt-0.5">
                                                    {occupancyRate}%
                                                </div>
                                                <div className="text-[11px] text-[#8a8f98]">
                                                    <span className="text-[#f7f8f8] font-mono font-medium">{occupiedInCurrentSlot}</span> of 12 Booked
                                                </div>
                                            </div>

                                            {/* Visual Progress Bar */}
                                            <div className="w-full sm:w-32 space-y-1">
                                                <div className="w-full h-2 bg-[#010102] rounded-full overflow-hidden border border-[#23252a]">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${occupancyRate}%` }}
                                                        transition={{ duration: 0.6, ease: 'easeOut' }}
                                                        className="h-full rounded-full bg-[#5e6ad2]"
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between text-[10px] font-mono text-[#62666d]">
                                                    <span>0%</span>
                                                    <span>{12 - occupiedInCurrentSlot} free</span>
                                                    <span>100%</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Time Slot Filter Selector (8 Ca họp trong ngày) */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-[#8a8f98]">
                                <div className="flex items-center gap-1.5 font-medium">
                                    <Clock className="w-3.5 h-3.5 text-[#8a8f98]" />
                                    <span>Select Time Slot</span>
                                </div>
                                <div>
                                    Viewing: <span className="font-mono text-[#f7f8f8] font-medium">{selectedTableTimeSlot}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
                                {SUMMIT_TIME_SLOTS.map((slotTime, idx) => {
                                    const isSelected = selectedTableTimeSlot === slotTime;
                                    const occupiedCount = SUMMIT_ZONES.flatMap((z) => z.tables).filter((tableId) =>
                                        scheduleSlots.some((s) => s.table === tableId && s.time === slotTime)
                                    ).length;

                                    return (
                                        <button
                                            key={slotTime}
                                            onClick={() => setSelectedTableTimeSlot(slotTime)}
                                            className={`p-2 rounded-lg border text-left transition-colors cursor-pointer flex flex-col justify-between gap-1 ${isSelected
                                                    ? 'bg-[#141516] text-[#f7f8f8] border-[#5e6ad2] shadow-sm'
                                                    : 'bg-[#0f1011] border-[#23252a] hover:border-[#34343a] text-[#8a8f98]'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className={`text-[10px] font-mono font-medium ${isSelected ? 'text-[#828fff]' : 'text-[#62666d]'}`}>
                                                    S{idx + 1}
                                                </span>
                                                <span className="text-[9px] font-mono text-[#8a8f98]">
                                                    {occupiedCount}/12
                                                </span>
                                            </div>
                                            <div className={`text-xs font-mono truncate ${isSelected ? 'text-[#f7f8f8]' : 'text-[#8a8f98]'}`}>
                                                {slotTime.split(' - ')[0]}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 4 Zones Floor Matrix (Zone A -> Zone D) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {SUMMIT_ZONES.map((zone) => {
                                const zoneMeetings = zone.tables.map((tableId) => {
                                    return {
                                        tableId,
                                        meeting: scheduleSlots.find((s) => s.table === tableId && s.time === selectedTableTimeSlot),
                                    };
                                });

                                const zoneOccupiedCount = zoneMeetings.filter((zm) => zm.meeting).length;

                                return (
                                    <div
                                        key={zone.id}
                                        className="bg-[#0f1011] p-4 rounded-xl border border-[#23252a] space-y-3"
                                    >
                                        {/* Zone Header */}
                                        <div className="flex items-center justify-between pb-2 border-b border-[#23252a]">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#141516] text-[#d0d6e0] border border-[#23252a]">
                                                    {zone.name}
                                                </span>
                                                <div>
                                                    <h4 className="text-xs font-medium text-[#f7f8f8]">
                                                        {zone.subtitle}
                                                    </h4>
                                                </div>
                                            </div>

                                            <span className="text-[10px] font-mono text-[#8a8f98]">
                                                {zoneOccupiedCount}/3 Occupied
                                            </span>
                                        </div>

                                        {/* Zone Tables (3 Tables per Zone) */}
                                        <div className="space-y-2">
                                            {zoneMeetings.map(({ tableId, meeting }) => {
                                                if (meeting) {
                                                    // OCCUPIED TABLE CARD
                                                    const pair = matches.find(
                                                        (m) =>
                                                            (m.startup.id === meeting.startup.id && m.investor.id === meeting.investor.id) ||
                                                            (m.startup.name === meeting.startup.name && m.investor.firm === meeting.investor.firm)
                                                    );

                                                    return (
                                                        <div
                                                            key={tableId}
                                                            className="p-3 rounded-lg border border-[#5e6ad2]/40 bg-[#5e6ad2]/10 space-y-2.5 transition-colors"
                                                        >
                                                            <div className="flex items-center justify-between pb-1.5 border-b border-[#5e6ad2]/20">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#828fff]" />
                                                                    <span className="font-mono text-xs font-medium text-[#f7f8f8]">
                                                                        {tableId}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#141516] text-[#828fff] border border-[#5e6ad2]/30">
                                                                        {meeting.matchScore || 95}% Match
                                                                    </span>
                                                                    <span className="text-[10px] font-mono text-[#8a8f98]">
                                                                        {meeting.status || 'Upcoming'}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                                <div className="space-y-0.5 min-w-0">
                                                                    <div className="text-[10px] text-[#8a8f98] font-mono uppercase">Startup</div>
                                                                    <div className="font-medium text-[#f7f8f8] truncate">{meeting.startup.name}</div>
                                                                    <div className="text-[10px] text-[#8a8f98] truncate">{meeting.startup.founderName}</div>
                                                                </div>

                                                                <div className="space-y-0.5 min-w-0 border-l border-[#5e6ad2]/20 pl-2">
                                                                    <div className="text-[10px] text-[#8a8f98] font-mono uppercase">Investor</div>
                                                                    <div className="font-medium text-[#f7f8f8] truncate">{meeting.investor.firm}</div>
                                                                    <div className="text-[10px] text-[#8a8f98] truncate">{meeting.investor.name}</div>
                                                                </div>
                                                            </div>

                                                            <button
                                                                onClick={() => {
                                                                    if (pair) {
                                                                        onInspectMatch(pair);
                                                                    } else {
                                                                        onInspectMatch({
                                                                            id: meeting.id,
                                                                            startupId: meeting.startup.id,
                                                                            investorId: meeting.investor.id,
                                                                            startup: meeting.startup,
                                                                            investor: meeting.investor,
                                                                            status: (meeting.status as any) || 'Scheduled',
                                                                            recommendedTable: meeting.table,
                                                                            analysis: {
                                                                                matching_score: meeting.matchScore || 95,
                                                                                reason: `Scheduled 1:1 business meeting at ${meeting.table} (${meeting.time}).`,
                                                                                ice_breakers: meeting.aiSuggestedTopics || [
                                                                                    'What are your primary go-to-market drivers?',
                                                                                    'How do you plan to leverage our VC network?',
                                                                                    'What unit economics benchmarks do you aim for post-round?'
                                                                                ],
                                                                            },
                                                                        });
                                                                    }
                                                                }}
                                                                className="w-full py-1 px-2 rounded bg-[#141516] hover:bg-[#18191a] text-[#8a8f98] hover:text-[#f7f8f8] text-[11px] font-medium border border-[#23252a] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                                            >
                                                                <FileText className="w-3 h-3 text-[#828fff]" />
                                                                <span>Inspect Meeting</span>
                                                            </button>
                                                        </div>
                                                    );
                                                } else {
                                                    // AVAILABLE TABLE CARD
                                                    return (
                                                        <div
                                                            key={tableId}
                                                            className="p-3 rounded-lg border border-[#23252a] bg-[#141516] text-[#8a8f98] flex items-center justify-between transition-colors"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-[#62666d]" />
                                                                <span className="font-mono text-xs text-[#d0d6e0]">
                                                                    {tableId}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center gap-1.5 text-[11px]">
                                                                <Grid className="w-3 h-3 text-[#62666d]" />
                                                                <span>Available</span>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
