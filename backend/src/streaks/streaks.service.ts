import { Injectable, Inject } from '@nestjs/common';
import { UserDataGateway, DayData } from './user-data.gateway';
import { USER_DATA_GATEWAY } from './user-data.gateway';

export enum DayState {
  COMPLETED = 'COMPLETED',
  INCOMPLETE = 'INCOMPLETE',
  AT_RISK = 'AT_RISK',
  SAVED = 'SAVED',
}

export interface DaySummary {
  date: string;
  activities: number;
  state: DayState;
}

export interface StreakSummary {
  activitiesToday: number;
  total: number;
  days: DaySummary[];
}

@Injectable()
export class StreaksService {
  constructor(
    @Inject(USER_DATA_GATEWAY) private readonly gateway: UserDataGateway,
  ) {}

  triggerStreakCase(date: string) {
    const caseData = this.gateway.getExampleData();
    return this.getLatestStreak(caseData.userData, date);
  }

  // today format "2024-02-27"
  getLatestStreak(
    userData: DayData[],
    today: string = new Date().toISOString().split('T')[0],
  ) {
    // Create a map for quick lookup by date
    const dataByDate = new Map<string, DayData>();
    userData.forEach((day) => dataByDate.set(day.date, day));

    const activitiesToday = dataByDate.get(today)?.activities || 0;

    // Calculate total completed days across all userData
    let total = 0;
    for (const day of userData) {
      if (day.activities >= 1) {
        total++;
      }
    }

    // Build the 7-day window by finding the most recent activity and padding from there.
    const days: (DayData & { state: DayState })[] = [];
    const windowSize = 7;

    // 1. Create a temporary window of today and the 6 days prior.
    const tempHistoricalDays: (DayData & { state: DayState })[] = [];
    for (let i = windowSize - 1; i >= 0; i--) {
      const date = this.addDays(today, -i);
      const dayData = dataByDate.get(date) || { date, activities: 0 };
      tempHistoricalDays.push({ ...dayData, state: DayState.INCOMPLETE });
    }

    // 2. Find the index of the first day with activity in this temporary window.
    const firstActiveIndex = tempHistoricalDays.findIndex(
      (d) => d.activities >= 1,
    );

    // 3. If activity exists, slice the array to remove leading empty days.
    if (firstActiveIndex > -1) {
      days.push(...tempHistoricalDays.slice(firstActiveIndex));
    } else {
      // If no activity in the last 7 days, show the full 7-day history.
      days.push(...tempHistoricalDays);
    }

    // 4. Fill the rest of the window with future days.
    let futureDayOffset = 1;
    while (days.length < windowSize) {
      const futureDate = this.addDays(today, futureDayOffset++);
      const dayData = dataByDate.get(futureDate) || {
        date: futureDate,
        activities: 0,
      };
      days.push({ ...dayData, state: DayState.INCOMPLETE });
    }

    // Find the index of today in our days array
    const todayIdx = days.findIndex((d) => d.date === today);

    // Calculate states for all days
    for (let i = 0; i < days.length; i++) {
      const curr = days[i];
      const isPastOrToday = i <= todayIdx;

      if (isPastOrToday) {
        const daysSinceLastCompleted = this.getDaysSinceLastCompleted(days, i);

        // Check for SAVED state first, as it's a specific type of completed day
        if (daysSinceLastCompleted === 1 && curr.activities >= 2) {
          curr.state = DayState.SAVED;
        } else if (daysSinceLastCompleted === 2 && curr.activities >= 2) {
          curr.state = DayState.SAVED;
        } else if (daysSinceLastCompleted === 3 && curr.activities >= 3) {
          curr.state = DayState.SAVED;
        } else if (curr.activities >= 1) {
          // If not saved, check if it's simply completed
          curr.state = DayState.COMPLETED;
        } else {
          // It's an incomplete day in the past or today
          if (daysSinceLastCompleted === 1 || daysSinceLastCompleted === 2) {
            curr.state = DayState.AT_RISK;
          } else {
            curr.state = DayState.INCOMPLETE;
          }
        }
      } else {
        // Future days are always INCOMPLETE and don't need risk/saved checks
        if (curr.activities >= 1) {
          curr.state = DayState.COMPLETED;
        } else {
          curr.state = DayState.INCOMPLETE;
        }
      }
    }

    const summary: StreakSummary = {
      activitiesToday,
      total,
      days: days.map((d) => ({
        date: d.date,
        activities: d.activities,
        state: d.state,
      })),
    };

    return summary;
  }

  private getDaysSinceLastCompleted(
    days: (DayData & { state: DayState })[],
    currentIdx: number,
  ): number {
    // Look backwards from current index to find the last completed day based on activities
    for (let i = currentIdx - 1; i >= 0; i--) {
      if (days[i].activities >= 1) {
        return currentIdx - i;
      }
    }
    return -1; // No completed day found
  }

  private addDays(dateStr: string, days: number): string {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }
}
