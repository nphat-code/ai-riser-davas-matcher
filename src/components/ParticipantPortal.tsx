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
    ChevronDown
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

            {/* View Title & Filter Tabs */}
            <div className="space-y-3 px-1">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-cyan-400" />
                            <span>My DavaSync Schedule</span>
                        </h3>
                        <p className="text-[11px] text-slate-400">
                            1:1 Investor-Startup Speed Networking
                        </p>
                    </div>
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-500/30">
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
                            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeFilter === filter
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
                                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
                                        <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 font-mono">
                                            <Clock className="w-3.5 h-3.5 text-cyan-400" />
                                            <span>{slot.time}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {slot.table}
                                            </span>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
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
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-extrabold text-white truncate">
                                                    {slot.startup.name}
                                                </h4>
                                                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                    {slot.startup.stage}
                                                </span>
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
                                    {slot.followUpGenerated && (
                                        <div className="mt-3 p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs space-y-1">
                                            <div className="flex items-center justify-between text-purple-300 font-semibold text-[11px]">
                                                <span className="flex items-center gap-1">
                                                    <Sparkles className="w-3 h-3 text-yellow-400" />
                                                    AI Follow-up Draft Ready
                                                </span>
                                                <span className="text-[10px] text-emerald-400 font-mono">Logged</span>
                                            </div>
                                            <p className="text-[11px] text-slate-300 line-clamp-2 italic">
                                                "{slot.followUpGenerated.emailSubject}"
                                            </p>
                                        </div>
                                    )}

                                    {/* Primary Action Button (Strictly Large Touch Target for Mobile with Hover/Tap Animation) */}
                                    <div className="mt-4 pt-2">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => onOpenFollowUpModal(slot)}
                                            className="w-full min-h-[44px] px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-lg shadow-cyan-600/20 border border-cyan-400/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                                        >
                                            <FileText className="w-4 h-4 text-cyan-200" />
                                            <span>
                                                {slot.followUpGenerated ? 'View / Edit AI Follow-up Draft' : 'Add Notes & AI Follow-up'}
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
