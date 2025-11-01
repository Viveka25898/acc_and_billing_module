// src/components/LedgerHeader.jsx
import React from 'react';

const LedgerHeader = ({ employeeInfo }) => {
  return (
    <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-6 lg:p-8">
      <h1 className="text-2xl lg:text-3xl font-semibold mb-6">
        {employeeInfo.designation === 'Shared Liability Account' 
          ? 'CONVEYANCE PAYABLE - SHARED ACCOUNT' 
          : `EMPLOYEE REIMBURSEMENT PAYABLE - ${employeeInfo.name.toUpperCase()}`}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="space-y-1">
          <div className="text-xs opacity-90">GL Account Code</div>
          <div className="text-sm font-semibold">{employeeInfo.glAccount}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs opacity-90">Employee Name</div>
          <div className="text-sm font-semibold">{employeeInfo.name}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs opacity-90">Employee Code</div>
          <div className="text-sm font-semibold">{employeeInfo.code}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs opacity-90">Department</div>
          <div className="text-sm font-semibold">{employeeInfo.department}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs opacity-90">Designation</div>
          <div className="text-sm font-semibold">{employeeInfo.designation}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs opacity-90">Account Type</div>
          <div className="text-sm font-semibold">{employeeInfo.accountType}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs opacity-90">Financial Year</div>
          <div className="text-sm font-semibold">{employeeInfo.financialYear}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs opacity-90">Period</div>
          <div className="text-sm font-semibold">{employeeInfo.period}</div>
        </div>
      </div>

      <div className="bg-green bg-opacity-20 rounded-lg p-4 mt-4">
        <div className="text-xs opacity-90">Opening Balance (01-Apr-2024)</div>
        <div className="text-xl lg:text-2xl font-bold">{employeeInfo.openingBalance}</div>
      </div>
    </div>
  );
};

export default LedgerHeader;