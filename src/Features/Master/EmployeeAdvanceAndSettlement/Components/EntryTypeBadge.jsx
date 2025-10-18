import React from 'react';

export const EntryTypeBadge = ({ type }) => {
  const badges = {
    'Payment': 'bg-blue-100 text-blue-700',
    'Journal': 'bg-purple-100 text-purple-700',
    'Receipt': 'bg-green-100 text-green-700',
    'Opening': 'bg-orange-100 text-orange-700'
  };
  
  return (
    <span className={`inline-block px-2 py-1 rounded text-[10px] font-semibold uppercase whitespace-nowrap ${badges[type] || 'bg-gray-100 text-gray-700'}`}>
      {type}
    </span>
  );
};