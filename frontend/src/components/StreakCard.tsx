import React from "react";
import { useStreaks } from "../hooks/useStreaks";

interface DayProps {
  day: string;
  active: boolean;
  isCurrent: boolean;
  date: string;
}

const Day: React.FC<DayProps> = ({ day, active, isCurrent }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Circle indicator */}
      <div
        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${
          active
            ? isCurrent
              ? "bg-indigo-600 border-indigo-600"
              : "bg-indigo-400 border-indigo-400"
            : "bg-white border-gray-300"
        }`}
      >
        {active && (
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>

      {/* Day label */}
      <span
        className={`text-xs font-medium tracking-wide mt-3 ${
          isCurrent ? "text-indigo-600" : "text-gray-500"
        }`}
      >
        {day}
      </span>

      {/* Underline - gray by default, indigo for current day */}
      <div
        className={`w-14 h-0.5 rounded-full mt-1 ${
          isCurrent ? "bg-indigo-600" : "bg-gray-200"
        }`}
      ></div>
    </div>
  );
};

const StreakCard = () => {
  const todayDate =
    window.location.pathname.split("/").pop() ??
    new Date().toISOString().split("T")[0];

  const { streakData, loading, error } = useStreaks(todayDate);

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  };

  const isToday = (dateStr: string, todayDate: string) => {
    const date = new Date(dateStr);
    const today = new Date(todayDate);

    return date.toDateString() === today.toDateString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 max-w-xl mx-auto">
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 max-w-xl mx-auto">
        <div className="text-center text-red-500">
          <p>Error loading streak data: {error}</p>
        </div>
      </div>
    );
  }

  if (!streakData) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 max-w-xl mx-auto">
        <div className="text-center text-gray-500">
          <p>No streak data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 max-w-xl mx-auto">
      <div className="relative">
        <div className="flex justify-between items-start">
          {streakData.days.map((dayData, index) => (
            <Day
              key={index}
              day={getDayName(dayData.date)}
              active={dayData.state === "COMPLETED"}
              isCurrent={isToday(dayData.date, todayDate)}
              date={dayData.date}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StreakCard;
