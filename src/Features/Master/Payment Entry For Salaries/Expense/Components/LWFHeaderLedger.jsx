import React from 'react'

const LWFLedgerHeader = ({ accountInfo, stateRates, complianceInfo }) => {
  return (
    <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white p-4 md:p-8 rounded-t-2xl shadow-xl">
      <h1 className="text-2xl md:text-4xl font-bold text-center uppercase tracking-wider mb-2">
        📊 Expense Account Ledger
      </h1>
      <p className="text-lg md:text-2xl text-center text-pink-100 mb-8">
        Employer Labour Welfare Fund Contribution
      </p>

      {/* Account Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
          <div className="text-xs font-semibold text-pink-200 uppercase tracking-wider mb-1">
            GL Code
          </div>
          <div className="text-xl font-bold text-white">{accountInfo.glCode}</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
          <div className="text-xs font-semibold text-pink-200 uppercase tracking-wider mb-1">
            Account Name
          </div>
          <div className="text-xl font-bold text-white">{accountInfo.accountName}</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
          <div className="text-xs font-semibold text-pink-200 uppercase tracking-wider mb-1">
            Account Type
          </div>
          <div className="text-xl font-bold text-red-300">Expense (P&L Account)</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
          <div className="text-xs font-semibold text-pink-200 uppercase tracking-wider mb-1">
            Parent Account
          </div>
          <div className="text-lg font-bold text-white">{accountInfo.parentAccount}</div>
        </div>
      </div>

      {/* Account Description */}
      <div className="bg-white/5 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-white/10 mb-4">
        <h3 className="text-lg font-bold text-white mb-4">📋 Account Description</h3>
        <p className="text-pink-100 mb-4">
          {accountInfo.description} This expense account records the employer's statutory
          contribution to the Labour Welfare Fund (LWF) as mandated by various State Labour Welfare
          Fund Acts in India. The LWF is managed by state-specific Labour Welfare Boards and aims to
          improve workers' living standards.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="bg-pink-900/30 p-3 rounded-lg border border-pink-500/30">
            <div className="text-xs text-pink-300">Tax Deductibility</div>
            <div className="font-bold text-white">{accountInfo.taxDeductibility}</div>
          </div>
          <div className="bg-purple-900/30 p-3 rounded-lg border border-purple-500/30">
            <div className="text-xs text-purple-300">Coverage Type</div>
            <div className="font-bold text-white">{accountInfo.coverageType}</div>
          </div>
          <div className="bg-indigo-900/30 p-3 rounded-lg border border-indigo-500/30">
            <div className="text-xs text-indigo-300">Mapped Salary Heads</div>
            <div className="font-bold text-white">{accountInfo.mappedSalaryHeads}</div>
          </div>
          <div className="bg-red-900/30 p-3 rounded-lg border border-red-500/30">
            <div className="text-xs text-red-300">Accounting Treatment</div>
            <div className="font-bold text-white">{accountInfo.accountingTreatment}</div>
          </div>
        </div>
      </div>

      {/* State-wise Rates */}
      <div className="bg-white/5 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-white/10 mt-4">
        <h3 className="text-lg font-bold text-white mb-4">
          🗺️ State-Wise LWF Rates (Employer Share)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(stateRates).map(([state, details]) => (
            <div key={state} className="bg-white/10 p-4 rounded-lg border border-white/20">
              <div className="font-bold text-white mb-2">
                {state.charAt(0).toUpperCase() + state.slice(1).replace(/([A-Z])/g, ' $1')}
              </div>
              <div className="space-y-1 text-sm text-blue-100">
                <div>
                  <span className="font-medium">Rate:</span> {details.rate}
                </div>
                <div>
                  <span className="font-medium">Frequency:</span> {details.frequency}
                </div>
                <div>
                  <span className="font-medium">Due Dates:</span> {details.dueDates}
                </div>
                <div>
                  <span className="font-medium">Wage Limit:</span> {details.wageLimit}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-pink-200">
          Note: Contribution rates, payment frequency, and applicability vary by state. Currently,{' '}
          {complianceInfo.applicableStates} have LWF legislation.
        </div>
      </div>
    </div>
  )
}

export default LWFLedgerHeader
