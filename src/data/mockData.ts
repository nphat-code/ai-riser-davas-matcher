import { Startup, Investor, MeetingSlot, EventStats, MatchPair } from '../types';

export const INITIAL_EVENT_STATS: EventStats = {
    totalStartups: 48,
    totalInvestors: 32,
    scheduledMeetings: 156,
    avgMatchScore: 92.4,
    dealSuccessRate: 86.5,
    topSector: 'AI & DeepTech',
};

export const MOCK_STARTUPS: Startup[] = [
    {
        id: 'st-1',
        name: 'EduBot AI',
        logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
        tagline: 'Hyper-personalized AI Tutor for K-12 and STEM Education in Southeast Asia',
        description: 'EduBot AI uses real-time adaptive LLM models to customize STEM curricula for students across SEA, increasing retention by 340%.',
        sector: 'EdTech & AI',
        stage: 'Seed',
        targetAsk: '$600,000',
        valuation: '$5,000,000',
        location: 'Da Nang, Vietnam',
        founderName: 'Dr. Minh Tran',
        founderTitle: 'Co-Founder & CEO',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        metrics: {
            mrr: '$38,000',
            growthRate: '+24% MoM',
            usersCount: '45,000+ Active Students',
        },
        keyTags: ['Adaptive Learning', 'Generative AI', 'STEM', 'B2B2C'],
        deckUrl: 'https://davas.vn/decks/edubot-ai-2026.pdf',
    },
    {
        id: 'st-2',
        name: 'EcoGrow Vietnam',
        logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=120&q=80',
        tagline: 'IoT Smart Hydroponics & Automated Urban Farming Networks',
        description: 'Zero-pesticide vertical farming modules powered by computer vision IoT sensors, reducing water usage by 90% in urban centers.',
        sector: 'AgriTech & Climate',
        stage: 'Pre-Seed',
        targetAsk: '$350,000',
        valuation: '$2,800,000',
        location: 'Da Nang, Vietnam',
        founderName: 'Linh Nguyen',
        founderTitle: 'Founder & CTO',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        metrics: {
            mrr: '$14,500',
            growthRate: '+18% MoM',
            usersCount: '28 Commercial Farms',
        },
        keyTags: ['Hydroponics', 'IoT Hardware', 'Carbon Offsets', 'B2B Supply Chain'],
        deckUrl: 'https://davas.vn/decks/ecogrow-2026.pdf',
    },
    {
        id: 'st-3',
        name: 'FinFlow APAC',
        logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=120&q=80',
        tagline: 'Cross-Border B2B Payment Protocol for SME Exporters in ASEAN',
        description: 'Instant multi-currency settlement engine with AI fraud detection, enabling Vietnam SMEs to collect international payments with sub-1% fees.',
        sector: 'FinTech',
        stage: 'Series A',
        targetAsk: '$2,500,000',
        valuation: '$18,000,000',
        location: 'Ho Chi Minh City, Vietnam',
        founderName: 'Alex Le',
        founderTitle: 'CEO & Ex-Paypal',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        metrics: {
            arr: '$1.2M',
            growthRate: '+310% YoY',
            usersCount: '$42M Annual GTV',
        },
        keyTags: ['Cross-Border Payment', 'RegTech', 'API Infrastructure', 'B2B'],
        deckUrl: 'https://davas.vn/decks/finflow-2026.pdf',
    },
    {
        id: 'st-4',
        name: 'MedPulse AI',
        logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=120&q=80',
        tagline: 'AI Radiography Diagnostics & Remote Tele-ICU Platform',
        description: 'Sub-second CT and X-Ray abnormality triage tool approved for hospital deployment across Central Vietnam medical hubs.',
        sector: 'HealthTech & AI',
        stage: 'Seed',
        targetAsk: '$800,000',
        valuation: '$6,500,000',
        location: 'Da Nang, Vietnam',
        founderName: 'Dr. Quoc Pham',
        founderTitle: 'Chief Medical Officer',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=120&q=80',
        metrics: {
            mrr: '$22,000',
            growthRate: '+15% MoM',
            usersCount: '14 Hospital Clients',
        },
        keyTags: ['Medical Diagnostics', 'DeepTech', 'FDA/MOH Compliance', 'SaaS'],
        deckUrl: 'https://davas.vn/decks/medpulse-2026.pdf',
    },
    {
        id: 'st-5',
        name: 'VoltWave Mobility',
        logo: 'https://images.unsplash.com/photo-1558441719-6705166e2106?auto=format&fit=crop&w=120&q=80',
        tagline: 'Next-Gen Battery Swapping Infrastructure for EV Two-Wheelers',
        description: 'Modular 60-second battery swapping kiosks for ride-hailing fleets and delivery drivers in tourist destinations like Da Nang and Hoi An.',
        sector: 'CleanTech & Hardware',
        stage: 'Series A',
        targetAsk: '$1,800,000',
        valuation: '$14,000,000',
        location: 'Da Nang, Vietnam',
        founderName: 'Hoang Vu',
        founderTitle: 'Founder & Head of R&D',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80',
        metrics: {
            mrr: '$65,000',
            growthRate: '+35% MoM',
            usersCount: '1,200 Daily Swaps',
        },
        keyTags: ['EV Charging', 'Battery Swapping', 'Smart Grid', 'Clean Mobility'],
        deckUrl: 'https://davas.vn/decks/voltwave-2026.pdf',
    },
];

