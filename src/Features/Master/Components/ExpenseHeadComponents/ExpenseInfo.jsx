// src/components/ExpenseInfo.jsx
import React from 'react';

const ExpenseInfo = ({ header }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div className="flex flex-col">
          <span className="text-xs opacity-90 mb-1">Expense Head Code</span>
          <span className="text-base font-semibold">{header.expenseHeadCode}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs opacity-90 mb-1">Expense Head Name</span>
          <span className="text-base font-semibold">{header.expenseHeadName}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs opacity-90 mb-1">Parent Account</span>
          <span className="text-base font-semibold">{header.parentAccount}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs opacity-90 mb-1">Account Type</span>
          <span className="text-base font-semibold">{header.accountType}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div className="flex flex-col">
          <span className="text-xs opacity-90 mb-1">Financial Year</span>
          <span className="text-base font-semibold">{header.financialYear}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs opacity-90 mb-1">Period</span>
          <span className="text-base font-semibold">{header.period}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs opacity-90 mb-1">Cost Center</span>
          <span className="text-base font-semibold">{header.costCenter}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs opacity-90 mb-1">Department</span>
          <span className="text-base font-semibold">{header.department}</span>
        </div>
      </div>
    </>
  );
};

export default ExpenseInfo;