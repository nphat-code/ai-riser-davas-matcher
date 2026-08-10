export interface Startup {
  id: string;
  name: string;
  sector: string;
  stage: string;
  fundingNeeded: string;
  fundingNeededVal: number; // in USD for numeric comparisons
  description: string;
  logoUrl?: string;
  location?: string;
  founder?: string;
  traction?: string;
}

export interface Investor {
  id: string;
  name: string;
  targetSectors: string[];
  investmentStages: string[];
  ticketSize: string;
  ticketMin: number; // in USD
  ticketMax: number; // in USD
  thesis: string;
  logoUrl?: string;
  firmType?: string; // VC, Angel, Corporate VC, Family Office
  representative?: string;
}

export interface CriteriaBreakdown {
  sector_fit: number;
  stage_fit: number;
  ticket_fit: number;
  thesis_fit: number;
}

export interface MatchEvaluationResult {
  matching_score: number;
  reason: string;
  ice_breakers: string[];
  criteria_breakdown: CriteriaBreakdown;
  recommendation: string;
  evaluatedAt?: string;
  startupName?: string;
  investorName?: string;
}

export interface MeetingSlot {
  id: string;
  startupId: string;
  investorId: string;
  timeSlot: string;
  tableNumber: string;
  status: 'suggested' | 'confirmed' | 'declined';
  notes?: string;
}
