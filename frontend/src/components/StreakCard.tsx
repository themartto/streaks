import React from 'react';

interface DayProps {
  day: string;
  active: boolean;
  isCurrent: boolean;
}

const Day: React.FC<DayProps> = ({ day, active, isCurrent }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Circle indicator */}
      <div
        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${
          active
            ? isCurrent
              ? 'bg-indigo-600 border-indigo-600'
              : 'bg-indigo-400 border-indigo-400'
            : 'bg-white border-gray-300'
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
      <span className={`text-xs font-medium tracking-wide mt-3 ${
        isCurrent ? 'text-indigo-600' : 'text-gray-500'
      }`}>
        {day}
      </span>

      {/* Underline - gray by default, indigo for current day */}
      <div className={`w-14 h-0.5 rounded-full mt-1 ${
        isCurrent ? 'bg-indigo-600' : 'bg-gray-200'
      }`}></div>
    </div>
  );
};

const StreakCard = () => {
  const days = [
    { day: 'SUN', active: true, isCurrent: false },
    { day: 'MON', active: true, isCurrent: false },
    { day: 'TUE', active: true, isCurrent: false },
    { day: 'WED', active: true, isCurrent: false },
    { day: 'THU', active: true, isCurrent: false },
    { day: 'FRI', active: true, isCurrent: false },
    { day: 'SAT', active: true, isCurrent: true },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 max-w-xl mx-auto">
      <div className="relative">
        <div className="flex justify-between items-start">
          {days.map((dayData, index) => (
            <Day
              key={index}
              day={dayData.day}
              active={dayData.active}
              isCurrent={dayData.isCurrent}
            />
          ))}
        </div>


      </div>
    </div>
  );
};

export default StreakCard;
