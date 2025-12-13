import React from 'react'
import { footerSections } from '../data/lwfLedgerData'

const Footer = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 md:p-8 lg:p-10 border-t-4 border-blue-600">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {footerSections.map((section, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-3">
              {section.title.split(' ')[0]} {/* Icon */}
              <span>{section.title.split(' ').slice(1).join(' ')}</span>
            </h3>
            <ul className="space-y-3">
              {section.items.map((item, idx) => (
                <li
                  key={idx}
                  className="text-sm text-gray-600 leading-relaxed pb-3 border-b border-gray-100 last:border-b-0 relative pl-6"
                >
                  <span className="absolute left-0 text-green-500 font-bold">✓</span>
                  {item.includes(':') ? (
                    <>
                      <strong>{item.split(':')[0]}:</strong>
                      {item.split(':').slice(1).join(':')}
                    </>
                  ) : (
                    item
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* 
      <div className="mt-8 bg-gradient-to-br from-red-50 to-pink-100 border-3 border-red-400 rounded-xl p-6">
        <strong className="text-red-700 block mb-3 text-lg">🔍 Audit & Verification Points:</strong>
        <p className="text-red-800 text-sm leading-relaxed">
          During audits, verify: (1) Opening balance agrees with previous year closing, (2) All
          monthly accruals are recorded as per payroll, (3) Payments are properly evidenced with
          challans, (4) No overdue liabilities exist beyond grace period, (5) State-wise breakup
          matches employee distribution, (6) Year-end balance represents actual unpaid obligation,
          (7) Reconciliation with expense account is complete, (8) Interest/penalties (if any) are
          properly accounted. This liability account should have active monitoring and cannot carry
          long-term balances.
        </p>
      </div> */}
    </div>
  )
}

export default Footer
