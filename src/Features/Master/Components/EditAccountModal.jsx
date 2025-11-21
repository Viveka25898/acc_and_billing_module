import { useEffect, useState } from 'react'
import { FiX } from 'react-icons/fi'

const EditAccountModal = ({ isOpen, onClose, onSubmit, accounts, editingAccount }) => {
  const [formData, setFormData] = useState({
    accountCode: '',
    accountName: '',
    accountType: 'FOLDER',
    parentAccount: 'No Parent (Root Level)',
    parentCode: null,
  })

  const [errors, setErrors] = useState({})

  // Update form data when editing account changes
  useEffect(() => {
    if (editingAccount) {
      setFormData({
        accountCode: editingAccount.code,
        accountName: editingAccount.name,
        accountType: editingAccount.type,
        parentAccount: editingAccount.parentAccount || 'No Parent (Root Level)',
        parentCode: editingAccount.parentCode || null,
      })
    }
  }, [editingAccount])

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
        // Find the selected parent account to get its code and name
        const selectedParent = accounts.find((acc) => `${acc.code} - ${acc.name}` === value)
        setFormData((prev) => ({
          ...prev,
          [name]: selectedParent ? selectedParent.name : value,
          parentCode: selectedParent ? selectedParent.code : null,
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

    if (!formData.accountCode.trim()) {
      newErrors.accountCode = 'Account Code is required'
    } else if (
      formData.accountCode.trim() !== editingAccount?.code &&
      accounts.some((acc) => acc.code === formData.accountCode.trim())
    ) {
      newErrors.accountCode = 'Account Code already exists'
    }

    if (!formData.accountName.trim()) {
      newErrors.accountName = 'Account Name is required'
    }

    // Check if trying to set itself as parent
    const selectedParent = accounts.find(
      (acc) => `${acc.code} - ${acc.name}` === formData.parentAccount
    )
    if (selectedParent && selectedParent.code === editingAccount?.code) {
      newErrors.parentAccount = 'Account cannot be its own parent'
    }

    // Check for circular reference
    if (formData.parentAccount !== 'No Parent (Root Level)') {
      const checkCircularReference = (parentCode, originalCode) => {
        const parent = accounts.find((acc) => acc.code === parentCode)
        if (!parent) return false
        if (parent.parentCode === originalCode) return true
        if (parent.parentCode && parent.parentCode !== null) {
          return checkCircularReference(parent.parentCode, originalCode)
        }
        return false
      }

      if (
        formData.parentCode &&
        checkCircularReference(formData.parentCode, editingAccount?.code)
      ) {
        newErrors.parentAccount = 'This would create a circular reference'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      const updatedAccount = {
        ...editingAccount,
        code: formData.accountCode.trim(),
        name: formData.accountName.trim(),
        type: formData.accountType,
        parentAccount:
          formData.parentAccount === 'No Parent (Root Level)' ? null : formData.parentAccount,
        parentCode: formData.parentCode,
      }
      onSubmit(updatedAccount)
      setErrors({})
      onClose()
    }
  }

  const handleCancel = () => {
    setErrors({})
    onClose()
  }

  if (!isOpen || !editingAccount) return null

  // ✅ UPDATED: Get ALL available parent accounts (except itself and its children)
  const getAvailableParents = () => {
    if (!editingAccount) return []

    // Get accounts that this account and its children cannot be parents of
    const getAccountChildren = (accountCode) => {
      const children = accounts.filter((acc) => acc.parentCode === accountCode)
      let allChildren = [...children]
      children.forEach((child) => {
        allChildren = [...allChildren, ...getAccountChildren(child.code)]
      })
      return allChildren
    }

    const childrenCodes = getAccountChildren(editingAccount.code).map((child) => child.code)

    // ✅ ROOT accounts cannot have parents
    if (editingAccount.type === 'ROOT') {
      return []
    }

    // ✅ For ALL other types, show ALL accounts except:
    // 1. The account itself
    // 2. Its children (to prevent circular reference)
    const availableParents = accounts.filter(
      (acc) => acc.code !== editingAccount.code && !childrenCodes.includes(acc.code)
    )

    return availableParents
  }

  const availableParents = getAvailableParents()

  // Sort parents hierarchically for better display
  const sortParentsHierarchically = (parentAccounts) => {
    const roots = parentAccounts
      .filter((acc) => acc.type === 'ROOT')
      .sort((a, b) => a.code.localeCompare(b.code))
    const folders = parentAccounts
      .filter((acc) => acc.type === 'FOLDER')
      .sort((a, b) => a.code.localeCompare(b.code))
    const subFolders = parentAccounts
      .filter((acc) => acc.type === 'SUB_FOLDER')
      .sort((a, b) => a.code.localeCompare(b.code))
    const subSubFolders = parentAccounts
      .filter((acc) => acc.type === 'SUB_SUB_FOLDER')
      .sort((a, b) => a.code.localeCompare(b.code))
    const accountSubcategories = parentAccounts
      .filter((acc) => acc.type === 'ACCOUNT_SUBCATEGORY')
      .sort((a, b) => a.code.localeCompare(b.code))
    const accountTypes = parentAccounts
      .filter((acc) => acc.type === 'ACCOUNT_TYPE')
      .sort((a, b) => a.code.localeCompare(b.code))
    const accountLedgers = parentAccounts
      .filter((acc) => acc.type === 'ACCOUNT')
      .sort((a, b) => a.code.localeCompare(b.code))

    return [
      ...roots,
      ...folders,
      ...subFolders,
      ...subSubFolders,
      ...accountSubcategories,
      ...accountTypes,
      ...accountLedgers,
    ]
  }

  const sortedParents = sortParentsHierarchically(availableParents)

  // Get type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'ROOT':
        return '🏛️'
      case 'FOLDER':
        return '📁'
      case 'SUB_FOLDER':
        return '📂'
      case 'SUB_SUB_FOLDER':
        return '📑'
      case 'ACCOUNT_SUBCATEGORY':
        return '🗂️'
      case 'ACCOUNT_TYPE':
        return '📋'
      case 'ACCOUNT':
        return '📄'
      default:
        return '📁'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Code</label>
            <input
              type="text"
              name="accountCode"
              value={formData.accountCode}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                errors.accountCode ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.accountCode && (
              <p className="text-red-500 text-sm mt-1">{errors.accountCode}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
            <input
              type="text"
              name="accountName"
              value={formData.accountName}
              onChange={handleInputChange}
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
            >
              <option value="ROOT">Root (Main Category)</option>
              <option value="FOLDER">Folder (Sub Category)</option>
              <option value="SUB_FOLDER">Sub Folder</option>
              <option value="SUB_SUB_FOLDER">Sub Sub Folder</option>
              <option value="ACCOUNT_SUBCATEGORY">Account Subcategory</option>
              <option value="ACCOUNT_TYPE">Account Type</option>
              <option value="ACCOUNT">Account (Final Ledger)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {formData.accountType === 'ROOT' && 'Main categories like ASSETS, LIABILITIES, etc.'}
              {formData.accountType === 'FOLDER' &&
                'Sub-categories that can contain other accounts'}
              {formData.accountType === 'SUB_FOLDER' && 'Sub-folders within folders'}
              {formData.accountType === 'SUB_SUB_FOLDER' && 'Sub sub folders within sub folders'}
              {formData.accountType === 'ACCOUNT_SUBCATEGORY' && 'Account subcategories'}
              {formData.accountType === 'ACCOUNT_TYPE' && 'Account types'}
              {formData.accountType === 'ACCOUNT' && 'Final ledger accounts for transactions'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Parent Account</label>
            <select
              name="parentAccount"
              value={
                formData.parentAccount === null
                  ? 'No Parent (Root Level)'
                  : sortedParents.find((p) => p.name === formData.parentAccount)
                    ? `${sortedParents.find((p) => p.name === formData.parentAccount).code} - ${formData.parentAccount}`
                    : 'No Parent (Root Level)'
              }
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white ${
                errors.parentAccount ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={editingAccount.type === 'ROOT'}
            >
              {editingAccount.type !== 'ROOT' && (
                <option value="No Parent (Root Level)">No Parent (Root Level)</option>
              )}
              {sortedParents.map((parent) => (
                <option key={parent.id} value={`${parent.code} - ${parent.name}`}>
                  {getTypeIcon(parent.type)} {parent.code} - {parent.name} ({parent.type})
                </option>
              ))}
            </select>
            {errors.parentAccount && (
              <p className="text-red-500 text-sm mt-1">{errors.parentAccount}</p>
            )}
            {editingAccount.type === 'ROOT' && (
              <p className="text-xs text-gray-500 mt-1">
                Root accounts cannot have parent accounts
              </p>
            )}
            {editingAccount.type !== 'ROOT' && (
              <p className="text-xs text-gray-500 mt-1">
                Showing {sortedParents.length} available parent accounts (all types except itself
                and its children)
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-2">
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
