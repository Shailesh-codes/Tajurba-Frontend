import React, { useState, useEffect } from "react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events] = useState([
    // Sample events - replace with your actual events data
    { date: '2024-03-15', title: 'Team Meeting', type: 'meeting' },
    { date: '2024-03-20', title: 'Workshop', type: 'workshop' },
  ]);

  // Add new state for hover effects
  const [hoveredDate, setHoveredDate] = useState(null);

  // Add gradient background classes
  const gradientClasses = {
    meeting: 'bg-gradient-to-r from-blue-500 to-blue-600',
    workshop: 'bg-gradient-to-r from-purple-500 to-purple-600',
    deadline: 'bg-gradient-to-r from-red-500 to-red-600',
    social: 'bg-gradient-to-r from-yellow-500 to-yellow-600'
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells with subtle gradient
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div 
          key={`empty-${i}`} 
          className="h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700/30 backdrop-blur-sm"
        />
      );
    }

    // Enhanced calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events.filter(event => event.date === dateString);
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
      const isHovered = hoveredDate === day;

      days.push(
        <div 
          key={day} 
          onMouseEnter={() => setHoveredDate(day)}
          onMouseLeave={() => setHoveredDate(null)}
          className={`h-32 p-3 rounded-xl transition-all duration-300 transform 
            ${isToday ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/20' : 
              'bg-gradient-to-br from-gray-800 to-gray-900'}
            ${isHovered ? 'scale-105 shadow-xl' : 'hover:scale-102'}
            border border-gray-700/30 backdrop-blur-sm`}
        >
          <div className="flex justify-between items-start">
            <span className={`font-medium ${isToday ? 'text-white' : 'text-gray-300'} text-lg`}>
              {day}
            </span>
            {dayEvents.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">
                {dayEvents.length}
              </span>
            )}
          </div>
          
          <div className="mt-2 space-y-1 max-h-[80px] overflow-y-auto custom-scrollbar">
            {dayEvents.map((event, index) => (
              <div 
                key={index}
                className={`p-2 text-xs rounded-lg ${gradientClasses[event.type]} 
                  shadow-sm backdrop-blur-sm transition-all duration-300
                  hover:shadow-md hover:scale-102 cursor-pointer`}
              >
                <div className="font-medium text-white truncate">{event.title}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="mt-32 max-w-7xl mx-auto p-6">
      <div className="w-full py-6 px-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl">
        {/* Calendar Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4 md:mb-0">
            Calendar
          </h3>
          <div className="flex space-x-4">
            <button 
              onClick={handleToday}
              className="w-fit bg-gradient-to-r from-green-500 to-green-600 text-white px-12 py-2.5 rounded-xl
                hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 font-medium"
            >
              Today
            </button>
            <div className="flex items-center bg-gray-800/50 rounded-xl p-1 backdrop-blur-sm">
              <button 
                onClick={handlePrevMonth}
                className="p-2.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={handleNextMonth}
                className="p-2.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Month Display */}
        <h3 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-8 text-center">
          {formatDate(currentDate)}
        </h3>

        {/* Calendar Grid */}
        <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/30">
          <div className="grid grid-cols-7 gap-4 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium text-gray-400">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-4">
            {renderCalendarDays()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this CSS to your global styles
const globalStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
  }
  
  .scale-102 {
    transform: scale(1.02);
  }
`;

export default Calendar;
