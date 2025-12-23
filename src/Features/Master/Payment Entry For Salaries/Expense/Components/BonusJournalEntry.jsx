import React from 'react'
import { journalEntries } from '../data/bonusData'

const JournalEntry = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-teal-800 flex items-center gap-3">
          <i className="fas fa-file-invoice"></i>
          Standard Journal Entry for Monthly Bonus
        </h2>
        <p className="text-gray-600 mt-2">
          When monthly bonus is paid, the following journal entry is recorded in the books:
        </p>
      </div>

      {/* Direct Entry */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8 border-l-4 border-teal-600">
        <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-3">
          <i className="fas fa-exchange-alt"></i>
          Journal Entry on Payment Date
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Debit */}
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-teal-700">
                {journalEntries.directEntry.debit.account}
              </span>
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {journalEntries.directEntry.debit.glCode}
              </span>
            </div>
            <div className="text-2xl font-bold text-red-600 mb-2">
              Dr. {journalEntries.directEntry.debit.amount}
            </div>
            <div className="text-sm text-gray-500">
              {journalEntries.directEntry.debit.description}
            </div>
          </div>

          {/* Credit */}
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-teal-700">
                {journalEntries.directEntry.credit.account}
              </span>
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {journalEntries.directEntry.credit.glCode}
              </span>
            </div>
            <div className="text-2xl font-bold text-green-600 mb-2">
              Cr. {journalEntries.directEntry.credit.amount}
            </div>
            <div className="text-sm text-gray-500">
              {journalEntries.directEntry.credit.description}
            </div>
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
          <p className="text-amber-800 flex items-start gap-2">
            <i className="fas fa-lightbulb text-amber-600 mt-1"></i>
            <span>
              <strong>Note:</strong> Since bonus is paid monthly and entries are only made when
              paid, we debit Bonus Expense (X2001001007) and credit Bank directly. No Salary Payable
              account is involved because there's no accrual - payment happens immediately.
            </span>
          </p>
        </div>
      </div>

      {/* Payroll Entry */}
      <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-600">
        <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-3">
          <i className="fas fa-route"></i>
          Alternative: Via Salary Payable (If processed through payroll)
        </h3>

        {/* Step 1 */}
        <div className="mb-8">
          <h4 className="text-md font-semibold text-gray-700 mb-4">Step 1: Expense Recognition</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-teal-700">
                  {journalEntries.payrollEntry.step1.debit.account}
                </span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {journalEntries.payrollEntry.step1.debit.glCode}
                </span>
              </div>
              <div className="text-2xl font-bold text-red-600">
                Dr. {journalEntries.payrollEntry.step1.debit.amount}
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-teal-700">
                  {journalEntries.payrollEntry.step1.credit.account}
                </span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {journalEntries.payrollEntry.step1.credit.glCode}
                </span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                Cr. {journalEntries.payrollEntry.step1.credit.amount}
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div>
          <h4 className="text-md font-semibold text-gray-700 mb-4">Step 2: Payment</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-teal-700">
                  {journalEntries.payrollEntry.step2.debit.account}
                </span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {journalEntries.payrollEntry.step2.debit.glCode}
                </span>
              </div>
              <div className="text-2xl font-bold text-red-600">
                Dr. {journalEntries.payrollEntry.step2.debit.amount}
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-teal-700">
                  {journalEntries.payrollEntry.step2.credit.account}
                </span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {journalEntries.payrollEntry.step2.credit.glCode}
                </span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                Cr. {journalEntries.payrollEntry.step2.credit.amount}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-teal-50 p-4 rounded-lg mt-6 border-l-4 border-teal-500">
          <p className="text-teal-800 flex items-start gap-2">
            <i className="fas fa-info-circle text-teal-600 mt-1"></i>
            <span>
              This two-step approach is used when bonus is processed through the regular payroll
              system along with salary. The net effect is the same: Bonus Expense debited and Bank
              credited.
            </span>
          </p>
        </div>
      </div>

      {/* Important Notes */}
      <div className="mt-8 bg-amber-50 p-6 rounded-xl border border-amber-200">
        <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-3">
          <i className="fas fa-exclamation-triangle"></i>
          Important Accounting Notes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg">
            <h4 className="font-semibold text-teal-700 mb-3 flex items-center gap-2">
              <i className="fas fa-calendar-check text-teal-600"></i>
              Monthly Recognition Only
            </h4>
            <p className="text-gray-600 text-sm">
              No accrual entries. Expense recognized only when cash leaves the company (payment
              made).
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg">
            <h4 className="font-semibold text-teal-700 mb-3 flex items-center gap-2">
              <i className="fas fa-file-alt text-teal-600"></i>
              Documentation Required
            </h4>
            <p className="text-gray-600 text-sm">
              Each entry must have: Payment voucher, Bank statement, Bonus calculation sheet,
              Employee acknowledgement.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JournalEntry
