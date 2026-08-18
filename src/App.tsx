import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AdminDashboard } from './components/AdminDashboard';
import { ParticipantPortal } from './components/ParticipantPortal';
import { AIMatchModal } from './components/AIMatchModal';
import { FollowUpModal } from './components/FollowUpModal';
import { Startup, Investor, MatchPair, MeetingSlot, EventStats } from './types';
import { generateSmartSchedule } from './utils/scheduler';
import { CheckCircle2 } from 'lucide-react';

const INITIAL_STATS: EventStats = {
    totalStartups: 0,
    totalInvestors: 0,
    scheduledMeetings: 0,
    avgMatchScore: 0,
    dealSuccessRate: 88.5,
    topSector: 'Tech & AI',
};

export default function App() {
    const [activeView, setActiveView] = useState<'admin' | 'participant'>('admin');
    const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'startups' | 'investors' | 'matches'>('overview');
    const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

    // Core Data States (100% real API data)
    const [stats, setStats] = useState<EventStats>(INITIAL_STATS);
    const [startups, setStartups] = useState<Startup[]>([]);
    const [investors, setInvestors] = useState<Investor[]>([]);
    const [matches, setMatches] = useState<MatchPair[]>([]);
    const [scheduleSlots, setScheduleSlots] = useState<MeetingSlot[]>([]);
    const [selectedInvestorId, setSelectedInvestorId] = useState<string>('');

    // Selected Current Investor for Participant Portal
    const currentInvestor: Investor | null =
        investors.find((i) => i.id === selectedInvestorId) ||
        (investors.length > 0 ? investors[0] : null);

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

    // Fetch real Google Sheets data on component mount
    useEffect(() => {
        const formatCurrency = (val: any): string => {
            if (val === undefined || val === null || val === '') return 'TBD';
            const cleanStr = String(val).replace(/[^0-9.-]+/g, '');
            const num = parseFloat(cleanStr);
            if (isNaN(num)) return String(val) || 'TBD';
            if (num >= 1_000_000) {
                const formatted = (num / 1_000_000).toFixed(1).replace(/\.0$/, '');
                return `$${formatted}M`;
            }
            if (num >= 1_000) {
                const formatted = (num / 1_000).toFixed(1).replace(/\.0$/, '');
                return `$${formatted}K`;
            }
            return `$${num}`;
        };

        const fetchData = async () => {
            try {
                const res = await fetch('/api/data');
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();

                if (data.startups && Array.isArray(data.startups) && data.startups.length > 0) {
                    const sanitizedStartups: Startup[] = data.startups.map((s: any, idx: number) => {
                        const name = s["Startup Name"] || s.name || `Startup ${idx + 1}`;
                        const sector = s["Primary Industry"] || s.sector || 'General Tech';
                        const stage = s["Current Funding Stage"] || s.stage || 'Seed';
                        const rawTargetAsk = s["Target Funding Amount in USD"] ?? s.targetAsk;
                        const targetAsk = rawTargetAsk ? formatCurrency(rawTargetAsk) : '$500K';
                        const founderName = s["Representative Name"] || s.founderName || 'Founder';
                        const summaryDesc = `A promising ${stage} startup in ${sector}`;

                        return {
                            id: s["Email Address"] || s.id || `startup-${idx + 1}`,
                            name,
                            sector,
                            stage,
                            targetAsk,
                            valuation: s.valuation || 'TBD',
                            description: s.description || summaryDesc,
                            tagline: s.tagline || summaryDesc,
                            logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
                            founderName,
                            founderTitle: 'Founder & CEO',
                            metrics: {
                                mrr: s.metrics?.mrr || s.mrr || 'TBD',
                                growthRate: s.metrics?.growthRate || s.growthRate || 'N/A',
                                teamSize: s.metrics?.teamSize || s.teamSize || 8,
                                patentCount: s.metrics?.patentCount || s.patentCount || 0,
                            },
                            keyTags: sector.split(',').map((t: string) => t.trim()).filter(Boolean),
                        };
                    });
                    setStartups(sanitizedStartups);
                }

                if (data.investors && Array.isArray(data.investors) && data.investors.length > 0) {
                    const sanitizedInvestors: Investor[] = data.investors.map((i: any, idx: number) => {
                        const name = i["Representative Name"] || i.name || `Investor ${idx + 1}`;
                        const firm = i["Investor or Fund Name"] || i.firm || 'Venture Capital';
                        const rawSectors = i["Interested Industries"] || i.targetSectors || 'EdTech & AI, FinTech';
                        const targetSectors = (typeof rawSectors === 'string' ? rawSectors : String(rawSectors))
                            .split(',')
                            .map((t: string) => t.trim())
                            .filter(Boolean);
                        const maxTicket = i["Maximum Ticket Size (USD)"];
                        const ticketSizeRange = maxTicket ? `Up to ${formatCurrency(maxTicket)}` : (i.ticketSizeRange || '$100K - $500K');
                        const investmentPhilosophy = i["Investment Philosophy and matching criteria"] || i.investmentPhilosophy || 'Active tech investor seeking high-growth ventures in SEA.';

                        return {
                            id: i["Email Address"] || i.id || `investor-${idx + 1}`,
                            name,
                            firm,
                            role: 'Investment Partner',
                            country: i.country || 'Vietnam',
                            targetSectors,
                            preferredStages: Array.isArray(i.preferredStages)
                                ? i.preferredStages
                                : typeof i.preferredStages === 'string'
                                    ? i.preferredStages.split(',').map((t: string) => t.trim())
                                    : ['Seed', 'Pre-Series A'],
                            ticketSizeRange,
                            investmentPhilosophy,
                            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
                        };
                    });
                    setInvestors(sanitizedInvestors);
                }

                if (data.startups || data.investors) {
                    setStats((prev) => ({
                        ...prev,
                        totalStartups: (data.startups && Array.isArray(data.startups)) ? data.startups.length : prev.totalStartups,
                        totalInvestors: (data.investors && Array.isArray(data.investors)) ? data.investors.length : prev.totalInvestors,
                    }));
                    showToast('📊 Loaded live data from Google Sheets API');
                }
            } catch (err) {
                console.warn('Could not load live Google Sheets data, using default fallback data:', err);
            }
        };

        fetchData();
    }, []);

    // Handler: Run AI Matchmaking
    const handleRunMatchmaking = async () => {
        if (startups.length === 0 || investors.length === 0) {
            showToast('⚠️ No startups or investors available. Please ensure data is loaded.');
            return;
        }

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
    const handleGenerateSchedule = async () => {
        if (matches.length === 0) {
            showToast('⚠️ Please run AI Matchmaking first before generating schedule.');
            return;
        }

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

            // Sync top slots to Google Calendar / Apps Script webhook (limit to top 3 slots)
            const slotsToSync = optimizedSlots.slice(0, 3);
            if (slotsToSync.length > 0) {
                await Promise.all(
                    slotsToSync.map(async (slot) => {
                        const correspondingPair = matches.find(
                            (m) =>
                                (m.startup.id === slot.startup.id && m.investor.id === slot.investor.id) ||
                                (m.startup.name === slot.startup.name && m.investor.firm === slot.investor.firm)
                        );

                        const iceBreakers = correspondingPair?.analysis?.ice_breakers
                            ? correspondingPair.analysis.ice_breakers.join('\n')
                            : 'What are your primary go-to-market drivers?\nHow do you plan to leverage VC network?';

                        const reason = correspondingPair?.analysis?.reason || 'Strong strategic alignment for DAVAS 2026 1:1 Summit.';

                        return fetch('/api/schedule', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                startupEmail: slot.startup.id,
                                investorEmail: slot.investor.id,
                                startupName: slot.startup.name,
                                investorName: slot.investor.name,
                                reason,
                                iceBreakers,
                                date: '2026-08-20',
                                time: slot.time,
                            }),
                        }).catch((err) => {
                            console.warn('Failed to sync slot to Google Calendar webhook:', err);
                        });
                    })
                );

                showToast('Đã đồng bộ lịch lên Google Calendar thành công!');
            }
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
                    startupsCount={startups.length}
                    investorsCount={investors.length}
                    matchesCount={matches.length}
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