export const MOCK_INVESTORS: Investor[] = [
    {
        id: 'inv-1',
        name: 'Kenji Suzuki',
        firm: 'CyberAgent Capital',
        role: 'Managing Director & General Partner',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
        targetSectors: ['EdTech & AI', 'FinTech', 'SaaS', 'Consumer Tech'],
        preferredStages: ['Seed', 'Series A'],
        ticketSizeRange: '$300,000 - $1,500,000',
        investmentPhilosophy: 'Backing visionary SEA founders building scalable AI & tech ecosystems with strong unit economics and rapid regional expansion.',
        totalDeals: 42,
        country: 'Japan / Vietnam Hub',
    },
    {
        id: 'inv-2',
        name: 'Binh Tran',
        firm: '500 Global Vietnam',
        role: 'General Partner',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80',
        targetSectors: ['AgriTech & Climate', 'EdTech & AI', 'FinTech', 'HealthTech & AI'],
        preferredStages: ['Pre-Seed', 'Seed'],
        ticketSizeRange: '$100,000 - $500,000',
        investmentPhilosophy: 'Early-stage velocity capital focused on high-conviction Vietnam founders solving grassroots inefficiency with modern technology.',
        totalDeals: 85,
        country: 'USA / Vietnam',
    },
    {
        id: 'inv-3',
        name: 'Jessica Chen',
        firm: 'Founders Fund SEA',
        role: 'Partner - DeepTech & Climate',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
        targetSectors: ['CleanTech & Hardware', 'HealthTech & AI', 'DeepTech'],
        preferredStages: ['Seed', 'Series A', 'Series B'],
        ticketSizeRange: '$1,000,000 - $4,000,000',
        investmentPhilosophy: 'Bold investments in engineering-first startups creating paradigm-shifting physical or algorithmic hardware & climate technologies.',
        totalDeals: 28,
        country: 'Singapore',
    },
    {
        id: 'inv-4',
        name: 'David Nguyen',
        firm: 'Golden Gate Ventures',
        role: 'Principal Investor',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
        targetSectors: ['FinTech', 'EdTech & AI', 'Logistics'],
        preferredStages: ['Seed', 'Series A'],
        ticketSizeRange: '$500,000 - $2,000,000',
        investmentPhilosophy: 'Building cross-border bridges across Singapore, Vietnam, and Indonesia. High emphasis on recurring SaaS and financial inclusion.',
        totalDeals: 54,
        country: 'Singapore',
    },
];

export const INITIAL_MEETING_SLOTS: MeetingSlot[] = [
    {
        id: 'slot-1',
        time: '09:00 - 09:30 AM',
        table: 'Table A1',
        startup: MOCK_STARTUPS[0], // EduBot AI
        investor: MOCK_INVESTORS[0], // CyberAgent Capital
        status: 'In Progress',
        matchScore: 98,
        notes: 'Kenji was impressed by the 24% MoM student growth in Central Vietnam. Requested detailed unit economics for B2B school licensing.',
        followUpGenerated: {
            emailSubject: 'DAVAS 1:1 Follow-up: CyberAgent Capital x EduBot AI Next Steps',
            emailBody: `Dear Dr. Minh,

Thank you for an insightful 1:1 session at DAVAS 2026. CyberAgent Capital is particularly intrigued by EduBot AI's 340% retention boost and market traction across Central Vietnam.

As discussed at Table A1, we would love to review your B2B institutional school licensing financial model and deck details. Let's schedule a 45-minute follow-up call next Tuesday.

Best regards,
Kenji Suzuki
Managing Director, CyberAgent Capital`,
            keyTakeaways: [
                'Strong alignment with CyberAgent SEA Seed ticket size ($600k ask vs $300k-$1.5M range).',
                'Proven retention metrics (+340% student engagement).',
                'Action item: Send B2B school subscription financial projections.',
            ],
            actionItems: [
                'Send financial model spreadsheet with B2B unit breakdown',
                'Set up deep-dive DD meeting with CyberAgent Vietnam principal',
            ],
        },
    },
    {
        id: 'slot-2',
        time: '10:00 - 10:30 AM',
        table: 'Table A3',
        startup: MOCK_STARTUPS[1], // EcoGrow Vietnam
        investor: MOCK_INVESTORS[1], // 500 Global Vietnam
        status: 'Upcoming',
        matchScore: 94,
    },
    {
        id: 'slot-3',
        time: '11:00 - 11:30 AM',
        table: 'Table B2',
        startup: MOCK_STARTUPS[2], // FinFlow APAC
        investor: MOCK_INVESTORS[3], // Golden Gate Ventures
        status: 'Upcoming',
        matchScore: 96,
    },
    {
        id: 'slot-4',
        time: '13:00 - 13:30 PM',
        table: 'Table A5',
        startup: MOCK_STARTUPS[3], // MedPulse AI
        investor: MOCK_INVESTORS[2], // Founders Fund SEA
        status: 'Upcoming',
        matchScore: 92,
    },
    {
        id: 'slot-5',
        time: '14:30 - 15:00 PM',
        table: 'Table C1',
        startup: MOCK_STARTUPS[4], // VoltWave Mobility
        investor: MOCK_INVESTORS[2], // Founders Fund SEA
        status: 'Upcoming',
        matchScore: 95,
    },
];

