// src/components/Badge.jsx
import React from 'react';

const Badge = ({ type }) => {
  const badgeConfig = {
    // Entry Type Badges
    opening: {
      label: 'Opening',
      className: 'bg-orange-100 text-orange-800'
    },
    expense: {
      label: 'Expense',
      className: 'bg-red-100 text-red-800'
    },
    payment: {
      label: 'Payment',
      className: 'bg-green-100 text-green-800'
    },
    
    // Status Badges
    posted: {
      label: 'Posted',
      className: 'bg-green-100 text-green-800'
    },
    pending: {
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-800'
    },
    paid: {
      label: 'Paid',
      className: 'bg-blue-100 text-blue-800'
    }
  };

  const config = badgeConfig[type] || {
    label: type,
    className: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${config.className}`}>
      {config.label}
    </span>
  );
};

export default Badge;