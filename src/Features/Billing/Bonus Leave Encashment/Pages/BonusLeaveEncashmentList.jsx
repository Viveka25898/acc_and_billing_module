import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Gift,
  Briefcase,
  FileText,
  Calendar,
  IndianRupee,
  Users,
  CheckCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import { getClientsWithPayrollData } from '../data/bonusLeavePayrollData'

const BonusLeaveEncashmentList = () => {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [filteredClients, setFilteredClients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, pending, billed, draft
  const [error, setError] = useState(null)

  // Load clients with payroll data
  useEffect(() => {
    loadClientsData()
  }, [])

  // Filter clients based on search and status
  useEffect(() => {
    filterClientsData()
  }, [searchTerm, filterStatus, clients])

  const loadClientsData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      const clientsData = getClientsWithPayrollData()
      setClients(clientsData)
      setFilteredClients(clientsData)
    } catch (err) {
      console.error('Error loading clients:', err)
      setError('Failed to load payroll data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const filterClientsData = () => {
    try {
      let filtered = [...clients]

      // Apply search filter
      if (searchTerm.trim()) {
        filtered = filtered.filter(
          (client) =>
            client.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.period.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      // Apply status filter
      if (filterStatus !== 'all') {
        filtered = filtered.filter((client) => client.status === filterStatus)
      }

      setFilteredClients(filtered)
    } catch (err) {
      console.error('Error filtering clients:', err)
    }
  }

  const handleGenerateInvoice = (client) => {
    try {
      navigate('/dashboard/billing-manager/bonus-leave-encashment/form', {
        state: {
          client: client.client,
          period: client.period,
          hasBonus: client.hasBonus,
          hasLeaveEncashment: client.hasLeaveEncashment,
        },
      })
    } catch (err) {
      console.error('Error navigating to form:', err)
      setError('Failed to navigate to billing form.')
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        border: 'border-yellow-300',
        icon: <Clock className="w-3 h-3" />,
        label: 'Pending',
      },
      billed: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-300',
        icon: <CheckCircle className="w-3 h-3" />,
        label: 'Billed',
      },
      draft: {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-300',
        icon: <FileText className="w-3 h-3" />,
        label: 'Draft',
      },
    }

    const config = statusConfig[status] || statusConfig.pending

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
      >
        {config.icon}
        {config.label}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading payroll data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Bonus & Leave Encashment Billing
              </h1>
              <p className="text-sm text-gray-600">
                Generate invoices for bonus payments and leave encashments processed through payroll
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clients.filter((c) => c.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Billed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clients.filter((c) => c.status === 'billed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(clients.reduce((sum, c) => sum + c.totalAmount, 0))}
                </p>
              </div>
              <IndianRupee className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by client or period..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="billed">Billed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <button
            onClick={loadClientsData}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </button>
        </div>

        {/* Clients Table */}
        {filteredClients.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all'
                ? 'No records match your search criteria.'
                : 'No bonus or leave encashment data has been processed yet.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                      Components
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                      Employees
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredClients.map((client, index) => (
                    <tr key={index} className="hover:bg-purple-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Briefcase className="w-5 h-5 text-purple-600 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{client.client}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700">{client.period}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-2">
                          {client.hasBonus && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                              <Gift className="w-3 h-3" />
                              Bonus
                            </span>
                          )}
                          {client.hasLeaveEncashment && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                              <Briefcase className="w-3 h-3" />
                              Leave
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {client.bonusEmployeeCount + client.leaveEmployeeCount}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-sm font-bold text-gray-900">
                          {formatCurrency(client.totalAmount)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">{getStatusBadge(client.status)}</td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleGenerateInvoice(client)}
                          disabled={client.status === 'billed'}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                        >
                          <FileText className="w-4 h-4" />
                          Generate Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BonusLeaveEncashmentList
