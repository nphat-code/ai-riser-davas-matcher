import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
    Calendar,
    Clock,
    MapPin,
    Sparkles,
    FileText,
    CheckCircle2,
    ChevronRight,
    Info,
    Users,
    ChevronDown,
    Compass,
    Mic,
    Utensils
} from 'lucide-react';
import { MeetingSlot, Investor } from '../types';

interface ParticipantPortalProps {
    scheduleSlots: MeetingSlot[];
    currentInvestor: Investor | null;
    investors?: Investor[];
    selectedInvestorId?: string;
    setSelectedInvestorId?: (id: string) => void;
    onSelectInvestorId?: (id: string) => void;
    onOpenFollowUpModal: (slot: MeetingSlot) => void;
}

interface SummitAgendaItem {
    id: string;
    time: string;
    location: string;
    title: string;
    description: string;
    tags: string[];
    type: 'networking' | 'summit' | 'workshop' | 'showcase' | 'pitch' | 'gala';
}

// 3-Day DAVAS Summit Agenda Data
const SUMMIT_3DAY_AGENDA: {
    day1: SummitAgendaItem[];
    day2: SummitAgendaItem[];
    day3: SummitAgendaItem[];
} = {
    day1: [
        {
            id: 'd1-golf',
            time: '06:30 - 12:00',
            location: 'Montgomerie Links Vietnam',
            title: 'DAVAS Champion Golf Tournament',
            description: 'Exclusive executive golf tournament connecting global venture capitalists, angel investors, and tech corporate leaders in a relaxed seaside setting.',
            tags: ['Networking', 'Sports', 'VIP VC'],
            type: 'networking',
        },
        {
            id: 'd1-web3',
            time: '13:30 - 17:00',
            location: 'Hall A • Furama Resort',
            title: "Web3 Builders' Summit",
            description: 'Deep-dive technical keynotes & panel discussions on Decentralized Infrastructure, Real World Assets (RWA), and Digital Asset Regulation.',
            tags: ['Blockchain', 'Web3', 'FinTech'],
            type: 'summit',
        },
        {
            id: 'd1-market-access',
            time: '14:00 - 17:30',
            location: 'Hall B • Furama Resort',
            title: 'Pre-DAVAS Market Access Workshop',
            description: 'Hands-on strategy session for high-growth startups targeting cross-border expansion across SEA, Japan, Korea, and North American markets.',
            tags: ['Startups', 'Growth', 'Global Markets'],
            type: 'workshop',
        },
    ],
    day2: [
        {
            id: 'd2-opening',
            time: '08:30 - 10:00',
            location: 'Grand Ballroom',
            title: 'DAVAS 2026 Official Opening Ceremony',
            description: 'Official opening remarks from Da Nang City Leaders, Ministry of Science & Technology, and Keynote Addresses by premier Global VC Managing Partners.',
            tags: ['Keynote', 'Government', 'Global VCs'],
            type: 'summit',
        },
        {
            id: 'd2-expo',
            time: '10:00 - 17:30',
            location: 'Exhibition Plaza',
            title: 'Tech Exhibition & Startup Showcase (50+ Booths)',
            description: 'Interactive demo zone featuring 50+ cutting-edge startups across AI, Semiconductors, FinTech, GreenTech, and Smart City hardware.',
            tags: ['Demo', 'Tech Showcase', 'Exhibition'],
            type: 'showcase',
        },
        {
            id: 'd2-mou',
            time: '10:30 - 12:00',
            location: 'Grand Ballroom',
            title: 'Venture Capital Outlook & Innovation MOU Signing',
            description: 'Strategic macro panel analyzing Southeast Asia early-stage deal flow, valuation benchmarks, and bilateral investment commitment signings.',
            tags: ['VC Trends', 'Policy', 'Partnerships'],
            type: 'summit',
        },
        {
            id: 'd2-ai-semiconductor',
            time: '13:30 - 15:00',
            location: 'Hall A',
            title: 'AI & Semiconductor Thematic Forum',
            description: 'Specialized panel focusing on Vietnam’s emerging semiconductor supply chain, IC design centers, and enterprise generative AI deployment.',
            tags: ['AI', 'DeepTech', 'Hardware', 'Semiconductor'],
            type: 'summit',
        },
        {
            id: 'd2-fintech-green',
            time: '15:30 - 17:00',
            location: 'Hall B',
            title: 'FinTech, Web3 & Green Capital Transition',
            description: 'Exploring ESG compliance, carbon credit trading infrastructure, climate-tech funding instruments, and future open banking rails.',
            tags: ['FinTech', 'Cleantech', 'Sustainability'],
            type: 'summit',
        },
    ],
    day3: [
        {
            id: 'd3-pitching',
            time: '08:30 - 11:30',
            location: 'Grand Ballroom',
            title: 'DAVAS Startup Pitching Arena',
            description: 'Top 20 selected seed & series-A tech startups deliver 5-minute live pitches followed by 3-minute Q&A rounds before the esteemed VC Jury.',
            tags: ['Pitching', 'Top 20', 'VC Jury'],
            type: 'pitch',
        },
        {
            id: 'd3-matching',
            time: '09:00 - 16:00',
            location: 'Summit Hall (Tables A1 - D3)',
            title: 'Dedicated 1:1 Business Matching Sessions',
            description: 'Curated 40-minute speed matching sessions across 12 designated Summit Tables connecting shortlisted founders with matched investors.',
            tags: ['1:1 Matching', '12 Tables', 'Dealflow'],
            type: 'networking',
        },
        {
            id: 'd3-gala',
            time: '18:00 - 21:00',
            location: 'Ocean Ballroom • Beachfront Lawn',
            title: 'Closing Ceremony & DAVAS Gala Dinner',
            description: 'Celebratory awards gala, Top Startup honors announcement, closing remarks, fine-dining banquet, and executive beachfront networking.',
            tags: ['Awards', 'Networking Dinner', 'Celebration'],
            type: 'gala',
        },
    ],
};

