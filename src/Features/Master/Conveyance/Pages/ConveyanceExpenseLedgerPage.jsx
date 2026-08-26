// src/pages/ConveyanceExpenseLedgerPage.jsx
import React, { useState, useEffect } from 'react'
import { ExpenseLedgerService } from '../../utils/expenseLedgerService'
import HeaderSection from '../../Components/ExpenseHeadComponents/HeaderSection'
import FilterSection from '../../Components/ExpenseHeadComponents/FilterSection'
import LedgerTable from '../../Components/ExpenseHeadComponents/LedgerTable'
import FooterSummary from '../../Components/ExpenseHeadComponents/FooterSummery'

const ConveyanceExpenseLedgerPage = () => {
  const [ledgerData, setLedgerData] = useState(null)
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadLedgerData()

    // Listen for conveyance updates to refresh ledger
    const handleConveyanceUpdate = () => {
      loadLedgerData()
    }
    window.addEventListener('conveyanceUpdated', handleConveyanceUpdate)

    return () => {
      window.removeEventListener('conveyanceUpdated', handleConveyanceUpdate)
    }
  }, [])

  const loadLedgerData = async (activeFilters = {}) => {
    try {
      setLoading(true)
      setError(null)
      const data = await ExpenseLedgerService.getExpenseLedgerData('X2001003', activeFilters)
      setLedgerData(data)
      setFilteredTransactions(data?.transactions || [])
    } catch (err) {
      console.error('Error loading conveyance expense ledger:', err)
      setError(err.message || 'Failed to load conveyance expense ledger data')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filters) => {
    loadLedgerData(filters)
  }

  const handleRefresh = () => {
    loadLedgerData()
  }

  if (loading && !ledgerData) {
    return (
      <div className="min-h-screen bg-gray-100 p-5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Branch conveyance expense Ledger...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 space-y-0">
        
        {/* Error notification banner */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center justify-between">
            <p className="text-sm text-red-700 font-medium">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700 transition cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {ledgerData && (
          <>
            <HeaderSection
              header={ledgerData.header}
              balances={ledgerData.balances}
              stats={ledgerData.stats}
            />

            <FilterSection
              filterOptions={ledgerData.filterOptions}
              onFilterChange={handleFilterChange}
            />

            {/* Refresh Toolbar */}
            <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-gray-600">
              <div>
                Showing <strong>{filteredTransactions.length}</strong> transactions
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white rounded font-semibold text-xs hover:bg-emerald-700 disabled:opacity-50 transition cursor-pointer"
              >
                <span>🔄</span> Refresh
              </button>
            </div>

            {loading ? (
              <div className="py-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-3"></div>
                <p className="text-sm text-gray-500 font-medium">Fetching transaction records...</p>
              </div>
            ) : (
              <LedgerTable transactions={filteredTransactions} />
            )}

            <FooterSummary summary={ledgerData.summary} />
          </>
        )}
      </div>
    </div>
  )
}

export default ConveyanceExpenseLedgerPage
