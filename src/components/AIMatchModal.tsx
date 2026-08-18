import React from 'react';
import { Sparkles, X, CheckCircle2, AlertTriangle, HelpCircle, Building2, UserCheck, MessageCircle } from 'lucide-react';
import { MatchPair } from '../types';

interface AIMatchModalProps {
    pair: MatchPair | null;
    onClose: () => void;
}

const getScoreEvaluation = (score: number) => {
    if (score >= 80) {
        return {
            label: 'High Conviction Meeting',
            badgeClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        };
    }
    if (score >= 60) {
        return {
            label: 'Moderate Synergy Meeting',
            badgeClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
        };
    }
    if (score >= 40) {
        return {
            label: 'Exploratory Meeting',
            badgeClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        };
    }
    return {
        label: 'Low Alignment Meeting',
        badgeClass: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    };
};

export const AIMatchModal: React.FC<AIMatchModalProps> = ({ pair, onClose }) => {
    if (!pair) return null;

    const score = Number(pair.analysis.matching_score) || 0;
    const evaluation = getScoreEvaluation(score);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
            <div className="glass-panel-glow w-full max-w-2xl rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto space-y-6 border border-purple-500/30">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header Badge */}
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                        Gemini VC AI Compatibility Breakdown
                    </span>
                    <span className="text-xs text-slate-400 font-mono">DAVAS 2026</span>
                </div>

                {/* Startup x Investor Dual Cards Header */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Startup Profile Card */}
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                        <div className="flex items-center gap-3">
                            <img src={pair.startup.logo} alt={pair.startup.name} className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
                            <div>
                                <h4 className="text-sm font-extrabold text-white">{pair.startup.name}</h4>
                                <p className="text-xs text-indigo-300 font-medium">{pair.startup.sector} • {pair.startup.stage}</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-2 mt-1">{pair.startup.tagline}</p>
                        <div className="text-xs font-bold text-emerald-400 pt-1">Target Ask: {pair.startup.targetAsk}</div>
                    </div>

                    {/* Investor Profile Card */}
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                        <div className="flex items-center gap-3">
                            <img src={pair.investor.avatar} alt={pair.investor.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                            <div>
                                <h4 className="text-sm font-extrabold text-white">{pair.investor.firm}</h4>
                                <p className="text-xs text-purple-300 font-medium">{pair.investor.name}</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-2 mt-1">{pair.investor.investmentPhilosophy}</p>
                        <div className="text-xs font-mono font-bold text-cyan-400 pt-1">Range: {pair.investor.ticketSizeRange}</div>
                    </div>
                </div>

                {/* Compatibility Score Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900 border border-purple-500/40 flex items-center justify-between">
                    <div>
                        <div className="text-xs font-semibold text-purple-300">Overall Matching Compatibility</div>
                        <div className="text-3xl font-black text-white">{score} / 100</div>
                    </div>
                    <div className="text-right">
                        <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${evaluation.badgeClass}`}>
                            {evaluation.label}
                        </span>
                        <div className="text-[11px] text-slate-400 mt-1">Recommended Location: {pair.recommendedTable || 'Table A1'}</div>
                    </div>
                </div>

                {/* Reason Section (Required JSON "reason" in Vietnamese/English) */}
                <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        <span>Analytical Justification (Match Reason)</span>
                    </h4>
                    <p className="text-xs text-slate-200 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 leading-relaxed italic">
                        "{pair.analysis.reason}"
                    </p>
                </div>

                {/* Ice Breakers Section (Required 3 Questions Array) */}
                <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-cyan-400" />
                        <span>3 Suggested Sharp Ice Breakers for 1:1 Discussion</span>
                    </h4>
                    <div className="space-y-2">
                        {pair.analysis.ice_breakers.map((question, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-200">
                                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                                    {idx + 1}
                                </span>
                                <p className="leading-snug">{question}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Synergies & Potential Risks */}
                {pair.analysis.keySynergies && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1.5">
                            <span className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider">Key Synergies</span>
                            <ul className="space-y-1 text-slate-300">
                                {pair.analysis.keySynergies.map((syn, i) => (
                                    <li key={i} className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                        <span>{syn}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-1.5">
                            <span className="font-bold text-amber-400 uppercase text-[10px] tracking-wider">Due Diligence Focus</span>
                            <ul className="space-y-1 text-slate-300">
                                {(pair.analysis.potentialRisks || ['Market expansion speed in SEA', 'Unit economics margins']).map((risk, i) => (
                                    <li key={i} className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                        <span>{risk}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                        Close Breakdown
                    </button>
                </div>
            </div>
        </div>
    );
};
