import React, { useState, useEffect } from 'react'
import {
  Search,
  RefreshCw,
  Filter,
  X,
  CreditCard,
  MapPin,
  Building2,
  AlertCircle,
  FileText,
  Save,
  Edit2,
  Check,
} from 'lucide-react'
import { RATE_CARDS, PAYROLL_DATA } from '../data/billingCalculationData'

const RateCardPage = () => {
  const [filters, setFilters] = useState({
    state: '',
    client: '',
    site: '',
    searchTerm: '',
  })

  const [showFilters, setShowFilters] = useState(true)
  const [rateCardData, setRateCardData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [editingRowId, setEditingRowId] = useState(null)
  const [editedDailyRate, setEditedDailyRate] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [rateChangeNotifications, setRateChangeNotifications] = useState([])

  // Load notifications from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rateChangeNotifications')
      if (saved) {
        setRateChangeNotifications(JSON.parse(saved))
      }
    } catch (err) {
      console.error('Error loading notifications:', err)
    }
  }, [])

  // Extract all unique states from RATE_CARDS dynamically
  const getAllStates = () => {
    try {
      const stateSet = new Set()
      Object.keys(RATE_CARDS).forEach((client) => {
        const clientData = RATE_CARDS[client]
        Object.keys(clientData.sites || {}).forEach((site) => {
          const siteData = clientData.sites[site]
          // Try to extract state from site location or infer from client name
          if (siteData.state) {
            stateSet.add(siteData.state)
          }
        })
      })

      // Fallback mapping if states not in data
      const clientLocationMap = {
        'ABC Mall': 'Maharashtra',
        'TechCorp IT Park': 'Karnataka',
        'NeoSoft Pvt. Ltd.': 'Maharashtra',
        'Global Industries': 'Delhi',
        'Retail Paradise': 'Telangana',
      }

      Object.values(clientLocationMap).forEach((state) => stateSet.add(state))

      return Array.from(stateSet).sort()
    } catch (err) {
      console.error('Error extracting states:', err)
      return []
    }
  }

  // Get all clients dynamically
  const getAllClients = () => {
    try {
      return Object.keys(RATE_CARDS).sort()
    } catch (err) {
      console.error('Error extracting clients:', err)
      return []
    }
  }

  const clientLocationMap = {
    'ABC Mall': 'Maharashtra',
    'TechCorp IT Park': 'Karnataka',
    'NeoSoft Pvt. Ltd.': 'Maharashtra',
    'Global Industries': 'Delhi',
    'Retail Paradise': 'Telangana',
  }

  const states = getAllStates()
  const clients = getAllClients()

  const getClientsForState = (state) => {
    try {
      if (!state) return clients
      return clients.filter((client) => clientLocationMap[client] === state)
    } catch (err) {
      console.error('Error filtering clients:', err)
      return clients
    }
  }

  const getSitesForClient = (client) => {
    try {
      if (!client || !RATE_CARDS[client]) return []
      return Object.keys(RATE_CARDS[client].sites).sort()
    } catch (err) {
      console.error('Error getting sites:', err)
      return []
    }
  }

  const handleFilterChange = (field, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [field]: value }

      // Reset dependent fields
      if (field === 'state') {
        newFilters.client = ''
        newFilters.site = ''
      } else if (field === 'client') {
        newFilters.site = ''
      }

      return newFilters
    })
  }

  const handleSearch = () => {
    try {
      setIsLoading(true)
      setHasSearched(true)
      setError(null)

      // Simulate loading delay
      setTimeout(() => {
        try {
          const results = []
          const clientsToSearch = filters.client
            ? [filters.client]
            : getClientsForState(filters.state)

          clientsToSearch.forEach((client) => {
            const clientData = RATE_CARDS[client]
            if (!clientData) return

            const sitesToSearch = filters.site ? [filters.site] : Object.keys(clientData.sites)

            sitesToSearch.forEach((site) => {
              const siteData = clientData.sites[site]
              if (!siteData) return

              // Get employee count from payroll data
              const payrollData = PAYROLL_DATA[client]?.sites[site] || []

              siteData.services.forEach((service) => {
                // Apply search filter
                if (filters.searchTerm) {
                  const searchLower = filters.searchTerm.toLowerCase()
                  const matchesSearch =
                    site.toLowerCase().includes(searchLower) ||
                    service.designation.toLowerCase().includes(searchLower) ||
                    client.toLowerCase().includes(searchLower)

                  if (!matchesSearch) return
                }

                // Find employee count for this designation
                const payrollEntry = payrollData.find((p) => p.designation === service.designation)
                const employeeCount = payrollEntry?.numberOfWorkers || 0

                // Calculate daily rate
                const dailyRate = Math.round(service.monthlyRate / 30)

                results.push({
                  id: `${client}-${site}-${service.id}`,
                  client,
                  state: clientLocationMap[client] || 'N/A',
                  site,
                  designation: service.designation,
                  product: service.product,
                  monthlyRate: service.monthlyRate,
                  dailyRate,
                  hsnCode: service.hsnCode,
                  gstRate: service.gstRate,
                  employeeCount,
                  isMachinery: service.isMachinery || false,
                  isConsumable: service.isConsumable || false,
                  effectiveDate: '01-Jan-2026',
                  lastUpdated: '-',
                })
              })
            })
          })

          setRateCardData(results)
          setIsLoading(false)
        } catch (err) {
          console.error('Error processing rate cards:', err)
          setError('Failed to load rate cards. Please try again.')
          setIsLoading(false)
        }
      }, 500)
    } catch (err) {
      console.error('Error in handleSearch:', err)
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setFilters({
      state: '',
      client: '',
      site: '',
      searchTerm: '',
    })
    setRateCardData([])
    setHasSearched(false)
    setError(null)
  }

  const handleEditClick = (rowId, currentDailyRate) => {
    setEditingRowId(rowId)
    setEditedDailyRate(currentDailyRate.toString())
  }

  const handleDailyRateChange = (e) => {
    const value = e.target.value
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setEditedDailyRate(value)
    }
  }

  const handleSaveRate = async (rowId) => {
    try {
      setIsSaving(true)
      setError(null)

      const newDailyRate = parseInt(editedDailyRate)
      if (isNaN(newDailyRate) || newDailyRate <= 0) {
        setError('Please enter a valid daily rate')
        setIsSaving(false)
        return
      }

      // Calculate new monthly rate
      const newMonthlyRate = newDailyRate * 30

      // Find the row and update it
      const updatedData = rateCardData.map((item) => {
        if (item.id === rowId) {
          const oldRate = item.dailyRate
          return {
            ...item,
            dailyRate: newDailyRate,
            monthlyRate: newMonthlyRate,
            lastUpdated: new Date().toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
            oldRate, // Store old rate for notification
          }
        }
        return item
      })

      setRateCardData(updatedData)

      // Find the updated item
      const updatedItem = updatedData.find((item) => item.id === rowId)

      if (updatedItem && updatedItem.oldRate !== newDailyRate) {
        // Prompt for rate change date (when the rate was actually changed in the past)
        const rateChangeDateInput = prompt(
          'Enter the Rate Change Date (DD-MM-YYYY):\n\nExample: 01-11-2025 for November 1, 2025\n\nThis is the PAST date when the rate was actually changed.\nArrears will be calculated from this date to yesterday.',
          '01-11-2025'
        )

        let rateChangeDate = new Date()
        rateChangeDate.setMonth(rateChangeDate.getMonth() - 2) // Default 2 months ago

        if (rateChangeDateInput) {
          try {
            const [day, month, year] = rateChangeDateInput.split('-')
            const parsedDate = new Date(year, month - 1, day)
            if (!isNaN(parsedDate.getTime())) {
              rateChangeDate = parsedDate
            }
          } catch (e) {
            console.error('Invalid date format, using default:', e)
          }
        }

        // Prompt for total working days from payroll
        const workingDaysInput = prompt(
          'Enter Total Working Days from Payroll:\n\nHow many days did employees actually work from ' +
            rateChangeDate.toLocaleDateString('en-GB') +
            ' to yesterday?\n\nExample: 65 (for ~2 months of work)',
          '65'
        )

        const totalWorkingDays = parseInt(workingDaysInput) || 65

        // Effective date is today (when new rate becomes effective going forward)
        const effectiveDate = new Date()

        // Create notification
        const notification = {
          id: `notif-${Date.now()}`,
          client: updatedItem.client,
          site: updatedItem.site,
          designation: updatedItem.designation,
          oldDailyRate: updatedItem.oldRate,
          newDailyRate: newDailyRate,
          oldMonthlyRate: updatedItem.oldRate * 30,
          newMonthlyRate: newMonthlyRate,
          rateChangeDate: rateChangeDate.toISOString(),
          effectiveDate: effectiveDate.toISOString(),
          totalWorkingDays: totalWorkingDays,
          timestamp: Date.now(),
          read: false,
        }

        // Add to notifications
        const updatedNotifications = [...rateChangeNotifications, notification]
        setRateChangeNotifications(updatedNotifications)

        // Save to localStorage
        localStorage.setItem('rateChangeNotifications', JSON.stringify(updatedNotifications))
      }

      // Reset editing state
      setEditingRowId(null)
      setEditedDailyRate('')
      setIsSaving(false)

      // Show success message briefly
      setTimeout(() => {
        setError(null)
      }, 3000)
    } catch (err) {
      console.error('Error saving rate:', err)
      setError('Failed to save rate. Please try again.')
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingRowId(null)
    setEditedDailyRate('')
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getItemTypeBadge = (item) => {
    if (item.isMachinery) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 border border-purple-300">
          🔧 Machinery
        </span>
      )
    }
    if (item.isConsumable) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300">
          📦 Consumable
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300">
        👤 Employee
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 overflow-x-hidden">
      <div className="max-w-[61rem] mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2 sm:gap-3">
                <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 flex-shrink-0" />
                <span className="break-words">Rate Card Management</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                View and manage client rate cards across all locations
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm sm:text-base">
                  {showFilters ? 'Hide' : 'Show'} Filters
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-red-700 break-words">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filters Section */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* State Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  State
                </label>
                <select
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                >
                  <option value="">All States</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Client Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  <Building2 className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  Client
                </label>
                <select
                  value={filters.client}
                  onChange={(e) => handleFilterChange('client', e.target.value)}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                >
                  <option value="">All Clients</option>
                  {getClientsForState(filters.state).map((client) => (
                    <option key={client} value={client}>
                      {client}
                    </option>
                  ))}
                </select>
              </div>

              {/* Site Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  <Building2 className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  Site
                </label>
                <select
                  value={filters.site}
                  onChange={(e) => handleFilterChange('site', e.target.value)}
                  disabled={!filters.client}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">All Sites</option>
                  {getSitesForClient(filters.client).map((site) => (
                    <option key={site} value={site}>
                      {site}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Box */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  <Search className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search site, designation..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 font-medium flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search Rate Cards
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-2 transition-all text-sm"
              >
                <X className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center">
              <RefreshCw className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Loading rate cards...</p>
            </div>
          </div>
        ) : rateCardData.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Results Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-emerald-100 border-b border-emerald-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-emerald-900 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Rate Card Results
                </h2>
                <span className="text-sm font-medium text-emerald-700 bg-emerald-200 px-3 py-1 rounded-full">
                  {rateCardData.length} {rateCardData.length === 1 ? 'Record' : 'Records'}
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Client
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      State
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Site
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Designation
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Product/Service
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Daily Rate
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Monthly Rate
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Count
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      HSN/SAC
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      GST %
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Effective Date
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Last Updated
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rateCardData.map((item, index) => {
                    const isEditing = editingRowId === item.id
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-emerald-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } ${isEditing ? 'ring-2 ring-emerald-500' : ''}`}
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                          {item.client}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">
                          {item.state}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">
                          {item.site}
                        </td>
                        <td className="px-4 py-3 text-sm border-r border-gray-200">
                          {getItemTypeBadge(item)}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                          {item.designation}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">
                          {item.product}
                        </td>
                        {/* Editable Daily Rate */}
                        <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900 border-r border-gray-200">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-gray-500">₹</span>
                              <input
                                type="text"
                                value={editedDailyRate}
                                onChange={handleDailyRateChange}
                                className="w-20 px-2 py-1 border-2 border-emerald-500 rounded text-right focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                autoFocus
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') handleSaveRate(item.id)
                                  if (e.key === 'Escape') handleCancelEdit()
                                }}
                              />
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2 group">
                              <span>{formatCurrency(item.dailyRate)}</span>
                              <button
                                onClick={() => handleEditClick(item.id, item.dailyRate)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-emerald-100 rounded"
                                title="Edit daily rate"
                              >
                                <Edit2 className="w-3 h-3 text-emerald-600" />
                              </button>
                            </div>
                          )}
                        </td>
                        {/* Auto-calculated Monthly Rate */}
                        <td className="px-4 py-3 text-sm text-right font-semibold text-emerald-700 border-r border-gray-200">
                          {isEditing && editedDailyRate ? (
                            <span className="text-emerald-600">
                              {formatCurrency(parseInt(editedDailyRate) * 30)}
                            </span>
                          ) : (
                            formatCurrency(item.monthlyRate)
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-center border-r border-gray-200">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold">
                            {item.employeeCount}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-gray-700 border-r border-gray-200">
                          {item.hsnCode}
                        </td>
                        <td className="px-4 py-3 text-sm text-center border-r border-gray-200">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                            {item.gstRate}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-gray-700 border-r border-gray-200">
                          {item.effectiveDate}
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-gray-600 border-r border-gray-200">
                          {item.lastUpdated}
                        </td>
                        {/* Actions Column */}
                        <td className="px-4 py-3 text-sm text-center">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleSaveRate(item.id)}
                                disabled={isSaving || !editedDailyRate}
                                className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                title="Save changes"
                              >
                                {isSaving ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                disabled={isSaving}
                                className="p-1.5 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 transition-colors"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditClick(item.id, item.dailyRate)}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors text-xs font-medium"
                              title="Edit rate"
                            >
                              <Edit2 className="w-3 h-3" />
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : hasSearched ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Rate Cards Found</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                No rate cards match your current filters. Try adjusting your search criteria.
              </p>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <CreditCard className="w-16 h-16 text-emerald-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Search</h3>
              <p className="text-gray-600 max-w-md">
                Select your filters above and click "Search Rate Cards" to view rate information.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RateCardPage
