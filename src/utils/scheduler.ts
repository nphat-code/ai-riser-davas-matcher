import { MatchPair, MeetingSlot } from '../types';

export const DEFAULT_TIME_SLOTS: string[] = [
    '09:00 - 09:30 AM',
    '09:40 - 10:10 AM',
    '10:20 - 10:50 AM',
    '11:00 - 11:30 AM',
    '13:30 - 14:00 PM',
    '14:10 - 14:40 PM',
    '14:50 - 15:20 PM',
    '15:30 - 16:00 PM',
];

export const DEFAULT_TABLES: string[] = [
    'Table A1',
    'Table A2',
    'Table A3',
    'Table B1',
    'Table B2',
    'Table B3',
    'Table C1',
    'Table C2',
    'Table C3',
    'Table D1',
    'Table D2',
    'Table D3',
];

/**
 * Smart Scheduler Algorithm (Greedy + Priority Queue approach)
 * 
 * Objectives:
 * 1. Prioritize high-compatibility matches (sorted by matching_score DESC).
 * 2. Assign optimal time slots and summit tables while strictly preventing:
 *    - Startup double-booking (no startup in 2 meetings at the same time).
 *    - Investor double-booking (no investor in 2 meetings at the same time).
 *    - Table collision (no table hosting multiple meetings in the same slot).
 * 
 * @param matches Array of potential match pairs
 * @param timeSlots Array of event time slot strings
 * @param tables Array of available summit tables
 * @returns Scheduled MeetingSlot[]
 */
export function generateSmartSchedule(
    matches: MatchPair[],
    timeSlots: string[] = DEFAULT_TIME_SLOTS,
    tables: string[] = DEFAULT_TABLES
): MeetingSlot[] {
    if (!matches || matches.length === 0) {
        return [];
    }

    // Step 1: Priority Sorting (High matching score pairs scheduled first)
    const sortedMatches = [...matches].sort((a, b) => {
        const scoreA = a.analysis?.matching_score ?? 0;
        const scoreB = b.analysis?.matching_score ?? 0;
        if (scoreB !== scoreA) {
            return scoreB - scoreA; // Descending
        }
        return a.id.localeCompare(b.id);
    });

    // Step 2: Initialize Availability Trackers for each Time Slot
    const busyStartupsBySlot = new Map<string, Set<string>>();
    const busyInvestorsBySlot = new Map<string, Set<string>>();
    const occupiedTablesBySlot = new Map<string, Set<string>>();

    timeSlots.forEach((slot) => {
        busyStartupsBySlot.set(slot, new Set<string>());
        busyInvestorsBySlot.set(slot, new Set<string>());
        occupiedTablesBySlot.set(slot, new Set<string>());
    });

    const scheduledSlots: MeetingSlot[] = [];

    // Step 3: Greedy Allocation Loop
    for (const pair of sortedMatches) {
        const startupId = pair.startupId || pair.startup?.id;
        const investorId = pair.investorId || pair.investor?.id;

        if (!startupId || !investorId || !pair.startup || !pair.investor) {
            continue;
        }

        let assigned = false;

        // Search for the earliest available timeSlot that satisfies all constraints
        for (let timeIdx = 0; timeIdx < timeSlots.length; timeIdx++) {
            const timeSlot = timeSlots[timeIdx];
            const busyStartups = busyStartupsBySlot.get(timeSlot)!;
            const busyInvestors = busyInvestorsBySlot.get(timeSlot)!;
            const occupiedTables = occupiedTablesBySlot.get(timeSlot)!;

            // Constraint 1: Startup must be free in this timeSlot
            if (busyStartups.has(startupId)) {
                continue;
            }

            // Constraint 2: Investor must be free in this timeSlot
            if (busyInvestors.has(investorId)) {
                continue;
            }

            // Constraint 3: Find a free table in this timeSlot
            let chosenTable: string | undefined;

            // Check if recommended table is specified and free
            if (pair.recommendedTable && tables.includes(pair.recommendedTable) && !occupiedTables.has(pair.recommendedTable)) {
                chosenTable = pair.recommendedTable;
            } else {
                // Otherwise grab the first open table
                chosenTable = tables.find((table) => !occupiedTables.has(table));
            }

            if (!chosenTable) {
                // All tables are occupied in this timeSlot, try next timeSlot
                continue;
            }

            // All constraints satisfied -> Book the meeting slot
            busyStartups.add(startupId);
            busyInvestors.add(investorId);
            occupiedTables.add(chosenTable);

            scheduledSlots.push({
                id: `slot-${timeIdx + 1}-${chosenTable.replace(/\s+/g, '').toLowerCase()}-${pair.id}`,
                time: timeSlot,
                table: chosenTable,
                startup: pair.startup,
                investor: pair.investor,
                status: scheduledSlots.length === 0 ? 'In Progress' : 'Upcoming',
                matchScore: pair.analysis?.matching_score ?? 90,
            });

            assigned = true;
            break; // Move to the next match pair
        }

        if (!assigned) {
            // All time slots and tables are fully booked for these participants
            console.warn(`[SmartScheduler] Could not schedule pair ${pair.id} due to capacity constraints.`);
        }
    }

    // Sort schedule chronologically by timeslot order, then table
    scheduledSlots.sort((a, b) => {
        const timeIndexA = timeSlots.indexOf(a.time);
        const timeIndexB = timeSlots.indexOf(b.time);
        if (timeIndexA !== timeIndexB) {
            return timeIndexA - timeIndexB;
        }
        return a.table.localeCompare(b.table);
    });

    return scheduledSlots;
}
