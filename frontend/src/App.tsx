import React from "react";
import StreakCard from "./components/StreakCard";
import { useStreaks } from "./hooks/useStreaks";

function App() {
  const { streakData, loading } = useStreaks();

  const getStreakCount = () => {
    if (!streakData) return 0;

    // Count consecutive completed days from the end
    let streak = 0;
    for (let i = streakData.days.length - 1; i >= 0; i--) {
      if (streakData.days[i].state === "COMPLETED") {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const streakCount = getStreakCount();

  return (
    <div className="min-h-screen bg-[#F7F5F0] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-64 overflow-hidden">
        {/* <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#F0E68C] rounded-full opacity-60"></div> */}
        {/* <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#F0E68C] rounded-full opacity-60"></div> */}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo */}
        <div className="mb-16">
          <h1 className="text-2xl font-semibold text-[#6366F1] tracking-wide">
            ahead
          </h1>
        </div>

        {/* Main content */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1F2937] mb-8">
            {loading
              ? "Loading..."
              : `Your streak is ${streakCount} ${streakCount === 1 ? "day" : "days"}`}
          </h2>

          <StreakCard />
        </div>
      </div>
    </div>
  );
}

export default App;
