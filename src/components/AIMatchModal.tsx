import React from 'react';
import { Sparkles, X, CheckCircle2, HelpCircle } from 'lucide-react';
import { MatchPair } from '../types';

interface AIMatchModalProps {
    pair: MatchPair | null;
    onClose: () => void;
}

const getScoreEvaluation = (score: number) => {
    if (score >= 80) {
        return {
            label: 'High Conviction',
            badgeClass: 'text-[#27a644] bg-[#27a644]/10 border-[#27a644]/30',
        };
    }
    if (score >= 60) {
        return {
            label: 'Moderate Synergy',
            badgeClass: 'text-[#828fff] bg-[#5e6ad2]/15 border-[#5e6ad2]/30',
        };
    }
    if (score >= 40) {
        return {
            label: 'Exploratory',
            badgeClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        };
    }
    return {
        label: 'Low Alignment',
        badgeClass: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    };
};

export const AIMatchModal: React.FC<AIMatchModalProps> = ({ pair, onClose }) => {
    if (!pair) return null;

    const score = Number(pair.analysis.matching_score) || 0;
    const evaluation = getScoreEvaluation(score);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
            <div className="bg-[#141516] border border-[#23252a] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] w-full max-w-2xl rounded-xl p-6 relative max-h-[90vh] overflow-y-auto space-y-6">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-1.5 rounded-md text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#18191a] transition-colors cursor-pointer"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Modal Header */}
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-[#5e6ad2]/15 text-[#828fff] border border-[#5e6ad2]/30 inline-flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-[#828fff]" />
                            Compatibility Breakdown
                        </span>
                        <span className="text-xs text-[#8a8f98] font-mono">DAVAS 2026</span>
                    </div>
                    <h3 className="text-xl font-semibold text-[#f7f8f8] tracking-tight">
                        Synergy & Match Analysis
                    </h3>
                </div>

                {/* Startup x Investor Dual Cards Header */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Startup Profile Card */}
                    <div className="p-4 rounded-lg bg-[#0f1011] border border-[#23252a] space-y-2">
                        <div className="flex items-center gap-3">
                            <img
                                src={pair.startup.logo}
                                alt={pair.startup.name}
                                className="w-10 h-10 rounded-md object-cover border border-[#23252a]"
                            />
                            <div>
                                <h4 className="text-sm font-medium text-[#f7f8f8]">{pair.startup.name}</h4>
                                <p className="text-xs text-[#828fff]">
                                    {pair.startup.sector} • {pair.startup.stage}
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-[#8a8f98] line-clamp-2 leading-relaxed">
                            {pair.startup.tagline}
                        </p>
                        <div className="text-xs font-mono text-[#27a644] pt-1">
                            Target Ask: {pair.startup.targetAsk}
                        </div>
                    </div>

                    {/* Investor Profile Card */}
                    <div className="p-4 rounded-lg bg-[#0f1011] border border-[#23252a] space-y-2">
                        <div className="flex items-center gap-3">
                            <img
                                src={pair.investor.avatar}
                                alt={pair.investor.name}
                                className="w-10 h-10 rounded-full object-cover border border-[#23252a]"
                            />
                            <div>
                                <h4 className="text-sm font-medium text-[#f7f8f8]">{pair.investor.firm}</h4>
                                <p className="text-xs text-[#8a8f98]">{pair.investor.name}</p>
                            </div>
                        </div>
                        <p className="text-xs text-[#8a8f98] line-clamp-2 leading-relaxed">
                            {pair.investor.investmentPhilosophy}
                        </p>
                        <div className="text-xs font-mono text-[#828fff] pt-1">
                            Ticket: {pair.investor.ticketSizeRange}
                        </div>
                    </div>
                </div>

                {/* Compatibility Score Banner */}
                <div className="p-4 rounded-lg bg-[#0f1011] border border-[#23252a] flex items-center justify-between">
                    <div>
                        <div className="text-xs font-medium text-[#8a8f98]">
                            Overall Compatibility Score
                        </div>
                        <div className="text-2xl font-bold text-[#f7f8f8] tracking-tight mt-0.5">
                            {score} <span className="text-xs font-normal text-[#62666d]">/ 100</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span
                            className={`inline-block text-xs font-mono font-medium px-2.5 py-1 rounded-full border ${evaluation.badgeClass}`}
                        >
                            {evaluation.label}
                        </span>
                        <div className="text-[11px] text-[#8a8f98] mt-1 font-mono">
                            Location: {pair.recommendedTable || 'Table TBD'}
                        </div>
                    </div>
                </div>

                {/* Reason Section */}
                <div className="space-y-2">
                    <h4 className="text-xs font-medium uppercase tracking-wider text-[#8a8f98] flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#27a644]" />
                        <span>Analytical Justification</span>
                    </h4>
                    <p className="text-xs text-[#d0d6e0] bg-[#0f1011] p-3.5 rounded-lg border border-[#23252a] leading-relaxed">
                        "{pair.analysis.reason}"
                    </p>
                </div>

                {/* Ice Breakers Section */}
                <div className="space-y-2">
                    <h4 className="text-xs font-medium uppercase tracking-wider text-[#8a8f98] flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-[#828fff]" />
                        <span>Suggested Executive Ice-breakers</span>
                    </h4>
                    <div className="space-y-2">
                        {pair.analysis.ice_breakers.map((question, idx) => (
                            <div
                                key={idx}
                                className="flex items-start gap-2.5 p-3 rounded-lg bg-[#0f1011] border border-[#23252a] text-xs text-[#d0d6e0]"
                            >
                                <span className="w-4 h-4 rounded-full bg-[#18191a] text-[#828fff] border border-[#23252a] font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                    {idx + 1}
                                </span>
                                <p className="leading-relaxed">{question}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Synergies & Potential Risks */}
                {pair.analysis.keySynergies && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 rounded-lg bg-[#0f1011] border border-[#23252a] space-y-1.5">
                            <span className="font-medium text-[#27a644] uppercase text-[10px] tracking-wider">
                                Key Synergies
                            </span>
                            <ul className="space-y-1 text-[#8a8f98]">
                                {pair.analysis.keySynergies.map((syn, i) => (
                                    <li key={i} className="flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-[#27a644]" />
                                        <span className="text-[#d0d6e0]">{syn}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-3.5 rounded-lg bg-[#0f1011] border border-[#23252a] space-y-1.5">
                            <span className="font-medium text-amber-400 uppercase text-[10px] tracking-wider">
                                Due Diligence Focus
                            </span>
                            <ul className="space-y-1 text-[#8a8f98]">
                                {(pair.analysis.potentialRisks || [
                                    'Market expansion speed in SEA',
                                    'Unit economics margins',
                                ]).map((risk, i) => (
                                    <li key={i} className="flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-amber-400" />
                                        <span className="text-[#d0d6e0]">{risk}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="pt-2 border-t border-[#23252a] flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-[#0f1011] hover:bg-[#18191a] text-[#f7f8f8] border border-[#23252a] rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
                    >
                        Close Breakdown
                    </button>
                </div>
            </div>
        </div>
    );
};
