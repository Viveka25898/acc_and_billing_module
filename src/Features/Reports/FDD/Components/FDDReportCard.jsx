import { FiArrowRight, FiDownload, FiFileText, FiUpload } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const FDDReportCard = () => {
  const navigate = useNavigate()

  const handleOpen = () => {
    try {
      navigate('/dashboard/account-manager/fdd-report')
    } catch (error) {
      console.error('FDDReportCard: navigation error', error)
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-green-600 to-blue-600" />

      <div className="p-5 space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-3 bg-green-50 rounded-lg border border-green-200">
            <FiFileText className="w-7 h-7 text-green-700" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-800">Financial Due Diligence (FDD)</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Upload last two FYs and download a combined 3-year report.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            { label: 'Upload FY-2, FY-1', icon: FiUpload },
            { label: 'Pull current FY', icon: FiFileText },
            { label: 'Download Excel', icon: FiDownload },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 bg-gray-50 rounded-md px-3 py-2 border border-gray-100"
            >
              <item.icon className="w-4 h-4 text-green-700" />
              <span className="text-xs text-gray-600 truncate">{item.label}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleOpen}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
        >
          <span>Open FDD Report</span>
          <FiArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-xs text-gray-400">API ready UI, backend will handle validation.</p>
      </div>
    </div>
  )
}

export default FDDReportCard
