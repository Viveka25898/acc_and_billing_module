// src/pages/ConveyanceExpenseLedgerPage.jsx
import React, { useState, useEffect } from 'react';
import { ExpenseLedgerService } from '../../utils/expenseLedgerService';
import HeaderSection from '../../Components/ExpenseHeadComponents/HeaderSection';
import FilterSection from '../../Components/ExpenseHeadComponents/FilterSection';
import LedgerTable from '../../Components/ExpenseHeadComponents/LedgerTable';
import FooterSummary from '../../Components/ExpenseHeadComponents/FooterSummery';

const ConveyanceExpenseLedgerPage = () => {
  const [ledgerData, setLedgerData] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLedgerData();
    
    // Listen for conveyance updates to refresh ledger
    const handleConveyanceUpdate = () => {
      loadLedgerData();
    };
    window.addEventListener('conveyanceUpdated', handleConveyanceUpdate);
    
    return () => {
      window.removeEventListener('conveyanceUpdated', handleConveyanceUpdate);
    };
  }, []);

  const loadLedgerData = () => {
    try {
      setLoading(true);
      const data = ExpenseLedgerService.getExpenseLedgerData('X2001003');
      setLedgerData(data);
      setFilteredTransactions(data.transactions);
    } catch (error) {
      console.error('Error loading conveyance expense ledger:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    if (!ledgerData) return;
    
    const filtered = ledgerData.transactions.filter(transaction => {
      // Date filter
      if (filters.fromDate) {
        const transDate = new Date(transaction.date);
        const fromDate = new Date(filters.fromDate);
        if (transDate < fromDate) return false;
      }
      if (filters.toDate) {
        const transDate = new Date(transaction.date);
        const toDate = new Date(filters.toDate);
        if (transDate > toDate) return false;
      }
      
      // Employee filter
      if (filters.employee && transaction.employee.id && 
          !transaction.employee.id.toLowerCase().includes(filters.employee.toLowerCase()) &&
          !transaction.employee.name.toLowerCase().includes(filters.employee.toLowerCase())) {
        return false;
      }
      
      // Cost center filter
      if (filters.costCenter && 
          transaction.costCenter.toLowerCase() !== filters.costCenter.toLowerCase() &&
          transaction.costCenter.toLowerCase() !== filters.costCenter.replace(/-/g, ' ').toLowerCase()) {
        return false;
      }
      
      // Entry type filter
      if (filters.entryType && transaction.entryType !== filters.entryType) {
        return false;
      }
      
      return true;
    });
    setFilteredTransactions(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading conveyance expense ledger...</p>
        </div>
      </div>
    );
  }

  if (!ledgerData) {
    return (
      <div className="min-h-screen bg-gray-100 p-5 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Failed to load conveyance expense ledger data</p>
          <button 
            onClick={loadLedgerData}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
        <HeaderSection 
          header={ledgerData.header}
          balances={ledgerData.balances}
          stats={ledgerData.stats}
        />
        
        <FilterSection 
          filterOptions={ledgerData.filterOptions}
          onFilterChange={handleFilterChange}
        />
        
        <LedgerTable transactions={filteredTransactions} />
        
        <FooterSummary summary={ledgerData.summary} />
      </div>
    </div>
  );
};

export default ConveyanceExpenseLedgerPage;




