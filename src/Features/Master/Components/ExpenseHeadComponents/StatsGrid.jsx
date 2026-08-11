// src/components/StatsGrid.jsx
import React from 'react';

const StatsGrid = ({ stats }) => {
  const list = Array.isArray(stats) ? stats : [];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
      {list.map((stat, index) => (
        <div key={index} className="bg-white/15 p-3 rounded-lg text-center backdrop-blur-xs">
          <div className="text-xs opacity-90">{stat.label || '-'}</div>
          <div className="text-lg font-bold mt-1">{stat.value !== undefined && stat.value !== null ? stat.value : '-'}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;