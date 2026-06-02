import { useMemo, useState } from 'react'
import { FiAlertCircle, FiCheckCircle, FiDownload, FiFileText, FiUpload } from 'react-icons/fi'
import { downloadFDDReport, uploadFDDHistoricalData } from '../Services/fddReportService'

const ACCEPTED_TYPES = '.xlsx,.xls,.xlsb'

const formatFileSize = (bytes) => {
  if (!bytes) return '0 KB'
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

const FDDReportPage = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [lastUpload, setLastUpload] = useState(null)

  const fileMeta = useMemo(() => {
    if (!selectedFile) return null
    return {
      name: selectedFile.name,
      size: formatFileSize(selectedFile.size),
      type: selectedFile.type || 'application/octet-stream',
    }
  }, [selectedFile])

  const handleFileChange = (event) => {
    try {
      const file = event.target.files?.[0]
      setSelectedFile(file || null)
      setStatus({ type: '', message: '' })
    } catch (error) {
      console.error('FDDReportPage: file change error', error)
      setStatus({ type: 'error', message: 'Failed to read the selected file.' })
    }
  }

  const handleUpload = async () => {
    try {
      if (!selectedFile) {
        setStatus({ type: 'error', message: 'Please select a file before uploading.' })
        return
      }

      setUploading(true)
      setStatus({ type: '', message: '' })

      const result = await uploadFDDHistoricalData(selectedFile)
      setLastUpload(result)
      setStatus({ type: 'success', message: 'Upload completed. Previous data has been replaced.' })
    } catch (error) {
      console.error('FDDReportPage: upload error', error)
      setStatus({ type: 'error', message: error.message || 'Upload failed. Please try again.' })
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = async () => {
    try {
      setDownloading(true)
      setStatus({ type: '', message: '' })

      await downloadFDDReport()
      setStatus({ type: 'success', message: 'Report download started.' })
    } catch (error) {
      console.error('FDDReportPage: download error', error)
      setStatus({ type: 'error', message: error.message || 'Download failed. Please try again.' })
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl border border-green-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-green-800">Financial Due Diligence (FDD)</h1>
              <p className="mt-1 text-sm text-green-700">
                Upload last two financial years and download a combined 3-year report.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs text-green-700">
              <FiFileText className="h-4 w-4" />
              <span>API-ready UI</span>
            </div>
          </div>
        </div>

        {status.message && (
          <div
            className={`rounded-xl border p-4 text-sm ${
              status.type === 'error'
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-green-200 bg-green-50 text-green-700'
            }`}
          >
            <div className="flex items-start gap-2">
              {status.type === 'error' ? (
                <FiAlertCircle className="mt-0.5 h-4 w-4" />
              ) : (
                <FiCheckCircle className="mt-0.5 h-4 w-4" />
              )}
              <span>{status.message}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-green-200 bg-white p-5 shadow-sm xl:col-span-2">
            <div className="flex items-center gap-2">
              <FiUpload className="h-5 w-5 text-green-700" />
              <h2 className="text-lg font-semibold text-green-800">1. Upload previous two FY data</h2>
            </div>
            <p className="mt-2 text-sm text-green-700">
              Upload a full-year Excel file (Apr to Mar). Re-uploads will replace existing data.
            </p>

            <div className="mt-4 rounded-xl border-2 border-dashed border-green-300 bg-green-50 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Select Excel file</p>
                  <p className="text-xs text-green-700">Accepted: .xls, .xlsx, .xlsb</p>
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-green-600 bg-white px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-100">
                  <FiUpload className="h-4 w-4" />
                  <span>Choose File</span>
                  <input
                    type="file"
                    accept={ACCEPTED_TYPES}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="mt-4 rounded-lg border border-green-200 bg-white p-3 text-sm text-green-800">
                {fileMeta ? (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-gray-500">File Name</p>
                      <p className="truncate font-semibold text-gray-800">{fileMeta.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">File Size</p>
                      <p className="font-semibold text-gray-800">{fileMeta.size}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">File Type</p>
                      <p className="font-semibold text-gray-800">{fileMeta.type}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No file selected.</p>
                )}
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-3 text-sm font-semibold text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                type="button"
              >
                {uploading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <FiUpload className="h-4 w-4" />
                    <span>Upload FY Data</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-green-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <FiDownload className="h-5 w-5 text-green-700" />
                <h2 className="text-lg font-semibold text-green-800">2. Download combined report</h2>
              </div>
              <p className="mt-2 text-sm text-green-700">
                Download a single Excel file that combines FY-2, FY-1, and current FY data.
              </p>

              <button
                onClick={handleDownload}
                disabled={downloading}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
              >
                {downloading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Preparing Excel...</span>
                  </>
                ) : (
                  <>
                    <FiDownload className="h-4 w-4" />
                    <span>Download FDD Excel</span>
                  </>
                )}
              </button>
            </div>

            <div className="rounded-2xl border border-green-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-green-800">Upload history</h3>
              {lastUpload ? (
                <div className="mt-3 space-y-2 text-sm text-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Last file</span>
                    <span className="font-semibold text-gray-800">{lastUpload.fileName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Uploaded</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(lastUpload.uploadedAt).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">File size</span>
                    <span className="font-semibold text-gray-800">{formatFileSize(lastUpload.size)}</span>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-gray-500">No uploads yet.</p>
              )}
            </div>

            <div className="rounded-2xl border border-green-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-green-800">How it works</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>Upload full-year data for FY-2 and FY-1.</li>
                <li>Current FY is pulled from master data.</li>
                <li>Backend applies formulas and generates 15 to 20 sheets.</li>
                <li>Download a combined Excel for all three FYs.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FDDReportPage
