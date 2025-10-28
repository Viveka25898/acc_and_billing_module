// src/components/BankLedger/BankLedgerHeader.jsx
import React from 'react';

const BankLedgerHeader = () => {
  return (
    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 sm:p-8">
      <div className="text-2xl sm:text-3xl font-semibold mb-6">
        BANK LEDGER - HDFC CURRENT ACCOUNT
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="flex flex-col">
          <div className="text-xs opacity-90 mb-1">GL Account Code</div>
          <div className="text-base font-semibold">A300403</div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs opacity-90 mb-1">Account Name</div>
          <div className="text-base font-semibold">HDFC Bank - Current A/c - Operations</div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs opacity-90 mb-1">Bank Name</div>
          <div className="text-base font-semibold">HDFC Bank</div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs opacity-90 mb-1">Account Number</div>
          <div className="text-base font-semibold">50100123456789</div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs opacity-90 mb-1">IFSC Code</div>
          <div className="text-base font-semibold">HDFC0001234</div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs opacity-90 mb-1">Branch</div>
          <div className="text-base font-semibold">Mumbai - Andheri East</div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs opacity-90 mb-1">Account Type</div>
          <div className="text-base font-semibold">Current Account</div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs opacity-90 mb-1">Financial Year</div>
          <div className="text-base font-semibold">2024-25</div>
        </div>
      </div>
      
      <div className="bg-white bg-opacity-20 p-4 rounded-lg mt-4">
        <div className="text-xs opacity-90 mb-1">Opening Balance (01-Apr-2024)</div>
        <div className="text-2xl font-bold">₹5,00,000.00 DR</div>
      </div>
    </div>
  );
};

export default BankLedgerHeader;