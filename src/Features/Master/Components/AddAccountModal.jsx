import { useState, useEffect } from 'react'
import { FiX } from 'react-icons/fi'
import { fetchAccountTypes, generateAccountCode, fetchAllAccounts } from '../Services/chartOfAccountsService'

const AddAccountModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    accountCode: '',
    accountName: '',
    accountType: 'FOLDER',
    parentAccount: 'No Parent (Root Level)',
    parentCode: null,
  })

  const [accountTypes, setAccountTypes] = useState([
    { value: 'ROOT', label: 'Root' },
    { value: 'FOLDER', label: 'Folder' },
    { value: 'SUBFOLDER', label: 'Sub-folder' },
    { value: 'SUB_SUBFOLDER', label: 'Sub-sub-folder' },
    { value: 'ACCOUNT', label: 'Account (Leaf)' }
  ])
  const [allAccounts, setAllAccounts] = useState([])
  const [typesLoading, setTypesLoading] = useState(false)
  const [accountsLoading, setAccountsLoading] = useState(false)
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)
  const [errors, setErrors] = useState({})

  // Load account types and all candidate parents from backend on open
  useEffect(() => {
    const loadData = async () => {
      try {
        setTypesLoading(true)
        setAccountsLoading(true)
        
        const [types, accountsRes] = await Promise.all([
          fetchAccountTypes(),
          fetchAllAccounts({ limit: 200 })
        ])
        
        if (Array.isArray(types) && types.length > 0) {
          setAccountTypes(types)
        }
        
        if (accountsRes && Array.isArray(accountsRes.items)) {
          setAllAccounts(accountsRes.items)
        }
      } catch (err) {
        console.error('Failed to load dynamic data from API:', err)
      } finally {
        setTypesLoading(false)
        setAccountsLoading(false)
      }
    }

    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  // Automatically fetch proposed code when account type or parent account changes
  useEffect(() => {
    if (!isOpen) return

    const getProposedCode = async () => {
      const { accountType, parentCode } = formData
      
      // ROOT doesn't require a parent. Other types require parentCode to preview the code.
      const canGenerate = accountType === 'ROOT' || parentCode

      if (!canGenerate) {
        setFormData((prev) => ({ ...prev, accountCode: '' }))
        return
      }

      try {
        setIsGeneratingCode(true)
        const res = await generateAccountCode(parentCode, accountType)
        if (res && res.proposedCode) {
          setFormData((prev) => ({ ...prev, accountCode: res.proposedCode }))
        } else {
          setFormData((prev) => ({ ...prev, accountCode: '' }))
        }
      } catch (err) {
        console.error('Failed to generate proposed code:', err)
        setFormData((prev) => ({ ...prev, accountCode: '' }))
      } finally {
        setIsGeneratingCode(false)
      }
    }

    getProposedCode()
  }, [formData.accountType, formData.parentCode, isOpen])

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name === 'parentAccount') {
      if (value === 'No Parent (Root Level)') {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          parentCode: null,
        }))
      } else {
        // Extract the code from the selected value (format: "CODE - NAME")
        const code = value.split(' - ')[0]
        const selectedParent = allAccounts.find((acc) => acc.code === code)
        setFormData((prev) => ({
          ...prev,
          [name]: selectedParent ? selectedParent.name : value,
          parentCode: selectedParent ? selectedParent.code : null,
        }))
      }
    } else if (name === 'accountType') {
      // If changing type to ROOT, reset parent selection
      if (value === 'ROOT') {
        setFormData((prev) => ({
          ...prev,
          accountType: value,
          parentAccount: 'No Parent (Root Level)',
          parentCode: null,
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          accountType: value,
        }))
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

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
      const payload = {
        name: formData.accountName.trim(),
        type: formData.accountType,
        parentCode: formData.accountType === 'ROOT' ? null : formData.parentCode,
      }
      
      onSubmit(payload)
      
      // Reset form
      setFormData({
        accountCode: '',
        accountName: '',
        accountType: 'FOLDER',
        parentAccount: 'No Parent (Root Level)',
        parentCode: null,
      })
      setErrors({})
      onClose()
    }
  }

  const handleCancel = () => {
    setFormData({
      accountCode: '',
      accountName: '',
      accountType: 'FOLDER',
      parentAccount: 'No Parent (Root Level)',
      parentCode: null,
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  // Get ALL available parent accounts (except ACCOUNT type)
  const getAvailableParents = () => {
    return allAccounts.filter((acc) => {
      const typeUpper = String(acc.type || '').toUpperCase()
      return typeUpper !== 'ACCOUNT'
    })
  }

  const availableParents = getAvailableParents()

  // Sort parents by code for better display
  const sortedParents = [...availableParents].sort((a, b) => a.code.localeCompare(b.code))

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
          <h2 className="text-lg font-semibold text-gray-800">Create New Account</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Code (Auto-Generated)</label>
            <div className="relative">
              <input
                type="text"
                name="accountCode"
                value={isGeneratingCode ? 'Generating proposed code...' : formData.accountCode || 'Select Parent and Type to generate...'}
                disabled
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 font-mono text-sm outline-none"
              />
              {isGeneratingCode && (
                <div className="absolute right-3 top-2.5">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500" />
                </div>
              )}
            </div>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
            <select
              name="accountType"
              value={formData.accountType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
              disabled={typesLoading}
            >
              {typesLoading ? (
                <option>Loading types...</option>
              ) : (
                accountTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))
              )}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {formData.accountType === 'ACCOUNT'
                ? 'Final ledger accounts for transactions (e.g., HDFC Bank, ICICI Bank)'
                : 'Select account type based on hierarchy level'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Parent Account</label>
            <select
              name="parentAccount"
              value={
                formData.parentAccount === 'No Parent (Root Level)'
                  ? 'No Parent (Root Level)'
                  : formData.parentCode
                    ? `${formData.parentCode} - ${formData.parentAccount}`
                    : 'No Parent (Root Level)'
              }
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
              disabled={formData.accountType === 'ROOT' || accountsLoading}
            >
              {accountsLoading ? (
                <option>Loading parent accounts...</option>
              ) : (
                <>
                  <option value="No Parent (Root Level)">
                    {formData.accountType === 'ROOT'
                      ? 'Root accounts cannot have parents'
                      : 'Select Parent Account'}
                  </option>
                  {sortedParents.map((parent) => (
                    <option key={parent.id} value={`${parent.code} - ${parent.name}`}>
                      {getTypeIcon(parent.type)} {parent.code} - {parent.name} ({parent.type})
                    </option>
                  ))}
                </>
              )}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {formData.accountType === 'ROOT'
                ? 'Root accounts cannot have parent accounts'
                : accountsLoading
                  ? 'Fetching valid parents...'
                  : `Found ${sortedParents.length} possible parent accounts`}
            </p>
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
              disabled={isGeneratingCode || accountsLoading || typesLoading}
              className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddAccountModal
