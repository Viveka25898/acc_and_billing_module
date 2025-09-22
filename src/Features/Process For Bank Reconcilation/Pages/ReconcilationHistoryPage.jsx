/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getReconciliationHistory } from "../utils/saveReconcilation";
// React Icons equivalent imports
import { 
  FiSearch,        // Search
  FiFilter,        // Filter
  FiDownload,      // Download
  FiCalendar,      // Calendar
  FiFileText,      // FileText
  FiEye,           // Eye
  FiTrash2,        // Trash2
  FiMoreVertical,  // MoreVertical
  FiAlertCircle,   // AlertCircle
  FiCheckCircle,   // CheckCircle
  FiXCircle        // XCircle
} from 'react-icons/fi';

export default function ReconciliationHistoryPage() {
  const history = getReconciliationHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState(new Set());

  // Enhanced filtering and sorting
  const filteredAndSortedHistory = useMemo(() => {
    let filtered = history.filter(record => {
      const matchedCount = record.records.filter(r => r.inBank && r.inBooks).length;
      const unmatchedCount = record.records.filter(r => !r.inBank || !r.inBooks).length;
      
      const matchesSearch = record.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.reconciler?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || 
                           (filterStatus === 'perfect' && unmatchedCount === 0) ||
                           (filterStatus === 'issues' && unmatchedCount > 0) ||
                           (filterStatus === 'recent' && new Date(record.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
      
      return matchesSearch && matchesFilter;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'fileName':
          aValue = a.fileName;
          bValue = b.fileName;
          break;
        case 'matched':
          aValue = a.records.filter(r => r.inBank && r.inBooks).length;
          bValue = b.records.filter(r => r.inBank && r.inBooks).length;
          break;
        case 'unmatched':
          aValue = a.records.filter(r => !r.inBank || !r.inBooks).length;
          bValue = b.records.filter(r => !r.inBank || !r.inBooks).length;
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
  }, [history, searchTerm, filterStatus, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSelectRecord = (recordId) => {
    const newSelected = new Set(selectedRecords);
    if (newSelected.has(recordId)) {
      newSelected.delete(recordId);
    } else {
      newSelected.add(recordId);
    }
    setSelectedRecords(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRecords.size === filteredAndSortedHistory.length) {
      setSelectedRecords(new Set());
    } else {
      setSelectedRecords(new Set(filteredAndSortedHistory.map(r => r.id)));
    }
  };

  const getStatusBadge = (matchedCount, unmatchedCount) => {
    if (unmatchedCount === 0) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FiCheckCircle className="w-3 h-3 mr-1" />
          Perfect
        </span>
      );
    } else if (unmatchedCount <= 2) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <FiAlertCircle className="w-3 h-3 mr-1" />
          Minor Issues
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <FiXCircle className="w-3 h-3 mr-1" />
          Issues
        </span>
      );
    }
  };

  const calculateStats = () => {
    const totalRecords = history.length;
    const perfectRecords = history.filter(record => {
      const unmatchedCount = record.records.filter(r => !r.inBank || !r.inBooks).length;
      return unmatchedCount === 0;
    }).length;
    const totalTransactions = history.reduce((sum, record) => sum + record.records.length, 0);
    const totalMatched = history.reduce((sum, record) => {
      return sum + record.records.filter(r => r.inBank && r.inBooks).length;
    }, 0);

    return { totalRecords, perfectRecords, totalTransactions, totalMatched };
  };

  const stats = calculateStats();

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-green-700 flex items-center">
              <FiFileText className="w-8 h-8 mr-3" />
              Reconciliation History
            </h1>
            <p className="text-gray-600 mt-1">Manage and view all your bank reconciliation records</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.totalRecords}</div>
            <div className="text-sm text-blue-800">Total Records</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{stats.perfectRecords}</div>
            <div className="text-sm text-green-800">Perfect Matches</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.totalTransactions}</div>
            <div className="text-sm text-purple-800">Total Transactions</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.totalTransactions > 0 ? Math.round((stats.totalMatched / stats.totalTransactions) * 100) : 0}%
            </div>
            <div className="text-sm text-yellow-800">Match Rate</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by file name or reconciler..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Records</option>
              <option value="perfect">Perfect Matches</option>
              <option value="issues">With Issues</option>
              <option value="recent">Recent (7 days)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {history.length === 0 ? (
          <div className="text-center py-12">
            <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-2">No reconciliation records found</p>
            <p className="text-gray-400">Start by uploading your first bank statement</p>
          </div>
        ) : filteredAndSortedHistory.length === 0 ? (
          <div className="text-center py-12">
            <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-2">No records match your search</p>
            <p className="text-gray-400">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRecords.size === filteredAndSortedHistory.length && filteredAndSortedHistory.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('fileName')}
                  >
                    <div className="flex items-center">
                      File Name
                      {sortBy === 'fileName' && (
                        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      Date & Time
                      {sortBy === 'date' && (
                        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('matched')}
                  >
                    <div className="flex items-center">
                      Matched
                      {sortBy === 'matched' && (
                        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('unmatched')}
                  >
                    <div className="flex items-center">
                      Unmatched
                      {sortBy === 'unmatched' && (
                        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reconciler
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedHistory.map((record) => {
                  const matchedCount = record.records.filter(r => r.inBank && r.inBooks).length;
                  const unmatchedCount = record.records.filter(r => !r.inBank || !r.inBooks).length;
                  const totalCount = record.records.length;

                  return (
                    <tr 
                      key={record.id} 
                      className={`hover:bg-gray-50 ${selectedRecords.has(record.id) ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedRecords.has(record.id)}
                          onChange={() => handleSelectRecord(record.id)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FiFileText className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{record.fileName}</div>
                            {record.period && (
                              <div className="text-xs text-gray-500">{record.period}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(record.date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(record.date).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(matchedCount, unmatchedCount)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-green-600">{matchedCount}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-red-600">{unmatchedCount}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{totalCount}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{record.reconciler || 'System'}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Link
                            to={`/dashboard/billing-manager/reconciliation-report-page/${record.id}`}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 transition-colors"
                          >
                            <FiEye className="w-3 h-3 mr-1" />
                            View Report
                          </Link>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <FiMoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredAndSortedHistory.length > 10 && (
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{' '}
                  <span className="font-medium">{Math.min(10, filteredAndSortedHistory.length)}</span> of{' '}
                  <span className="font-medium">{filteredAndSortedHistory.length}</span> results
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}