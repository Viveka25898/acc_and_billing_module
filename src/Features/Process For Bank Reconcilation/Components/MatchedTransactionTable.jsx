/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from "react";
import { 
  FiCheckCircle, 
  FiSearch, 
  FiFilter, 
  FiDownload,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiEye,
  FiTrendingUp,
  FiTrendingDown,
  FiCheck,
  FiX
} from 'react-icons/fi';

export default function MatchedTransactionsTable({ data }) {
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
          case 'perfect':
            matchesFilter = (transaction.matchScore || 100) === 100;
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
        case 'matchScore':
          aValue = parseFloat(a.matchScore || 100);
          bValue = parseFloat(b.matchScore || 100);
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
    const avgMatchScore = filteredAndSortedData.reduce((sum, t) => sum + (parseFloat(t.matchScore) || 100), 0) / (filteredAndSortedData.length || 1);
    
    return {
      totalTransactions: filteredAndSortedData.length,
      totalAmount,
      creditAmount,
      debitAmount,
      avgMatchScore: Math.round(avgMatchScore)
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

  const getStatusIcon = (inBank, inBooks) => {
    if (inBank && inBooks) {
      return <FiCheck className="w-4 h-4 text-green-600" />;
    }
    return <FiX className="w-4 h-4 text-red-600" />;
  };

  const getMatchScoreColor = (score) => {
    const numScore = parseFloat(score || 100);
    if (numScore === 100) return 'text-green-600 bg-green-50';
    if (numScore >= 90) return 'text-blue-600 bg-blue-50';
    if (numScore >= 80) return 'text-yellow-600 bg-yellow-50';
    return 'text-orange-600 bg-orange-50';
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Amount', 'Description', 'Reference', 'In Bank', 'In Books', 'Status', 'Match Score'];
    const csvData = [
      headers.join(','),
      ...filteredAndSortedData.map(row => [
        row.date,
        row.amount,
        `"${row.description}"`,
        row.reference,
        row.inBank ? 'Yes' : 'No',
        row.inBooks ? 'Yes' : 'No',
        'Matched',
        row.matchScore || 100
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `matched_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 bg-green-50 rounded-lg border border-green-200">
        <FiCheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <p className="text-lg text-green-700 font-medium mb-2">No Matched Transactions</p>
        <p className="text-green-600">All transactions are perfectly reconciled or no data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Total Matched</p>
              <p className="text-2xl font-bold text-green-700">{stats.totalTransactions}</p>
            </div>
            <FiCheckCircle className="w-8 h-8 text-green-500" />
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

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Credits</p>
              <p className="text-xl font-bold text-purple-700">{formatAmount(stats.creditAmount)}</p>
            </div>
            <FiTrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600">Avg Match Score</p>
              <p className="text-2xl font-bold text-orange-700">{stats.avgMatchScore}%</p>
            </div>
            <FiFileText className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
           
          </div>

          <div className="flex gap-2">
            
            
            <button
              onClick={exportToCSV}
              className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
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
              {['all', 'credit', 'debit', 'large', 'medium', 'small', 'perfect'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterBy(filter)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filterBy === filter
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
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
            <thead className="bg-green-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider cursor-pointer hover:bg-green-100 transition-colors"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">
                    <FiCalendar className="w-4 h-4 mr-2" />
                    Date
                    {sortBy === 'date' && (
                      <span className="ml-1 text-green-600">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider cursor-pointer hover:bg-green-100 transition-colors"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center">
                    Amount
                    {sortBy === 'amount' && (
                      <span className="ml-1 text-green-600">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider cursor-pointer hover:bg-green-100 transition-colors"
                  onClick={() => handleSort('description')}
                >
                  <div className="flex items-center">
                    <FiFileText className="w-4 h-4 mr-2" />
                    Description
                    {sortBy === 'description' && (
                      <span className="ml-1 text-green-600">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider">
                  In Bank
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider">
                  In Books
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider">
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider cursor-pointer hover:bg-green-100 transition-colors"
                  onClick={() => handleSort('matchScore')}
                >
                  <div className="flex items-center justify-center">
                    Match Score
                    {sortBy === 'matchScore' && (
                      <span className="ml-1 text-green-600">
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
                const matchScore = parseFloat(transaction.matchScore || 100);
                
                return (
                  <tr key={idx} className="hover:bg-green-50 transition-colors">
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
                      {transaction.reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center">
                        {transaction.inBank !== false ? (
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
                        {transaction.inBooks !== false ? (
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
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FiCheckCircle className="w-3 h-3 mr-1" />
                        Matched
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMatchScoreColor(matchScore)}`}>
                        {matchScore}%
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
                            ? 'z-10 bg-green-50 border-green-500 text-green-600'
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
    </div>
  );
}