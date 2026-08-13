export type FundingStage = 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B' | 'Growth';

export interface Startup {
    id: string;
    name: string;
    logo: string;
    tagline: string;
    description: string;
    sector: string;
    stage: FundingStage;
    targetAsk: string; // e.g., "$500,000"
    valuation: string; // e.g., "$4,500,000"
    location: string;
    founderName: string;
    founderTitle: string;
    avatar: string;
    metrics: {
        mrr?: string;
        arr?: string;
        growthRate?: string;
        usersCount?: string;
    };
    keyTags: string[];
    deckUrl?: string;
}

export interface Investor {
    id: string;
    name: string;
    firm: string;
    role: string;
    avatar: string;
    targetSectors: string[];
    preferredStages: FundingStage[];
    ticketSizeRange: string; // e.g., "$250k - $1M"
    investmentPhilosophy: string;
    totalDeals: number;
    country: string;
}

export interface AIMatchAnalysis {
    matching_score: number; // 0 - 100
    reason: string; // concise Vietnamese or English explanation
    ice_breakers: string[]; // 3 sharp ice breaker questions
    keySynergies?: string[];
    potentialRisks?: string[];
}

export interface MatchPair {
    id: string;
    startupId: string;
    investorId: string;
    startup: Startup;
    investor: Investor;
    analysis: AIMatchAnalysis;
    status: 'Pending' | 'Scheduled' | 'Confirmed' | 'Completed';
    recommendedTable?: string;
}

export interface MeetingSlot {
    id: string;
    time: string; // e.g. "09:00 - 09:30"
    table: string; // e.g. "Table A1"
    startup: Startup;
    investor: Investor;
    status: 'Upcoming' | 'In Progress' | 'Completed';
    matchScore: number;
    notes?: string;
    followUpGenerated?: {
        emailSubject: string;
        emailBody: string;
        keyTakeaways: string[];
        actionItems: string[];
    };
}

export interface EventStats {
    totalStartups: number;
    totalInvestors: number;
    scheduledMeetings: number;
    avgMatchScore: number;
    dealSuccessRate: number; // e.g., 88.5%
    topSector: string;
}
