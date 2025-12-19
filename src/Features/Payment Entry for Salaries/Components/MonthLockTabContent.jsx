import React from 'react'
import PaymentEntriesFilter from './PaymentEntriesFilter'
import AERejectionModal from './AERejectionModal'
import GLMappingModal from './GLMappingModal'

export default function MonthLockTabContent({
  // Filter & Pagination Props
  filters,
  setFilters,
  paginatedBatches,
  currentPage,
  totalPages,
  setCurrentPage,

  // Selection Props
  selectedIds,
  handleSelectAll,
  handleSelect,

  // Table Data & Expansion Props
  getTableData,
  expandedBatch,
  handleBatchClick,

  // Amount Editing Props
  editingAmount,
  handleAmountEdit,
  saveAmountEdit,
  cancelAmountEdit,

  // File & Batch Management Props
  handleDownloadExcel,
  handleReupload,
  handleDeleteBatch,
  handleFileReupload,
  fileInputRef,

  // Action Props
  handleApprove,
  openRejectModal,
  handleBulkApprove,

  // Modal Props - Rejection
  showRejectModal,
  setShowRejectModal,
  setRejectionReason,
  confirmReject,

  // Modal Props - GL Mapping
  showGLMappingModal,
  closeGLMappingModal,
  handleApproveFromModal,
  handleGLMappingSave,
  approvedBatchData,
  approvedBatches,
}) {
  return (
    <div className="w-full space-y-4 md:space-y-6">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-3 md:p-4">
        <PaymentEntriesFilter filters={filters} onChange={setFilters} />
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=". xlsx, .xls, .csv"
        onChange={handleFileReupload}
        className="hidden"
        aria-hidden="true"
      />

      {/* Table Container - Fixed overflow issue */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto -mx-3 md:mx-0">
          <table className="w-full table-auto text-xs sm:text-sm border-collapse">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-50 sticky top-0 z-10">
              <tr>
                <th className="p-2 sm:p-3 border border-gray-200 text-left">
                  <input
                    type="checkbox"
                    checked={
                      paginatedBatches.length > 0 &&
                      paginatedBatches.every((batch) => selectedIds.includes(batch.id))
                    }
                    onChange={handleSelectAll}
                    aria-label="Select all batches on this page"
                    className="cursor-pointer w-4 h-4"
                  />
                </th>
                <th className="p-2 sm:p-3 border border-gray-200 text-left font-semibold whitespace-nowrap">
                  Batch ID
                </th>
                <th className="p-2 sm:p-3 border border-gray-200 text-center font-semibold whitespace-nowrap">
                  Emp
                </th>
                <th className="p-2 sm: p-3 border border-gray-200 text-right font-semibold whitespace-nowrap">
                  Gross
                </th>
                <th className="p-2 sm:p-3 border border-gray-200 text-right font-semibold whitespace-nowrap">
                  Ded
                </th>
                <th className="p-2 sm:p-3 border border-gray-200 text-right font-semibold whitespace-nowrap">
                  Net
                </th>
                <th className="p-2 sm:p-3 border border-gray-200 text-right font-semibold whitespace-nowrap">
                  PF
                </th>
                <th className="p-2 sm:p-3 border border-gray-200 text-right font-semibold whitespace-nowrap">
                  ESIC
                </th>
                <th className="p-2 sm:p-3 border border-gray-200 text-right font-semibold whitespace-nowrap">
                  PT
                </th>
                <th className="p-2 sm:p-3 border border-gray-200 text-left font-semibold whitespace-nowrap">
                  Period
                </th>
                <th className="p-2 sm:p-3 border border-gray-200 text-center font-semibold whitespace-nowrap">
                  File
                </th>
                <th className="p-2 sm:p-3 border border-gray-200 text-center font-semibold whitespace-nowrap">
                  Status
                </th>
                <th className="p-2 sm:p-3 border border-gray-200 text-center font-semibold whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedBatches && paginatedBatches.length > 0 ? (
                paginatedBatches.map((batch) => {
                  const tableData = getTableData(batch)
                  return (
                    <React.Fragment key={batch.id}>
                      {/* Main Row */}
                      <tr className="hover:bg-gray-50 transition-colors duration-150">
                        {/* Checkbox */}
                        <td className="p-2 sm:p-3 border border-gray-200 text-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(batch.id)}
                            onChange={() => handleSelect(batch.id)}
                            disabled={batch.status !== 'Pending Approval'}
                            aria-label={`Select batch ${tableData.batchName}`}
                            className="cursor-pointer disabled:opacity-50 w-4 h-4"
                          />
                        </td>

                        {/* Batch Name */}
                        <td className="p-2 sm:p-3 border border-gray-200 font-medium text-gray-900 whitespace-nowrap text-xs sm:text-sm">
                          {tableData.batchName}
                        </td>

                        {/* Employee Count */}
                        <td className="p-2 sm:p-3 border border-gray-200 text-center text-gray-700 whitespace-nowrap">
                          {tableData.employeeCount}
                        </td>

                        {/* Gross Amount */}
                        <td className="p-2 sm: p-3 border border-gray-200 font-medium text-blue-600 text-right whitespace-nowrap text-xs sm:text-sm">
                          ₹{tableData.grossAmount.toLocaleString('en-IN')}
                        </td>

                        {/* Total Deductions */}
                        <td className="p-2 sm:p-3 border border-gray-200 text-red-600 text-right whitespace-nowrap text-xs sm: text-sm">
                          ₹{tableData.totalDeductions.toLocaleString('en-IN')}
                        </td>

                        {/* Net Payable with Edit */}
                        <td className="p-2 sm:p-3 border border-gray-200">
                          {editingAmount[batch.id] !== undefined ? (
                            <div className="flex items-center gap-1 justify-end">
                              <input
                                type="number"
                                value={editingAmount[batch.id]}
                                onChange={(e) => handleAmountEdit(batch.id, e.target.value)}
                                className="w-16 sm:w-20 px-1. 5 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                                aria-label="Edit net payable amount"
                              />
                              <button
                                onClick={() => saveAmountEdit(batch.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-1. 5 py-1 rounded text-xs font-medium transition-colors duration-200 flex-shrink-0"
                                title="Save"
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => cancelAmountEdit(batch.id)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-1.5 py-1 rounded text-xs font-medium transition-colors duration-200 flex-shrink-0"
                                title="Cancel"
                              >
                                ✗
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1">
                              <span className="font-bold text-green-600 whitespace-nowrap text-xs sm:text-sm">
                                ₹{tableData.netPayable.toLocaleString('en-IN')}
                              </span>
                              {tableData.status === 'Pending Approval' && (
                                <button
                                  onClick={() => handleAmountEdit(batch.id, tableData.netPayable)}
                                  className="text-blue-600 hover:text-blue-800 text-sm transition-colors duration-200 flex-shrink-0"
                                  title="Edit amount"
                                >
                                  ✏️
                                </button>
                              )}
                            </div>
                          )}
                        </td>

                        {/* PF Employee */}
                        <td className="p-2 sm:p-3 border border-gray-200 text-orange-600 text-right whitespace-nowrap text-xs sm:text-sm">
                          ₹{tableData.pfEmployee.toLocaleString('en-IN')}
                        </td>

                        {/* ESIC Employee */}
                        <td className="p-2 sm:p-3 border border-gray-200 text-purple-600 text-right whitespace-nowrap text-xs sm: text-sm">
                          ₹{tableData.esicEmployee.toLocaleString('en-IN')}
                        </td>

                        {/* PT */}
                        <td className="p-2 sm:p-3 border border-gray-200 text-pink-600 text-right whitespace-nowrap text-xs sm: text-sm">
                          ₹{tableData.pt.toLocaleString('en-IN')}
                        </td>

                        {/* Payroll Period */}
                        <td className="p-2 sm:p-3 border border-gray-200">
                          <button
                            onClick={() => handleBatchClick(batch.id)}
                            className="text-blue-600 hover:text-blue-800 underline text-left font-medium transition-colors duration-200 flex items-center gap-1 whitespace-nowrap text-xs sm:text-sm"
                            aria-expanded={expandedBatch === batch.id}
                          >
                            {batch.payrollPeriod}
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {expandedBatch === batch.id ? '▼' : '▶'}
                            </span>
                          </button>
                        </td>

                        {/* Download Button */}
                        <td className="p-2 sm:p-3 border border-gray-200">
                          <button
                            onClick={() => handleDownloadExcel(batch)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors duration-200 whitespace-nowrap"
                            title="Download Excel"
                          >
                            📥
                          </button>
                        </td>

                        {/* Status Badge */}
                        <td className="p-2 sm:p-3 border border-gray-200 text-center">
                          <span
                            className={`inline-flex px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                              tableData.status === 'Pending Approval'
                                ? 'bg-yellow-100 text-yellow-800'
                                : tableData.status === 'Approved'
                                  ? 'bg-green-100 text-green-800'
                                  : tableData.status === 'GL Mapped'
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {tableData.status === 'Pending Approval' ? 'Pending' : tableData.status}
                          </span>
                        </td>

                        {/* Action Buttons */}
                        <td className="p-2 sm:p-3 border border-gray-200">
                          <div className="flex flex-col gap-1">
                            {tableData.status === 'Pending Approval' ? (
                              <>
                                <button
                                  onClick={() => handleApprove(batch.id)}
                                  className="w-full bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors duration-200 whitespace-nowrap"
                                  title="Approve batch"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => openRejectModal(batch.id)}
                                  className="w-full bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors duration-200 whitespace-nowrap"
                                  title="Reject batch"
                                >
                                  Reject
                                </button>
                                <button
                                  onClick={() => handleReupload(batch.id)}
                                  className="w-full bg-orange-600 hover:bg-orange-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors duration-200 whitespace-nowrap"
                                  title="Reupload file"
                                >
                                  🔄 Reup
                                </button>
                                <button
                                  onClick={() => handleDeleteBatch(batch.id)}
                                  className="w-full bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors duration-200 whitespace-nowrap"
                                  title="Delete batch"
                                >
                                  🗑️ Del
                                </button>
                              </>
                            ) : tableData.status === 'Approved' ? (
                              <button
                                onClick={() => handleApprove(batch.id)}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors duration-200 whitespace-nowrap"
                                title="Map GL accounts"
                              >
                                Map GL
                              </button>
                            ) : (
                              <span className="text-xs italic text-gray-500 text-center py-1">
                                Done
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Employee Details Row */}
                      {expandedBatch === batch.id && (
                        <tr className="bg-gray-50">
                          <td colSpan="13" className="p-0 border-0">
                            <div className="p-3 md:p-4">
                              <h4 className="font-semibold text-sm md:text-base mb-3 text-gray-800">
                                Employee Details ({tableData.employees.length} employees)
                              </h4>
                              <div className="overflow-x-auto rounded border border-gray-200">
                                <table className="w-full text-xs border-collapse">
                                  <thead className="bg-gray-100 sticky top-0 z-5">
                                    <tr>
                                      <th className="p-2 border border-gray-200 text-left">
                                        Emp Code
                                      </th>
                                      <th className="p-2 border border-gray-200 text-left">Name</th>
                                      <th className="p-2 border border-gray-200 text-left">Desg</th>
                                      <th className="p-2 border border-gray-200 text-right">
                                        Basic
                                      </th>
                                      <th className="p-2 border border-gray-200 text-right">HRA</th>
                                      <th className="p-2 border border-gray-200 text-right">
                                        Conv
                                      </th>
                                      <th className="p-2 border border-gray-200 text-right">
                                        Gross
                                      </th>
                                      <th className="p-2 border border-gray-200 text-right">PF</th>
                                      <th className="p-2 border border-gray-200 text-right">
                                        ESIC
                                      </th>
                                      <th className="p-2 border border-gray-200 text-right">PT</th>
                                      <th className="p-2 border border-gray-200 text-right">Ded</th>
                                      <th className="p-2 border border-gray-200 text-right">Net</th>
                                      <th className="p-2 border border-gray-200 text-left">
                                        Account
                                      </th>
                                      <th className="p-2 border border-gray-200 text-left">IFSC</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {tableData.employees.map((employee, index) => (
                                      <tr
                                        key={index}
                                        className="hover:bg-gray-100 transition-colors duration-150"
                                      >
                                        <td className="p-2 border border-gray-200 font-medium text-gray-900">
                                          {employee.empCode}
                                        </td>
                                        <td className="p-2 border border-gray-200 text-gray-700">
                                          {employee.name}
                                        </td>
                                        <td className="p-2 border border-gray-200 text-gray-700 text-xs">
                                          {employee.designation?.substring(0, 10)}
                                        </td>
                                        <td className="p-2 border border-gray-200 text-right text-gray-700">
                                          ₹{employee.basic.toLocaleString('en-IN')}
                                        </td>
                                        <td className="p-2 border border-gray-200 text-right text-gray-700">
                                          ₹{employee.hra.toLocaleString('en-IN')}
                                        </td>
                                        <td className="p-2 border border-gray-200 text-right text-gray-700">
                                          ₹{employee.conveyance.toLocaleString('en-IN')}
                                        </td>
                                        <td className="p-2 border border-gray-200 text-right font-medium text-blue-600">
                                          ₹{employee.grossAmount.toLocaleString('en-IN')}
                                        </td>
                                        <td className="p-2 border border-gray-200 text-right text-orange-600">
                                          ₹{employee.pf.toLocaleString('en-IN')}
                                        </td>
                                        <td className="p-2 border border-gray-200 text-right text-purple-600">
                                          ₹{employee.esic.toLocaleString('en-IN')}
                                        </td>
                                        <td className="p-2 border border-gray-200 text-right text-pink-600">
                                          ₹{employee.pt.toLocaleString('en-IN')}
                                        </td>
                                        <td className="p-2 border border-gray-200 text-right text-red-600">
                                          ₹{employee.totalDeductions.toLocaleString('en-IN')}
                                        </td>
                                        <td className="p-2 border border-gray-200 text-right font-bold text-green-600">
                                          ₹{employee.netPayable.toLocaleString('en-IN')}
                                        </td>
                                        <td className="p-2 border border-gray-200 text-gray-700 text-xs">
                                          {employee.account?.substring(0, 10)}
                                        </td>
                                        <td className="p-2 border border-gray-200 text-gray-700 text-xs">
                                          {employee.ifsc}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="13" className="p-6 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-sm">No payroll batches found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Approve Button */}
      {selectedIds.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 flex justify-end">
          <button
            onClick={handleBulkApprove}
            className="bg-green-700 hover:bg-green-800 text-white px-4 md:px-6 py-2 rounded font-medium transition-colors duration-200 flex items-center gap-2 text-sm md:text-base"
          >
            <span>✓</span>
            <span>Approve Selected ({selectedIds.length})</span>
          </button>
        </div>
      )}

      {/* Pagination */}
      <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 flex justify-between items-center flex-wrap gap-3">
        <div className="text-xs md:text-sm text-gray-600">
          <span>
            Page <strong className="text-gray-900">{currentPage}</strong> of{' '}
            <strong className="text-gray-900">{totalPages || 1}</strong>
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm font-medium transition-colors duration-200"
          >
            ← Prev
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages || 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm font-medium transition-colors duration-200"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Rejection Modal */}
      <AERejectionModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onSubmit={{
          reasonChange: setRejectionReason,
          confirm: confirmReject,
        }}
      />

      {/* GL Mapping Modal */}
      <GLMappingModal
        isOpen={showGLMappingModal}
        onClose={closeGLMappingModal}
        onApprove={handleApproveFromModal}
        onSave={handleGLMappingSave}
        batchData={approvedBatchData}
        approvedBatches={approvedBatches}
      />
    </div>
  )
}
