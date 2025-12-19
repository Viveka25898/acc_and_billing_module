const SalaryPaymentTab = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="text-green-600 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Salary Payment Requests</h3>
        <p className="text-gray-600 mb-6">
          This section will display salary payment approval requests. Configure the settings to get
          started.
        </p>
        <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
          <p>Pending requests will appear here once configured.</p>
        </div>
      </div>
    </div>
  )
}
export default SalaryPaymentTab
