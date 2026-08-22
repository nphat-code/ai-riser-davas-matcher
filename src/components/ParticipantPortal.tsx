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
    Utensils,
    Briefcase,
    Rocket,
    Building2,
    DollarSign
} from 'lucide-react';
import { MeetingSlot, Investor, Startup } from '../types';

interface ParticipantPortalProps {
    scheduleSlots: MeetingSlot[];
    currentInvestor?: Investor | null;
    investors?: Investor[];
    selectedInvestorId?: string;
    setSelectedInvestorId?: (id: string) => void;
    onSelectInvestorId?: (id: string) => void;
    startups?: Startup[];
    selectedStartupId?: string;
    setSelectedStartupId?: (id: string) => void;
    onSelectStartupId?: (id: string) => void;
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
            tags: ['Startups', 'Growth', 'Global Markets', 'SaaS'],
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
            tags: ['Demo', 'Tech Showcase', 'Exhibition', 'Startups'],
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
            tags: ['FinTech', 'Cleantech', 'Sustainability', 'Green'],
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

const timelineContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
        },
    },
};

const timelineItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.25,
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
    startups = [],
    selectedStartupId,
    setSelectedStartupId,
    onSelectStartupId,
    onOpenFollowUpModal,
}) => {
    // Delegate Persona Role State ('investor' vs 'startup')
    const [personaRole, setPersonaRole] = useState<'investor' | 'startup'>('investor');

    // Day Selector (Default to Day 3 for immediate 1:1 Speed Matching view)
    const [selectedDay, setSelectedDay] = useState<'day1' | 'day2' | 'day3'>('day3');
    const [activeFilter, setActiveFilter] = useState<'All' | 'Upcoming' | 'Completed'>('All');

    // Active Investor / Startup Resolution
    const activeInvestor: Investor | null =
        investors.find((i) => i.id === selectedInvestorId) ||
        currentInvestor ||
        (investors.length > 0 ? investors[0] : null);

    const activeStartup: Startup | null =
        startups.find((s) => s.id === selectedStartupId) ||
        (startups.length > 0 ? startups[0] : null);

    const handleInvestorChange = (newId: string) => {
        if (setSelectedInvestorId) setSelectedInvestorId(newId);
        if (onSelectInvestorId) onSelectInvestorId(newId);
    };

    const handleStartupChange = (newId: string) => {
        if (setSelectedStartupId) setSelectedStartupId(newId);
        if (onSelectStartupId) onSelectStartupId(newId);
    };

    // Filter 1:1 slots based on active role & selected entity
    const roleSlots = scheduleSlots.filter((slot) => {
        if (personaRole === 'investor') {
            if (!activeInvestor) return true;
            return slot.investor.id === activeInvestor.id || slot.investor.firm === activeInvestor.firm;
        } else {
            if (!activeStartup) return true;
            return slot.startup.id === activeStartup.id || slot.startup.name === activeStartup.name;
        }
    });

    const filteredSlots = roleSlots.filter((slot) => {
        if (activeFilter === 'Upcoming') return slot.status === 'Upcoming' || slot.status === 'In Progress';
        if (activeFilter === 'Completed') return slot.status === 'Completed';
        return true;
    });

    // Investor Profile Data
    const investorName = activeInvestor?.name || 'DAVAS Delegate';
    const investorFirm = activeInvestor?.firm || 'Attending Venture Capital';
    const investorRole = activeInvestor?.role || 'Partner';
    const investorAvatar =
        activeInvestor?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';

    // Startup Profile Data
    const startupName = activeStartup?.name || 'DAVAS Startup';
    const startupFounder = activeStartup?.founderName || 'Founder & CEO';
    const startupTitle = activeStartup?.founderTitle || 'Founder';
    const startupSector = activeStartup?.sector || 'General Tech';
    const startupStage = activeStartup?.stage || 'Seed';
    const startupAsk = activeStartup?.targetAsk || '$500K';
    const startupAvatar =
        activeStartup?.avatar ||
        activeStartup?.logo ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80';

    // Smart Workshop Match Logic for Day 1 & Day 2
    const isEventAIRecommended = (tags: string[], title: string, desc: string) => {
        const combinedContent = `${tags.join(' ')} ${title} ${desc}`.toLowerCase();

        if (personaRole === 'investor') {
            if (!activeInvestor) return false;
            const investorSectors = (activeInvestor?.targetSectors || (activeInvestor as any)?.sectors || []).map((s: string) => s.toLowerCase());
            const investmentPhilosophy = (activeInvestor?.investmentPhilosophy || '').toLowerCase();

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

            const philosophyMatch = ['web3', 'ai', 'deeptech', 'fintech', 'semiconductor', 'sustainability', 'green', 'golf', 'vip vc']
                .some((kw) => investmentPhilosophy.includes(kw) && combinedContent.includes(kw));

            return sectorMatch || philosophyMatch;
        } else {
            if (!activeStartup) return false;
            const sec = (activeStartup.sector || '').toLowerCase();
            const tagsList = (activeStartup.keyTags || []).map((t) => t.toLowerCase());

            const sectorMatch =
                combinedContent.includes(sec) ||
                (sec.includes('ai') && combinedContent.includes('ai')) ||
                (sec.includes('deeptech') && (combinedContent.includes('deeptech') || combinedContent.includes('semiconductor'))) ||
                (sec.includes('semiconductor') && combinedContent.includes('semiconductor')) ||
                (sec.includes('fintech') && combinedContent.includes('fintech')) ||
                (sec.includes('blockchain') && (combinedContent.includes('web3') || combinedContent.includes('blockchain') || combinedContent.includes('rwa'))) ||
                (sec.includes('web3') && (combinedContent.includes('web3') || combinedContent.includes('blockchain'))) ||
                (sec.includes('cleantech') && (combinedContent.includes('green') || combinedContent.includes('sustainability') || combinedContent.includes('cleantech'))) ||
                (sec.includes('greentech') && (combinedContent.includes('green') || combinedContent.includes('sustainability'))) ||
                (sec.includes('hardware') && (combinedContent.includes('semiconductor') || combinedContent.includes('hardware') || combinedContent.includes('deeptech'))) ||
                (sec.includes('saas') && (combinedContent.includes('market access') || combinedContent.includes('growth') || combinedContent.includes('summit')));

            const tagMatch = tagsList.some((t) => combinedContent.includes(t));
            const generalStartupMatch = combinedContent.includes('startup') || combinedContent.includes('market access') || combinedContent.includes('pitch');

            return sectorMatch || tagMatch || generalStartupMatch;
        }
    };

    // Helper to generate 3 sharp AI Ice-breakers for Investor
    const getInvestorIceBreakers = (slot: MeetingSlot): string[] => {
        return [
            `What is your customer acquisition strategy and current monthly burn rate for ${slot.startup.name}?`,
            `How will the ${slot.startup.targetAsk} round be allocated towards product milestones and regional expansion?`,
            `What technical moat or proprietary IP protects your product against rapid competitor cloning in ${slot.startup.sector}?`,
        ];
    };

    // Helper to generate 3 focused Pitch Prep topics for Startup Founder
    const getStartupPitchPrep = (slot: MeetingSlot): string[] => {
        const sectors = slot.investor.targetSectors?.slice(0, 2).join(' & ') || 'Technology';
        const ticket = slot.investor.ticketSizeRange || '$250K - $1M';
        return [
            `Align your pitch with ${slot.investor.firm}'s investment thesis in ${sectors} (typical ticket size: ${ticket}).`,
            `Prepare key traction metrics (MRR/ARR, growth velocity, and user retention) justifying your ${slot.startup.targetAsk} ask.`,
            `Be ready to address unit economics, defensibility, and your SEA / global expansion execution plan.`,
        ];
    };

    const avgMatchScore =
        roleSlots.length > 0
            ? Math.round(roleSlots.reduce((acc, s) => acc + (s.matchScore || 90), 0) / roleSlots.length)
            : 0;

    return (
        <div className="max-w-md mx-auto min-h-screen pb-20 space-y-4 px-2 sm:px-0">
            {/* Participant Profile Card */}
            <div className="bg-[#0f1011] border border-[#23252a] rounded-xl p-5 relative shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                {/* Persona Role Switcher */}
                <div className="mb-4 pb-3.5 border-b border-[#23252a] space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-medium text-[#8a8f98]">
                        <span className="flex items-center gap-1.5 text-[#d0d6e0]">
                            <Users className="w-3.5 h-3.5 text-[#5e6ad2]" />
                            <span>Delegate Role & Persona</span>
                        </span>
                        <span className="text-[10px] text-[#62666d] font-mono">DAVAS 2026</span>
                    </div>

                    {/* Role Switcher Tabs */}
                    <div className="grid grid-cols-2 gap-1 p-1 bg-[#010102] rounded-lg border border-[#23252a]">
                        <button
                            onClick={() => setPersonaRole('investor')}
                            className={`py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${personaRole === 'investor'
                                    ? 'bg-[#141516] text-[#f7f8f8] border border-[#34343a] shadow-sm'
                                    : 'text-[#8a8f98] hover:text-[#f7f8f8]'
                                }`}
                        >
                            <Briefcase className="w-3.5 h-3.5 text-[#8a8f98]" />
                            <span>Investor ({investors.length})</span>
                        </button>

                        <button
                            onClick={() => setPersonaRole('startup')}
                            className={`py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${personaRole === 'startup'
                                    ? 'bg-[#141516] text-[#f7f8f8] border border-[#34343a] shadow-sm'
                                    : 'text-[#8a8f98] hover:text-[#f7f8f8]'
                                }`}
                        >
                            <Rocket className="w-3.5 h-3.5 text-[#8a8f98]" />
                            <span>Startup ({startups.length})</span>
                        </button>
                    </div>

                    {/* Persona Dropdown Selection */}
                    {personaRole === 'investor' ? (
                        <div className="relative">
                            <select
                                id="investor-persona-switcher"
                                value={selectedInvestorId || activeInvestor?.id || ''}
                                onChange={(e) => handleInvestorChange(e.target.value)}
                                className="w-full bg-[#010102] text-[#f7f8f8] text-xs font-medium rounded-md border border-[#23252a] px-3 py-2 pr-8 focus:outline-none focus:border-[#5e6ad2] cursor-pointer truncate appearance-none transition-colors"
                            >
                                {investors.map((inv) => (
                                    <option key={inv.id} value={inv.id} className="bg-[#0f1011] text-[#f7f8f8] py-1.5">
                                        {inv.firm} - {inv.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#8a8f98] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    ) : (
                        <div className="relative">
                            <select
                                id="startup-persona-switcher"
                                value={selectedStartupId || activeStartup?.id || ''}
                                onChange={(e) => handleStartupChange(e.target.value)}
                                className="w-full bg-[#010102] text-[#f7f8f8] text-xs font-medium rounded-md border border-[#23252a] px-3 py-2 pr-8 focus:outline-none focus:border-[#5e6ad2] cursor-pointer truncate appearance-none transition-colors"
                            >
                                {startups.map((st) => (
                                    <option key={st.id} value={st.id} className="bg-[#0f1011] text-[#f7f8f8] py-1.5">
                                        {st.name} • {st.sector} ({st.stage})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#8a8f98] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    )}
                </div>

                {/* Welcome Delegate Info */}
                {personaRole === 'investor' ? (
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img
                                src={investorAvatar}
                                alt={investorName}
                                className="w-12 h-12 rounded-lg object-cover border border-[#23252a]"
                            />
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#27a644] border-2 border-[#0f1011]" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#141516] text-[#d0d6e0] border border-[#23252a]">
                                    DAVAS Investor
                                </span>
                                <span className="text-[10px] text-[#27a644] font-medium flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#27a644]" />
                                    Live Summit
                                </span>
                            </div>
                            <h2 className="text-base font-semibold text-[#f7f8f8] tracking-tight mt-1 truncate">
                                Welcome, {investorFirm}
                            </h2>
                            <p className="text-xs text-[#8a8f98] truncate">
                                {investorName} • {investorRole}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img
                                src={startupAvatar}
                                alt={startupName}
                                className="w-12 h-12 rounded-lg object-cover border border-[#23252a]"
                            />
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#5e6ad2] border-2 border-[#0f1011]" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#141516] text-[#d0d6e0] border border-[#23252a]">
                                    DAVAS Startup
                                </span>
                                <span className="text-[10px] text-[#27a644] font-medium flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#27a644]" />
                                    Live Summit
                                </span>
                            </div>
                            <h2 className="text-base font-semibold text-[#f7f8f8] tracking-tight mt-1 truncate">
                                Welcome, {startupName}
                            </h2>
                            <p className="text-xs text-[#8a8f98] truncate">
                                {startupFounder} • {startupTitle} ({startupSector})
                            </p>
                        </div>
                    </div>
                )}

                {/* Quick Delegate Stats */}
                <div className="mt-4 pt-3 border-t border-[#23252a] grid grid-cols-3 gap-2 text-center">
                    <div className="bg-[#141516] p-2 rounded-lg border border-[#23252a]">
                        <div className="text-[10px] text-[#8a8f98] uppercase font-medium">1:1 Meetings</div>
                        <div className="text-sm font-semibold text-[#f7f8f8] mt-0.5">{roleSlots.length}</div>
                    </div>

                    <div className="bg-[#141516] p-2 rounded-lg border border-[#23252a]">
                        <div className="text-[10px] text-[#8a8f98] uppercase font-medium">
                            {personaRole === 'investor' ? 'Hall Location' : 'Target Ask'}
                        </div>
                        <div className="text-xs font-semibold text-[#f7f8f8] mt-0.5 truncate">
                            {personaRole === 'investor' ? 'Furama A1' : startupAsk}
                        </div>
                    </div>

                    <div className="bg-[#141516] p-2 rounded-lg border border-[#23252a]">
                        <div className="text-[10px] text-[#8a8f98] uppercase font-medium">
                            {personaRole === 'investor' ? 'Avg Match' : 'Stage'}
                        </div>
                        <div className="text-sm font-semibold text-[#828fff] mt-0.5">
                            {personaRole === 'investor' ? (roleSlots.length > 0 ? `${avgMatchScore}%` : '--') : startupStage}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3-Day Summit Agenda Tabs */}
            <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-[#f7f8f8] flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#8a8f98]" />
                            <span>DAVAS 2026 Official Agenda</span>
                        </h3>
                        <p className="text-[11px] text-[#8a8f98]">
                            3-Day Official Schedule & Curated Sessions
                        </p>
                    </div>
                    <span className="text-[10px] font-mono text-[#d0d6e0] bg-[#141516] px-2 py-0.5 rounded-full border border-[#23252a]">
                        3-Day Pass
                    </span>
                </div>

                {/* 3-Day Navigation Bar */}
                <div className="grid grid-cols-3 gap-1 p-1 bg-[#0f1011] rounded-lg border border-[#23252a]">
                    <button
                        onClick={() => setSelectedDay('day1')}
                        className={`py-1.5 px-1 text-center rounded-md transition-all duration-150 cursor-pointer flex flex-col items-center justify-center ${selectedDay === 'day1'
                                ? 'bg-[#141516] text-[#f7f8f8] border border-[#34343a] font-medium shadow-sm'
                                : 'text-[#8a8f98] hover:text-[#f7f8f8]'
                            }`}
                    >
                        <span className="text-xs">Day 1</span>
                        <span className="text-[10px] text-[#62666d]">Golf & Fringe</span>
                    </button>

                    <button
                        onClick={() => setSelectedDay('day2')}
                        className={`py-1.5 px-1 text-center rounded-md transition-all duration-150 cursor-pointer flex flex-col items-center justify-center ${selectedDay === 'day2'
                                ? 'bg-[#141516] text-[#f7f8f8] border border-[#34343a] font-medium shadow-sm'
                                : 'text-[#8a8f98] hover:text-[#f7f8f8]'
                            }`}
                    >
                        <span className="text-xs">Day 2</span>
                        <span className="text-[10px] text-[#62666d]">Summit & Expo</span>
                    </button>

                    <button
                        onClick={() => setSelectedDay('day3')}
                        className={`py-1.5 px-1 text-center rounded-md transition-all duration-150 cursor-pointer flex flex-col items-center justify-center ${selectedDay === 'day3'
                                ? 'bg-[#141516] text-[#f7f8f8] border border-[#34343a] font-medium shadow-sm'
                                : 'text-[#8a8f98] hover:text-[#f7f8f8]'
                            }`}
                    >
                        <span className="text-xs flex items-center gap-1">
                            Day 3
                            <span className="w-1.5 h-1.5 rounded-full bg-[#5e6ad2]" />
                        </span>
                        <span className="text-[10px] text-[#62666d]">1:1 Matching</span>
                    </button>
                </div>
            </div>

            {/* DAY 1 CONTENT */}
            {selectedDay === 'day1' && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                >
                    <div className="p-3 rounded-lg bg-[#0f1011] border border-[#23252a] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Compass className="w-4 h-4 text-[#8a8f98]" />
                            <span className="text-xs font-medium text-[#f7f8f8]">Day 1: Kickoff, Golf & Workshops</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#8a8f98]">Aug 11, 2026</span>
                    </div>

                    <div className="space-y-2.5">
                        {SUMMIT_3DAY_AGENDA.day1.map((item) => {
                            const recommended = isEventAIRecommended(item.tags, item.title, item.description);

                            return (
                                <div
                                    key={item.id}
                                    className={`p-4 rounded-xl border transition-all ${recommended
                                            ? 'border-[#5e6ad2]/40 bg-[#0f1011] shadow-[inset_0_1px_0_0_rgba(94,106,210,0.15)]'
                                            : 'border-[#23252a] bg-[#0f1011] hover:border-[#34343a]'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#23252a] gap-2">
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-[#f7f8f8] font-mono">
                                            <Clock className="w-3.5 h-3.5 text-[#8a8f98] shrink-0" />
                                            <span>{item.time}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-[#8a8f98]">
                                            <MapPin className="w-3.5 h-3.5 text-[#8a8f98] shrink-0" />
                                            <span className="truncate max-w-[170px]">{item.location}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="text-sm font-medium text-[#f7f8f8] leading-snug">
                                                {item.title}
                                            </h4>
                                            {recommended && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#5e6ad2]/15 text-[#828fff] border border-[#5e6ad2]/30 shrink-0 flex items-center gap-1">
                                                    <Sparkles className="w-2.5 h-2.5 text-[#828fff]" />
                                                    Recommended
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs text-[#8a8f98] leading-relaxed">
                                            {item.description}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                            {item.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-0.5 rounded bg-[#141516] text-[10px] text-[#8a8f98] border border-[#23252a] font-mono"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* DAY 2 CONTENT */}
            {selectedDay === 'day2' && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                >
                    <div className="p-3 rounded-lg bg-[#0f1011] border border-[#23252a] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Compass className="w-4 h-4 text-[#8a8f98]" />
                            <span className="text-xs font-medium text-[#f7f8f8]">Day 2: Main Summit & Tech Expo</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#8a8f98]">Aug 12, 2026</span>
                    </div>

                    <div className="space-y-2.5">
                        {SUMMIT_3DAY_AGENDA.day2.map((item) => {
                            const recommended = isEventAIRecommended(item.tags, item.title, item.description);

                            return (
                                <div
                                    key={item.id}
                                    className={`p-4 rounded-xl border transition-all ${recommended
                                            ? 'border-[#5e6ad2]/40 bg-[#0f1011] shadow-[inset_0_1px_0_0_rgba(94,106,210,0.15)]'
                                            : 'border-[#23252a] bg-[#0f1011] hover:border-[#34343a]'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#23252a] gap-2">
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-[#f7f8f8] font-mono">
                                            <Clock className="w-3.5 h-3.5 text-[#8a8f98] shrink-0" />
                                            <span>{item.time}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-[#8a8f98]">
                                            <MapPin className="w-3.5 h-3.5 text-[#8a8f98] shrink-0" />
                                            <span className="truncate max-w-[170px]">{item.location}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="text-sm font-medium text-[#f7f8f8] leading-snug">
                                                {item.title}
                                            </h4>
                                            {recommended && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#5e6ad2]/15 text-[#828fff] border border-[#5e6ad2]/30 shrink-0 flex items-center gap-1">
                                                    <Sparkles className="w-2.5 h-2.5 text-[#828fff]" />
                                                    Recommended
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs text-[#8a8f98] leading-relaxed">
                                            {item.description}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                            {item.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-0.5 rounded bg-[#141516] text-[10px] text-[#8a8f98] border border-[#23252a] font-mono"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* DAY 3 CONTENT (1:1 INVESTMENT SPEED MATCHING & GALA) */}
            {selectedDay === 'day3' && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3.5"
                >
                    {/* Day 3 Highlight Cards (Pitching & Gala Banners) */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 rounded-lg bg-[#0f1011] border border-[#23252a] space-y-1">
                            <div className="flex items-center gap-1.5 text-[#828fff] text-xs font-medium">
                                <Mic className="w-3.5 h-3.5" />
                                <span>Pitch Arena</span>
                            </div>
                            <div className="text-[11px] font-medium text-[#f7f8f8]">08:30 - 11:30</div>
                            <div className="text-[10px] text-[#8a8f98]">Grand Ballroom • Top 20</div>
                        </div>

                        <div className="p-3 rounded-lg bg-[#0f1011] border border-[#23252a] space-y-1">
                            <div className="flex items-center gap-1.5 text-[#828fff] text-xs font-medium">
                                <Utensils className="w-3.5 h-3.5" />
                                <span>Gala Dinner</span>
                            </div>
                            <div className="text-[11px] font-medium text-[#f7f8f8]">18:00 - 21:00</div>
                            <div className="text-[10px] text-[#8a8f98]">Ocean Ballroom • Awards</div>
                        </div>
                    </div>

                    {/* 1:1 SPEED MATCHING TIMELINE SECTION */}
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-semibold text-[#f7f8f8] flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-[#5e6ad2]" />
                                    <span>
                                        {personaRole === 'investor'
                                            ? 'My 1:1 Speed Meetings'
                                            : 'My Investor Meetings'}
                                    </span>
                                </h4>
                                <p className="text-[11px] text-[#8a8f98]">
                                    09:00 - 16:00 | 12 Designated Summit Tables
                                </p>
                            </div>
                            <span className="text-xs font-mono text-[#8a8f98] bg-[#141516] px-2 py-0.5 rounded border border-[#23252a]">
                                Aug 13, 2026
                            </span>
                        </div>

                        {/* Status Filter Chips */}
                        <div className="flex items-center gap-1 p-1 bg-[#0f1011] rounded-lg border border-[#23252a]">
                            {(['All', 'Upcoming', 'Completed'] as const).map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all duration-150 cursor-pointer ${activeFilter === filter
                                            ? 'bg-[#141516] text-[#f7f8f8] border border-[#34343a] shadow-sm'
                                            : 'text-[#8a8f98] hover:text-[#f7f8f8]'
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Vertical Timeline Schedule */}
                    {filteredSlots.length === 0 ? (
                        <div className="p-8 rounded-xl border border-dashed border-[#23252a] text-center space-y-3 bg-[#0f1011]">
                            <div className="w-10 h-10 mx-auto rounded-lg bg-[#141516] text-[#8a8f98] flex items-center justify-center border border-[#23252a]">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <h4 className="text-sm font-medium text-[#f7f8f8]">
                                {personaRole === 'investor'
                                    ? 'No 1:1 Meetings Scheduled'
                                    : 'No VC Meetings Scheduled'}
                            </h4>
                            <p className="text-xs text-[#8a8f98] max-w-xs mx-auto leading-relaxed">
                                Generate your personalized speed meeting schedule in the Admin Dashboard to see your timed sessions here.
                            </p>
                        </div>
                    ) : (
                        <motion.div
                            variants={timelineContainerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-3 relative"
                        >
                            {/* Timeline Connecting Line */}
                            <div className="absolute left-4 top-3 bottom-3 w-px bg-[#23252a] pointer-events-none" />

                            {filteredSlots.map((slot) => {
                                const isCompleted = slot.status === 'Completed';
                                const isInProgress = slot.status === 'In Progress';

                                return (
                                    <motion.div
                                        key={slot.id}
                                        variants={timelineItemVariants}
                                        className="relative pl-9 group"
                                    >
                                        {/* Timeline Indicator Dot */}
                                        <div
                                            className={`absolute left-4 top-5 -translate-x-1/2 w-4 h-4 rounded-full border flex items-center justify-center z-10 ${isCompleted
                                                    ? 'bg-[#27a644] border-[#27a644] text-white'
                                                    : isInProgress
                                                        ? 'bg-[#5e6ad2] border-white text-white'
                                                        : 'bg-[#0f1011] border-[#34343a] text-[#8a8f98]'
                                                }`}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                                            ) : (
                                                <div className="w-1 h-1 rounded-full bg-current" />
                                            )}
                                        </div>

                                        {/* Schedule Card */}
                                        <div
                                            className={`p-4 rounded-xl border transition-all ${isInProgress
                                                    ? 'border-[#5e6ad2] bg-[#0f1011] shadow-[inset_0_1px_0_0_rgba(94,106,210,0.2)]'
                                                    : 'border-[#23252a] bg-[#0f1011] hover:border-[#34343a]'
                                                }`}
                                        >
                                            {/* Time & Table Banner */}
                                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#23252a] gap-2">
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-[#f7f8f8] font-mono">
                                                    <Clock className="w-3.5 h-3.5 text-[#8a8f98] shrink-0" />
                                                    <span>{slot.time}</span>
                                                </div>

                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <span className="font-mono text-xs bg-[#141516] border border-[#23252a] text-[#d0d6e0] px-2.5 py-1 rounded-md flex items-center gap-1">
                                                        <MapPin className="w-3 h-3 text-[#8a8f98]" />
                                                        {slot.table}
                                                    </span>
                                                    <span className="font-mono text-xs bg-[#5e6ad2]/15 border border-[#5e6ad2]/30 text-[#828fff] px-2.5 py-1 rounded-md">
                                                        {slot.matchScore}% Match
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Header Info: Dynamic based on personaRole */}
                                            {personaRole === 'investor' ? (
                                                /* INVESTOR VIEW -> SHOW STARTUP PROFILE */
                                                <div className="flex items-start gap-3">
                                                    <img
                                                        src={slot.startup.logo}
                                                        alt={slot.startup.name}
                                                        className="w-10 h-10 rounded-md object-cover border border-[#23252a] shrink-0"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <h4 className="text-sm font-medium text-[#f7f8f8] truncate">
                                                                {slot.startup.name}
                                                            </h4>
                                                            <div className="flex items-center gap-1.5 shrink-0">
                                                                {(slot.notes || slot.followUpGenerated) && (
                                                                    <span className="text-[10px] font-medium text-[#27a644] bg-[#27a644]/10 px-2 py-0.5 rounded-full border border-[#27a644]/30 flex items-center gap-1">
                                                                        <CheckCircle2 className="w-3 h-3 text-[#27a644]" />
                                                                        Logged
                                                                    </span>
                                                                )}
                                                                <span className="text-[10px] font-medium text-[#828fff] bg-[#5e6ad2]/10 px-2 py-0.5 rounded border border-[#5e6ad2]/20 font-mono">
                                                                    {slot.startup.stage}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <p className="text-xs text-[#8a8f98] line-clamp-2 mt-0.5 leading-relaxed">
                                                            {slot.startup.tagline}
                                                        </p>

                                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#8a8f98]">
                                                            <span>Ask: <strong className="text-[#f7f8f8] font-mono">{slot.startup.targetAsk}</strong></span>
                                                            <span>•</span>
                                                            <span>Founder: <strong className="text-[#d0d6e0]">{slot.startup.founderName}</strong></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                /* STARTUP VIEW -> SHOW INVESTOR / VC FUND PROFILE */
                                                <div className="flex items-start gap-3">
                                                    <img
                                                        src={slot.investor.avatar}
                                                        alt={slot.investor.firm}
                                                        className="w-10 h-10 rounded-full object-cover border border-[#23252a] shrink-0"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <h4 className="text-sm font-medium text-[#f7f8f8] truncate flex items-center gap-1.5">
                                                                <Building2 className="w-3.5 h-3.5 text-[#8a8f98] shrink-0" />
                                                                <span>{slot.investor.firm}</span>
                                                            </h4>
                                                            <div className="flex items-center gap-1.5 shrink-0">
                                                                {(slot.notes || slot.followUpGenerated) && (
                                                                    <span className="text-[10px] font-medium text-[#27a644] bg-[#27a644]/10 px-2 py-0.5 rounded-full border border-[#27a644]/30 flex items-center gap-1">
                                                                        <CheckCircle2 className="w-3 h-3 text-[#27a644]" />
                                                                        Logged
                                                                    </span>
                                                                )}
                                                                <span className="text-[10px] font-medium text-[#d0d6e0] bg-[#141516] px-2 py-0.5 rounded border border-[#23252a]">
                                                                    {slot.investor.country || 'Global VC'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <p className="text-xs text-[#8a8f98] mt-0.5 flex items-center gap-1">
                                                            <span>Representative:</span>
                                                            <strong className="text-[#f7f8f8]">{slot.investor.name}</strong>
                                                            <span className="text-[#62666d]">({slot.investor.role})</span>
                                                        </p>

                                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#8a8f98]">
                                                            <span className="flex items-center gap-1 text-[#27a644] font-mono">
                                                                <DollarSign className="w-3 h-3" />
                                                                Ticket: {slot.investor.ticketSizeRange || '$250K - $1M'}
                                                            </span>
                                                            <span>•</span>
                                                            <span>
                                                                Target: <strong className="text-[#d0d6e0]">{slot.investor.targetSectors?.slice(0, 2).join(', ')}</strong>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Ice-breakers (Investor) vs Pitch Prep (Startup) Section */}
                                            {personaRole === 'investor' ? (
                                                <div className="mt-3 p-3.5 rounded-lg bg-[#141516] border border-[#23252a] space-y-2">
                                                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#f7f8f8]">
                                                        <Sparkles className="w-3.5 h-3.5 text-[#828fff] shrink-0" />
                                                        <span>Executive Ice-breakers (Questions for Founder)</span>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        {getInvestorIceBreakers(slot).map((q, idx) => (
                                                            <div key={idx} className="flex items-start gap-2 text-xs text-[#d0d6e0] leading-relaxed">
                                                                <span className="w-4 h-4 rounded-full bg-[#5e6ad2]/15 text-[#828fff] border border-[#5e6ad2]/30 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                                                    {idx + 1}
                                                                </span>
                                                                <span className="flex-1">{q}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mt-3 p-3.5 rounded-lg bg-[#141516] border border-[#23252a] space-y-2">
                                                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#f7f8f8]">
                                                        <Sparkles className="w-3.5 h-3.5 text-[#828fff] shrink-0" />
                                                        <span>Pitch Prep (Expected Topics from VC)</span>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        {getStartupPitchPrep(slot).map((topic, idx) => (
                                                            <div key={idx} className="flex items-start gap-2 text-xs text-[#d0d6e0] leading-relaxed">
                                                                <span className="w-4 h-4 rounded-full bg-[#5e6ad2]/15 text-[#828fff] border border-[#5e6ad2]/30 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                                                    {idx + 1}
                                                                </span>
                                                                <span className="flex-1">{topic}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Logged Notes Summary Preview */}
                                            {(slot.notes || slot.followUpGenerated) && (
                                                <div className="mt-3 p-3 rounded-lg bg-[#141516] border border-[#23252a] text-xs space-y-1">
                                                    <div className="flex items-center justify-between font-medium text-[11px] text-[#828fff]">
                                                        <span className="flex items-center gap-1.5">
                                                            <Sparkles className="w-3 h-3 text-[#828fff]" />
                                                            {personaRole === 'startup'
                                                                ? 'VC Feedback & Follow-up Draft'
                                                                : slot.followUpGenerated
                                                                    ? 'Follow-up Draft Ready'
                                                                    : 'Meeting Notes Saved'}
                                                        </span>
                                                        <span className="text-[10px] text-[#27a644] font-mono">Logged</span>
                                                    </div>
                                                    {slot.followUpGenerated ? (
                                                        <p className="text-xs text-[#8a8f98] line-clamp-2 italic leading-relaxed">
                                                            "{slot.followUpGenerated.emailSubject}"
                                                        </p>
                                                    ) : slot.notes ? (
                                                        <p className="text-xs text-[#8a8f98] line-clamp-2 italic leading-relaxed">
                                                            "{slot.notes}"
                                                        </p>
                                                    ) : null}
                                                </div>
                                            )}

                                            {/* Primary Action Button */}
                                            <div className="mt-3.5 pt-1">
                                                <button
                                                    onClick={() => onOpenFollowUpModal(slot)}
                                                    className="w-full bg-[#5e6ad2] hover:bg-[#828fff] text-white rounded-md px-4 py-2.5 text-xs font-medium transition-colors shadow-sm cursor-pointer flex items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4" />
                                                        <span>
                                                            {personaRole === 'investor'
                                                                ? (slot.notes || slot.followUpGenerated)
                                                                    ? 'View / Edit Notes & Follow-up'
                                                                    : 'Add Notes & Follow-up'
                                                                : (slot.notes || slot.followUpGenerated)
                                                                    ? 'View VC Feedback & Email Draft'
                                                                    : 'Review Table Location & Pitch Deck'}
                                                        </span>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-white/80" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </motion.div>
            )}

            {/* Footnote tips for summit attendees */}
            <div className="p-4 rounded-xl bg-[#0f1011] border border-[#23252a] text-center text-xs text-[#8a8f98] space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-[#d0d6e0] font-medium">
                    <Info className="w-3.5 h-3.5 text-[#5e6ad2]" />
                    <span>DAVAS 1:1 Summit Tip</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                    {personaRole === 'investor'
                        ? 'Tap "Add Notes & Follow-up" during or right after your 1:1 meeting to craft an executive email summary and action items in seconds.'
                        : 'Review your VC partner’s ticket size and focus areas before sitting at your designated Summit Table. Log your notes directly for follow-ups.'}
                </p>
            </div>
        </div>
    );
};
