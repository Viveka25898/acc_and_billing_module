// src/pages/OfficeSuppliesLedgerPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ExpenseLedgerService } from '../../../../utils/expenseLedgerService';
import HeaderSection from '../../../../Components/ExpenseHeadComponents/HeaderSection';
import FilterSection from '../../../../Components/ExpenseHeadComponents/FilterSection';
import LedgerTable from '../../../../Components/ExpenseHeadComponents/LedgerTable';
import FooterSummary from '../../../../Components/ExpenseHeadComponents/FooterSummery';

const OfficeSuppliesLedgerPage = () => {
  const { accountCode } = useParams();
  const activeGlCode = accountCode || 'X2001002001';

  const [ledgerData, setLedgerData] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filtersState, setFiltersState] = useState({
    fromDate: '',
    toDate: '',
    employee: '',
    costCenter: '',
    entryType: ''
  });
  
  // Reload ledger when activeGlCode changes
  useEffect(() => {
    loadLedgerData(1);
  }, [activeGlCode]);
  
  const loadLedgerData = async (page = 1, activeFilters = filtersState) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 15,
        ...activeFilters
      };
      const data = await ExpenseLedgerService.getExpenseLedgerData(activeGlCode, params);
      setLedgerData(data);
      setFilteredTransactions(data.transactions);
      setPagination(data.pagination || { page: 1, totalPages: 1 });
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading office supplies ledger:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (newFilters) => {
    setFiltersState(newFilters);
    loadLedgerData(1, newFilters);
  };

  const handlePageChange = (page) => {
    loadLedgerData(page);
  };
  
  if (loading && !ledgerData) {
    return (
      <div className="min-h-screen bg-gray-100 p-5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading office supplies ledger...</p>
        </div>
      </div>
    );
  }
  
  if (!ledgerData) {
    return (
      <div className="min-h-screen bg-gray-100 p-5 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Failed to load office supplies ledger data</p>
          <button 
            onClick={() => loadLedgerData(1)}
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
        
        {loading ? (
          <div className="text-center py-12 text-gray-500 bg-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <span>Refreshing entries...</span>
          </div>
        ) : (
          <>
            <LedgerTable transactions={filteredTransactions} />
            
            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-white">
                <span className="text-sm text-slate-500">
                  Showing Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.totalItems ?? filteredTransactions.length} entries)
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                    className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        
        <FooterSummary summary={ledgerData.summary} />
      </div>
    </div>
  );
};

export default OfficeSuppliesLedgerPage;
