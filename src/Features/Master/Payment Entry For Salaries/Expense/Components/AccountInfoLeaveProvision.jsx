/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { FiInfo, FiChevronDown, FiChevronUp, FiExternalLink } from 'react-icons/fi'

const AccountInfoLeaveProvision = ({ accountInfo }) => {
  const [showDescription, setShowDescription] = useState(true)

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 border-b-2 border-blue-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'GL Code',
            value: accountInfo.glCode,
            icon: '🔢',
            color: 'bg-blue-100 border-blue-300',
          },
          {
            label: 'Account Name',
            value: accountInfo.accountName,
            icon: '📄',
            color: 'bg-green-100 border-green-300',
          },
          {
            label: 'Account Type',
            value: accountInfo.accountType,
            icon: '📊',
            color: 'bg-purple-100 border-purple-300',
          },
          {
            label: 'Parent Account',
            value: accountInfo.parentAccount,
            icon: '📂',
            color: 'bg-amber-100 border-amber-300',
          },
          {
            label: 'Financial Statement',
            value: accountInfo.financialStatement,
            icon: '📈',
            color: 'bg-indigo-100 border-indigo-300',
          },
          {
            label: 'Nature of Account',
            value: accountInfo.natureOfAccount,
            icon: '⚖️',
            color: 'bg-red-100 border-red-300',
          },
          {
            label: 'Tax Treatment',
            value: accountInfo.taxTreatment,
            icon: '💰',
            color: 'bg-emerald-100 border-emerald-300',
          },
          {
            label: 'Accounting Standard',
            value: accountInfo.accountingStandard,
            icon: '📋',
            color: 'bg-pink-100 border-pink-300',
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`${item.color} border-l-4 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                {item.label}
              </span>
            </div>
            <div className="text-sm font-semibold text-gray-900">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Description & Key Features Section */}
    </div>
  )
}

export default AccountInfoLeaveProvision
