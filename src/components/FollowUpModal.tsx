import React, { useState } from 'react';
import { Sparkles, X, FileText, Send, CheckCircle2, Copy, RefreshCw, Mail, ListChecks } from 'lucide-react';
import { MeetingSlot } from '../types';

interface FollowUpModalProps {
    slot: MeetingSlot | null;
    onClose: () => void;
    onSaveFollowUp: (slotId: string, notes: string, generatedResult: any) => void;
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({
    slot,
    onClose,
    onSaveFollowUp,
}) => {
    if (!slot) return null;

    const [notes, setNotes] = useState(slot.notes || '');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [followUpResult, setFollowUpResult] = useState(slot.followUpGenerated || null);

    const handleGenerateFollowUp = async () => {
        if (!notes.trim()) {
            alert('Please enter a few bullet points or notes from your 1:1 meeting first!');
            return;
        }

        setIsGenerating(true);

        try {
            const res = await fetch('/api/ai-followup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startup: slot.startup,
                    investor: slot.investor,
                    userNotes: notes,
                }),
            });

            const data = await res.json();
            setFollowUpResult(data);
            onSaveFollowUp(slot.id, notes, data);
        } catch (err) {
            console.error('Follow-up generation error:', err);
            // Fallback draft
            const fallback = {
                emailSubject: `DAVAS 2026 Follow-up: ${slot.investor.firm} x ${slot.startup.name}`,
                emailBody: `Hi ${slot.startup.founderName},\n\nThank you for taking the time to meet with us at DAVAS 2026. Here are my notes from our conversation:\n"${notes}"\n\nLet's schedule a deep dive meeting next week.\n\nBest,\n${slot.investor.name}`,
                keyTakeaways: [`Discussed traction & ask of ${slot.startup.targetAsk}`],
                actionItems: ['Share pitch deck and financial projections'],
            };
            setFollowUpResult(fallback);
            onSaveFollowUp(slot.id, notes, fallback);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopyEmail = () => {
        if (followUpResult) {
            const fullText = `Subject: ${followUpResult.emailSubject}\n\n${followUpResult.emailBody}`;
            navigator.clipboard.writeText(fullText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
            <div className="glass-panel-glow w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 relative max-h-[92vh] overflow-y-auto space-y-5 border border-cyan-500/30">
                {/* Modal Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header Title */}
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                            DAVAS Meeting Feedback
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{slot.time}</span>
                    </div>
                    <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                        <span>Meeting with {slot.startup.name}</span>
                    </h3>
                    <p className="text-xs text-slate-300">
                        Founder: {slot.startup.founderName} • {slot.startup.sector}
                    </p>
                </div>

                {/* Input Notes Area */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                        <span>📝 VC Meeting Notes & Observations</span>
                        <span className="text-[10px] text-slate-500 font-normal">Type or dictate bullet points</span>
                    </label>
                    <textarea
                        rows={4}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g., Founder presented 24% MoM student growth. Strong unit economics. Asked for $600k for expansion to Indonesia. Interested in follow-up DD call next Tuesday..."
                        className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed resize-none"
                    />
                </div>

                {/* Action Button: Generate AI Follow-up */}
                <button
                    onClick={handleGenerateFollowUp}
                    disabled={isGenerating}
                    className={`w-full min-h-[44px] py-3 px-4 rounded-xl font-bold text-xs text-white transition-all shadow-lg cursor-pointer ${isGenerating
                            ? 'bg-slate-800 border border-slate-700 opacity-80 cursor-wait'
                            : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 border border-cyan-400/30 shadow-cyan-500/20 active:scale-95'
                        }`}
                >
                    <div className="flex items-center justify-center gap-2">
                        {isGenerating ? (
                            <>
                                <RefreshCw className="w-4 h-4 text-cyan-300 animate-spin" />
                                <span>Drafting Executive Follow-up with Gemini...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                                <span>✨ Generate AI Follow-up & Email Draft</span>
                            </>
                        )}
                    </div>
                </button>

                {/* Generated AI Result Preview Card */}
                {followUpResult && (
                    <div className="space-y-4 pt-3 border-t border-slate-800 animate-fadeIn">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-extrabold text-cyan-300 flex items-center gap-1.5">
                                <Mail className="w-4 h-4 text-cyan-400" />
                                <span>AI Drafted Post-Summit Email</span>
                            </h4>
                            <button
                                onClick={handleCopyEmail}
                                className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-950/40 px-2.5 py-1 rounded-lg border border-indigo-500/30 cursor-pointer"
                            >
                                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copied ? 'Copied!' : 'Copy Email'}</span>
                            </button>
                        </div>

                        {/* Email Box */}
                        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
                            <div className="font-bold text-white border-b border-slate-800 pb-1">
                                Subject: {followUpResult.emailSubject}
                            </div>
                            <pre className="text-slate-300 whitespace-pre-wrap font-sans text-xs leading-relaxed">
                                {followUpResult.emailBody}
                            </pre>
                        </div>

                        {/* Key Takeaways & Action Items */}
                        <div className="grid grid-cols-1 gap-2 text-xs">
                            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-1">
                                <span className="font-bold text-purple-300 text-[11px] uppercase tracking-wider flex items-center gap-1">
                                    <ListChecks className="w-3.5 h-3.5 text-purple-400" />
                                    Key Takeaways
                                </span>
                                <ul className="space-y-1 text-slate-300 pl-1">
                                    {followUpResult.keyTakeaways?.map((takeaway: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                                            <span className="text-purple-400 font-bold">•</span>
                                            <span>{takeaway}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <div className="pt-2 flex justify-end">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                        Done & Save Notes
                    </button>
                </div>
            </div>
        </div>
    );
};