// Staggered variants for vertical timeline
const timelineContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

const timelineItemVariants = {
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

export const ParticipantPortal: React.FC<ParticipantPortalProps> = ({
    scheduleSlots,
    currentInvestor,
    investors = [],
    selectedInvestorId,
    setSelectedInvestorId,
    onSelectInvestorId,
    onOpenFollowUpModal,
}) => {
    // Day Selector (Default to Day 3 for immediate 1:1 Speed Matching view)
    const [selectedDay, setSelectedDay] = useState<'day1' | 'day2' | 'day3'>('day3');
    const [activeFilter, setActiveFilter] = useState<'All' | 'Upcoming' | 'Completed'>('All');

    const handleInvestorChange = (newId: string) => {
        if (setSelectedInvestorId) setSelectedInvestorId(newId);
        if (onSelectInvestorId) onSelectInvestorId(newId);
    };

    const filteredSlots = scheduleSlots.filter((slot) => {
        if (activeFilter === 'Upcoming') return slot.status === 'Upcoming' || slot.status === 'In Progress';
        if (activeFilter === 'Completed') return slot.status === 'Completed';
        return true;
    });

    const investorName = currentInvestor?.name || 'DAVAS Delegate';
    const investorFirm = currentInvestor?.firm || 'Attending Venture Capital';
    const investorRole = currentInvestor?.role || 'Partner';
    const investorAvatar =
        currentInvestor?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';

    // Extract investor sector keywords and investment philosophy for AI Recommended badge matching
    const investorSectors = (currentInvestor?.targetSectors || (currentInvestor as any)?.sectors || []).map((s: string) => s.toLowerCase());
    const investmentPhilosophy = (currentInvestor?.investmentPhilosophy || '').toLowerCase();

    const isEventAIRecommended = (tags: string[], title: string, desc: string) => {
        if (!currentInvestor) return false;
        const combinedContent = `${tags.join(' ')} ${title} ${desc}`.toLowerCase();

        // Match against target sectors with smart keyword mapping
        const sectorMatch = investorSectors.some((sec: string) => {
            const cleanSec = sec.trim().toLowerCase();
            if (!cleanSec) return false;
            return (
                combinedContent.includes(cleanSec) ||
                (cleanSec.includes('ai') && combinedContent.includes('ai')) ||
                (cleanSec.includes('deeptech') && (combinedContent.includes('deeptech') || combinedContent.includes('semiconductor'))) ||
                (cleanSec.includes('fintech') && combinedContent.includes('fintech')) ||
                (cleanSec.includes('blockchain') && (combinedContent.includes('web3') || combinedContent.includes('blockchain') || combinedContent.includes('rwa'))) ||
                (cleanSec.includes('cleantech') && (combinedContent.includes('green') || combinedContent.includes('cleantech') || combinedContent.includes('sustainability'))) ||
                (cleanSec.includes('hardware') && (combinedContent.includes('semiconductor') || combinedContent.includes('hardware'))) ||
                (cleanSec.includes('saas') && combinedContent.includes('market access'))
            );
        });

        // Match against investment philosophy
        const philosophyMatch = ['web3', 'ai', 'deeptech', 'fintech', 'semiconductor', 'sustainability', 'green', 'golf', 'vip vc']
            .some(kw => investmentPhilosophy.includes(kw) && combinedContent.includes(kw));

        return sectorMatch || philosophyMatch;
    };

    const avgInvestorScore =
        scheduleSlots.length > 0
            ? Math.round(scheduleSlots.reduce((acc, s) => acc + (s.matchScore || 90), 0) / scheduleSlots.length)
            : 0;

    return (
        <div className="max-w-md mx-auto min-h-screen pb-20 space-y-5 px-2 sm:px-0">
            {/* Mobile Device Frame Header Accent */}
            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="glass-panel p-5 rounded-3xl border border-cyan-500/30 relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 shadow-xl"
            >
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* Investor Persona Switcher Dropdown */}
                {investors.length > 0 && (
                    <div className="mb-4 pb-3.5 border-b border-slate-800/90 flex flex-col gap-1.5 relative z-10">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                            <span className="flex items-center gap-1.5 text-cyan-400">
                                <Users className="w-3.5 h-3.5" />
                                <span>Investor Persona Switcher</span>
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                                {investors.length} VCs
                            </span>
                        </div>
                        <div className="relative">
                            <select
                                id="investor-persona-switcher"
                                value={selectedInvestorId || currentInvestor?.id || ''}
                                onChange={(e) => handleInvestorChange(e.target.value)}
                                className="w-full bg-slate-950/90 text-cyan-200 text-xs font-semibold rounded-xl border border-cyan-500/30 px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer truncate appearance-none hover:border-cyan-400/60 transition-all shadow-inner"
                            >
                                {investors.map((inv) => (
                                    <option key={inv.id} value={inv.id} className="bg-slate-900 text-slate-100 py-1.5">
                                        {inv.firm} - {inv.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-cyan-400/80 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                )}

                {/* Welcome Investor Header */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img
                            src={investorAvatar}
                            alt={investorName}
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-400/40 shadow-lg shadow-cyan-500/20"
                        />
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase tracking-wider border border-cyan-500/30">
                                DAVAS Delegate
                            </span>
                            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                Live Summit
                            </span>
                        </div>
                        <h2 className="text-lg font-extrabold text-white tracking-tight mt-0.5 truncate">
                            Welcome, {investorFirm}
                        </h2>
                        <p className="text-xs text-slate-400 truncate">
                            {investorName} • {investorRole}
                        </p>
                    </div>
                </div>

                {/* Quick Day Stats Banner */}
                <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 text-center">
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="bg-slate-950/60 p-2 rounded-xl border border-slate-800"
                    >
                        <div className="text-[10px] text-slate-400 uppercase font-bold">1:1 Meetings</div>
                        <div className="text-base font-black text-cyan-300">{scheduleSlots.length}</div>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="bg-slate-950/60 p-2 rounded-xl border border-slate-800"
                    >
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Hall Location</div>
                        <div className="text-xs font-bold text-white mt-1">Furama A1</div>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="bg-slate-950/60 p-2 rounded-xl border border-slate-800"
                    >
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Avg AI Match</div>
                        <div className="text-base font-black text-yellow-400">
                            {scheduleSlots.length > 0 ? `${avgInvestorScore}%` : '--'}
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* 3-DAY SUMMIT AGENDA SELECTOR TABS */}
            <div className="space-y-3 px-1">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-cyan-400" />
                            <span>DAVAS 2026 Official Agenda</span>
                        </h3>
                        <p className="text-[11px] text-slate-400">
                            3-Day Official Schedule & Curated Sessions
                        </p>
                    </div>
                    <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-1 rounded-lg border border-cyan-500/30 font-bold">
                        3-Day Pass
                    </span>
                </div>

                {/* 3-Day Navigation Bar */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setSelectedDay('day1')}
                        className={`py-2 px-1 text-center rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center ${selectedDay === 'day1'
                                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-500/20 font-bold'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                            }`}
                    >
                        <span className="text-xs">🏌️ Day 1</span>
                        <span className="text-[9px] opacity-80 whitespace-nowrap">Fringe & Golf</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setSelectedDay('day2')}
                        className={`py-2 px-1 text-center rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center ${selectedDay === 'day2'
                                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-500/20 font-bold'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                            }`}
                    >
                        <span className="text-xs">🏛️ Day 2</span>
                        <span className="text-[9px] opacity-80 whitespace-nowrap">Summit & Expo</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setSelectedDay('day3')}
                        className={`py-2 px-1 text-center rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center relative ${selectedDay === 'day3'
                                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-500/20 font-bold ring-1 ring-cyan-400'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                            }`}
                    >
                        <span className="text-xs flex items-center gap-1">
                            🤝 Day 3
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        </span>
                        <span className="text-[9px] opacity-80 whitespace-nowrap">1:1 Matching</span>
                    </motion.button>
                </div>
            </div>

            {/* DAY 1 CONTENT */}
            {selectedDay === 'day1' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                >
                    <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Compass className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs font-bold text-white">Day 1: Kickoff, Golf & Workshops</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">August 11, 2026</span>
                    </div>

                    <div className="space-y-3">
                        {SUMMIT_3DAY_AGENDA.day1.map((item) => {
                            const recommended = isEventAIRecommended(item.tags, item.title, item.description);

                            return (
                                <motion.div
                                    key={item.id}
                                    whileHover={{ y: -2 }}
                                    className={`glass-panel p-4 rounded-2xl border transition-all ${recommended
                                            ? 'border-cyan-500/50 bg-gradient-to-b from-slate-900/90 to-indigo-950/40 shadow-lg shadow-cyan-500/10'
                                            : 'border-slate-800/80 bg-slate-950/70 hover:border-slate-700'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800/80 gap-2">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 font-mono">
                                            <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                            <span>{item.time}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                                            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                            <span className="truncate max-w-[170px]">{item.location}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="text-sm font-extrabold text-white leading-snug">
                                                {item.title}
                                            </h4>
                                            {recommended && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0 flex items-center gap-1">
                                                    <Sparkles className="w-2.5 h-2.5 text-yellow-400" />
                                                    Recommended for You
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            {item.description}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                            {item.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-0.5 rounded-md bg-slate-900 text-[10px] text-slate-400 border border-slate-800 font-medium"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* DAY 2 CONTENT */}
            {selectedDay === 'day2' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                >
                    <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Compass className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs font-bold text-white">Day 2: Main Summit & Tech Expo</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">August 12, 2026</span>
                    </div>

                    <div className="space-y-3">
                        {SUMMIT_3DAY_AGENDA.day2.map((item) => {
                            const recommended = isEventAIRecommended(item.tags, item.title, item.description);

                            return (
                                <motion.div
                                    key={item.id}
                                    whileHover={{ y: -2 }}
                                    className={`glass-panel p-4 rounded-2xl border transition-all ${recommended
                                            ? 'border-cyan-500/50 bg-gradient-to-b from-slate-900/90 to-indigo-950/40 shadow-lg shadow-cyan-500/10'
                                            : 'border-slate-800/80 bg-slate-950/70 hover:border-slate-700'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800/80 gap-2">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 font-mono">
                                            <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                            <span>{item.time}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                                            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                            <span className="truncate max-w-[170px]">{item.location}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="text-sm font-extrabold text-white leading-snug">
                                                {item.title}
                                            </h4>
                                            {recommended && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0 flex items-center gap-1">
                                                    <Sparkles className="w-2.5 h-2.5 text-yellow-400" />
                                                    Recommended for You
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            {item.description}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                            {item.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-0.5 rounded-md bg-slate-900 text-[10px] text-slate-400 border border-slate-800 font-medium"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* DAY 3 CONTENT (1:1 INVESTMENT SPEED MATCHING & GALA) */}
            {selectedDay === 'day3' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                >
                    {/* Day 3 Highlight Cards (Pitching & Gala Banners) */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 rounded-2xl bg-gradient-to-b from-slate-900 to-indigo-950/60 border border-indigo-500/30 space-y-1">
                            <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-bold">
                                <Mic className="w-3.5 h-3.5" />
                                <span>Pitch Arena</span>
                            </div>
                            <div className="text-[11px] font-bold text-white">08:30 - 11:30</div>
                            <div className="text-[10px] text-slate-400">Grand Ballroom • Top 20</div>
                        </div>

                        <div className="p-3 rounded-2xl bg-gradient-to-b from-slate-900 to-purple-950/60 border border-purple-500/30 space-y-1">
                            <div className="flex items-center gap-1.5 text-purple-400 text-xs font-bold">
                                <Utensils className="w-3.5 h-3.5" />
                                <span>Gala Dinner</span>
                            </div>
                            <div className="text-[11px] font-bold text-white">18:00 - 21:00</div>
                            <div className="text-[10px] text-slate-400">Ocean Ballroom • Awards</div>
                        </div>
                    </div>

                    {/* 1:1 SPEED MATCHING TIMELINE SECTION */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-cyan-400" />
                                    <span>My 1:1 Speed Meetings (Summit Tables)</span>
                                </h4>
                                <p className="text-[11px] text-slate-400">
                                    09:00 - 16:00 | 12 Designated Summit Tables
                                </p>
                            </div>
                            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded-lg border border-cyan-500/30">
                                August 13, 2026
                            </span>
                        </div>

                        {/* Status Filter Chips */}
                        <div className="flex items-center gap-2 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
                            {(['All', 'Upcoming', 'Completed'] as const).map((filter) => (
                                <motion.button
                                    key={filter}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeFilter === filter
                                            ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-500/20'
                                            : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    {filter}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Vertical Timeline Schedule with Stagger Animation */}
                    {filteredSlots.length === 0 ? (
                        <div className="glass-panel p-8 rounded-3xl border border-dashed border-slate-800 text-center space-y-3">
                            <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <h4 className="text-sm font-bold text-white">No 1:1 Meetings Scheduled</h4>
                            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                                Generate your personalized AI speed meeting schedule in the Admin Dashboard to see your timed agenda here.
                            </p>
                        </div>
                    ) : (
                        <motion.div
                            variants={timelineContainerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-4 relative"
                        >
                            {/* Timeline Connecting Line */}
                            <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-slate-800 pointer-events-none" />

                            {filteredSlots.map((slot) => {
                                const isCompleted = slot.status === 'Completed';
                                const isInProgress = slot.status === 'In Progress';

                                return (
                                    <motion.div
                                        key={slot.id}
                                        variants={timelineItemVariants}
                                        className="relative pl-12 group"
                                    >
                                        {/* Timeline Indicator Dot */}
                                        <div
                                            className={`absolute left-3.5 top-5 -translate-x-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 ${isCompleted
                                                    ? 'bg-emerald-500 border-emerald-300 text-slate-950'
                                                    : isInProgress
                                                        ? 'bg-cyan-500 border-white text-slate-950 animate-pulse'
                                                        : 'bg-slate-900 border-slate-700 text-slate-500'
                                                }`}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                                            ) : (
                                                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                            )}
                                        </div>

                                        {/* Schedule Card Mobile Card with Hover Animation */}
                                        <motion.div
                                            whileHover={{
                                                y: -4,
                                                boxShadow: '0px 10px 20px rgba(124, 58, 237, 0.2)',
                                            }}
                                            className={`glass-panel p-4 rounded-2xl border transition-colors ${isInProgress
                                                    ? 'border-cyan-400/50 shadow-lg shadow-cyan-500/10 bg-slate-900/90'
                                                    : 'border-slate-800/80 bg-slate-950/70 hover:border-slate-700'
                                                }`}
                                        >
                                            {/* Time & Table Banner */}
                                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80 gap-2">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 font-mono whitespace-nowrap">
                                                    <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                                    <span>{slot.time}</span>
                                                </div>

                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {slot.table}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 whitespace-nowrap">
                                                        {slot.matchScore}% Match
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Startup Header Info */}
                                            <div className="flex items-start gap-3">
                                                <img
                                                    src={slot.startup.logo}
                                                    alt={slot.startup.name}
                                                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0 shadow-md"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <h4 className="text-sm font-extrabold text-white truncate">
                                                            {slot.startup.name}
                                                        </h4>
                                                        <div className="flex items-center gap-1.5 shrink-0">
                                                            {(slot.notes || slot.followUpGenerated) && (
                                                                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                                                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                                                    Logged
                                                                </span>
                                                            )}
                                                            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                                {slot.startup.stage}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">
                                                        {slot.startup.tagline}
                                                    </p>

                                                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                                                        <span>Ask: <strong className="text-white">{slot.startup.targetAsk}</strong></span>
                                                        <span>•</span>
                                                        <span>Founder: <strong className="text-slate-200">{slot.startup.founderName}</strong></span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Generated AI Followup summary pill if present */}
                                            {(slot.notes || slot.followUpGenerated) && (
                                                <div className="mt-3 p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs space-y-1">
                                                    <div className="flex items-center justify-between text-purple-300 font-semibold text-[11px]">
                                                        <span className="flex items-center gap-1">
                                                            <Sparkles className="w-3 h-3 text-yellow-400" />
                                                            {slot.followUpGenerated ? 'AI Follow-up Draft Ready' : 'Meeting Notes Saved'}
                                                        </span>
                                                        <span className="text-[10px] text-emerald-400 font-mono">Logged</span>
                                                    </div>
                                                    {slot.followUpGenerated ? (
                                                        <p className="text-[11px] text-slate-300 line-clamp-2 italic">
                                                            "{slot.followUpGenerated.emailSubject}"
                                                        </p>
                                                    ) : slot.notes ? (
                                                        <p className="text-[11px] text-slate-300 line-clamp-2 italic">
                                                            "{slot.notes}"
                                                        </p>
                                                    ) : null}
                                                </div>
                                            )}

                                            {/* Primary Action Button */}
                                            <div className="mt-4 pt-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => onOpenFollowUpModal(slot)}
                                                    className="w-full min-h-[44px] px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-lg shadow-cyan-600/20 border border-cyan-400/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                                                >
                                                    <FileText className="w-4 h-4 text-cyan-200" />
                                                    <span>
                                                        {(slot.notes || slot.followUpGenerated) ? 'View / Edit Notes & AI Draft' : 'Add Notes & AI Follow-up'}
                                                    </span>
                                                    <ChevronRight className="w-4 h-4 ml-auto text-cyan-200" />
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </motion.div>
            )}

            {/* Footnote tips for summit attendees */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400 space-y-1">
                <div className="flex items-center justify-center gap-1 text-cyan-400 font-semibold">
                    <Info className="w-3.5 h-3.5" />
                    <span>DAVAS 1:1 Summit Tip</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                    Tap "Add Notes & AI Follow-up" during or right after your 1:1 meeting. Our Gemini AI engine will draft an executive email summary and action items in seconds.
                </p>
            </div>
        </div>
    );
};
