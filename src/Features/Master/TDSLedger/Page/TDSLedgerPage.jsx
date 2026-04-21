// src/features/Master/TDS Ledger/Pages/TDSLedgerPage.jsx
import { useState, useEffect } from 'react'
import CompanyInfo from '../Components/CompanyInfo'
import ActionButtons from '../Components/ActionButtons'
import LedgerHeader from '../Components/LedgerHeader'
import { MobileCard } from '../Components/MobileCard'
import { DesktopTable } from '../Components/Desktop'
import { Summary } from '../Components/Summery'
import TDSRealDataService from '../../utils/TDSLedgerService'

export default function 
TDSLedgerPage() {
  const [expandedCards, setExpandedCards] = useState({})
  const [tdsData, setTdsData] = useState([])
  const [companyInfo, setCompanyInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadRealTDSData()
  }, [])

  const loadRealTDSData = () => {
    setLoading(true)
    setError(null)

    try {
      const { tdsData: realTdsData, companyInfo: realCompanyInfo } =
        TDSRealDataService.getRealTDSData()

      if (realTdsData.length === 0) {
        setError('No TDS transactions found. Please process some invoices with TDS first.')
      }

      setTdsData(realTdsData)
      setCompanyInfo(realCompanyInfo)
    } catch (error) {
      console.error('Error loading TDS data:', error)
      setError('Failed to load TDS data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleCard = (lineNo) => {
    setExpandedCards((prev) => ({
      ...prev,
      [lineNo]: !prev[lineNo],
    }))
  }

  const handleRefresh = () => {
    loadRealTDSData()
  }

  const handleExport = () => {
    // Export functionality
    console.log('Exporting TDS data...')
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading TDS Ledger Data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No TDS Data Found</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh Data
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden my-4 md:my-8">
        <LedgerHeader />

        {companyInfo && <CompanyInfo info={companyInfo} />}

        <ActionButtons
          onRefresh={handleRefresh}
          onExport={handleExport}
          onPrint={handlePrint}
          dataCount={tdsData.length}
        />

        {/* Data Status */}
        <div className="px-6 py-3 bg-blue-50 border-b">
          <div className="flex justify-between items-center">
            <div className="text-sm text-blue-700">
              Showing <span className="font-bold">{tdsData.length}</span> TDS transactions
            </div>
            <div className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="block lg:hidden px-4 py-4">
          {tdsData.map((entry) => (
            <MobileCard
              key={entry.lineNo}
              entry={entry}
              isExpanded={expandedCards[entry.lineNo]}
              onToggle={() => toggleCard(entry.lineNo)}
            />
          ))}

          {tdsData.length === 0 && (
            <div className="text-center py-8 text-gray-500">No TDS transactions to display</div>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block px-6 py-4">
          {tdsData.length > 0 ? (
            <DesktopTable data={tdsData} />
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-600">No TDS transactions found</p>
            </div>
          )}
        </div>

        {tdsData.length > 0 && <Summary data={tdsData} />}
      </div>
    </div>
  )
}
