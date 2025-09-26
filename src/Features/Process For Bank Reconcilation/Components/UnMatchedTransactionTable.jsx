import React, { useState, useMemo } from "react";
import { 
  FiXCircle, 
  FiSearch, 
  FiFilter, 
  FiDownload,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiAlertTriangle,
  FiTrendingUp,
  FiTrendingDown,
  FiCheck,
  FiX,
  FiEye,
  FiEdit
} from 'react-icons/fi';

export default function UnmatchedTransactionsTable({ data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterBy, setFilterBy] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Enhanced filtering and sorting
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(transaction => {
      const matchesSearch = 
        transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.type?.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesFilter = true;
      if (filterBy !== 'all') {
        const amount = parseFloat(transaction.amount || 0);
        switch (filterBy) {
          case 'credit':
            matchesFilter = amount > 0;
            break;
          case 'debit':
            matchesFilter = amount < 0;
            break;
          case 'large':
            matchesFilter = Math.abs(amount) > 10000;
            break;
          case 'small':
            matchesFilter = Math.abs(amount) <= 1000;
            break;
          case 'medium':
            matchesFilter = Math.abs(amount) > 1000 && Math.abs(amount) <= 10000;
            break;
          case 'only_in_bank':
            matchesFilter = transaction.inBank && !transaction.inBooks;
            break;
          case 'only_in_books':
            matchesFilter = !transaction.inBank && transaction.inBooks;
            break;
          case 'missing_both':
            matchesFilter = !transaction.inBank && !transaction.inBooks;
            break;
        }
      }

      return matchesSearch && matchesFilter;
    });

    // Sort data
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date || 0);
          bValue = new Date(b.date || 0);
          break;
        case 'amount':
          aValue = Math.abs(parseFloat(a.amount || 0));
          bValue = Math.abs(parseFloat(b.amount || 0));
          break;
        case 'description':
          aValue = a.description || '';
          bValue = b.description || '';
          break;
        case 'severity':
          // Sort by severity: missing both > only in books > only in bank
          aValue = (!a.inBank && !a.inBooks) ? 3 : (!a.inBank ? 2 : 1);
          bValue = (!b.inBank && !b.inBooks) ? 3 : (!b.inBank ? 2 : 1);
          break;
        default:
          aValue = a.date;
          bValue = b.date;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [data, searchTerm, sortBy, sortOrder, filterBy]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Calculate summary stats
  const stats = useMemo(() => {
    const totalAmount = filteredAndSortedData.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    const creditAmount = filteredAndSortedData.filter(t => parseFloat(t.amount || 0) > 0).reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const debitAmount = filteredAndSortedData.filter(t => parseFloat(t.amount || 0) < 0).reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);
    
    const onlyInBank = filteredAndSortedData.filter(t => t.inBank && !t.inBooks).length;
    const onlyInBooks = filteredAndSortedData.filter(t => !t.inBank && t.inBooks).length;
    const missingBoth = filteredAndSortedData.filter(t => !t.inBank && !t.inBooks).length;
    
    return {
      totalTransactions: filteredAndSortedData.length,
      totalAmount,
      creditAmount,
      debitAmount,
      onlyInBank,
      onlyInBooks,
      missingBoth
    };
  }, [filteredAndSortedData]);

  const formatAmount = (amount) => {
    const num = parseFloat(amount || 0);
    return num.toLocaleString('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      minimumFractionDigits: 2
    });
  };

  const getStatusInfo = (transaction) => {
    if (transaction.inBank && !transaction.inBooks) {
      return {
        label: 'Only in Bank',
        color: 'bg-orange-100 text-orange-800',
        icon: FiAlertTriangle,
        severity: 'medium'
      };
    } else if (!transaction.inBank && transaction.inBooks) {
      return {
        label: 'Only in Books',
        color: 'bg-yellow-100 text-yellow-800',
        icon: FiAlertTriangle,
        severity: 'medium'
      };
    } else if (!transaction.inBank && !transaction.inBooks) {
      return {
        label: 'Missing Both',
        color: 'bg-red-100 text-red-800',
        icon: FiXCircle,
        severity: 'high'
      };
    }
    return {
      label: 'Unmatched',
      color: 'bg-gray-100 text-gray-800',
      icon: FiXCircle,
      severity: 'low'
    };
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Amount', 'Description', 'Reference', 'In Bank', 'In Books', 'Status', 'Issue Type'];
    const csvData = [
      headers.join(','),
      ...filteredAndSortedData.map(row => {
        const statusInfo = getStatusInfo(row);
        return [
          row.date,
          row.amount,
          `"${row.description}"`,
          row.reference,
          row.inBank ? 'Yes' : 'No',
          row.inBooks ? 'Yes' : 'No',
          'Unmatched',
          statusInfo.label
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unmatched_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 bg-green-50 rounded-lg border border-green-200">
        <FiCheck className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <p className="text-lg text-green-700 font-medium mb-2">No Unmatched Transactions</p>
        <p className="text-green-600">All transactions have been successfully reconciled!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Total Unmatched</p>
              <p className="text-2xl font-bold text-red-700">{stats.totalTransactions}</p>
            </div>
            <FiXCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600">Only in Bank</p>
              <p className="text-2xl font-bold text-orange-700">{stats.onlyInBank}</p>
            </div>
            <FiAlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Only in Books</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.onlyInBooks}</p>
            </div>
            <FiFileText className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Net Amount</p>
              <p className="text-xl font-bold text-blue-700">{formatAmount(stats.totalAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert for High Priority Issues */}
      {stats.missingBoth > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
          <div className="flex">
            <FiAlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Critical Issues Found</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  {stats.missingBoth} transaction{stats.missingBoth > 1 ? 's are' : ' is'} missing from both bank and books records. 
                  These require immediate attention to resolve discrepancies.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search unmatched transactions..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
            >
              <option value="all">All Unmatched</option>
              <option value="only_in_bank">Only in Bank</option>
              <option value="only_in_books">Only in Books</option>
              <option value="missing_both">Missing Both</option>
              <option value="credit">Credits Only</option>
              <option value="debit">Debits Only</option>
              <option value="large">Large Amounts (&gt; ₹10K)</option>
              <option value="medium">Medium Amounts (₹1K-₹10K)</option>
              <option value="small">Small Amounts (≤₹1K)</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiFilter className="w-4 h-4 mr-2" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
            
            <button
              onClick={exportToCSV}
              className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
            >
              <FiDownload className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-2">Quick Filters:</div>
            <div className="flex flex-wrap gap-2">
              {['all', 'only_in_bank', 'only_in_books', 'missing_both', 'credit', 'debit', 'large', 'medium', 'small'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterBy(filter)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filterBy === filter
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.replace('_', ' ').charAt(0).toUpperCase() + filter.replace('_', ' ').slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-red-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider cursor-pointer hover:bg-red-100 transition-colors"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">
                    <FiCalendar className="w-4 h-4 mr-2" />
                    Date
                    {sortBy === 'date' && (
                      <span className="ml-1 text-red-600">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider cursor-pointer hover:bg-red-100 transition-colors"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center">
                    <FiDollarSign className="w-4 h-4 mr-2" />
                    Amount
                    {sortBy === 'amount' && (
                      <span className="ml-1 text-red-600">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider cursor-pointer hover:bg-red-100 transition-colors"
                  onClick={() => handleSort('description')}
                >
                  <div className="flex items-center">
                    <FiFileText className="w-4 h-4 mr-2" />
                    Description
                    {sortBy === 'description' && (
                      <span className="ml-1 text-red-600">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-red-700 uppercase tracking-wider">
                  In Bank
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-red-700 uppercase tracking-wider">
                  In Books
                </th>
                <th 
                  className="px-6 py-3 text-center text-xs font-medium text-red-700 uppercase tracking-wider cursor-pointer hover:bg-red-100 transition-colors"
                  onClick={() => handleSort('severity')}
                >
                  <div className="flex items-center justify-center">
                    Issue Type
                    {sortBy === 'severity' && (
                      <span className="ml-1 text-red-600">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((transaction, idx) => {
                const amount = parseFloat(transaction.amount || 0);
                const isCredit = amount > 0;
                const statusInfo = getStatusInfo(transaction);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <tr key={idx} className="hover:bg-red-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <FiCalendar className="w-4 h-4 text-gray-400 mr-2" />
                        {new Date(transaction.date).toLocaleDateString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className={`flex items-center ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                        {isCredit ? (
                          <FiTrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <FiTrendingDown className="w-4 h-4 mr-1" />
                        )}
                        {formatAmount(Math.abs(amount))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate" title={transaction.description}>
                        {transaction.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {transaction.reference || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center">
                        {transaction.inBank ? (
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <FiCheck className="w-4 h-4 text-green-600" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                            <FiX className="w-4 h-4 text-red-600" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center">
                        {transaction.inBooks ? (
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <FiCheck className="w-4 h-4 text-green-600" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                            <FiX className="w-4 h-4 text-red-600" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredAndSortedData.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? 'z-10 bg-red-50 border-red-500 text-red-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resolution Suggestions */}
      {filteredAndSortedData.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-medium text-blue-900 mb-4">Resolution Suggestions</h3>
          <div className="space-y-3 text-sm text-blue-800">
            {stats.onlyInBank > 0 && (
              <div className="flex items-start space-x-2">
                <FiAlertTriangle className="w-4 h-4 mt-0.5 text-orange-500" />
                <p>
                  <strong>{stats.onlyInBank} transactions</strong> appear only in bank records. 
                  Check if these need to be added to your books or if they're duplicate entries.
                </p>
              </div>
            )}
            {stats.onlyInBooks > 0 && (
              <div className="flex items-start space-x-2">
                <FiFileText className="w-4 h-4 mt-0.5 text-yellow-500" />
                <p>
                  <strong>{stats.onlyInBooks} transactions</strong> appear only in books. 
                  Verify if these transactions were actually processed by the bank.
                </p>
              </div>
            )}
            {stats.missingBoth > 0 && (
              <div className="flex items-start space-x-2">
                <FiXCircle className="w-4 h-4 mt-0.5 text-red-500" />
                <p>
                  <strong>{stats.missingBoth} transactions</strong> are missing from both records. 
                  These require immediate investigation to determine their origin and validity.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}