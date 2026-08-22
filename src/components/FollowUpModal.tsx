import React, { useState } from 'react';
import { Sparkles, X, FileText, CheckCircle2, Copy, RefreshCw, Mail, ListChecks } from 'lucide-react';
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
            alert('Please enter a few notes from your 1:1 meeting first!');
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
            <div className="bg-[#141516] border border-[#23252a] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] w-full max-w-lg rounded-t-xl sm:rounded-xl p-5 relative max-h-[92vh] overflow-y-auto space-y-5">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-md text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#18191a] transition-colors cursor-pointer"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Header Title */}
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#5e6ad2]/15 text-[#828fff] border border-[#5e6ad2]/30 uppercase tracking-wider">
                            Meeting Follow-up
                        </span>
                        <span className="text-xs text-[#8a8f98] font-mono">{slot.time}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-[#f7f8f8] tracking-tight">
                        Follow-up: {slot.startup.name}
                    </h3>
                    <p className="text-xs text-[#8a8f98]">
                        Founder: {slot.startup.founderName} • {slot.startup.sector}
                    </p>
                </div>

                {/* Input Notes Area */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-[#d0d6e0] flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-[#828fff]" />
                            VC Meeting Notes & Observations
                        </span>
                        <span className="text-[10px] text-[#62666d]">Type or dictate notes</span>
                    </label>
                    <textarea
                        rows={4}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g., Founder presented 24% MoM growth. Strong unit economics. Asked for $600k for expansion to Indonesia. Scheduled follow-up DD call next Tuesday..."
                        className="w-full bg-[#0f1011] border border-[#23252a] rounded-md p-3 text-xs text-[#f7f8f8] placeholder-[#62666d] focus:outline-none focus:border-[#5e6ad2] leading-relaxed resize-none transition-colors"
                    />
                </div>

                {/* Action Button: Generate Follow-up Draft */}
                <button
                    onClick={handleGenerateFollowUp}
                    disabled={isGenerating}
                    className="w-full bg-[#5e6ad2] hover:bg-[#828fff] text-white rounded-md px-4 py-2.5 text-sm font-medium transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isGenerating ? (
                        <>
                            <RefreshCw className="w-4 h-4 text-white animate-spin" />
                            <span>Drafting Executive Follow-up...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 text-white" />
                            <span>Generate Follow-up Draft</span>
                        </>
                    )}
                </button>

                {/* Generated Result Preview Card */}
                {followUpResult && (
                    <div className="space-y-3 pt-3 border-t border-[#23252a] animate-fadeIn">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-medium text-[#d0d6e0] flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-[#828fff]" />
                                <span>Executive Follow-up Email</span>
                            </h4>
                            <button
                                onClick={handleCopyEmail}
                                className="flex items-center gap-1 text-[11px] font-medium text-[#828fff] hover:text-white bg-[#0f1011] hover:bg-[#18191a] px-2.5 py-1 rounded-md border border-[#23252a] transition-colors cursor-pointer"
                            >
                                {copied ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#27a644]" />
                                ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                )}
                                <span>{copied ? 'Copied' : 'Copy Email'}</span>
                            </button>
                        </div>

                        {/* Email Box */}
                        <div className="p-3.5 rounded-lg bg-[#0f1011] border border-[#23252a] text-xs space-y-2">
                            <div className="font-medium text-[#f7f8f8] border-b border-[#23252a] pb-1.5 font-mono text-[11px]">
                                Subject: {followUpResult.emailSubject}
                            </div>
                            <pre className="text-[#d0d6e0] whitespace-pre-wrap font-sans text-xs leading-relaxed">
                                {followUpResult.emailBody}
                            </pre>
                        </div>

                        {/* Key Takeaways & Action Items */}
                        {followUpResult.keyTakeaways && followUpResult.keyTakeaways.length > 0 && (
                            <div className="p-3 rounded-lg bg-[#0f1011] border border-[#23252a] space-y-1.5">
                                <span className="font-medium text-[#8a8f98] text-[10px] uppercase tracking-wider flex items-center gap-1">
                                    <ListChecks className="w-3 h-3 text-[#828fff]" />
                                    Key Takeaways
                                </span>
                                <ul className="space-y-1 text-[#d0d6e0]">
                                    {followUpResult.keyTakeaways.map((takeaway: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-1.5 text-xs">
                                            <span className="text-[#828fff]">•</span>
                                            <span>{takeaway}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="pt-2 flex justify-end">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto bg-[#0f1011] hover:bg-[#18191a] text-[#f7f8f8] border border-[#23252a] rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
                    >
                        Done & Save Notes
                    </button>
                </div>
            </div>
        </div>
    );
};
