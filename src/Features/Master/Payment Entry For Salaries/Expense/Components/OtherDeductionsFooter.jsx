import React from 'react'

const OtherDeductionsFooter = () => {
  return (
    <div className="mt-6 p-4 bg-gray-50 border-t border-gray-200">
      <div className="text-center text-sm text-gray-600">
        <p className="mb-2">GL Code: X2001001007 | Other Deductions Expense Ledger</p>
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Payroll Management System • All statutory deductions managed
          as per compliance
        </p>
      </div>
    </div>
  )
}

export default OtherDeductionsFooter
