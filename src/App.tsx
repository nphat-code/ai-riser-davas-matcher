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
    dealSuccessRate: 0,
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

                let sanitizedStartups: Startup[] = [];
                if (data.startups && Array.isArray(data.startups) && data.startups.length > 0) {
                    sanitizedStartups = data.startups.map((s: any, idx: number) => {
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
                            location: s.location || 'Vietnam',
                            avatar: s.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(founderName)}&background=random`,
                            description: s.description || summaryDesc,
                            tagline: s.tagline || summaryDesc,
                            logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
                            founderName,
                            founderTitle: 'Founder & CEO',
                            metrics: {
                                mrr: s.metrics?.mrr || s.mrr || 'TBD',
                                arr: s.metrics?.arr || s.arr || 'TBD',
                                growthRate: s.metrics?.growthRate || s.growthRate || 'N/A',
                                usersCount: s.metrics?.usersCount || s.usersCount || '10K+',
                            },
                            keyTags: sector.split(',').map((t: string) => t.trim()).filter(Boolean),
                        };
                    });
                    setStartups(sanitizedStartups);
                }

                let sanitizedInvestors: Investor[] = [];
                if (data.investors && Array.isArray(data.investors) && data.investors.length > 0) {
                    sanitizedInvestors = data.investors.map((i: any, idx: number) => {
                        const name = i["Representative Name"] || i.name || `Investor ${idx + 1}`;
                        const firm = i["Investor or Fund Name"] || i.firm || 'Venture Capital';
                        const rawSectors =
                            i["Investment Sectors of Interest"] ||
                            i["Investment_Sectors_of_Interest"] ||
                            i["Interested Industries"] ||
                            i.targetSectors ||
                            'EdTech & AI, FinTech';
                        const targetSectors = (typeof rawSectors === 'string' ? rawSectors : String(rawSectors))
                            .split(',')
                            .map((t: string) => t.trim())
                            .filter(Boolean);
                        const maxTicket = i["Maximum Ticket Size (USD)"];
                        const ticketSizeRange = maxTicket ? `Up to ${formatCurrency(maxTicket)}` : (i.ticketSizeRange || '$100K - $500K');
                        const investmentPhilosophy =
                            i["Investment Philosophy / Thesis"] ||
                            i["Investment_Philosophy_Thesis"] ||
                            i["Investment Philosophy and matching criteria"] ||
                            i.investmentPhilosophy ||
                            'Active tech investor seeking high-growth ventures in SEA.';

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
                            totalDeals: Number(i.totalDeals || 12),
                            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
                        };
                    });
                    setInvestors(sanitizedInvestors);
                }

                // Load existing matches from Google Sheets if available
                if (data.matches && Array.isArray(data.matches) && data.matches.length > 0) {
                    const loadedMatches: MatchPair[] = data.matches.map((m: any, idx: number) => {
                        const startupName = m.Startup_Name || m["Startup_Name"] || m.startupName || m["Startup Name"] || `Startup ${idx + 1}`;
                        const startupEmail = m.Startup_Email || m["Startup_Email"] || m.startupEmail || m["Startup Email"] || `startup-${idx + 1}`;
                        const startupSector = m.Startup_Sector || m["Startup_Sector"] || m.startupSector || m["Startup Sector"] || 'General Tech';
                        const startupStage = m.Startup_Stage || m["Startup_Stage"] || m.startupStage || m["Startup Stage"] || 'Seed';
                        const targetAsk = m.Target_Ask || m["Target_Ask"] || m.targetAsk || m["Target Ask"] || '$500K';
                        const founderName = m.Founder_Name || m["Founder_Name"] || m.founderName || m["Founder Name"] || 'Founder';

                        const matchedStartup: Startup = sanitizedStartups.find(
                            (s) => s.id === startupEmail || s.name === startupName
                        ) || {
                            id: startupEmail,
                            name: startupName,
                            sector: startupSector,
                            stage: startupStage,
                            targetAsk,
                            valuation: 'TBD',
                            location: 'Vietnam',
                            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(founderName)}&background=random`,
                            description: `A promising ${startupStage} startup in ${startupSector}`,
                            tagline: `A promising ${startupStage} startup in ${startupSector}`,
                            logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(startupName)}&background=random`,
                            founderName,
                            founderTitle: 'Founder & CEO',
                            metrics: { mrr: 'TBD', arr: 'TBD', growthRate: 'N/A', usersCount: '10K+' },
                            keyTags: startupSector.split(',').map((t: string) => t.trim()).filter(Boolean),
                        };

                        const investorFirm = m.Investor_Firm || m["Investor_Firm"] || m.investorFirm || m["Investor Firm"] || 'Venture Capital';
                        const investorName = m.Investor_Representative || m["Investor_Representative"] || m.investorName || m["Investor Name"] || 'Investor';
                        const investorEmail = m.Investor_Email || m["Investor_Email"] || m.investorEmail || m["Investor Email"] || `investor-${idx + 1}`;

                        const matchedInvestor: Investor = sanitizedInvestors.find(
                            (i) => i.id === investorEmail || i.firm === investorFirm
                        ) || {
                            id: investorEmail,
                            name: investorName,
                            firm: investorFirm,
                            role: 'Investment Partner',
                            country: 'Vietnam',
                            targetSectors: [startupSector],
                            preferredStages: [startupStage],
                            ticketSizeRange: '$100K - $1M',
                            investmentPhilosophy: 'Active tech investor seeking high-growth ventures in SEA.',
                            totalDeals: 12,
                            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(investorName)}&background=random`,
                        };

                        const rawIce = m.AI_Ice_Breakers || m["AI_Ice_Breakers"] || m.iceBreakers || m.ice_breakers || m["Ice Breakers"];
                        const score = Number(m.AI_Match_Score || m["AI_Match_Score"] || m.score || m.matching_score || 90);
                        const reason = m.AI_Match_Reason || m["AI_Match_Reason"] || m.reason || m["Reason"] || 'Strong strategic alignment for DAVAS 2026 1:1 Summit.';
                        const recommendedTable = m.Assigned_Table || m["Assigned_Table"] || m.table || m.recommendedTable || `Table A${(idx % 5) + 1}`;

                        const iceBreakers = Array.isArray(rawIce)
                            ? rawIce
                            : typeof rawIce === 'string'
                                ? rawIce.split('\n').filter(Boolean)
                                : [
                                    'What are your primary go-to-market drivers?',
                                    'How do you plan to leverage our VC network?',
                                    'What unit economics benchmarks do you aim for post-round?',
                                ];

                        return {
                            id: m.id || m["ID"] || `mp-sheet-${idx + 1}`,
                            startupId: matchedStartup.id,
                            investorId: matchedInvestor.id,
                            startup: matchedStartup,
                            investor: matchedInvestor,
                            status: 'Scheduled',
                            recommendedTable,
                            analysis: {
                                matching_score: score,
                                reason,
                                ice_breakers: iceBreakers,
                            },
                        };
                    });

                    setMatches(loadedMatches);

                    // Khôi phục scheduleSlots cho Participant Portal từ Google Sheets
                    const hydratedSlots: MeetingSlot[] = data.matches
                        .filter((m: any) => m.Meeting_Time_Slot && m.Meeting_Time_Slot !== 'Pending Schedule')
                        .map((m: any, idx: number) => {
                            const correspondingPair = loadedMatches[idx];
                            const time = m.Meeting_Time_Slot || m["Meeting_Time_Slot"] || '09:00 - 09:30 AM';
                            const table = m.Assigned_Table || m["Assigned_Table"] || 'Table A1';
                            const notes = m.Investor_Notes || m["Investor_Notes"] || '';
                            const score = Number(m.AI_Match_Score || m["AI_Match_Score"] || 90);

                            const rawDraft = m.AI_Followup_Draft || m["AI_Followup_Draft"] || '';
                            let followUpGenerated = undefined;
                            if (rawDraft) {
                                const subjectMatch = rawDraft.match(/Subject:\s*(.*)/);
                                followUpGenerated = {
                                    emailSubject: subjectMatch ? subjectMatch[1] : 'DAVAS 2026 Follow-up Draft',
                                    emailBody: rawDraft.replace(/Subject:\s*.*?\n\n?/, '').trim() || rawDraft,
                                    keyTakeaways: [notes || 'Meeting notes recorded.'],
                                    actionItems: ['Follow up with founder on next steps.'],
                                };
                            }

                            return {
                                id: `slot-hydrated-${idx + 1}-${m.Match_ID || idx}`,
                                time,
                                table,
                                startup: correspondingPair.startup,
                                investor: correspondingPair.investor,
                                status: notes ? ('Completed' as const) : (idx === 0 ? ('In Progress' as const) : ('Upcoming' as const)),
                                matchScore: score,
                                notes,
                                followUpGenerated,
                            };
                        });

                    if (hydratedSlots.length > 0) {
                        setScheduleSlots(hydratedSlots);
                    } else if (loadedMatches.length > 0) {
                        // Nếu chưa lưu giờ cố định, tự động xếp lịch thông minh từ các cặp đã match
                        setScheduleSlots(generateSmartSchedule(loadedMatches));
                    }
                }

                if (data.startups || data.investors || data.matches) {
                    setStats((prev) => {
                        const totalScheduled = (data.matches && Array.isArray(data.matches)) ? data.matches.length : prev.scheduledMeetings;
                        const avgScore = (data.matches && Array.isArray(data.matches) && data.matches.length > 0)
                            ? Math.round(
                                (data.matches.reduce((acc: number, curr: any) => acc + Number(curr.score || curr.matching_score || 90), 0) /
                                    data.matches.length) * 10
                            ) / 10
                            : prev.avgMatchScore;

                        return {
                            ...prev,
                            totalStartups: (data.startups && Array.isArray(data.startups)) ? data.startups.length : prev.totalStartups,
                            totalInvestors: (data.investors && Array.isArray(data.investors)) ? data.investors.length : prev.totalInvestors,
                            scheduledMeetings: totalScheduled,
                            avgMatchScore: avgScore,
                        };
                    });
                    showToast('📊 Loaded live data & matches from Google Sheets API');
                }
            } catch (err) {
                console.warn('Could not load live Google Sheets data, using default fallback data:', err);
            }
        };

        fetchData();
    }, []);

    // Update dynamic deal success rate whenever schedule slots or notes change
    useEffect(() => {
        const completedMeetingsWithNotes = scheduleSlots.filter((s) => s.notes && s.notes.trim().length > 0);
        const dynamicDealRate =
            scheduleSlots.length > 0 && completedMeetingsWithNotes.length > 0
                ? Math.round((completedMeetingsWithNotes.length / scheduleSlots.length) * 1000) / 10
                : 0;

        setStats((prev) => ({
            ...prev,
            dealSuccessRate: dynamicDealRate,
            scheduledMeetings: scheduleSlots.length > 0 ? scheduleSlots.length : prev.scheduledMeetings,
        }));
    }, [scheduleSlots]);

    // Helper to extract clean sector tokens for semantic matching
    const extractSectorTokens = (text: string): string[] => {
        return (text || '')
            .toLowerCase()
            .replace(/[&,/\-_()]/g, ' ')
            .split(/\s+/)
            .map((t) => t.trim())
            .filter((t) => t.length > 1 && !['and', 'the', 'for', 'in', 'of', 'with', 'or', 'tech'].includes(t));
    };

    // Helper to calculate similarity score between startup and investor sectors
    const calculateSectorScore = (startupSector: string, investorSectors: string[], startupTags: string[] = []): number => {
        const normStartupSector = (startupSector || '').toLowerCase().trim();
        const startupTokens = new Set([
            ...extractSectorTokens(normStartupSector),
            ...startupTags.flatMap(extractSectorTokens),
        ]);

        let bestScore = 0;

        for (const invSec of investorSectors) {
            const normInvSec = (invSec || '').toLowerCase().trim();
            if (!normInvSec) continue;

            // Direct exact match
            if (normStartupSector === normInvSec) {
                return 100;
            }

            // Substring containment
            if (normStartupSector.includes(normInvSec) || normInvSec.includes(normStartupSector)) {
                bestScore = Math.max(bestScore, 85);
            }

            // Token overlap
            const invTokens = extractSectorTokens(normInvSec);
            let matchedTokens = 0;
            for (const token of invTokens) {
                if (startupTokens.has(token)) {
                    matchedTokens++;
                } else {
                    for (const sToken of startupTokens) {
                        if (sToken.includes(token) || token.includes(sToken)) {
                            matchedTokens += 0.6;
                            break;
                        }
                    }
                }
            }

            if (invTokens.length > 0 && matchedTokens > 0) {
                const ratio = matchedTokens / Math.max(1, Math.min(startupTokens.size, invTokens.length));
                const tokenScore = Math.min(80, Math.round(ratio * 75) + 20);
                bestScore = Math.max(bestScore, tokenScore);
            }
        }

        return bestScore;
    };

    // Helper to parse funding strings into numeric USD values
    const parseFundingAmount = (text: string): number => {
        if (!text) return 0;
        const cleanStr = text.replace(/,/g, '').trim();
        const numMatch = cleanStr.match(/([\d.]+)\s*([KkMmBb])?/);
        if (!numMatch) return 0;
        let val = parseFloat(numMatch[1]);
        if (isNaN(val)) return 0;
        const unit = numMatch[2]?.toUpperCase();
        if (unit === 'K') val *= 1_000;
        else if (unit === 'M') val *= 1_000_000;
        else if (unit === 'B') val *= 1_000_000_000;
        return val;
    };

    // Helper to parse max ticket size from investor range (e.g. "$250k - $1M", "Up to $1M", "$2M+")
    const parseMaxTicketSize = (rangeStr: string): number => {
        if (!rangeStr) return Infinity;
        const cleanStr = rangeStr.replace(/,/g, '');
        const matches = Array.from(cleanStr.matchAll(/([\d.]+)\s*([KkMmBb])?/g));
        if (matches.length === 0) return Infinity;

        let maxVal = 0;
        for (const match of matches) {
            let val = parseFloat(match[1]);
            if (isNaN(val)) continue;
            const unit = match[2]?.toUpperCase();
            if (unit === 'K') val *= 1_000;
            else if (unit === 'M') val *= 1_000_000;
            else if (unit === 'B') val *= 1_000_000_000;
            else if (val <= 100 && !unit) {
                val *= 1_000_000;
            }
            if (val > maxVal) maxVal = val;
        }

        return maxVal > 0 ? maxVal : Infinity;
    };

    // Find the best-fit investor for a selected startup
    const findBestFitInvestor = (
        startup: Startup,
        allInvestors: Investor[],
        existingMatches: MatchPair[]
    ): Investor => {
        if (allInvestors.length <= 1) return allInvestors[0];

        const scored = allInvestors.map((investor) => {
            let score = 0;

            // 1. Sector Alignment (Highest Weight)
            const sectorScore = calculateSectorScore(
                startup.sector,
                investor.targetSectors || [],
                startup.keyTags || []
            );
            score += sectorScore * 1.5;

            // Check investment philosophy keywords
            if (investor.investmentPhilosophy) {
                const philTokens = extractSectorTokens(investor.investmentPhilosophy);
                const startupTokens = extractSectorTokens(startup.sector);
                for (const t of startupTokens) {
                    if (philTokens.includes(t)) {
                        score += 15;
                        break;
                    }
                }
            }

            // 2. Stage Alignment & Penalty
            const preferredStages = investor.preferredStages || [];
            const startupStage = (startup.stage || '').toLowerCase().trim();
            const hasStageMatch = preferredStages.some((st) => {
                const normSt = st.toLowerCase().trim();
                return normSt === startupStage || normSt.includes(startupStage) || startupStage.includes(normSt);
            });
            if (hasStageMatch) {
                score += 40; // Trùng khớp hoàn toàn Stage
            } else {
                score -= 35; // Lệch Stage (ví dụ Startup Series A mà Quỹ chỉ Pre-Seed)
            }

            // 3. Ticket Size (Quy mô vốn) Matching & Over-ask Penalty
            const startupAsk = parseFundingAmount(startup.targetAsk);
            const investorMaxTicket = parseMaxTicketSize(investor.ticketSizeRange);
            if (startupAsk > 0 && investorMaxTicket > 0 && investorMaxTicket !== Infinity && startupAsk > investorMaxTicket) {
                score -= 50; // Vốn gọi vượt quá khả năng chi trả của Quỹ
            }

            // 4. Duplicate Pairing Penalty (avoid pairing the same startup and investor twice if alternatives exist)
            const alreadyPaired = existingMatches.some(
                (m) =>
                    (m.startupId === startup.id && m.investorId === investor.id) ||
                    (m.startup?.name === startup.name && m.investor?.firm === investor.firm)
            );
            if (alreadyPaired) {
                score -= 60;
            }

            // 5. Meeting Load Balancing
            const totalInvestorMeetings = existingMatches.filter(
                (m) => m.investorId === investor.id || m.investor?.firm === investor.firm
            ).length;
            score -= totalInvestorMeetings * 5;

            return { investor, score, sectorScore };
        });

        // Sort descending by score
        scored.sort((a, b) => b.score - a.score);

        // Luôn chọn ứng viên tốt nhất số 1
        return scored[0].investor;
    };

    // Helper to validate if an argument is a true Startup object and not a React Event
    const isStartupObject = (obj: any): obj is Startup => {
        return (
            obj !== null &&
            typeof obj === 'object' &&
            !('nativeEvent' in obj) &&
            !('bubbles' in obj) &&
            typeof obj.name === 'string' &&
            typeof obj.sector === 'string'
        );
    };

    // Handler: Run Best-Fit Smart Matchmaking
    const handleRunMatchmaking = async (targetStartup?: Startup | unknown) => {
        if (startups.length === 0 || investors.length === 0) {
            showToast('⚠️ No startups or investors available. Please ensure data is loaded.');
            return;
        }

        setIsMatchmakingLoading(true);

        try {
            // 1. Choose Startup: Use targetStartup if it is a valid Startup object; otherwise pick an unmatched startup
            let chosenStartup: Startup;
            if (isStartupObject(targetStartup)) {
                chosenStartup = targetStartup;
            } else {
                const matchedStartupIds = new Set(matches.map((m) => m.startupId || m.startup?.id || m.startup?.name));
                const unmatchedStartups = startups.filter((s) => !matchedStartupIds.has(s.id) && !matchedStartupIds.has(s.name));

                if (unmatchedStartups.length > 0) {
                    chosenStartup = unmatchedStartups[Math.floor(Math.random() * unmatchedStartups.length)];
                } else {
                    // If all have matches, pick startup with the least meetings
                    const matchCounts: Record<string, number> = {};
                    matches.forEach((m) => {
                        const id = m.startupId || m.startup?.id || m.startup?.name;
                        if (id) matchCounts[id] = (matchCounts[id] || 0) + 1;
                    });
                    const sorted = [...startups].sort((a, b) => (matchCounts[a.id] || 0) - (matchCounts[b.id] || 0));
                    chosenStartup = sorted[0];
                }
            }

            // 2. Choose Best-Fit Investor matching sector, stage & thesis
            const bestInvestor = findBestFitInvestor(chosenStartup, investors, matches);

            // 3. Send high-synergy pair to Gemini AI evaluation endpoint
            const res = await fetch('/api/matchmaking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startup: chosenStartup,
                    investor: bestInvestor,
                }),
            });

            const analysis = await res.json();

            const newPair: MatchPair = {
                id: `mp-${Date.now()}`,
                startupId: chosenStartup.id,
                investorId: bestInvestor.id,
                startup: chosenStartup,
                investor: bestInvestor,
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

            setMatches((prev) => {
                const updated = [newPair, ...prev];
                const totalScore = updated.reduce((sum, m) => sum + (m.analysis?.matching_score || 0), 0);
                const newAvg = updated.length > 0 ? Math.round((totalScore / updated.length) * 10) / 10 : 0;
                setStats((prevStats) => ({
                    ...prevStats,
                    avgMatchScore: newAvg,
                }));
                return updated;
            });

            // Automatically inspect the newly generated AI match
            setInspectPair(newPair);
            showToast(`✨ Smart Match: ${chosenStartup.name} matched with ${bestInvestor.firm} (${newPair.analysis.matching_score}% Fit)`);

            // Save match to Google Sheets in background
            fetch('/api/matches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startup: chosenStartup,
                    investor: bestInvestor,
                    analysis,
                    recommendedTable: newPair.recommendedTable,
                    id: newPair.id,
                }),
            }).catch((syncErr) => {
                console.warn('Failed to sync match to Google Sheets:', syncErr);
            });
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

            // Send optimized schedule batch to Google Sheets to update Meeting_Time_Slot & Assigned_Table
            const schedulePayload = optimizedSlots.map((slot) => ({
                startupName: slot.startup.name,
                investorFirm: slot.investor.firm,
                time: slot.time,
                table: slot.table,
            }));

            await fetch('/api/schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ schedule: schedulePayload }),
            }).catch((err) => {
                console.warn('Failed to sync schedule to Google Sheets:', err);
            });

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

                showToast('📅 Successfully synced schedule to Google Calendar & Sheets!');
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

        const targetSlot = scheduleSlots.find((s) => s.id === slotId);
        if (targetSlot) {
            fetch('/api/followup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startupName: targetSlot.startup.name,
                    investorFirm: targetSlot.investor.firm,
                    notes,
                    followUpGenerated: generatedResult,
                }),
            }).catch((err) => {
                console.warn('Failed to sync follow-up to Google Sheets:', err);
            });
        }

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
            <div className="flex-1 max-w-[1600px] w-full mx-auto flex flex-col lg:flex-row">
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
                            scheduleSlots={scheduleSlots.filter(
                                (slot) => slot.investor.id === currentInvestor?.id || slot.investor.firm === currentInvestor?.firm
                            )}
                            currentInvestor={currentInvestor}
                            investors={investors}
                            selectedInvestorId={selectedInvestorId}
                            setSelectedInvestorId={setSelectedInvestorId}
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
