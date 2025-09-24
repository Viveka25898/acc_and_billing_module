import { useState } from "react";
import { FiX } from "react-icons/fi";

const AddAccountModal = ({ isOpen, onClose, onSubmit, accounts }) => {
  const [formData, setFormData] = useState({
    accountCode: '',
    accountName: '',
    accountType: 'Folder',
    parentAccount: 'No Parent (Root Level)'
  });

  const [errors, setErrors] = useState({});

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
    } else if (accounts.some(acc => acc.code === formData.accountCode.trim())) {
      newErrors.accountCode = 'Account Code already exists';
    }
    
    if (!formData.accountName.trim()) {
      newErrors.accountName = 'Account Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const newAccount = {
        code: formData.accountCode.trim(),
        name: formData.accountName.trim(),
        type: formData.accountType,
        parentAccount: formData.parentAccount === 'No Parent (Root Level)' ? null : formData.parentAccount,
        id: Date.now().toString()
      };
      onSubmit(newAccount);
      // Reset form
      setFormData({
        accountCode: '',
        accountName: '',
        accountType: 'Folder',
        parentAccount: 'No Parent (Root Level)'
      });
      setErrors({});
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({
      accountCode: '',
      accountName: '',
      accountType: 'Folder',
      parentAccount: 'No Parent (Root Level)'
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  // Get available parent accounts (only folders)
  const availableParents = accounts.filter(acc => acc.type === 'Folder');

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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Code
            </label>
            <input
              type="text"
              name="accountCode"
              value={formData.accountCode}
              onChange={handleInputChange}
              placeholder="e.g., A1001"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                errors.accountCode ? 'border-red-500' : 'border-gray-300'
              }`}
            />
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
              placeholder="e.g., FA COMPUTERS"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
            >
              <option value="No Parent (Root Level)">No Parent (Root Level)</option>
              {availableParents.map(parent => (
                <option key={parent.id} value={parent.code}>
                  {parent.code} - {parent.name}
                </option>
              ))}
            </select>
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
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddAccountModal