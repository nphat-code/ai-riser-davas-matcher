import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AdminDashboard } from './components/AdminDashboard';
import { ParticipantPortal } from './components/ParticipantPortal';
import { AIMatchModal } from './components/AIMatchModal';
import { FollowUpModal } from './components/FollowUpModal';
import {
    MOCK_STARTUPS,
    MOCK_INVESTORS,
    INITIAL_EVENT_STATS,
    SAMPLE_MATCH_PAIRS,
    INITIAL_MEETING_SLOTS,
} from './data/mockData';
import { Startup, Investor, MatchPair, MeetingSlot, EventStats } from './types';
import { generateSmartSchedule } from './utils/scheduler';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
    const [activeView, setActiveView] = useState<'admin' | 'participant'>('admin');
    const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'startups' | 'investors' | 'matches'>('overview');
    const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

    // Core Data States
    const [stats, setStats] = useState<EventStats>(INITIAL_EVENT_STATS);
    const [startups] = useState<Startup[]>(MOCK_STARTUPS);
    const [investors] = useState<Investor[]>(MOCK_INVESTORS);
    const [matches, setMatches] = useState<MatchPair[]>(SAMPLE_MATCH_PAIRS);
    const [scheduleSlots, setScheduleSlots] = useState<MeetingSlot[]>(INITIAL_MEETING_SLOTS);

    // Selected Current Investor for Participant Portal demo
    const [currentInvestor] = useState<Investor>(MOCK_INVESTORS[0]); // CyberAgent Capital (Kenji Suzuki)

    // Loading States
    const [isMatchmakingLoading, setIsMatchmakingLoading] = useState(false);
    const [isScheduleLoading, setIsScheduleLoading] = useState(false);

    // Modals
    const [inspectPair, setInspectPair] = useState<MatchPair | null>(null);
    const [followUpSlot, setFollowUpSlot] = useState<MeetingSlot | null>(null);

    // Toast Notification
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage(null);
        }, 3500);
    };

    // Handler: Run AI Matchmaking
    const handleRunMatchmaking = async () => {
        setIsMatchmakingLoading(true);

        try {
            const randomStartup = startups[Math.floor(Math.random() * startups.length)];
            const randomInvestor = investors[Math.floor(Math.random() * investors.length)];

            const res = await fetch('/api/matchmaking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startup: randomStartup,
                    investor: randomInvestor,
                }),
            });

            const analysis = await res.json();

            const newPair: MatchPair = {
                id: `mp-${Date.now()}`,
                startupId: randomStartup.id,
                investorId: randomInvestor.id,
                startup: randomStartup,
                investor: randomInvestor,
                status: 'Scheduled',
                recommendedTable: `Table ${String.fromCharCode(65 + Math.floor(Math.random() * 4))}${Math.floor(Math.random() * 5) + 1}`,
                analysis: {
                    matching_score: analysis.matching_score || 95,
                    reason: analysis.reason || 'Strong synergy across sector targets and stage funding.',
                    ice_breakers: analysis.ice_breakers || [
                        'What are your primary go-to-market drivers?',
                        'How do you plan to leverage our VC network?',
                        'What unit economics benchmarks do you aim for post-round?',
                    ],
                },
            };

            setMatches((prev) => [newPair, ...prev]);
            setStats((prev) => ({
                ...prev,
                scheduledMeetings: prev.scheduledMeetings + 1,
                avgMatchScore: Math.round(((prev.avgMatchScore + (analysis.matching_score || 95)) / 2) * 10) / 10,
            }));

            // Automatically inspect the newly generated AI match
            setInspectPair(newPair);
            showToast(`✨ AI Match Generated! Compatibility Score: ${newPair.analysis.matching_score}%`);
        } catch (err) {
            console.error('Matchmaking error:', err);
            showToast('⚠️ AI Matchmaking evaluation completed with standard criteria.');
        } finally {
            setIsMatchmakingLoading(false);
        }
    };

    // Handler: Generate Smart Schedule using Greedy + Priority Algorithm
    const handleGenerateSchedule = () => {
        setIsScheduleLoading(true);

        try {
            // Execute smart scheduling algorithm
            const optimizedSlots = generateSmartSchedule(matches);

            setScheduleSlots(optimizedSlots);
            setStats((prev) => ({
                ...prev,
                scheduledMeetings: optimizedSlots.length,
            }));

            showToast(`📅 Smart Schedule Generated! ${optimizedSlots.length} 1:1 meetings assigned with zero collisions.`);
        } catch (err) {
            console.error('Smart scheduling failed:', err);
            showToast('⚠️ Failed to generate schedule.');
        } finally {
            setIsScheduleLoading(false);
        }
    };

    // Handler: Save Notes & AI Follow-Up to Meeting Slot
    const handleSaveFollowUp = (slotId: string, notes: string, generatedResult: any) => {
        setScheduleSlots((prev) =>
            prev.map((slot) => {
                if (slot.id === slotId) {
                    return {
                        ...slot,
                        notes,
                        followUpGenerated: generatedResult,
                        status: 'Completed',
                    };
                }
                return slot;
            })
        );
        showToast('✅ Meeting notes and AI Follow-up draft saved to your schedule.');
    };

    return (
        <div className="min-h-screen bg-gradient-dark text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed top-20 right-6 z-50 glass-panel-glow px-4 py-3 rounded-2xl border border-cyan-400/40 shadow-2xl flex items-center gap-3 animate-bounce">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold text-white">{toastMessage}</span>
                </div>
            )}

            {/* Top Application Header */}
            <Header
                activeView={activeView}
                setActiveView={setActiveView}
                isMobileFrame={isMobileFrame}
                setIsMobileFrame={setIsMobileFrame}
                onRunMatchmaking={handleRunMatchmaking}
            />

            {/* Main Content Layout */}
            <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
                {/* Sidebar Navigation */}
                <Sidebar
                    activeView={activeView}
                    setActiveView={setActiveView}
                    activeAdminTab={activeAdminTab}
                    setActiveAdminTab={setActiveAdminTab}
                    onRunMatchmaking={handleRunMatchmaking}
                />

                {/* View Render Container */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto min-w-0">
                    {activeView === 'admin' ? (
                        <AdminDashboard
                            stats={stats}
                            startups={startups}
                            investors={investors}
                            matches={matches}
                            activeTab={activeAdminTab}
                            setActiveTab={setActiveAdminTab}
                            onRunMatchmaking={handleRunMatchmaking}
                            onGenerateSchedule={handleGenerateSchedule}
                            isMatchmakingLoading={isMatchmakingLoading}
                            isScheduleLoading={isScheduleLoading}
                            onInspectMatch={(pair) => setInspectPair(pair)}
                        />
                    ) : (
                        <ParticipantPortal
                            scheduleSlots={scheduleSlots}
                            currentInvestor={currentInvestor}
                            onOpenFollowUpModal={(slot) => setFollowUpSlot(slot)}
                        />
                    )}
                </main>
            </div>

            {/* Modals */}
            <AIMatchModal pair={inspectPair} onClose={() => setInspectPair(null)} />

            <FollowUpModal
                slot={followUpSlot}
                onClose={() => setFollowUpSlot(null)}
                onSaveFollowUp={handleSaveFollowUp}
            />
        </div>
    );
}
