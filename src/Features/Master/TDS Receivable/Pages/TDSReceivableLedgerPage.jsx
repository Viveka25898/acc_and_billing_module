/* eslint-disable no-unused-vars */
// TDS Receivable Ledger Page — max-w-5xl, green theme
import { useState } from 'react'
import TDSReceivableLedgerHeader from '../Components/TDSReceivableLedgerHeader'
import TDSReceivableLedgerTable from '../Components/TDSReceivableLedgerTable'
import TDSReceivableLedgerFooter from '../Components/TDSReceivableLedgerFooter'
import { tdsReceivableEntries, tdsReceivableLedgerInfo } from '../data/tdsReceivableDummyData'

const TDSReceivableLedgerPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sectionFilter, setSectionFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [quarterFilter, setQuarterFilter] = useState('All')

  const sections = ['All', ...new Set(tdsReceivableEntries.map((e) => e.section))]
  const quarters = ['All', ...new Set(tdsReceivableEntries.map((e) => e.quarter).filter(Boolean))]

  const filteredEntries = tdsReceivableEntries.filter((entry) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      !term ||
      entry.clientName.toLowerCase().includes(term) ||
      (entry.clientTAN && entry.clientTAN.toLowerCase().includes(term)) ||
      (entry.clientPAN && entry.clientPAN.toLowerCase().includes(term)) ||
      (entry.voucherNo && entry.voucherNo.toLowerCase().includes(term)) ||
      entry.particulars.toLowerCase().includes(term)

    const matchesSection = sectionFilter === 'All' || entry.section === sectionFilter
    const matchesQuarter = quarterFilter === 'All' || entry.quarter === quarterFilter

    return matchesSearch && matchesSection && matchesQuarter
  })


  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      {/* max-w-5xl as requested */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">

        {/* ── HEADING ── */}
        <TDSReceivableLedgerHeader ledgerInfo={tdsReceivableLedgerInfo} />

        {/* ── TOOLBAR ── */}
        <div className="px-5 py-3 border-b border-green-100 bg-white flex flex-wrap gap-3 items-center justify-between">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by client, TAN, PAN, voucher…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 w-60"
          />

          {/* Filters + Print */}
          <div className="flex flex-wrap gap-2 items-center">
            <FilterSelect label="Section" value={sectionFilter} onChange={setSectionFilter} options={sections} />
            <FilterSelect label="Quarter" value={quarterFilter} onChange={setQuarterFilter} options={quarters} />
          </div>

          {/* Count */}
          <div className="text-xs text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filteredEntries.length}</span> of{' '}
            <span className="font-semibold text-gray-700">{tdsReceivableEntries.length}</span> entries
          </div>
        </div>

        {/* ── TABLE ── */}
        <TDSReceivableLedgerTable entries={filteredEntries} />

        {/* ── FOOTER ── */}
        <TDSReceivableLedgerFooter entries={filteredEntries} />
      </div>
    </div>
  )
}

const FilterSelect = ({ label, value, onChange, options }) => (
  <div className="flex items-center gap-1.5">
    <span className="text-xs text-gray-500 font-medium">{label}:</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
)

export default TDSReceivableLedgerPage
