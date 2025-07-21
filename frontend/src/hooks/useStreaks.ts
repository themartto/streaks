import { useState, useEffect } from "react";

export enum DayState {
  COMPLETED = "COMPLETED",
  INCOMPLETE = "INCOMPLETE",
  AT_RISK = "AT_RISK",
  SAVED = "SAVED",
}

export interface DayData {
  date: string;
  activities: number;
  state: DayState;
}
export interface StreakSummary {
  activitiesToday: number;
  total: number;
  days: DayData[];
}

export const useStreaks = () => {
  const [streakData, setStreakData] = useState<StreakSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreaks = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "http://localhost:3000/streaks/2025-07-18",
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch streaks: ${response.statusText}`);
        }
        const data: StreakSummary = await response.json();

        setStreakData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching streaks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStreaks();
  }, []);

  return {
    streakData,
    loading,
    error,
  };
};
