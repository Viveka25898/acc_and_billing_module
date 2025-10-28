// import { useState } from "react";
// import { FiX } from "react-icons/fi";

// const AddAccountModal = ({ isOpen, onClose, onSubmit, accounts }) => {
//   const [formData, setFormData] = useState({
//     accountCode: '',
//     accountName: '',
//     accountType: 'FOLDER',
//     parentAccount: 'No Parent (Root Level)',
//     parentCode: null
//   });

//   const [errors, setErrors] = useState({});

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
    
//     if (name === 'parentAccount') {
//       if (value === 'No Parent (Root Level)') {
//         setFormData(prev => ({
//           ...prev,
//           [name]: value,
//           parentCode: null
//         }));
//       } else {
//         // Find the selected parent account to get its code
//         const selectedParent = accounts.find(acc => `${acc.code} - ${acc.name}` === value);
//         setFormData(prev => ({
//           ...prev,
//           [name]: selectedParent ? selectedParent.name : value,
//           parentCode: selectedParent ? selectedParent.code : null
//         }));
//       }
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
    
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.accountCode.trim()) {
//       newErrors.accountCode = 'Account Code is required';
//     } else if (accounts.some(acc => acc.code === formData.accountCode.trim())) {
//       newErrors.accountCode = 'Account Code already exists';
//     }
    
//     if (!formData.accountName.trim()) {
//       newErrors.accountName = 'Account Name is required';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       const newAccount = {
//         code: formData.accountCode.trim(),
//         name: formData.accountName.trim(),
//         type: formData.accountType,
//         parentAccount: formData.parentAccount === 'No Parent (Root Level)' ? null : formData.parentAccount,
//         parentCode: formData.parentCode,
//         id: Date.now().toString()
//       };
//       onSubmit(newAccount);
//       // Reset form
//       setFormData({
//         accountCode: '',
//         accountName: '',
//         accountType: 'FOLDER',
//         parentAccount: 'No Parent (Root Level)',
//         parentCode: null
//       });
//       setErrors({});
//       onClose();
//     }
//   };

//   const handleCancel = () => {
//     setFormData({
//       accountCode: '',
//       accountName: '',
//       accountType: 'FOLDER',
//       parentAccount: 'No Parent (Root Level)',
//       parentCode: null
//     });
//     setErrors({});
//     onClose();
//   };

//   if (!isOpen) return null;

//   // Get available parent accounts (ROOT, FOLDER, SUB_FOLDER, ACCOUNT_SUBCATEGORY, and ACCOUNT_TYPE types)
//   const availableParents = accounts.filter(acc => 
//     acc.type === 'ROOT' || 
//     acc.type === 'FOLDER' || 
//     acc.type === 'SUB_FOLDER' || 
//     acc.type === 'ACCOUNT_SUBCATEGORY' ||
//     acc.type === 'ACCOUNT_TYPE'
//   );

//   // Sort parents hierarchically for better display
//   const sortParentsHierarchically = (parentAccounts) => {
//     const roots = parentAccounts.filter(acc => acc.type === 'ROOT').sort((a, b) => a.code.localeCompare(b.code));
//     const folders = parentAccounts.filter(acc => acc.type === 'FOLDER').sort((a, b) => a.code.localeCompare(b.code));
//     const subFolders = parentAccounts.filter(acc => acc.type === 'SUB_FOLDER').sort((a, b) => a.code.localeCompare(b.code));
//     const accountSubcategories = parentAccounts.filter(acc => acc.type === 'ACCOUNT_SUBCATEGORY').sort((a, b) => a.code.localeCompare(b.code));
//     const accountTypes = parentAccounts.filter(acc => acc.type === 'ACCOUNT_TYPE').sort((a, b) => a.code.localeCompare(b.code));
//     return [...roots, ...folders, ...subFolders, ...accountSubcategories, ...accountTypes];
//   };

//   const sortedParents = sortParentsHierarchically(availableParents);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <h2 className="text-lg font-semibold text-gray-800">Create New Account</h2>
//           <button
//             onClick={handleCancel}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <FiX className="w-6 h-6" />
//           </button>
//         </div>
        
//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Account Code
//             </label>
//             <input
//               type="text"
//               name="accountCode"
//               value={formData.accountCode}
//               onChange={handleInputChange}
//               placeholder="e.g., A1005, L2005, R3001, X3001"
//               className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
//                 errors.accountCode ? 'border-red-500' : 'border-gray-300'
//               }`}
//             />
//             {errors.accountCode && (
//               <p className="text-red-500 text-sm mt-1">{errors.accountCode}</p>
//             )}
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Account Name
//             </label>
//             <input
//               type="text"
//               name="accountName"
//               value={formData.accountName}
//               onChange={handleInputChange}
//               placeholder="e.g., FA OFFICE EQUIPMENT"
//               className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
//                 errors.accountName ? 'border-red-500' : 'border-gray-300'
//               }`}
//             />
//             {errors.accountName && (
//               <p className="text-red-500 text-sm mt-1">{errors.accountName}</p>
//             )}
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Account Type
//             </label>
//             <select
//               name="accountType"
//               value={formData.accountType}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
//             >
//               <option value="ROOT">Root (Main Category)</option>
//               <option value="FOLDER">Folder (Sub Category)</option>
//               <option value="SUB_FOLDER">Sub Folder (Sub Folder)</option>
//               <option value="ACCOUNT_SUBCATEGORY">Account Subcategory (Account Subcategory)</option>
//               <option value="ACCOUNT_TYPE">Account Type (Account Type)</option>
//               <option value="ACCOUNT">Account (Final Account)</option>
//             </select>
//             <p className="text-xs text-gray-500 mt-1">
//               {formData.accountType === 'ROOT' && 'Main categories like ASSETS, LIABILITIES, etc.'}
//               {formData.accountType === 'FOLDER' && 'Sub-categories that can contain other accounts'}
//               {formData.accountType === 'SUB_FOLDER' && 'Sub-folders within folders that can contain accounts'}
//               {formData.accountType === 'ACCOUNT_SUBCATEGORY' && 'Account subcategories within sub-folders that can contain account types'}
//               {formData.accountType === 'ACCOUNT_TYPE' && 'Account types within subcategories that can contain final accounts'}
//               {formData.accountType === 'ACCOUNT' && 'Final accounts for transactions'}
//             </p>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Parent Account
//             </label>
//             <select
//               name="parentAccount"
//               value={formData.parentAccount === null ? 'No Parent (Root Level)' : 
//                      sortedParents.find(p => p.name === formData.parentAccount) ? 
//                      `${sortedParents.find(p => p.name === formData.parentAccount).code} - ${formData.parentAccount}` : 
//                      'No Parent (Root Level)'}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
//             >
//               <option value="No Parent (Root Level)">No Parent (Root Level)</option>
//               {sortedParents.map(parent => (
//                 <option key={parent.id} value={`${parent.code} - ${parent.name}`}>
//                   {parent.type === 'ROOT' ? '🏛️' : 
//                    parent.type === 'FOLDER' ? '📁' : 
//                    parent.type === 'SUB_FOLDER' ? '📂' : 
//                    parent.type === 'ACCOUNT_SUBCATEGORY' ? '🗂️' : 
//                    parent.type === 'ACCOUNT_TYPE' ? '📋' : '📁'} {parent.code} - {parent.name}
//                 </option>
//               ))}
//             </select>
//             <p className="text-xs text-gray-500 mt-1">
//               Select the parent category where this account should be placed
//             </p>
//           </div>
          
//           <div className="flex gap-3 pt-4">
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
//             >
//               Create Account
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

import { useState } from "react";
import { FiX } from "react-icons/fi";

const AddAccountModal = ({ isOpen, onClose, onSubmit, accounts }) => {
  const [formData, setFormData] = useState({
    accountCode: '',
    accountName: '',
    accountType: 'FOLDER',
    parentAccount: 'No Parent (Root Level)',
    parentCode: null
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'parentAccount') {
      if (value === 'No Parent (Root Level)') {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          parentCode: null
        }));
      } else {
        // Extract the code from the selected value (format: "CODE - NAME")
        const code = value.split(' - ')[0];
        const selectedParent = accounts.find(acc => acc.code === code);
        setFormData(prev => ({
          ...prev,
          [name]: selectedParent ? selectedParent.name : value,
          parentCode: selectedParent ? selectedParent.code : null
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
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
        parentCode: formData.parentCode,
        id: Date.now().toString()
      };
      onSubmit(newAccount);
      // Reset form
      setFormData({
        accountCode: '',
        accountName: '',
        accountType: 'FOLDER',
        parentAccount: 'No Parent (Root Level)',
        parentCode: null
      });
      setErrors({});
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({
      accountCode: '',
      accountName: '',
      accountType: 'FOLDER',
      parentAccount: 'No Parent (Root Level)',
      parentCode: null
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  // Get ALL available parent accounts (except ACCOUNT type if needed)
  const getAvailableParents = () => {
    // For ACCOUNT type, show ALL possible parent types
    if (formData.accountType === 'ACCOUNT') {
      return accounts.filter(acc => acc.type !== 'ACCOUNT');
    }
    // For other types, show all except the same type and ACCOUNT
    return accounts.filter(acc => 
      acc.type !== 'ACCOUNT' && acc.type !== formData.accountType
    );
  };

  const availableParents = getAvailableParents();

  // Debug: Log available parents to console
  console.log('Available parents for', formData.accountType, ':', availableParents);

  // Sort parents by code for better display
  const sortedParents = [...availableParents].sort((a, b) => a.code.localeCompare(b.code));

  // Get type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'ROOT': return '🏛️';
      case 'FOLDER': return '📁';
      case 'SUB_FOLDER': return '📂';
      case 'SUB_SUB_FOLDER': return '📑';
      case 'ACCOUNT_SUBCATEGORY': return '🗂️';
      case 'ACCOUNT_TYPE': return '📋';
      case 'ACCOUNT': return '📄';
      default: return '📁';
    }
  };

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
              placeholder="e.g., A3004003001, A3004003002"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
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
              {formData.accountType === 'ACCOUNT' 
                ? 'Final ledger accounts for transactions (e.g., HDFC Bank, ICICI Bank)' 
                : 'Select account type based on hierarchy level'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent Account
            </label>
            <select
              name="parentAccount"
              value={formData.parentAccount === 'No Parent (Root Level)' ? 'No Parent (Root Level)' : 
                     formData.parentCode ? 
                     `${formData.parentCode} - ${formData.parentAccount}` : 
                     'No Parent (Root Level)'}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
              disabled={formData.accountType === 'ROOT'}
            >
              <option value="No Parent (Root Level)">
                {formData.accountType === 'ROOT' ? 'Root accounts cannot have parents' : 'Select Parent Account'}
              </option>
              {sortedParents.map(parent => (
                <option key={parent.id} value={`${parent.code} - ${parent.name}`}>
                  {getTypeIcon(parent.type)} {parent.code} - {parent.name} ({parent.type})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {formData.accountType === 'ROOT' 
                ? 'Root accounts cannot have parent accounts' 
                : `Found ${sortedParents.length} possible parent accounts`
              }
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

export default AddAccountModal;