/* eslint-disable no-unsafe-finally */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../Components/SearchBar'
import ReportTabs from '../Components/ReportTabs'
import SystemDataAnalyzer from '../utils/SystemDataAnalyzer'
import { analyzeTransactionData } from '../Services/PLReportDataService'

const ReportsDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const navigate = useNavigate()

  const handleViewReport = (periodData) => {
    if (periodData) {
      navigate('/reports/pnl-view', { state: { periodData } })
    }
  }

  // Effect to load data
  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        setLoading(true)

        // Analyze system data (vendors, clients, states)
        SystemDataAnalyzer.printSystemSummary()

        // Analyze transaction data completeness and filtering
        // To analyze with a specific period and filters, pass an object like:
        // analyzeTransactionData({ month: 1, year: 2025, clientName: 'All', stateName: 'All' })
        console.log('\n\n')
        analyzeTransactionData() // Analyzes all transactions without filtering

        // Simulate async load (e.g., available reports, user permissions)
        await new Promise((r) => setTimeout(r, 300))
        if (!mounted) return
        setError(null)
      } catch (err) {
        console.error('ReportsDashboard load error', err)
        if (!mounted) return
        setError('Failed to load reports')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const handleSearch = (term) => {
    try {
      setSearchTerm(term)
      // In production this would filter available reports or call API
      console.log('Reports search:', term)
    } catch (err) {
      console.error('handleSearch error', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          <p className="text-sm text-gray-600">Browse and generate financial reports</p>
        </div>

        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-green-400 border-t-transparent rounded-full" />
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-600">{error}</div>
          ) : (
            <ReportTabs initial={searchTerm ? 'pnl' : 'pnl'} onView={handleViewReport} />
          )}
        </div>
      </div>
    </div>
  )
}

export default ReportsDashboard
