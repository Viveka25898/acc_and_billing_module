// src/components/BankLedger/Badge.jsx
import React from 'react';

const Badge = ({ type, children, className = '' }) => {
  const getBadgeClasses = (badgeType) => {
    const baseClasses = "inline-block px-2 py-1 rounded-full text-xs font-semibold uppercase whitespace-nowrap";
    
    const typeClasses = {
      payment: "bg-red-100 text-red-800",
      receipt: "bg-green-100 text-green-800",
      journal: "bg-indigo-100 text-indigo-800",
      opening: "bg-orange-100 text-orange-800",
      cheque: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-200 text-red-900",
      posted: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
      reconciled: "bg-blue-100 text-blue-800",
      vendor: "bg-pink-100 text-pink-800",
      advance: "bg-indigo-100 text-indigo-800",
      salary: "bg-purple-100 text-purple-800",
      statutory: "bg-orange-100 text-orange-800",
      receipt_type: "bg-green-100 text-green-800",
      utility: "bg-pink-200 text-pink-900",
      loan: "bg-blue-100 text-blue-800",
      reimbursement: "bg-purple-100 text-purple-800",
      cash: "bg-yellow-100 text-yellow-800",
      dividend: "bg-red-100 text-red-800",
      investment: "bg-green-200 text-green-900",
      opening_type: "bg-orange-100 text-orange-800"
    };

    return `${baseClasses} ${typeClasses[badgeType] || 'bg-gray-100 text-gray-800'} ${className}`;
  };

  return (
    <span className={getBadgeClasses(type)}>
      {children}
    </span>
  );
};

export default Badge;