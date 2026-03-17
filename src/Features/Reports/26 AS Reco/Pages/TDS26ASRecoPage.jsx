import { useMemo, useState } from 'react'
import TDS26ASRecoCard from '../Components/TDS26ASRecoCard'
import {
  RECO_STATUS,
  TDS26ASDataGateway,
  reconcile26ASData,
} from '../services/tds26asReconciliationService'
import {
  exportFullReconciliationExcel,
  exportSingleStatusExcel,
} from '../services/tds26asExportService'

const statusTabs = [
  { label: 'Matched', key: RECO_STATUS.MATCHED },
  { label: 'Partially Matched', key: RECO_STATUS.PARTIAL },
  { label: 'Unmatched', key: RECO_STATUS.UNMATCHED },
  { label: 'Pending', key: RECO_STATUS.PENDING },
]

const currency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(
    Number(amount || 0)
  )

const getCurrentFYStart = () => {
  const today = new Date()
  const year = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1
  return new Date(year, 3, 1).toISOString().slice(0, 10)
}

const TDS26ASRecoPage = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadRows, setUploadRows] = useState([])
  const [uploadMeta, setUploadMeta] = useState({ fileName: '', rows: 0 })
  const [startDate, setStartDate] = useState(getCurrentFYStart())
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10))
  const [activeTab, setActiveTab] = useState(RECO_STATUS.MATCHED)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [report, setReport] = useState(null)

  const currentRows = report?.grouped?.[activeTab] || []

  const totals = useMemo(() => {
    const rows = currentRows || []
    return rows.reduce(
      (acc, row) => {
        acc.books += Number(row.booksAmount || 0)
        acc.form26as += Number(row.form26ASAmount || 0)
        return acc
      },
      { books: 0, form26as: 0 }
    )
  }, [currentRows])

  const handleUseSampleData = async () => {
    setError('')
    const rows = await TDS26ASDataGateway.fetchSample26ASRows()
    setUploadRows(rows)
    setSelectedFile(null)
    setUploadMeta({ fileName: 'sample-26as-dataset.json', rows: rows.length })
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setError('')
    setReport(null)

    try {
      const rows = await TDS26ASDataGateway.parseUploadFile(file)
      if (!rows.length) {
        throw new Error('No valid rows found in uploaded file')
      }
      setUploadRows(rows)
      setUploadMeta({ fileName: file.name, rows: rows.length })
    } catch (uploadError) {
      setUploadRows([])
      setUploadMeta({ fileName: '', rows: 0 })
      setError(uploadError.message || 'Upload failed')
    }
  }

  const handleReconcile = async () => {
    if (!uploadRows.length) {
      setError('Please upload a statement or load sample data before reconciliation')
      return
    }

    setLoading(true)
    setError('')

    try {
      const bookEntries = await TDS26ASDataGateway.fetchBookEntries()
      const result = reconcile26ASData({
        bookEntries,
        form26ASRows: uploadRows,
        startDate,
        endDate,
      })
      setReport(result)
      setActiveTab(RECO_STATUS.MATCHED)
    } catch (recoError) {
      setReport(null)
      setError(recoError.message || 'Reconciliation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleExportStatus = (status) => {
    if (!report) return
    exportSingleStatusExcel({
      status,
      rows: report.grouped[status],
      meta: report.meta,
    })
  }

  const handleExportAll = () => {
    if (!report) return
    exportFullReconciliationExcel({
      grouped: report.grouped,
      summary: report.summary,
      meta: report.meta,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl border border-green-200 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-green-800">TDS 26AS Reconciliation</h1>
          <p className="mt-1 text-sm text-green-700">
            Upload statement, select date range, reconcile, and export every report in Excel.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-green-200 bg-white p-5 shadow-sm xl:col-span-2">
            <h2 className="text-lg font-semibold text-green-800">1. Upload Statement</h2>
            <div className="mt-4 rounded-xl border-2 border-dashed border-green-300 bg-green-50 p-5 text-center">
              <p className="text-sm text-green-700">Upload 26AS file (CSV or JSON)</p>
              <input
                type="file"
                accept=".csv,.json"
                onChange={handleFileUpload}
                className="mt-3 block w-full cursor-pointer rounded-lg border border-green-200 bg-white p-2 text-sm"
              />
              <button
                onClick={handleUseSampleData}
                className="mt-3 rounded-lg border border-green-600 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-100"
                type="button"
              >
                Load Sample Edge-Case Data
              </button>
              <p className="mt-3 text-xs text-green-700">
                {uploadMeta.fileName
                  ? `Loaded: ${uploadMeta.fileName} (${uploadMeta.rows} rows)`
                  : 'No file loaded'}
              </p>
              {selectedFile ? (
                <p className="mt-1 text-xs text-green-700">Selected file: {selectedFile.name}</p>
              ) : null}
            </div>

            <h2 className="mt-6 text-lg font-semibold text-green-800">2. Date Range for Reconciliation</h2>
            <p className="mt-1 text-xs text-green-700">
              Financial Year follows April to March. End Date should be the 26AS download date.
            </p>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-sm font-medium text-green-800">
                Start Date
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-green-200 bg-white p-2"
                />
              </label>
              <label className="text-sm font-medium text-green-800">
                End Date (26AS Download Date)
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-green-200 bg-white p-2"
                />
              </label>
            </div>

            <div className="mt-5">
              <button
                onClick={handleReconcile}
                disabled={loading}
                className="w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
                type="button"
              >
                {loading ? 'Reconciling...' : '3. Reconcile'}
              </button>
            </div>

            {error ? <p className="mt-3 rounded-lg bg-red-50 p-2 text-sm text-red-700">{error}</p> : null}
          </div>

          <div className="rounded-2xl border border-green-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-green-800">Export Center</h2>
            <p className="mt-1 text-xs text-green-700">Export each report or full workbook.</p>

            <div className="mt-4 grid grid-cols-1 gap-2">
              {statusTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleExportStatus(tab.key)}
                  disabled={!report}
                  className="rounded-lg border border-green-300 bg-white px-3 py-2 text-sm font-medium text-green-800 hover:bg-green-50 disabled:opacity-50"
                  type="button"
                >
                  Export {tab.label}
                </button>
              ))}
              <button
                onClick={handleExportAll}
                disabled={!report}
                className="mt-2 rounded-lg bg-green-700 px-3 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
                type="button"
              >
                Export Full Reconciliation
              </button>
            </div>
          </div>
        </div>

        {report ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <TDS26ASRecoCard
                title="Matched"
                value={report.summary.matchedCount}
                subValue={currency(report.grouped[RECO_STATUS.MATCHED].reduce((s, r) => s + (r.form26ASAmount || 0), 0))}
                tone="green"
              />
              <TDS26ASRecoCard
                title="Partially Matched"
                value={report.summary.partialCount}
                subValue={currency(report.grouped[RECO_STATUS.PARTIAL].reduce((s, r) => s + Math.abs(r.difference || 0), 0))}
                tone="yellow"
              />
              <TDS26ASRecoCard
                title="Unmatched"
                value={report.summary.unmatchedCount}
                subValue={currency(report.grouped[RECO_STATUS.UNMATCHED].reduce((s, r) => s + Math.abs(r.difference || 0), 0))}
                tone="red"
              />
              <TDS26ASRecoCard
                title="Pending"
                value={report.summary.pendingCount}
                subValue={`FY ${report.summary.financialYear}`}
                tone="gray"
              />
            </div>

            <div className="rounded-2xl border border-green-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-green-800">4. Reconciliation Report</h2>
                  <p className="text-xs text-green-700">
                    Books: {currency(report.summary.booksTotal)} | 26AS: {currency(report.summary.form26ASTotal)} |
                    Difference: {currency(report.summary.difference)}
                  </p>
                </div>
                <p className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                  FY {report.summary.financialYear}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {statusTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      activeTab === tab.key
                        ? 'bg-green-700 text-white'
                        : 'border border-green-300 bg-white text-green-800 hover:bg-green-50'
                    }`}
                    type="button"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="min-w-[980px] w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-green-100 text-left text-green-900">
                      <th className="border border-green-200 px-3 py-2">Status</th>
                      <th className="border border-green-200 px-3 py-2">Deductor</th>
                      <th className="border border-green-200 px-3 py-2">TAN</th>
                      <th className="border border-green-200 px-3 py-2">Section</th>
                      <th className="border border-green-200 px-3 py-2">Quarter</th>
                      <th className="border border-green-200 px-3 py-2">Books Amount</th>
                      <th className="border border-green-200 px-3 py-2">26AS Amount</th>
                      <th className="border border-green-200 px-3 py-2">Difference</th>
                      <th className="border border-green-200 px-3 py-2">Books Date</th>
                      <th className="border border-green-200 px-3 py-2">26AS Date</th>
                      <th className="border border-green-200 px-3 py-2">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!currentRows.length ? (
                      <tr>
                        <td colSpan={11} className="border border-green-200 px-3 py-6 text-center text-green-700">
                          No records for this status.
                        </td>
                      </tr>
                    ) : (
                      currentRows.map((row, index) => (
                        <tr key={`${activeTab}-${row.id || index}`} className="odd:bg-white even:bg-green-50/40">
                          <td className="border border-green-100 px-3 py-2 font-semibold text-green-800">
                            {row.status}
                          </td>
                          <td className="border border-green-100 px-3 py-2">{row.deductorName || '-'}</td>
                          <td className="border border-green-100 px-3 py-2">{row.tan || '-'}</td>
                          <td className="border border-green-100 px-3 py-2">{row.section || '-'}</td>
                          <td className="border border-green-100 px-3 py-2">
                            {row.quarter || row.month || '-'}
                          </td>
                          <td className="border border-green-100 px-3 py-2">{currency(row.booksAmount)}</td>
                          <td className="border border-green-100 px-3 py-2">{currency(row.form26ASAmount)}</td>
                          <td className="border border-green-100 px-3 py-2">{currency(row.difference)}</td>
                          <td className="border border-green-100 px-3 py-2">{row.booksDate || '-'}</td>
                          <td className="border border-green-100 px-3 py-2">{row.form26ASDate || '-'}</td>
                          <td className="border border-green-100 px-3 py-2">{row.reason || '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">
                Current Tab Totals: Books {currency(totals.books)} | 26AS {currency(totals.form26as)}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default TDS26ASRecoPage
