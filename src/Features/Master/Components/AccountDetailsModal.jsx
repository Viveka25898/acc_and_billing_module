import { FiX, FiEdit3, FiTrash2 } from 'react-icons/fi'

const AccountDetailsModal = ({ isOpen, onClose, account, onEdit, onDelete }) => {
  if (!isOpen || !account) return null

  const handleEdit = () => {
    onEdit(account)
    onClose() // Close the details modal when opening edit modal
  }

  const handleDelete = () => {
    const confirmMessage =
      account.type === 'ROOT' || account.type === 'FOLDER'
        ? `Are you sure you want to delete the account "${account.code} - ${account.name}"?\n\nThis will also delete ALL accounts under this ${account.type.toLowerCase()}.\n\nThis action cannot be undone.`
        : `Are you sure you want to delete the account "${account.code} - ${account.name}"?\n\nThis action cannot be undone.`

    const confirmDelete = window.confirm(confirmMessage)

    if (confirmDelete) {
      onDelete(account.id)
      onClose()
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'ROOT':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'FOLDER':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'Account':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'ROOT':
        return '🏛️'
      case 'FOLDER':
        return '📁'
      case 'Account':
        return '📄'
      default:
        return '📄'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Account Details</h2>
            <p className="text-sm text-gray-600">Selected account information</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Account Information */}
        <div className="p-6 space-y-4">
          {/* Account Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Code</label>
            <p className="text-lg font-mono text-gray-900">{account.code}</p>
          </div>

          {/* Account Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
            <div className="flex items-center gap-2">
              <span className="text-lg">{getTypeIcon(account.type)}</span>
              <p className="text-lg text-gray-900">{account.name}</p>
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <span
              className={`inline-flex px-3 py-1 text-sm font-medium rounded-md border ${getTypeColor(account.type)}`}
            >
              {account.type}
            </span>
          </div>

          {/* Parent Account */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Account</label>
            <p className="text-lg text-gray-900">{account.parentAccount || 'None (Root Level)'}</p>
            {account.parentCode && (
              <p className="text-sm text-gray-500">Parent Code: {account.parentCode}</p>
            )}
          </div>

          {/* Hierarchy Level Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hierarchy Information
            </label>
            <div className="text-sm text-gray-600 space-y-1">
              {account.type === 'ROOT' && (
                <p>This is a root level account that can contain folders and other accounts.</p>
              )}
              {account.type === 'FOLDER' && (
                <p>This is a folder that can contain other folders and accounts.</p>
              )}
              {account.type === 'Account' && (
                <p>This is a final account that can be used for transactions.</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleEdit}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            <FiEdit3 className="w-4 h-4" />
            Edit Account
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            <FiTrash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccountDetailsModal
