/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReconciliationById } from "../utils/reconciliationHistory";
import { 
  FiArrowLeft, 
  FiDownload, 
  FiPrinter, 
  FiShare2, 
  FiFileText, 
  FiCheckCircle, 
  FiXCircle, 
  FiAlertTriangle,
  FiCalendar,
  FiUser,
  FiHome,
  FiDollarSign,
  FiTrendingUp,
  FiFilter,
  FiSearch
} from 'react-icons/fi';
import MatchedTransactionsTable from "../Components/MatchedTransactionTable";
import UnmatchedTransactionsTable from "../Components/UnMatchedTransactionTable";

export default function ReconciliationReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = getReconciliationById(id);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [amountFilter, setAmountFilter] = useState('all');

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
          <FiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h2>
          <p className="text-gray-600 mb-6">The requested reconciliation report could not be found.</p>
          <button 
            onClick={() => navigate("/dashboard/billing-manager/reconciliation-history")} 
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to History
          </button>
        </div>
      </div>
    );
  }

  const matchedTransactions = data.matched || [];
  const unmatchedTransactions = data.unmatched || [];
  const allTransactions = [...matchedTransactions, ...unmatchedTransactions];
  
  // Calculate enhanced statistics
  const stats = useMemo(() => {
    const totalAmount = allTransactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    const matchedAmount = matchedTransactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    const unmatchedAmount = unmatchedTransactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
    const matchPercentage = allTransactions.length > 0 
      ? Math.round((matchedTransactions.length / allTransactions.length) * 100) 
      : 0;
    
    const amountMatchPercentage = totalAmount > 0 
      ? Math.round((matchedAmount / totalAmount) * 100) 
      : 0;

    return {
      totalTransactions: allTransactions.length,
      matchedCount: matchedTransactions.length,
      unmatchedCount: unmatchedTransactions.length,
      totalAmount,
      matchedAmount,
      unmatchedAmount,
      matchPercentage,
      amountMatchPercentage
    };
  }, [matchedTransactions, unmatchedTransactions, allTransactions]);

  const filteredTransactions = useMemo(() => {
    let filtered = allTransactions.filter(transaction => {
      const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesAmount = true;
      if (amountFilter !== 'all') {
        const amount = parseFloat(transaction.amount || 0);
        switch (amountFilter) {
          case 'small': matchesAmount = amount < 1000; break;
          case 'medium': matchesAmount = amount >= 1000 && amount < 10000; break;
          case 'large': matchesAmount = amount >= 10000; break;
        }
      }
      
      return matchesSearch && matchesAmount;
    });
    
    return filtered;
  }, [allTransactions, searchTerm, amountFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate("/dashboard/billing-manager/reconciliation-history")}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiArrowLeft className="w-5 h-5 mr-2" />
                Back to History
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Reconciliation Report</h1>
                <p className="text-sm text-gray-600">
                  {data.fileName} • {new Date(data.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
              </div>
              <FiFileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Matched</p>
                <p className="text-2xl font-bold text-green-600">{stats.matchedCount}</p>
                <p className="text-xs text-gray-500">{stats.matchPercentage}% of transactions</p>
              </div>
              <FiCheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unmatched</p>
                <p className="text-2xl font-bold text-red-600">{stats.unmatchedCount}</p>
                <p className="text-xs text-gray-500">{100 - stats.matchPercentage}% of transactions</p>
              </div>
              <FiXCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalAmount.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{stats.amountMatchPercentage}% matched</p>
              </div>
              <FiDollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Report Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <FiCalendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Reconciliation Date</p>
                <p className="font-medium">{new Date(data.date).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FiUser className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Reconciled By</p>
                <p className="font-medium">{data.reconciler || 'System'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FiHome className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Bank Account</p>
                <p className="font-medium">{data.bankAccount || 'Main Operating Account'}</p>
              </div>
            </div>
          </div>
          
          {data.notes && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">Notes</p>
              <p className="mt-1 text-gray-800">{data.notes}</p>
            </div>
          )}
        </div>

        {/* Status Alert */}
        {stats.unmatchedCount > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
            <div className="flex">
              <FiAlertTriangle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Attention Required
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    This reconciliation has {stats.unmatchedCount} unmatched transaction{stats.unmatchedCount > 1 ? 's' : ''} 
                    totaling ₹{stats.unmatchedAmount.toLocaleString()}. Please review and resolve these discrepancies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'overview', name: 'Overview', icon: FiTrendingUp },
                { id: 'matched', name: `Matched (${stats.matchedCount})`, icon: FiCheckCircle },
                { id: 'unmatched', name: `Unmatched (${stats.unmatchedCount})`, icon: FiXCircle },
                { id: 'all', name: 'All Transactions', icon: FiFileText }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Summary Charts/Visualizations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                          <span className="text-sm text-gray-700">Matched Transactions</span>
                        </div>
                        <span className="text-sm font-medium">{stats.matchedCount} ({stats.matchPercentage}%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                          <span className="text-sm text-gray-700">Unmatched Transactions</span>
                        </div>
                        <span className="text-sm font-medium">{stats.unmatchedCount} ({100 - stats.matchPercentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${stats.matchPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Amount Breakdown</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Total Amount</span>
                        <span className="text-sm font-medium">₹{stats.totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Matched Amount</span>
                        <span className="text-sm font-medium text-green-600">₹{stats.matchedAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Unmatched Amount</span>
                        <span className="text-sm font-medium text-red-600">₹{stats.unmatchedAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity or Key Insights */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Key Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{stats.matchPercentage}%</div>
                      <div className="text-sm text-gray-600">Match Rate</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        ₹{Math.round(stats.matchedAmount / (stats.matchedCount || 1)).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Avg Matched Amount</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        ₹{Math.round(stats.unmatchedAmount / (stats.unmatchedCount || 1) || 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Avg Unmatched Amount</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'matched' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-green-600 flex items-center">
                    <FiCheckCircle className="w-5 h-5 mr-2" />
                    Matched Transactions
                  </h3>
                  <div className="text-sm text-gray-600">
                    {stats.matchedCount} transactions • ₹{stats.matchedAmount.toLocaleString()}
                  </div>
                </div>
                <MatchedTransactionsTable data={matchedTransactions} />
              </div>
            )}

            {activeTab === 'unmatched' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-red-600 flex items-center">
                    <FiXCircle className="w-5 h-5 mr-2" />
                    Unmatched Transactions
                  </h3>
                  <div className="text-sm text-gray-600">
                    {stats.unmatchedCount} transactions • ₹{stats.unmatchedAmount.toLocaleString()}
                  </div>
                </div>
                <UnmatchedTransactionsTable data={unmatchedTransactions} />
              </div>
            )}

            {activeTab === 'all' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FiFileText className="w-5 h-5 mr-2" />
                    All Transactions
                  </h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <FiFilter className="w-4 h-4 mr-2" />
                      Filters
                    </button>
                  </div>
                </div>

                {showFilters && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search transactions..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <select
                        className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                        value={amountFilter}
                        onChange={(e) => setAmountFilter(e.target.value)}
                      >
                        <option value="all">All Amounts</option>
                        <option value="small">Small ( ₹1,000)</option>
                        <option value="medium">Medium (₹1,000 - ₹10,000)</option>
                        <option value="large">Large (₹10,000)</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTransactions.map((transaction, idx) => {
                        const isMatched = matchedTransactions.includes(transaction);
                        return (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {transaction.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              ₹{parseFloat(transaction.amount || 0).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {transaction.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {transaction.reference}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {isMatched ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <FiCheckCircle className="w-3 h-3 mr-1" />
                                  Matched
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <FiXCircle className="w-3 h-3 mr-1" />
                                  Unmatched
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Report generated on {new Date(data.date).toLocaleString()}
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
}