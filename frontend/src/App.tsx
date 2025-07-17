import React from 'react';
import StreakCard from './components/StreakCard';

function App() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-64 overflow-hidden">
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#F0E68C] rounded-full opacity-60"></div>
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#F0E68C] rounded-full opacity-60"></div>
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
            Your streak is 6 days
          </h2>
          
          <StreakCard />
        </div>
      </div>
    </div>
  );
}

export default App;