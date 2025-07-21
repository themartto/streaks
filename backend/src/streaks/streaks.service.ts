import { Injectable, Inject } from '@nestjs/common';
import { StreaksGateway, DayData } from './streaks.gateway';
import { STREAKS_GATEWAY } from './streaks.gateway';

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
    @Inject(STREAKS_GATEWAY) private readonly gateway: StreaksGateway,
  ) {}

  triggerStreakCase(date: string) {
    const caseData = this.gateway.getCase(1);
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

    // Find consecutive completed days before today (going backwards)
    const completedDaysBeforeToday: string[] = [];
    let dayOffset = -1;
    while (completedDaysBeforeToday.length < 6) {
      // Max 6 days before today
      const checkDate = this.addDays(today, dayOffset);
      const dayData = dataByDate.get(checkDate);

      if (dayData && dayData.activities >= 1) {
        completedDaysBeforeToday.unshift(checkDate); // Add to beginning
        dayOffset--;
      } else {
        break; // Stop at first non-completed day
      }
    }

    // Calculate how many future days we need to show 7 total days
    const pastDaysCount = completedDaysBeforeToday.length;
    const futureDaysCount = 6 - pastDaysCount; // 7 total - 1 (today) - past days

    // Build the 7-day window: past completed days + today + future days
    const days: (DayData & { state: DayState })[] = [];

    // Add past completed days
    for (const date of completedDaysBeforeToday) {
      const dayData = dataByDate.get(date) || { date, activities: 0 };
      days.push({ ...dayData, state: DayState.COMPLETED });
    }

    // Add today
    const todayData = dataByDate.get(today) || { date: today, activities: 0 };
    days.push({ ...todayData, state: DayState.INCOMPLETE });

    // Add future days
    for (let i = 1; i <= futureDaysCount; i++) {
      const futureDate = this.addDays(today, i);
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

      // Mark completed days
      if (curr.activities >= 1) {
        curr.state = DayState.COMPLETED;
        continue;
      }

      // For incomplete days, check if they're at risk or can be saved
      if (i > todayIdx) {
        // Future days remain incomplete
        curr.state = DayState.INCOMPLETE;
      } else {
        // Today and any incomplete past days
        const daysSinceLastCompleted = this.getDaysSinceLastCompleted(days, i);

        if (daysSinceLastCompleted === 1 || daysSinceLastCompleted === 2) {
          curr.state = DayState.AT_RISK;

          // Check if it can be saved
          if (daysSinceLastCompleted === 1 && curr.activities >= 2) {
            curr.state = DayState.SAVED;
          } else if (daysSinceLastCompleted === 2 && curr.activities >= 3) {
            curr.state = DayState.SAVED;
          }
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
    // Look backwards from current index to find the last completed day
    for (let i = currentIdx - 1; i >= 0; i--) {
      if (days[i].state === DayState.COMPLETED) {
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
