import React from 'react';
import {  FiDownload, FiUpload, FiPlus, FiX } from 'react-icons/fi';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
const Header = ({ onAddAccount }) => {
  return (
    <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center">
          <HiOutlineOfficeBuilding className="text-white text-lg" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Chart of Accounts Master</h1>
          <p className="text-sm text-gray-600">Manage your ERP chart of accounts in tabular format</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={onAddAccount}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
        >
          <FiPlus className="text-sm" />
          Add Account
        </button>
      </div>
    </div>
  );
};
export default Header