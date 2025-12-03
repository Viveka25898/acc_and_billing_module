/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

export default function POForm({ onSubmit }) {
  const initialFormState = {
    poNumber: '',
    vendorName: '',
    newVendorName: '',
    poType: '',
    expenseType: '',
    description: '',
    amount: '',
    attachment: null,
    startDate: '',
    endDate: '',
    tdsSection: '',
  }

  const [formData, setFormData] = useState(initialFormState)
  const [isNewVendor, setIsNewVendor] = useState(false)
  const [tdsSections, setTdsSections] = useState([])

  // Existing vendors list
  const existingVendors = [
    'Vendor 1',
    'Vendor 2',
    'Vendor 3',
    'ABC Solutions Pvt Ltd',
    'XYZ Consultancy Services',
    'Tech Support India',
    'Legal Associates',
    'Audit & Co.',
    'Cleaning Services Ltd',
    'Security Solutions',
  ]

  // Auto-generate PO number on component mount
  useEffect(() => {
    const generatePONumber = () => {
      const currentYear = new Date().getFullYear()
      const randomNum = Math.floor(Math.random() * 9000) + 1000 // 4 digit random number
      return `PO-${currentYear}-${randomNum}`
    }

    setFormData((prev) => ({
      ...prev,
      poNumber: generatePONumber(),
    }))
  }, [])

  // Load TDS sections from localStorage on component mount
  useEffect(() => {
    const loadTdsSections = () => {
      try {
        console.log('=== DEBUG: Loading TDS Sections ===')

        // Check ALL localStorage keys
        console.log('All localStorage keys:', Object.keys(localStorage))

        const storedData = localStorage.getItem('statutoryData')
        console.log('statutoryData exists:', storedData !== null)

        if (storedData) {
          const statutoryData = JSON.parse(storedData)
          console.log('Full statutoryData:', statutoryData)
          console.log('Number of items:', statutoryData.length)

          // Show all sections to debug
          console.log('All sections found:')
          statutoryData.forEach((item, index) => {
            console.log(`Item ${index}:`, {
              section: item.section,
              description: item.description,
              rate: item.rate,
            })
          })

          // More flexible filtering
          const tdsData = statutoryData.filter((item) => {
            if (!item.section) return false

            const sectionUpper = String(item.section).toUpperCase()
            const descUpper = String(item.description || '').toUpperCase()

            return (
              sectionUpper.includes('TDS') ||
              sectionUpper.includes('TAX') ||
              sectionUpper.includes('194') || // Common TDS sections like 194C, 194J
              sectionUpper.includes('DEDUCTION') ||
              descUpper.includes('TDS') ||
              descUpper.includes('TAX DEDUCTED AT SOURCE')
            )
          })

          console.log('Filtered TDS sections:', tdsData)
          console.log('Number of TDS sections:', tdsData.length)

          setTdsSections(tdsData)

          // If still empty, show ALL sections for testing
          if (tdsData.length === 0) {
            console.warn('No TDS sections filtered, showing all sections for debugging')
            setTdsSections(statutoryData.slice(0, 10)) // Show first 10 for testing
          }
        } else {
          console.warn('No statutoryData found in localStorage')
          setTdsSections([])
        }
      } catch (error) {
        console.error('Error loading TDS sections:', error)
        setTdsSections([])
      }
    }

    loadTdsSections()
  }, [])

  const handleChange = (e) => {
    const { name, value, files, type } = e.target
    const newValue = files ? files[0] : value

    // Handle vendor selection
    if (name === 'vendorName') {
      if (value === 'other') {
        setIsNewVendor(true)
        setFormData((prev) => ({
          ...prev,
          vendorName: '',
          newVendorName: '',
        }))
      } else {
        setIsNewVendor(false)
        setFormData((prev) => ({
          ...prev,
          vendorName: value,
          newVendorName: '',
        }))
      }
      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'radio' ? value : newValue,
    }))
  }

  const validateForm = () => {
    const errors = []

    // PO Number validation
    if (!formData.poNumber.trim()) {
      errors.push('PO Number is required')
    }

    // Vendor validation
    if (!isNewVendor && !formData.vendorName) {
      errors.push('Please select a vendor')
    }
    if (isNewVendor && !formData.newVendorName.trim()) {
      errors.push('Please enter new vendor name')
    }
    if (isNewVendor && formData.newVendorName.length < 3) {
      errors.push('Vendor name must be at least 3 characters')
    }

    // PO Type validation
    if (!formData.poType) {
      errors.push('Please select PO type')
    }

    // Expense Type validation
    if (!formData.expenseType) {
      errors.push('Please select expense type')
    }

    // Description validation
    if (!formData.description.trim()) {
      errors.push('Description is required')
    }
    if (formData.description.length < 10) {
      errors.push('Description must be at least 10 characters')
    }

    // Amount validation
    if (!formData.amount) {
      errors.push('Amount is required')
    }
    if (formData.amount <= 0) {
      errors.push('Amount must be greater than 0')
    }
    if (formData.amount > 10000000) {
      // 1 crore limit
      errors.push('Amount cannot exceed ₹1,00,00,000')
    }

    // Date validation
    if (!formData.startDate) {
      errors.push('Start date is required')
    }

    const today = new Date().toISOString().split('T')[0]
    if (formData.startDate < today) {
      errors.push('Start date cannot be in the past')
    }

    if (formData.endDate && formData.endDate <= formData.startDate) {
      errors.push('End date must be after start date')
    }

    // Attachment validation
    if (!formData.attachment) {
      errors.push('Please upload an attachment')
    }

    if (formData.attachment) {
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (formData.attachment.size > maxSize) {
        errors.push('File size must be less than 5MB')
      }

      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
      if (!allowedTypes.includes(formData.attachment.type)) {
        errors.push('Only PDF and image files are allowed')
      }
    }

    return errors
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const errors = validateForm()

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error))
      return
    }

    // Prepare final form data
    const finalFormData = {
      ...formData,
      vendorName: isNewVendor ? formData.newVendorName : formData.vendorName,
      isNewVendor: isNewVendor,
    }

    delete finalFormData.newVendorName // Remove helper field

    onSubmit(finalFormData)
    setFormData(initialFormState)
    setIsNewVendor(false)
    e.target.reset()

    // Generate new PO number for next form
    const generatePONumber = () => {
      const currentYear = new Date().getFullYear()
      const randomNum = Math.floor(Math.random() * 9000) + 1000
      return `PO-${currentYear}-${randomNum}`
    }

    setFormData((prev) => ({
      ...initialFormState,
      poNumber: generatePONumber(),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Auto-generated PO Number */}
      <div>
        <label className="block font-medium">PO Number</label>
        <input
          type="text"
          name="poNumber"
          value={formData.poNumber}
          className="w-full border rounded p-2 bg-gray-100"
          readOnly
        />
        <p className="text-xs text-gray-500 mt-1">Auto-generated PO Number</p>
      </div>

      {/* Enhanced Vendor Selection */}
      <div>
        <label className="block font-medium">
          Vendor Name <span className="text-red-500">*</span>
        </label>
        <select
          name="vendorName"
          value={isNewVendor ? 'other' : formData.vendorName}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        >
          <option value="">Select Vendor</option>
          {existingVendors.map((vendor, index) => (
            <option key={index} value={vendor}>
              {vendor}
            </option>
          ))}
          <option value="other">+ Add New Vendor</option>
        </select>
      </div>

      {/* New Vendor Input */}
      {isNewVendor && (
        <div>
          <label className="block font-medium">
            New Vendor Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="newVendorName"
            value={formData.newVendorName}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="Enter new vendor name"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Minimum 3 characters required</p>
        </div>
      )}

      <div>
        <label className="block font-medium">
          PO Type <span className="text-red-500">*</span>
        </label>
        <select
          name="poType"
          value={formData.poType}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        >
          <option value="">Select PO Type</option>
          <option value="one-time">One-time</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Date fields - show only when PO type is selected */}
      {formData.poType && (
        <>
          <div>
            <label className="block font-medium">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full border rounded p-2"
              min={new Date().toISOString().split('T')[0]} // Prevent past dates
              required
            />
          </div>
          <div>
            <label className="block font-medium">
              End Date
              {formData.poType === 'yearly' && <span className="text-red-500">*</span>}
              {formData.poType === 'one-time' && <span className="text-gray-500">(Optional)</span>}
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full border rounded p-2"
              min={formData.startDate || new Date().toISOString().split('T')[0]}
              required={formData.poType === 'yearly'}
            />
          </div>
        </>
      )}

      {(formData.expenseType === 'professional-fees' ||
        formData.expenseType === 'one-time-service') && (
        <div>
          <label className="block font-medium mb-1">
            TDS Section <span className="text-gray-500">(Optional)</span>
          </label>
          <div className="mb-4">
            <select
              name="tdsSection"
              value={formData.tdsSection}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="">Select TDS Section (if applicable)</option>
              {tdsSections.length === 0 ? (
                <option value="" disabled>
                  No TDS sections found in statutory data
                </option>
              ) : (
                tdsSections.map((item, index) => (
                  <option key={index} value={item.section}>
                    {item.section} - {item.description} ({item.rate})
                  </option>
                ))
              )}
            </select>
            <div className="text-xs text-gray-500 mt-1 flex flex-col space-y-1">
              {tdsSections.length > 0 ? (
                <>
                  <span>Select TDS section for professional fees (if applicable)</span>
                  <span className="text-blue-600">
                    {tdsSections.length} TDS sections loaded from statutory setup
                  </span>
                </>
              ) : (
                <span className="text-amber-600">
                  No TDS sections found. Please add TDS sections in Statutory Setup first.
                </span>
              )}
            </div>
          </div>

          {/* TDS Rate Display (if section selected) */}
          {formData.tdsSection && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm font-medium text-blue-700">TDS Details:</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {(() => {
                  const selectedSection = tdsSections.find(
                    (item) => item.section === formData.tdsSection
                  )
                  if (selectedSection) {
                    return (
                      <>
                        <div>
                          <span className="text-xs text-gray-600">Section:</span>
                          <p className="font-medium">{selectedSection.section}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-600">Rate:</span>
                          <p className="font-medium">{selectedSection.rate}%</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-xs text-gray-600">Description:</span>
                          <p className="text-sm">{selectedSection.description}</p>
                        </div>
                        {formData.amount && (
                          <div className="col-span-2 mt-2 p-2 bg-white border rounded">
                            <span className="text-xs text-gray-600">Estimated TDS Amount:</span>
                            <p className="font-medium text-blue-700">
                              ₹
                              {(
                                (parseFloat(formData.amount) * parseFloat(selectedSection.rate)) /
                                100
                              ).toFixed(2)}
                            </p>
                          </div>
                        )}
                      </>
                    )
                  }
                  return null
                })()}
              </div>
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block font-medium mb-1">
          Expense Type <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="expenseType"
              value="professional-fees"
              checked={formData.expenseType === 'professional-fees'}
              onChange={handleChange}
              required
            />
            Professional Fees
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="expenseType"
              value="one-time-service"
              checked={formData.expenseType === 'one-time-service'}
              onChange={handleChange}
              required
            />
            Other Services
          </label>
        </div>
      </div>

      <div>
        <label className="block font-medium">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded p-2"
          rows={3}
          placeholder="Enter detailed description (minimum 10 characters)"
          required
        ></textarea>
        <p className="text-xs text-gray-500 mt-1">
          {formData.description.length}/10 characters minimum
        </p>
      </div>

      <div>
        <label className="block font-medium">
          PO Amount (₹) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full border rounded p-2"
          min="1"
          max="10000000"
          step="0.01"
          placeholder="Enter amount"
          required
        />
      </div>

      <div>
        <label className="block font-medium">
          Upload Attachment <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          name="attachment"
          accept="application/pdf,image/jpeg,image/png,image/jpg"
          onChange={handleChange}
          className="w-full border p-2"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Accepted formats: PDF, JPG, PNG | Maximum size: 5MB
        </p>
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 w-full md:w-auto cursor-pointer font-medium"
      >
        Generate PO
      </button>
    </form>
  )
}
