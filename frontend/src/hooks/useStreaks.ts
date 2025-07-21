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

export const useStreaks = (date?: string) => {
  const [streakData, setStreakData] = useState<StreakSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreaks = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/streaks/${date || new Date().toISOString().split("T")[0]}`,
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
  }, [date]);

  return {
    streakData,
    loading,
    error,
  };
};
