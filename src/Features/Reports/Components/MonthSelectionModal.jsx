import React, { useState, useEffect } from 'react'
import { FiX, FiCalendar, FiBriefcase, FiMapPin } from 'react-icons/fi'

const MonthSelectionModal = ({ isOpen, onClose, onSelect }) => {
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedClient, setSelectedClient] = useState('all')
  const [selectedState, setSelectedState] = useState('all')
  const [clients, setClients] = useState([])
  const [states, setStates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Generate years (current year and 5 years back)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i)

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ]

  // Load clients and states from localStorage (merged from billing and transactions)
  useEffect(() => {
    try {
      // --- Clients ---
      // From billing (chartOfAccounts, D-prefix)
      const chartOfAccounts = JSON.parse(localStorage.getItem('chartOfAccounts') || '[]')
      const billingClients = chartOfAccounts
        .filter((acc) => acc.code && acc.code.startsWith('D') && acc.type === 'ACCOUNT')
        .map((acc) => ({ code: acc.code, name: acc.name }))
      // From transactions
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
      const txnClientSet = new Set()
      transactions.forEach((txn) => {
        if (txn.clientCode) txnClientSet.add(txn.clientCode)
        if (txn.client) txnClientSet.add(txn.client)
        if (txn.customer) txnClientSet.add(txn.customer)
      })
      const txnClients = Array.from(txnClientSet)
        .filter(Boolean)
        .map((code) => {
          // Try to get name from chartOfAccounts
          const acc = chartOfAccounts.find((a) => a.code === code)
          return { code, name: acc ? acc.name : code }
        })
      // Merge and dedupe
      const allClientsMap = new Map()
      billingClients.forEach((c) => allClientsMap.set(c.code, c))
      txnClients.forEach((c) => allClientsMap.set(c.code, c))
      const mergedClients = Array.from(allClientsMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      )
      setClients(mergedClients)

      // --- States ---
      // From billing (sites or chartOfAccounts)
      const sites = JSON.parse(localStorage.getItem('sites') || '[]')
      const billingStates = new Set()
      sites.forEach((site) => {
        if (site.state) billingStates.add(site.state)
      })
      chartOfAccounts.forEach((acc) => {
        if (acc.state) billingStates.add(acc.state)
      })
      // From transactions
      const txnStateSet = new Set()
      transactions.forEach((txn) => {
        if (txn.state) txnStateSet.add(txn.state)
      })
      // Merge and dedupe
      const allStates = Array.from(new Set([...billingStates, ...txnStateSet]))
        .filter(Boolean)
        .sort()
      setStates(allStates)
    } catch (err) {
      console.error('Error loading clients/states:', err)
      setClients([])
      setStates([])
    }
  }, [])

  // Set default to current month
  useEffect(() => {
    if (isOpen) {
      const now = new Date()
      setSelectedMonth(String(now.getMonth() + 1).padStart(2, '0'))
      setSelectedYear(now.getFullYear())
      setSelectedClient('all')
      setSelectedState('all')
      setError(null)
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedMonth) {
      setError('Please select a month')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const monthData = {
        month: selectedMonth,
        year: selectedYear,
        monthName: months.find((m) => m.value === selectedMonth)?.label || '',
        periodType: 'monthly',
        client: selectedClient === 'all' ? null : selectedClient,
        state: selectedState === 'all' ? null : selectedState,
        clientName:
          selectedClient === 'all'
            ? 'All'
            : clients.find((c) => c.code === selectedClient)?.name || selectedClient,
        stateName: selectedState === 'all' ? 'All' : selectedState,
      }

      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 300))

      if (onSelect) {
        onSelect(monthData)
      }

      onClose()
    } catch (err) {
      console.error('MonthSelectionModal: handleSubmit error', err)
      setError('Failed to process selection. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setError(null)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiCalendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Select Month</h2>
              <p className="text-sm text-gray-500">Choose month for P&L Report</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Year Selection */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                Year <span className="text-red-500">*</span>
              </label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Selection */}
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
                Month <span className="text-red-500">*</span>
              </label>
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              >
                <option value="">Select Month</option>
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Client Selection */}
            <div>
              <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FiBriefcase className="w-4 h-4" />
                  <span>Client</span>
                </div>
              </label>
              <select
                id="client"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="all">All</option>
                {clients.map((client) => (
                  <option key={client.code} value={client.code}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            {/* State Selection */}
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FiMapPin className="w-4 h-4" />
                  <span>State</span>
                </div>
              </label>
              <select
                id="state"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="all">All</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedMonth}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FiCalendar className="w-4 h-4" />
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MonthSelectionModal
