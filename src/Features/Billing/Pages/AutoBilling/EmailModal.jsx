import React, { useState } from 'react'
import { X, Mail, User, Send, AlertCircle } from 'lucide-react'

const EmailModal = ({ isOpen, onClose, onSend, isLoading }) => {
  const [emailData, setEmailData] = useState({
    recipientEmail: '',
    recipientName: '',
    ccEmails: '',
    message: '',
  })
  const [errors, setErrors] = useState({})

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEmailData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    const newErrors = {}

    if (!emailData.recipientEmail.trim()) {
      newErrors.recipientEmail = 'Recipient email is required'
    } else if (!validateEmail(emailData.recipientEmail)) {
      newErrors.recipientEmail = 'Please enter a valid email address'
    }

    if (!emailData.recipientName.trim()) {
      newErrors.recipientName = 'Recipient name is required'
    }

    // Validate CC emails if provided
    if (emailData.ccEmails.trim()) {
      const ccEmailList = emailData.ccEmails.split(',').map((e) => e.trim())
      const invalidCcEmails = ccEmailList.filter((email) => email && !validateEmail(email))
      if (invalidCcEmails.length > 0) {
        newErrors.ccEmails = 'Please enter valid email addresses separated by commas'
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Submit
    onSend(emailData)
  }

  const handleClose = () => {
    if (!isLoading) {
      setEmailData({
        recipientEmail: '',
        recipientName: '',
        ccEmails: '',
        message: '',
      })
      setErrors({})
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <Mail className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Send Invoice via Email</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4">
          {/* Recipient Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="recipientEmail"
                value={emailData.recipientEmail}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="client@example.com"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 ${
                  errors.recipientEmail ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.recipientEmail && (
              <div className="mt-1 flex items-center text-red-600 text-xs">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.recipientEmail}
              </div>
            )}
          </div>

          {/* Recipient Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="recipientName"
                value={emailData.recipientName}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="John Doe"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 ${
                  errors.recipientName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.recipientName && (
              <div className="mt-1 flex items-center text-red-600 text-xs">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.recipientName}
              </div>
            )}
          </div>

          {/* CC Emails */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CC Emails (Optional)
            </label>
            <input
              type="text"
              name="ccEmails"
              value={emailData.ccEmails}
              onChange={handleInputChange}
              disabled={isLoading}
              placeholder="email1@example.com, email2@example.com"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 ${
                errors.ccEmails ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.ccEmails && (
              <div className="mt-1 flex items-center text-red-600 text-xs">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.ccEmails}
              </div>
            )}
            <p className="mt-1 text-xs text-gray-500">Separate multiple emails with commas</p>
          </div>

          {/* Additional Message */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Message (Optional)
            </label>
            <textarea
              name="message"
              value={emailData.message}
              onChange={handleInputChange}
              disabled={isLoading}
              placeholder="Add any additional notes or comments..."
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Email
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EmailModal
