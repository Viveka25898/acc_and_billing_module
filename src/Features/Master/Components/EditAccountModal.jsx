import { useEffect, useState } from 'react'
import { FiX } from 'react-icons/fi'

const EditAccountModal = ({ isOpen, onClose, onSubmit, editingAccount }) => {
  const [formData, setFormData] = useState({
    accountCode: '',
    accountName: '',
    accountType: 'FOLDER',
    parentAccount: 'No Parent (Root Level)',
    parentCode: null,
  })

  const [errors, setErrors] = useState({})

  // Initialize form data when editing account changes
  useEffect(() => {
    if (editingAccount) {
      setFormData({
        accountCode: editingAccount.code || '',
        accountName: editingAccount.name || '',
        accountType: editingAccount.type || 'FOLDER',
        parentAccount: editingAccount.parentAccount || 'No Parent (Root Level)',
        parentCode: editingAccount.parentCode || null,
      })
    }
  }, [editingAccount])

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.accountName.trim()) {
      newErrors.accountName = 'Account Name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        id: editingAccount.id,
        name: formData.accountName.trim(),
      })
      setErrors({})
      onClose()
    }
  }

  const handleCancel = () => {
    setErrors({})
    onClose()
  }

  if (!isOpen || !editingAccount) return null

  // Get type icon helper
  const getTypeIcon = (type) => {
    const t = String(type || '').toUpperCase()
    if (t === 'ROOT') return '🏛️'
    if (t === 'FOLDER') return '📁'
    if (t === 'SUBFOLDER' || t === 'SUB_FOLDER') return '📂'
    if (t === 'SUB_SUBFOLDER' || t === 'SUB_SUB_FOLDER') return '📑'
    if (t === 'ACCOUNT_SUBCATEGORY') return '🗂️'
    if (t === 'ACCOUNT_TYPE') return '📋'
    if (t === 'ACCOUNT') return '📄'
    return '📁'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Edit Account</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Code (Read-Only)</label>
            <input
              type="text"
              name="accountCode"
              value={formData.accountCode}
              disabled
              className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 font-mono text-sm outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
            <input
              type="text"
              name="accountName"
              value={formData.accountName}
              onChange={handleInputChange}
              placeholder="e.g., HDFC Bank, ICICI Bank"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                errors.accountName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.accountName && (
              <p className="text-red-500 text-sm mt-1">{errors.accountName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Type (Read-Only)</label>
            <select
              name="accountType"
              value={formData.accountType}
              disabled
              className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 outline-none cursor-not-allowed appearance-none"
            >
              <option value="ROOT">Root (Main Category)</option>
              <option value="FOLDER">Folder (Sub Category)</option>
              <option value="SUBFOLDER">Sub-folder</option>
              <option value="SUB_SUBFOLDER">Sub-sub-folder</option>
              <option value="ACCOUNT">Account (Leaf)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Parent Account (Read-Only)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5">
                {getTypeIcon(formData.accountType)}
              </span>
              <input
                type="text"
                name="parentAccount"
                value={
                  formData.parentCode 
                    ? `${formData.parentCode} - ${formData.parentAccount}` 
                    : formData.parentAccount
                }
                disabled
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 text-sm outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
            >
              Update Account
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditAccountModal
