// src/components/ExpenseInfo.jsx
import React from 'react';

const val = (v) => (v === undefined || v === null || String(v).trim() === "" ? "-" : String(v));

const ExpenseInfo = ({ header }) => {
  const h = header || {};
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div className="flex flex-col">
          <span className="text-xs opacity-90 mb-1">Expense Head Code</span>
          <span className="text-base font-semibold">{val(h.expenseHeadCode || h.glCode)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs opacity-90 mb-1">Expense Head Name</span>
          <span className="text-base font-semibold">{val(h.expenseHeadName || h.ledgerName)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs opacity-90 mb-1">Parent Account</span>
          <span className="text-base font-semibold">{val(h.parentAccount)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs opacity-90 mb-1">Account Type</span>
          <span className="text-base font-semibold">{val(h.accountType)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div className="flex flex-col">
          <span className="text-xs opacity-90 mb-1">Financial Year</span>
          <span className="text-base font-semibold">{val(h.financialYear)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs opacity-90 mb-1">Period</span>
          <span className="text-base font-semibold">{val(h.period)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs opacity-90 mb-1">Cost Center</span>
          <span className="text-base font-semibold">{val(h.costCenter)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs opacity-90 mb-1">Department</span>
          <span className="text-base font-semibold">{val(h.department)}</span>
        </div>
      </div>
    </>
  );
};

export default ExpenseInfo;