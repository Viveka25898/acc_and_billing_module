import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

const EditAccountModal = ({ isOpen, onClose, onSubmit, accounts, editingAccount }) => {
  const [formData, setFormData] = useState({
    accountCode: '',
    accountName: '',
    accountType: 'Folder',
    parentAccount: 'No Parent (Root Level)'
  });

  const [errors, setErrors] = useState({});

  // Update form data when editing account changes
  useEffect(() => {
    if (editingAccount) {
      setFormData({
        accountCode: editingAccount.code,
        accountName: editingAccount.name,
        accountType: editingAccount.type,
        parentAccount: editingAccount.parentAccount || 'No Parent (Root Level)'
      });
    }
  }, [editingAccount]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.accountCode.trim()) {
      newErrors.accountCode = 'Account Code is required';
    } else if (formData.accountCode.trim() !== editingAccount?.code && 
               accounts.some(acc => acc.code === formData.accountCode.trim())) {
      newErrors.accountCode = 'Account Code already exists';
    }
    
    if (!formData.accountName.trim()) {
      newErrors.accountName = 'Account Name is required';
    }

    // Check if trying to set itself as parent
    if (formData.parentAccount === formData.accountCode.trim()) {
      newErrors.parentAccount = 'Account cannot be its own parent';
    }

    // Check for circular reference
    if (formData.parentAccount !== 'No Parent (Root Level)') {
      const checkCircularReference = (parentCode, originalCode) => {
        const parent = accounts.find(acc => acc.code === parentCode);
        if (!parent) return false;
        if (parent.parentAccount === originalCode) return true;
        if (parent.parentAccount && parent.parentAccount !== 'No Parent (Root Level)') {
          return checkCircularReference(parent.parentAccount, originalCode);
        }
        return false;
      };

      if (checkCircularReference(formData.parentAccount, editingAccount?.code)) {
        newErrors.parentAccount = 'This would create a circular reference';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const updatedAccount = {
        ...editingAccount,
        code: formData.accountCode.trim(),
        name: formData.accountName.trim(),
        type: formData.accountType,
        parentAccount: formData.parentAccount === 'No Parent (Root Level)' ? null : formData.parentAccount
      };
      onSubmit(updatedAccount);
      setErrors({});
      onClose();
    }
  };

  const handleCancel = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen || !editingAccount) return null;

  // Get available parent accounts (only folders, excluding the current account and its children)
  const getAccountChildren = (accountCode) => {
    const children = accounts.filter(acc => acc.parentAccount === accountCode);
    let allChildren = [...children];
    children.forEach(child => {
      allChildren = [...allChildren, ...getAccountChildren(child.code)];
    });
    return allChildren;
  };

  const childrenCodes = getAccountChildren(editingAccount.code).map(child => child.code);
  const availableParents = accounts.filter(acc => 
    acc.type === 'Folder' && 
    acc.code !== editingAccount.code && 
    !childrenCodes.includes(acc.code)
  );

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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Code
            </label>
            <div className="relative">
              <input
                type="text"
                name="accountCode"
                value={formData.accountCode}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                  errors.accountCode ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <span className="absolute left-2 top-1 bg-emerald-100 text-emerald-800 text-xs px-1 rounded">
                {editingAccount.code}
              </span>
            </div>
            {errors.accountCode && (
              <p className="text-red-500 text-sm mt-1">{errors.accountCode}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Name
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <select
              name="accountType"
              value={formData.accountType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
            >
              <option value="Folder">Folder</option>
              <option value="Account">Account</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent Account
            </label>
            <select
              name="parentAccount"
              value={formData.parentAccount}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white ${
                errors.parentAccount ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="No Parent (Root Level)">No Parent (Root Level)</option>
              {availableParents.map(parent => (
                <option key={parent.id} value={parent.code}>
                  {parent.code} - {parent.name}
                </option>
              ))}
            </select>
            {errors.parentAccount && (
              <p className="text-red-500 text-sm mt-1">{errors.parentAccount}</p>
            )}
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
  );
};
export default EditAccountModal