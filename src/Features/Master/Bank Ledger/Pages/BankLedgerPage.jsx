import React from 'react';
import BankLedgerHeader from '../Components/BankLedgerHeader';
import FilterSection from '../Components/FilterSection';
import TransactionTable from '../Components/TransactionTable';
import SummarySection from '../Components/SummerySection';


const BankLedgerPage = () => {
  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <BankLedgerHeader />
          <FilterSection />
          <TransactionTable />
          <SummarySection />
        </div>
      </div>
    </div>
  );
};

export default BankLedgerPage;