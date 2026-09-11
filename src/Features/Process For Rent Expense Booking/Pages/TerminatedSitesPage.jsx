import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTerminatedSites,
  selectTerminatedSites,
  selectTerminatedPagination,
  selectTerminatedAuditSummary,
  selectTerminatedLoading,
  selectTerminatedError,
} from '../../../store/slices/rentExpenseSlice';
import ViewTerminatedSiteModal from '../Components/ViewTerminatedSiteModal';

const formatCurrency = (val) => {
  if (val === null || val === undefined || val === '' || val === '-') return '-';
  const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^\d.-]/g, ''));
  if (isNaN(num)) return String(val);
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (dateString) => {
  try {
    if (!dateString || dateString === '-') return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(date.getDate()).padStart(2, '0')}-${months[date.getMonth()]}-${date.getFullYear()}`;
  } catch {
    return dateString || '-';
  }
};

const TerminatedSitesPage = ({ onBack }) => {
  const dispatch = useDispatch();

  const terminatedSites = useSelector(selectTerminatedSites);
  const pagination = useSelector(selectTerminatedPagination);
  const auditSummary = useSelector(selectTerminatedAuditSummary);
  const loading = useSelector(selectTerminatedLoading);
  const error = useSelector(selectTerminatedError);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSiteModal, setSelectedSiteModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const limit = 10;

  useEffect(() => {
    dispatch(
      fetchTerminatedSites({
        page: currentPage,
        limit,
        search: searchTerm,
      })
    );
  }, [dispatch, currentPage, searchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > (pagination?.totalPages || 1)) return;
    setCurrentPage(newPage);
  };

  const handleOpenDetails = (siteObj) => {
    setSelectedSiteModal(siteObj);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Back Button */}
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs md:text-sm font-semibold transition-all shadow-xs cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Active Sites
          </button>
        </div>

        {/* Page Banner Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-2xl p-6 shadow-md border border-emerald-600/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-rose-500/30 text-rose-100 text-xs font-semibold px-3 py-0.5 rounded-full border border-rose-400/30 uppercase tracking-wider">
                  Audit & Compliance
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Terminated Rental Sites
              </h1>
              <p className="text-xs md:text-sm text-emerald-100/90 mt-1 max-w-2xl">
                Comprehensive audit register of prematurely closed property rental agreements, termination rationale, voucher status metrics, and early termination financial savings.
              </p>
            </div>
            <div className="text-right hidden md:block">
              <div className="text-xs text-emerald-200 uppercase tracking-wider font-semibold">Module</div>
              <div className="text-sm font-bold text-white">Accounts & Billing Module</div>
            </div>
          </div>
        </div>

        {/* KPI Audit Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="text-xs text-slate-500 font-medium">Terminated Sites</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {auditSummary?.totalTerminatedSites ?? 0}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Total closed leases</div>
          </div>

          <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200 shadow-2xs">
            <div className="text-xs text-emerald-800 font-medium">Total Savings Achieved</div>
            <div className="text-2xl font-extrabold text-emerald-700 mt-1">
              {formatCurrency(auditSummary?.totalSavingsAchieved)}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Cost avoided from early exit</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="text-xs text-slate-500 font-medium">Total Rent Booked</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">
              {formatCurrency(auditSummary?.totalRentBookedAcrossTerminated)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Actual completed term rent</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="text-xs text-slate-500 font-medium">Cancelled Vouchers</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">
              {auditSummary?.totalCancelledVouchers ?? 0}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Unbilled future vouchers</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search site name, code, or owner..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50"
            />
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="text-xs text-gray-500">
            Showing <strong className="text-gray-900">{terminatedSites.length}</strong> site records
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="bg-white rounded-xl shadow-2xs p-12 border border-gray-200 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-emerald-600 border-t-transparent"></div>
            <p className="mt-3 text-sm font-medium text-gray-700">Loading terminated rental sites from API...</p>
            <p className="text-xs text-gray-400 mt-1">Fetching audit history and financial calculations</p>
          </div>
        )}

        {/* Error Alert Banner */}
        {!loading && error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 text-rose-600 mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-rose-900 mb-1">Failed to Load Terminated Sites</h3>
            <p className="text-xs md:text-sm text-rose-700 max-w-md mx-auto mb-4">{error}</p>
            <button
              onClick={() => dispatch(fetchTerminatedSites({ page: currentPage, limit, search: searchTerm }))}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs md:text-sm font-medium rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              Retry API Request
            </button>
          </div>
        )}

        {/* Terminated Sites Data Table */}
        {!loading && !error && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1050px] text-xs md:text-sm">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b border-gray-200">
                    <th className="p-3 border-r border-gray-200">Site & Location</th>
                    <th className="p-3 border-r border-gray-200">Owner Details</th>
                    <th className="p-3 border-r border-gray-200">Agreement Term</th>
                    <th className="p-3 border-r border-gray-200">Termination Reason & Date</th>
                    <th className="p-3 border-r border-gray-200 text-right">Financial Savings</th>
                    <th className="p-3 border-r border-gray-200 text-center">Status</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {terminatedSites.length > 0 ? (
                    terminatedSites.map((site) => {
                      const agreement = site.agreementDetails || {};
                      const termination = site.terminationDetails || {};
                      const financials = site.financialActuals || {};

                      return (
                        <tr key={site.siteId || site.siteCode} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 border-r border-gray-200">
                            <div className="font-bold text-slate-900">{site.siteName || '-'}</div>
                            <div className="text-[11px] font-mono text-emerald-800 font-semibold">{site.siteCode || site.siteId || '-'}</div>
                            <div className="text-xs text-slate-500">{site.city || '-'}, {site.state || '-'}</div>
                          </td>

                          <td className="p-3 border-r border-gray-200">
                            <div className="font-semibold text-slate-800">{site.ownerName || '-'}</div>
                            <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                              {site.ownerGLCode || '-'}
                            </div>
                          </td>

                          <td className="p-3 border-r border-gray-200">
                            <div className="text-slate-800 font-medium">
                              {formatDate(agreement.startDate)} to {formatDate(agreement.endDate)}
                            </div>
                            <div className="text-xs text-slate-500">
                              Monthly: <strong className="text-slate-900">{formatCurrency(agreement.monthlyTotal)}</strong> ({agreement.contractualTotalMonths ?? '-'} mos)
                            </div>
                          </td>

                          <td className="p-3 border-r border-gray-200">
                            <div className="font-bold text-rose-700">{formatDate(termination.terminationDate)}</div>
                            <div className="text-xs font-medium text-slate-800">{termination.terminationReason || '-'}</div>
                            <div className="text-[11px] text-slate-500">By: {termination.terminatedByName || termination.terminatedBy || '-'}</div>
                          </td>

                          <td className="p-3 border-r border-gray-200 text-right">
                            <div className="font-extrabold text-emerald-700">
                              {formatCurrency(financials.savingsFromEarlyTermination)}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Rent Booked: {formatCurrency(financials.totalRentBooked)}
                            </div>
                          </td>

                          <td className="p-3 border-r border-gray-200 text-center whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200 uppercase tracking-wider">
                              {termination.status || 'TERMINATED'}
                            </span>
                          </td>

                          <td className="p-3 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleOpenDetails(site)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View Audit
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-slate-500 bg-slate-50/50">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-sm font-medium text-slate-600">No terminated rental sites found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="bg-slate-50 border-t border-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-600">
                Page <strong className="text-slate-900">{pagination?.currentPage || 1}</strong> of{' '}
                <strong className="text-slate-900">{pagination?.totalPages || 1}</strong> | Total Records:{' '}
                <strong className="text-slate-900">{pagination?.totalRecords || 0}</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-3.5 py-1.5 border border-gray-300 rounded-md text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= (pagination?.totalPages || 1)}
                  className="px-3.5 py-1.5 border border-gray-300 rounded-md text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>

          </div>
        )}

        {/* View Modal */}
        <ViewTerminatedSiteModal
          siteData={selectedSiteModal}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

      </div>
    </div>
  );
};

export default TerminatedSitesPage;
