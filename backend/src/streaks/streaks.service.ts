import { Injectable, Inject } from '@nestjs/common';
import { StreaksGateway, DayState, DayData } from './streaks.gateway';
import { STREAKS_GATEWAY } from './streaks.gateway';

export interface StreakSummary {
  activitiesToday: number;
  total: number;
  days: DayData[];
}

@Injectable()
export class StreaksService {
  constructor(
    @Inject(STREAKS_GATEWAY) private readonly gateway: StreaksGateway,
  ) {}

  triggerStreakCase(id: number) {
    const caseData = this.gateway.getCase(id);
    return this.getLatestStreak(caseData.userData, '2024-02-26');
  }

  // today format "2024-02-27"
  getLatestStreak(
    userData: DayData[],
    today: string = new Date().toISOString().split('T')[0],
  ) {
    // Sort userData by date descending (most recent first)
    const sortedUserData = [...userData].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    // Create a map for quick lookup by date
    const dataByDate = new Map<string, DayData>();
    sortedUserData.forEach((day) => dataByDate.set(day.date, day));

    const activitiesToday = dataByDate.get(today)?.activities || 0;
    const days = this.buildDayWindow(dataByDate, today, 7);
    const { total, atRiskCount } = this.calculateInitialStates(days);
    this.applySavedLogic(days, atRiskCount);
    this.finalizeStates(days);

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

  private buildDayWindow(
    dataByDate: Map<string, DayData>,
    today: string,
    windowSize: number,
  ): DayData[] {
    const days: DayData[] = [];

    // Find the latest streak window (filling with future dates if needed)
    for (let i = 0; i < windowSize; i++) {
      const targetDate = this.addDays(today, i);
      const day = dataByDate.get(targetDate) || {
        date: targetDate,
        activities: 0,
        state: DayState.INCOMPLETE,
      };
      days.push({ ...day });
    }

    return days;
  }

  private calculateInitialStates(days: DayData[]): {
    total: number;
    atRiskCount: number;
  } {
    let atRiskCount = 0;
    let lastCompletedIdx = -1;
    let total = 0;

    // Calculate states for each day in the window
    for (let i = 0; i < days.length; i++) {
      const curr = days[i];
      // Completed: at least 1 activity
      if (curr.activities >= 1) {
        curr.state = DayState.COMPLETED;
        lastCompletedIdx = i;
        atRiskCount = 0;
        total++;
      } else if (lastCompletedIdx !== -1) {
        // At risk: first or second day after a completed day
        const daysSinceCompleted = i - lastCompletedIdx;
        if (daysSinceCompleted === 1 || daysSinceCompleted === 2) {
          curr.state = DayState.AT_RISK;
          atRiskCount = daysSinceCompleted;
        }
      }
    }

    return { total, atRiskCount };
  }

  private applySavedLogic(days: DayData[], atRiskCount: number): void {
    for (let i = 0; i < days.length; i++) {
      const curr = days[i];
      if (curr.state === DayState.AT_RISK) {
        const next = days[i - 1];
        if (atRiskCount === 1 && next && next.activities >= 2) {
          curr.state = DayState.SAVED;
        } else if (atRiskCount === 2 && next && next.activities >= 3) {
          curr.state = DayState.SAVED;
        }
      }
    }
  }

  private finalizeStates(days: DayData[]): void {
    for (let i = 0; i < days.length; i++) {
      const curr = days[i];
      // Incomplete: current day and not enough activities, or 0 activities
      if (
        curr.state !== DayState.COMPLETED &&
        curr.state !== DayState.SAVED &&
        (curr.activities === 0 || (i === 0 && curr.activities < 2))
      ) {
        curr.state = DayState.INCOMPLETE;
      }
    }
  }

  addDays(dateStr: string, days: number): string {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }
}
