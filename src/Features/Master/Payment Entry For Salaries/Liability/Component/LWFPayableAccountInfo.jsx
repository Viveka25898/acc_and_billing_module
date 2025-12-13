import React from 'react'
import { accountInfo } from '../data/lwfLedgerData'

const AccountInfo = () => {
  const infoCards = Object.entries(accountInfo).map(([label, value]) => ({
    label: label.replace(/([A-Z])/g, ' $1').trim(),
    value,
  }))

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 md:p-8 lg:p-10 border-b-4 border-blue-600">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {infoCards.map((card, index) => (
          <div
            key={index}
            className="bg-white p-5 md:p-6 rounded-xl shadow-lg border-l-4 border-blue-600 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-3xl" />
            <div className="relative z-10">
              <div className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="text-blue-600">▸</span>
                {card.label}
              </div>
              <div className="text-lg font-semibold text-gray-900">{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* <div className="description-gradient border-3 border-red-400 rounded-2xl p-6 md:p-8 mt-8">
        <h3 className="text-xl font-semibold text-red-700 mb-4 flex items-center gap-3">
          📋 Account Description
        </h3>
        <p className="text-red-800 leading-relaxed mb-4">
          This current liability account records the employer's outstanding obligation to pay Labour
          Welfare Fund contributions to state labour welfare boards. The liability is created when
          the employer's LWF contribution is accrued from payroll (typically monthly or as per state
          requirements) and remains on the books until actual payment is made to the respective
          state authority.
        </p>
        <p className="text-red-800 leading-relaxed mb-6">
          <strong>Key Characteristics:</strong> This is a short-term liability that must be settled
          within the statutory payment timeline (varies by state). The account balance represents
          unpaid employer LWF contributions. As a liability account, it has a normal credit balance
          - credits increase the obligation when contributions are accrued, and debits reduce it
          when payments are made.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {[
            {
              title: '💰 Balance Type',
              desc: 'Credit balance indicates amount owed to government',
            },
            {
              title: '📅 Settlement Period',
              desc: 'Within statutory due dates (15-30 days post month-end)',
            },
            { title: '🔗 Linked Expense', desc: 'Employer LWF Contribution (X2001001004)' },
            { title: '🎯 Aging Analysis', desc: 'Track payment delays and compliance' },
            { title: '⚡ Payment Priority', desc: 'High (statutory obligation with penalties)' },
            { title: '📊 Reconciliation', desc: 'Monthly with payroll and payment records' },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-500 hover:translate-x-1 transition-transform"
            >
              <strong className="text-green-700 block mb-2">{feature.title}</strong>
              <span className="text-gray-600 text-sm leading-relaxed">{feature.desc}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-br from-red-50 to-pink-100 border-3 border-red-400 rounded-xl p-5">
          <strong className="text-red-700 block mb-3">⚠️ Compliance Alert:</strong>
          <p className="text-red-800 text-sm leading-relaxed">
            Late payment of LWF contributions attracts penalties, interest, and potential legal
            action as per state Labour Welfare Fund Acts. Ensure timely payment within statutory
            deadlines. This liability should be actively managed and not allowed to accumulate
            beyond the payment due date. Maintain proper documentation including payment challans,
            receipts, and returns filed with labour welfare boards.
          </p>
        </div>
      </div> */}
    </div>
  )
}

export default AccountInfo
