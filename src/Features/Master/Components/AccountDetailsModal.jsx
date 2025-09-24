import { FiX, FiEdit3, FiTrash2 } from "react-icons/fi";

const AccountDetailsModal = ({ isOpen, onClose, account, onEdit, onDelete }) => {
  if (!isOpen || !account) return null;

  const getHierarchyLevel = (accountCode, accounts) => {
    let level = 1;
    let currentAccount = account;
    
    while (currentAccount && currentAccount.parentAccount && currentAccount.parentAccount !== 'No Parent (Root Level)') {
      const parent = accounts.find(acc => acc.code === currentAccount.parentAccount);
      if (parent) {
        level++;
        currentAccount = parent;
      } else {
        break;
      }
    }
    
    return level;
  };

  const handleEdit = () => {
    onEdit(account);
    onClose(); // Close the details modal when opening edit modal
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the account "${account.code} - ${account.name}"?\n\nThis action cannot be undone.`
    );
    
    if (confirmDelete) {
      onDelete(account.id);
      onClose();
    }
  };

  const hierarchyLevel = getHierarchyLevel(account.code, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Account Details</h2>
            <p className="text-sm text-gray-600">Selected account information</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        
        {/* Account Information */}
        <div className="p-6 space-y-4">
          {/* Account Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Code
            </label>
            <p className="text-lg font-mono text-gray-900">{account.code}</p>
          </div>
          
          {/* Account Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Name
            </label>
            <p className="text-lg text-gray-900">{account.name}</p>
          </div>
          
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-md border ${
              account.type === 'Folder' 
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                : 'bg-gray-100 text-gray-800 border-gray-200'
            }`}>
              {account.type.toUpperCase()}
            </span>
          </div>
          
          {/* Parent Account */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Account
            </label>
            <p className="text-lg text-gray-900">
              {account.parentAccount || 'ASSETS'}
            </p>
          </div>
          
          {/* Hierarchy Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hierarchy Level
            </label>
            <p className="text-lg text-gray-900">Level {hierarchyLevel}</p>
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
  );
};

export default AccountDetailsModal;