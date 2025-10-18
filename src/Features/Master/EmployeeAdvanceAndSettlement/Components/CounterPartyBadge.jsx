import React from 'react';

export const CounterpartyBadge = ({ type }) => {
  const badges = {
    'Bank': 'bg-blue-100 text-blue-700',
    'Expense': 'bg-pink-100 text-pink-700',
    'Cash': 'bg-green-100 text-green-700'
  };
  
  return type ? (
    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-semibold uppercase ${badges[type] || 'bg-gray-100 text-gray-700'}`}>
      {type}
    </span>
  ) : null;
};