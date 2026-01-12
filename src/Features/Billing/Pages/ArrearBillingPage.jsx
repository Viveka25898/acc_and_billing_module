import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  RefreshCw,
  Filter,
  X,
  TrendingUp,
  MapPin,
  Building2,
  AlertCircle,
  FileText,
  Calendar,
  User,
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
  CheckCircle,
  PlayCircle,
} from 'lucide-react'

const ArrearBillingPage = () => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    state: '',
    site: '',
    searchTerm: '',
  })

  const [showFilters, setShowFilters] = useState(true)
  const [rateChangeData, setRateChangeData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notificationCount, setNotificationCount] = useState(0)

  // Load rate change notifications from localStorage
  useEffect(() => {
    loadRateChanges()
  }, [])

  const loadRateChanges = () => {
    try {
      setIsLoading(true)
      setError(null)

      const saved = localStorage.getItem('rateChangeNotifications')
      if (saved) {
        const notifications = JSON.parse(saved)
        setRateChangeData(notifications)
        const unreadCount = notifications.filter((n) => !n.read).length
        setNotificationCount(unreadCount)
      } else {
        setRateChangeData([])
        setNotificationCount(0)
      }

      setIsLoading(false)
    } catch (err) {
      console.error('Error loading rate changes:', err)
      setError('Failed to load rate change data. Please try again.')
      setIsLoading(false)
    }
  }

  // Extract unique states from rate change data
  const getUniqueStates = () => {
    try {
      const stateMap = {
        'ABC Mall': 'Maharashtra',
        'TechCorp IT Park': 'Karnataka',
        'NeoSoft Pvt. Ltd.': 'Maharashtra',
        'Global Industries': 'Delhi',
        'Retail Paradise': 'Telangana',
      }

      const states = new Set()
      rateChangeData.forEach((item) => {
        const state = stateMap[item.client] || 'Unknown'
        states.add(state)
      })

      return Array.from(states).sort()
    } catch (err) {
      console.error('Error extracting states:', err)
      return []
    }
  }

  // Extract unique sites from rate change data
  const getUniqueSites = () => {
    try {
      const sites = new Set()
      rateChangeData.forEach((item) => {
        sites.add(item.site)
      })
      return Array.from(sites).sort()
    } catch (err) {
      console.error('Error extracting sites:', err)
      return []
    }
  }

  const states = getUniqueStates()
  const sites = getUniqueSites()

  // Filter rate change data based on selected filters
  const getFilteredData = () => {
    try {
      let filtered = [...rateChangeData]

      const stateMap = {
        'ABC Mall': 'Maharashtra',
        'TechCorp IT Park': 'Karnataka',
        'NeoSoft Pvt. Ltd.': 'Maharashtra',
        'Global Industries': 'Delhi',
        'Retail Paradise': 'Telangana',
      }

      // Filter by state
      if (filters.state) {
        filtered = filtered.filter((item) => {
          const itemState = stateMap[item.client] || 'Unknown'
          return itemState === filters.state
        })
      }

      // Filter by site
      if (filters.site) {
        filtered = filtered.filter((item) => item.site === filters.site)
      }

      // Filter by search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        filtered = filtered.filter(
          (item) =>
            item.site.toLowerCase().includes(searchLower) ||
            item.client.toLowerCase().includes(searchLower) ||
            item.designation.toLowerCase().includes(searchLower)
        )
      }

      return filtered
    } catch (err) {
      console.error('Error filtering data:', err)
      return []
    }
  }

  const filteredData = getFilteredData()

  // Group filtered data by client
  const getGroupedDataByClient = () => {
    try {
      const grouped = {}

      filteredData.forEach((item) => {
        if (!grouped[item.client]) {
          grouped[item.client] = []
        }
        grouped[item.client].push(item)
      })

      return grouped
    } catch (err) {
      console.error('Error grouping data:', err)
      return {}
    }
  }

  const groupedData = getGroupedDataByClient()

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleReset = () => {
    setFilters({
      state: '',
      site: '',
      searchTerm: '',
    })
  }

  const handleStartArrearBilling = (client, notifications) => {
    try {
      // Navigate to arrear billing form with client data
      navigate('/dashboard/billing-manager/arrear-billing/form', {
        state: {
          client,
          notifications,
        },
      })
    } catch (err) {
      console.error('Error starting arrear billing:', err)
      setError('Failed to start arrear billing. Please try again.')
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDateTime = (timestamp) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    } catch {
      return 'N/A'
    }
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return 'N/A'
    }
  }

  const getStateForClient = (client) => {
    const stateMap = {
      'ABC Mall': 'Maharashtra',
      'TechCorp IT Park': 'Karnataka',
      'NeoSoft Pvt. Ltd.': 'Maharashtra',
      'Global Industries': 'Delhi',
      'Retail Paradise': 'Telangana',
    }
    return stateMap[client] || 'Unknown'
  }

  const getStatusBadge = (notification) => {
    if (notification.read) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 border border-green-300">
          <CheckCircle className="w-3 h-3 mr-1" />
          Processed
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
        <Clock className="w-3 h-3 mr-1" />
        Pending
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
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
                <span className="break-words">Arrear Billing Management</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Process arrear billing for rate changes across all locations
              </p>
              {notificationCount > 0 && (
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {notificationCount} pending rate {notificationCount === 1 ? 'change' : 'changes'}
                </div>
              )}
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
              <button
                onClick={loadRateChanges}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="text-sm sm:text-base">Refresh</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* State Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  State
                </label>
                <select
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">All States</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
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
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">All Sites</option>
                  {sites.map((site) => (
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
                  placeholder="Search by site, client, designation..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-2 transition-all text-sm"
              >
                <X className="w-4 h-4" />
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center">
              <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Loading rate changes...</p>
            </div>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Results Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Rate Change Records
                </h2>
                <span className="text-sm font-medium text-blue-700 bg-blue-200 px-3 py-1 rounded-full">
                  {filteredData.length} {filteredData.length === 1 ? 'Record' : 'Records'}
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
                      Designation
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Old Daily Rate
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      New Daily Rate
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Rate Difference
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Old Monthly Rate
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      New Monthly Rate
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Changed By
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Changed At
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Effective Date
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.keys(groupedData).map((client) => {
                    const clientNotifications = groupedData[client]
                    const rowCount = clientNotifications.length
                    const allProcessed = clientNotifications.every((n) => n.read)

                    return clientNotifications.map((item, itemIndex) => {
                      const rateDifference = item.newDailyRate - item.oldDailyRate
                      const isIncrease = rateDifference > 0
                      const isFirstRow = itemIndex === 0

                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-blue-50 transition-colors ${
                            !item.read ? 'border-l-4 border-l-blue-500' : ''
                          }`}
                        >
                          {/* Client - only show in first row with rowspan */}
                          {isFirstRow && (
                            <td
                              rowSpan={rowCount}
                              className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200 bg-gray-50 align-top"
                            >
                              <div className="sticky top-0">
                                <div className="font-bold text-base">{client}</div>
                                <div className="text-xs text-gray-600 mt-1">
                                  {rowCount} rate {rowCount === 1 ? 'change' : 'changes'}
                                </div>
                              </div>
                            </td>
                          )}

                          {/* State - only show in first row with rowspan */}
                          {isFirstRow && (
                            <td
                              rowSpan={rowCount}
                              className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 bg-gray-50 align-top"
                            >
                              {getStateForClient(client)}
                            </td>
                          )}

                          {/* Site */}
                          <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">
                            {item.site}
                          </td>

                          {/* Designation */}
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                            {item.designation}
                          </td>

                          {/* Old Daily Rate */}
                          <td className="px-4 py-3 text-sm text-right text-gray-700 border-r border-gray-200">
                            {formatCurrency(item.oldDailyRate)}
                          </td>

                          {/* New Daily Rate */}
                          <td className="px-4 py-3 text-sm text-right font-semibold text-blue-700 border-r border-gray-200">
                            {formatCurrency(item.newDailyRate)}
                          </td>

                          {/* Rate Difference */}
                          <td className="px-4 py-3 text-sm text-right border-r border-gray-200">
                            <div className="flex items-center justify-end gap-1">
                              {isIncrease ? (
                                <>
                                  <ArrowUpCircle className="w-4 h-4 text-green-600" />
                                  <span className="font-semibold text-green-700">
                                    +{formatCurrency(rateDifference)}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <ArrowDownCircle className="w-4 h-4 text-red-600" />
                                  <span className="font-semibold text-red-700">
                                    {formatCurrency(rateDifference)}
                                  </span>
                                </>
                              )}
                            </div>
                          </td>

                          {/* Old Monthly Rate */}
                          <td className="px-4 py-3 text-sm text-right text-gray-700 border-r border-gray-200">
                            {formatCurrency(item.oldMonthlyRate)}
                          </td>

                          {/* New Monthly Rate */}
                          <td className="px-4 py-3 text-sm text-right font-semibold text-blue-700 border-r border-gray-200">
                            {formatCurrency(item.newMonthlyRate)}
                          </td>

                          {/* Changed By */}
                          <td className="px-4 py-3 text-sm text-center border-r border-gray-200">
                            <div className="flex items-center justify-center gap-1 text-gray-700">
                              <User className="w-3 h-3" />
                              <span>Admin</span>
                            </div>
                          </td>

                          {/* Changed At */}
                          <td className="px-4 py-3 text-sm text-center text-gray-700 border-r border-gray-200">
                            <div className="flex flex-col items-center gap-1">
                              <span className="font-medium">{formatDateTime(item.timestamp)}</span>
                            </div>
                          </td>

                          {/* Effective Date */}
                          <td className="px-4 py-3 text-sm text-center text-gray-700 border-r border-gray-200">
                            <div className="flex items-center justify-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(item.rateChangeDate)}</span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3 text-sm text-center border-r border-gray-200">
                            {getStatusBadge(item)}
                          </td>

                          {/* Action - only show in first row with rowspan */}
                          {isFirstRow && (
                            <td
                              rowSpan={rowCount}
                              className="px-4 py-3 text-sm text-center bg-gray-50 align-middle"
                            >
                              <button
                                onClick={() =>
                                  handleStartArrearBilling(client, clientNotifications)
                                }
                                disabled={allProcessed}
                                className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all text-xs font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
                                title={
                                  allProcessed
                                    ? 'All changes processed'
                                    : `Start billing for ${rowCount} rate ${
                                        rowCount === 1 ? 'change' : 'changes'
                                      }`
                                }
                              >
                                <PlayCircle className="w-4 h-4" />
                                {allProcessed ? 'Completed' : 'Start Billing'}
                              </button>
                            </td>
                          )}
                        </tr>
                      )
                    })
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Rate Changes Found</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                {filters.state || filters.site || filters.searchTerm
                  ? 'No rate changes match your current filters. Try adjusting your search criteria.'
                  : 'There are no pending rate changes at this time. Rate changes will appear here when rates are updated.'}
              </p>
              {(filters.state || filters.site || filters.searchTerm) && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArrearBillingPage
