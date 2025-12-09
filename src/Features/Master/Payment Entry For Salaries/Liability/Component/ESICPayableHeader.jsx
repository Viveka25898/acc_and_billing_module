/* eslint-disable no-unused-vars */
import React from 'react'

const ESICPayableHeader = ({ accountInfo, complianceInfo, journalEntries }) => {
  return (
    <div className="bg-gradient-to-r from-blue-900 to-purple-800 text-white p-4 md:p-8 rounded-t-2xl shadow-xl">
      <h1 className="text-2xl md:text-4xl font-bold text-center uppercase tracking-wider mb-2">
        General Ledger Account
      </h1>
      <p className="text-lg md:text-2xl text-center text-blue-100 mb-8">
        ESIC Payable - Employer Share
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
          <div className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1">
            GL Code
          </div>
          <div className="text-xl font-bold text-white">L2002003</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
          <div className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1">
            Account Name
          </div>
          <div className="text-xl font-bold text-white">{accountInfo.accountName}</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
          <div className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1">
            Account Type
          </div>
          <div className="text-xl font-bold text-green-300">Current Liability</div>
        </div>
      </div>

      {/* Compliance Section */}
      {/* <div className="bg-white/5 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-white/10 mt-4">
        <h3 className="text-lg font-bold text-white mb-4">📋 Account Description</h3>
        <p className="text-blue-100 mb-4">
          This account records the employer's liability to the Employee State Insurance Corporation
          (ESIC) at 3.25% of ESI-eligible wages. As per ESIC Act 1948 and the latest amendment
          effective July 1, 2019, employers must contribute 3.25% while employees contribute 0.75%
          of wages. This liability remains on the books until payment is made to ESIC within 15 days
          of the month-end.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="bg-green-900/30 p-3 rounded-lg border border-green-500/30">
            <div className="text-xs text-green-300">Contribution Rate</div>
            <div className="font-bold text-white">{complianceInfo.employerRate}</div>
          </div>
          <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-500/30">
            <div className="text-xs text-blue-300">Wage Ceiling</div>
            <div className="font-bold text-white">{complianceInfo.wageCeiling}</div>
          </div>
          <div className="bg-purple-900/30 p-3 rounded-lg border border-purple-500/30">
            <div className="text-xs text-purple-300">Payment Due</div>
            <div className="font-bold text-white">{complianceInfo.dueDate}</div>
          </div>
          <div className="bg-red-900/30 p-3 rounded-lg border border-red-500/30">
            <div className="text-xs text-red-300">Penalty Rate</div>
            <div className="font-bold text-white">{complianceInfo.penaltyRate}</div>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default ESICPayableHeader