export const SAMPLE_MATCH_PAIRS: MatchPair[] = [
    {
        id: 'mp-1',
        startupId: 'st-1',
        investorId: 'inv-1',
        startup: MOCK_STARTUPS[0],
        investor: MOCK_INVESTORS[0],
        status: 'Scheduled',
        recommendedTable: 'Table A1',
        analysis: {
            matching_score: 98,
            reason: 'EduBot AI\'s $600k Seed ask fits CyberAgent\'s $300k-$1.5M range perfectly. CyberAgent\'s strong portfolio in SEA EdTech creates immediate distribution synergies.',
            ice_breakers: [
                'How does EduBot plan to scale its adaptive learning LLMs across non-English speaking SEA markets like Indonesia?',
                'What is your customer acquisition cost (CAC) for school district partnerships in Vietnam?',
                'How do you protect your custom curriculum data against open-source LLM fine-tuning?',
            ],
            keySynergies: ['Perfect ticket size fit', 'SEA expansion expertise', 'EdTech domain knowledge'],
            potentialRisks: ['Content localization speed', 'Sales cycle length in public schools'],
        },
    },
    {
        id: 'mp-2',
        startupId: 'st-2',
        investorId: 'inv-2',
        startup: MOCK_STARTUPS[1],
        investor: MOCK_INVESTORS[1],
        status: 'Scheduled',
        recommendedTable: 'Table A3',
        analysis: {
            matching_score: 94,
            reason: '500 Global Vietnam excels at Pre-Seed high-velocity investments ($100k-$500k). EcoGrow\'s $350k ask and local hydroponics innovation matches their grassroots thesis.',
            ice_breakers: [
                'What are the payback periods for urban farming modules installed in commercial buildings?',
                'How do your IoT hardware maintenance costs scale as farm networks expand across Vietnam?',
                'Are you exploring carbon credit monetization models for water savings?',
            ],
            keySynergies: ['Pre-Seed alignment', 'High grassroots impact', 'Local Da Nang founder synergy'],
            potentialRisks: ['Hardware manufacturing scaling', 'Margin pressure on sensor hardware'],
        },
    },
    {
        id: 'mp-3',
        startupId: 'st-3',
        investorId: 'inv-4',
        startup: MOCK_STARTUPS[2],
        investor: MOCK_INVESTORS[3],
        status: 'Scheduled',
        recommendedTable: 'Table B2',
        analysis: {
            matching_score: 96,
            reason: 'Golden Gate Ventures focuses on cross-border ASEAN FinTech. FinFlow\'s $2.5M Series A round aligns with Golden Gate\'s growth thesis and regional SME network.',
            ice_breakers: [
                'How does FinFlow navigate cross-border banking compliance across differing ASEAN regulatory regimes?',
                'What is your target Gross Transaction Volume (GTV) run-rate for end of 2026?',
                'How do you differentiate your settlement speed against traditional SWIFT correspondent banking?',
            ],
            keySynergies: ['Cross-border ASEAN strategy', 'Series A check size', 'Strong revenue traction ($1.2M ARR)'],
            potentialRisks: ['Regulatory licensing speed in secondary ASEAN markets'],
        },
    },
    {
        id: 'mp-4',
        startupId: 'st-5',
        investorId: 'inv-3',
        startup: MOCK_STARTUPS[4],
        investor: MOCK_INVESTORS[2],
        status: 'Scheduled',
        recommendedTable: 'Table C1',
        analysis: {
            matching_score: 95,
            reason: 'Founders Fund SEA specializes in DeepTech & Climate hardware ($1M-$4M). VoltWave\'s $1.8M ask and EV battery swapping hardware is a prime portfolio match.',
            ice_breakers: [
                'What is the degradation rate of your battery swapping cells under high-frequency daily usage?',
                'How are you negotiating land-use permits for station placement with Da Nang city authorities?',
                'What is the unit economics breakeven threshold per kiosk station?',
            ],
            keySynergies: ['CleanTech hardware focus', 'Series A ticket fit ($1.8M)', 'Da Nang green city initiative alignment'],
            potentialRisks: ['CapEx intensity for fast station deployment'],
        },
    },
];
