import React, { useState, useEffect, useCallback } from 'react';
import { RentLedgerService } from '../../utils/rentLedgerService';
import RentLedgerHeader from '../Components/RentLedgerHeader';
import RentLedgerCard from '../Components/RentLedgerCard';
import FilterSection from '../Components/FilterSection';

const RentExpenseBookingLedgers = () => {
  const [headerInfo, setHeaderInfo] = useState(null);
  const [entries, setEntries] = useState([]);
  const [footerInfo, setFooterInfo] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    page: 1,
  });

  // Fetch Rent Expense Ledger from backend APIs
  const fetchLedgerData = useCallback(async (activeFilters = filters) => {
    try {
      setLoading(true);
      setError(null);

      const response = await RentLedgerService.getRentExpenseLedger('X2001002002', activeFilters);

      setHeaderInfo(response.headerInfo || null);
      setEntries(response.entries || []);
      setFooterInfo(response.footerInfo || null);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      console.error('❌ Failed to fetch rent expense ledger:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch rent expense ledger details. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLedgerData(filters);
  }, []);

  const handleApplyFilter = () => {
    const updatedFilters = { ...filters, page: 1 };
    setFilters(updatedFilters);
    fetchLedgerData(updatedFilters);
  };

  const handleResetFilter = () => {
    const defaultFilters = {
      fromDate: '',
      toDate: '',
      page: 1,
    };
    setFilters(defaultFilters);
    fetchLedgerData(defaultFilters);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    const updatedFilters = { ...filters, page: newPage };
    setFilters(updatedFilters);
    fetchLedgerData(updatedFilters);
  };

  const handlePrint = () => {
    window.print();
  };

  const ledgerPayload = {
    entries,
    summary: {
      totalDebit: footerInfo?.totalDebit || 0,
      totalCredit: footerInfo?.totalCredit || 0,
      closingBalance: footerInfo?.closingBalance || '0.00 DR',
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 px-3 md:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Render Ledger Header Info */}
        <RentLedgerHeader data={headerInfo} />

        {/* Filter Controls */}
        <FilterSection
          filters={filters}
          onFilterChange={setFilters}
          onApplyFilter={handleApplyFilter}
          onResetFilter={handleResetFilter}
          onPrint={handlePrint}
        />

        {/* Loading Spinner */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent"></div>
            <p className="mt-3 text-sm font-medium text-gray-700">Fetching Rent Expense Ledger entries from API...</p>
            <p className="text-xs text-gray-400 mt-1">GL Account X2001002002 • Branch Office Rent</p>
          </div>
        )}

        {/* Error / Offline Alert */}
        {!loading && error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 text-rose-600 mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-rose-900 mb-1">Unable to Load Ledger Data</h3>
            <p className="text-xs md:text-sm text-rose-700 max-w-md mx-auto mb-4">{error}</p>
            <button
              onClick={() => fetchLedgerData(filters)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs md:text-sm font-medium rounded-lg shadow-sm transition-colors"
            >
              Retry API Request
            </button>
          </div>
        )}

        {/* Ledger Entries Table Card */}
        {!loading && !error && (
          <>
            <RentLedgerCard ledger={ledgerPayload} footerInfo={footerInfo} />

            {/* Responsive Pagination Bar */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span>
                  Showing Page <strong className="text-gray-900">{pagination.page}</strong> of{' '}
                  <strong className="text-gray-900">{pagination.totalPages || 1}</strong>
                </span>
                <span className="text-gray-300">|</span>
                <span>
                  Total Entries: <strong className="text-gray-900">{pagination.totalItems}</strong>
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPreviousPage && pagination.page <= 1}
                  className="px-3.5 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNextPage && pagination.page >= pagination.totalPages}
                  className="px-3.5 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default RentExpenseBookingLedgers;

