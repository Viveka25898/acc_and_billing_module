import React, { useMemo, useState, useEffect } from 'react';
import LedgerHeader from '../Components/LedgerHeader';
import LedgerTable from '../Components/LedgerTable';
import Summary from '../Components/Summary';
import FilterSection from '../Components/FilterSection';
import { RelieverLedgerService } from '../../utils/relieverLedgerService';

const RelieverPaymentPage = () => {
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    entryType: 'All',
    status: 'All',
    site: 'All',
    reliever: 'All',
    searchText: ''
  });

  const [ledgerData, setLedgerData] = useState({
    header: null,
    transactions: [],
    summary: {
      openingBalance: 0,
      totalDebit: 0,
      totalCredit: 0,
      closingBalance: 0
    }
  });

  const [loading, setLoading] = useState(true);

  // Load ledger data on component mount
  useEffect(() => {
    loadLedgerData();
  }, []);

  const loadLedgerData = () => {
    try {
      setLoading(true);
      
      // Get account details for header
      const header = RelieverLedgerService.getRelieverAccountDetails();
      
      // Get all ledger entries
      const transactions = RelieverLedgerService.getRelieverLedgerEntries();
      
      // Get summary data
      const summary = RelieverLedgerService.getSummaryData(transactions);
      
      setLedgerData({
        header,
        transactions,
        summary
      });
      
    } catch (error) {
      console.error('Error loading reliever ledger data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions based on current filters
  const filteredTransactions = useMemo(() => {
    let filtered = [...ledgerData.transactions];

    // Apply all filters
    filtered = RelieverLedgerService.filterByDateRange(
      filtered, 
      filters.fromDate, 
      filters.toDate
    );

    filtered = RelieverLedgerService.filterByEntryType(filtered, filters.entryType);
    filtered = RelieverLedgerService.filterBySite(filtered, filters.site);
    filtered = RelieverLedgerService.filterByReliever(filtered, filters.reliever);
    filtered = RelieverLedgerService.searchEntries(filtered, filters.searchText);

    return filtered;
  }, [ledgerData.transactions, filters]);

  // Update summary when filtered transactions change
  const filteredSummary = useMemo(() => {
    return RelieverLedgerService.getSummaryData(filteredTransactions);
  }, [filteredTransactions]);

  const handleApplyFilter = () => {
    console.log('Filters applied:', filters);
  };

  const handlePrint = () => {
    window.print();
  };
  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reliever ledger data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <LedgerHeader ledgerInfo={ledgerData.header} />
          
          {/* Filter Section */}
          <FilterSection 
            filters={filters}
            onFilterChange={setFilters}
            onApplyFilter={handleApplyFilter}
            onPrint={handlePrint}
          />
          
          {/* Action Bar */}
          <div className="px-6 py-3 bg-gray-50 border-b flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {filteredTransactions.length} of {ledgerData.transactions.length} transactions
            </div>
           
          </div>
          
          {/* Ledger Table with Filtered Data */}
          <LedgerTable transactions={filteredTransactions} />
          
          {/* Summary Section */}
          <Summary summary={filteredSummary} />
        </div>
      </div>
    </div>
  );
};

export default RelieverPaymentPage;