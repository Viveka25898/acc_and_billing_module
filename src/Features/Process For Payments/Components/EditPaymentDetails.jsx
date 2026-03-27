import React, { useState } from 'react'
import { FaSave, FaTimes, FaPlus, FaTrash } from 'react-icons/fa'
import { toast } from 'react-toastify'

const EditPaymentDetails = ({ data, setData, onCancel }) => {
  // Use local copy of data for editing
  const [editedData, setEditedData] = useState([...data])

  const handleInputChange = (index, field, value) => {
    const updatedData = [...editedData]
    updatedData[index][field] = value
    setEditedData(updatedData)
  }

  const handleDeleteRow = (index) => {
    if (editedData.length === 1) {
      toast.warning('Cannot delete the last row.')
      return
    }
    const updatedData = editedData.filter((_, i) => i !== index)
    setEditedData(updatedData)
  }

  const handleAddRow = () => {
    setEditedData([
      ...editedData,
      { 'Vendor Name': '', 'Invoice Numbers': '', 'Payment Done': '' },
    ])
  }

  const handleSave = () => {
    // Validate rows
    const hasErrors = editedData.some(
      (row) =>
        !row['Vendor Name']?.trim() ||
        !row['Invoice Numbers']?.trim() ||
        isNaN(Number(row['Payment Done'])) ||
        Number(row['Payment Done']) <= 0
    )

    if (hasErrors) {
      toast.error('Please fix empty fields or invalid amounts before saving.')
      return
    }

    // Clean amounts
    const cleanData = editedData.map((row) => ({
      ...row,
      'Payment Done': Number(row['Payment Done']),
    }))

    setData(cleanData)
    toast.success('Payment details updated successfully.')
    onCancel() // Will close the edit view
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 flex justify-between items-center text-white">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="bg-white/20 p-1.5 rounded-lg text-sm">✏️</span>
              Edit Payment Details
            </h2>
            <p className="text-green-100 text-sm mt-1">
              Modify uploaded Excel data before processing
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Editing Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-gray-50/50">
          <div className="space-y-4">
            {editedData.map((row, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 relative group flex flex-col md:flex-row gap-4 items-start md:items-center focus-within:ring-2 focus-within:ring-green-400 focus-within:border-transparent transition-all"
              >
                <div className="absolute -left-3 -top-3 w-6 h-6 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-xs font-bold border border-gray-200 shadow-sm z-10">
                  {index + 1}
                </div>

                <div className="flex-1 w-full space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Vendor Name
                  </label>
                  <input
                    type="text"
                    value={row['Vendor Name'] || ''}
                    onChange={(e) => handleInputChange(index, 'Vendor Name', e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm px-3 py-2 border"
                  />
                </div>

                <div className="flex-1 w-full space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Invoice Numbers
                  </label>
                  <input
                    type="text"
                    value={row['Invoice Numbers'] || ''}
                    onChange={(e) => handleInputChange(index, 'Invoice Numbers', e.target.value)}
                    placeholder="e.g. INV-001, INV-002"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm px-3 py-2 border font-mono"
                  />
                </div>

                <div className="w-full md:w-48 space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={row['Payment Done'] || ''}
                    onChange={(e) => handleInputChange(index, 'Payment Done', e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm px-3 py-2 border text-right font-medium"
                  />
                </div>

                <div className="pt-6 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDeleteRow(index)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    title="Delete Row"
                  >
                    <FaTrash />
                  </button>
                </div>
                {/* Mobile delete button */}
                <button
                  onClick={() => handleDeleteRow(index)}
                  className="md:hidden absolute top-4 right-4 text-red-400 p-1"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleAddRow}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 rounded-full border border-green-200 transition-colors shadow-sm"
            >
              <FaPlus size={12} />
              Add Another Row
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-100 bg-white p-4 flex justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white font-semibold text-sm rounded-xl hover:bg-green-700 hover:shadow active:scale-95 transition-all shadow-sm"
          >
            <FaSave />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditPaymentDetails
