import React from 'react'
import { FiFileText, FiCheckCircle, FiAlertCircle, FiDownload, FiClock } from 'react-icons/fi'

const LeaveProvisionFooter = ({ complianceRequirements, actuarialAssumptions }) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 border-t-4 border-blue-600">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Compliance & Standards Section */}
        <div className="bg-white p-5 rounded-xl border-l-4 border-emerald-500 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FiCheckCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-gray-800">Compliance & Accounting Standards</h3>
          </div>

          <div className="space-y-4">
            {complianceRequirements.map((req, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-gray-800">{req.standard}</div>
                    <div className="text-sm text-gray-600">{req.requirement}</div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      req.penalty === 'N/A' ? 'bg-gray-100 text-gray-800' : 'bg-red-50 text-red-800'
                    }`}
                  >
                    {req.frequency}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FiClock className="w-3 h-3" />
                    Deadline: {req.deadline}
                  </span>
                  {req.penalty !== 'N/A' && (
                    <span className="text-red-600">Penalty: {req.penalty}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <FiAlertCircle className="w-4 h-4 text-blue-600" />
              <strong className="text-sm text-blue-800">Important Notes</strong>
            </div>
            <ul className="text-xs text-blue-700 space-y-1">
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>Leave encashment is a defined benefit obligation under AS 15/Ind AS 19</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>Actuarial valuation must be done by a qualified actuary</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>Tax deduction available only on actual payment (Section 43B)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>Disclosure required in financial statement notes</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Actuarial & Calculation Details */}
        <div className="bg-white p-5 rounded-xl border-l-4 border-purple-500 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FiFileText className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-800">Actuarial Valuation Details</h3>
          </div>

          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Valuation Assumptions</div>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(actuarialAssumptions).map(([key, value]) => (
                <div key={key} className="text-sm">
                  <div className="text-xs text-gray-500 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </div>
                  <div className="font-medium text-gray-800">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="text-sm font-medium text-gray-700 mb-3">Calculation Methodology</div>
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="font-medium text-purple-800 text-sm mb-1">
                  Projected Unit Credit Method
                </div>
                <div className="text-xs text-purple-700">
                  Future salary increases, attrition rates, and discounting applied to calculate
                  present value of obligation
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-800 text-sm mb-1">Discount Rate</div>
                <div className="text-xs text-blue-700">
                  Based on market yields of government bonds with similar maturity (6.5% p.a.)
                </div>
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-medium text-green-800 text-sm mb-1">Salary Escalation</div>
                <div className="text-xs text-green-700">
                  Includes inflation, promotions, and merit increases (8% p.a. assumption)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Journal Entry Templates */}
      <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
        <h3 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
          📝 Standard Journal Entries
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-amber-200">
            <div className="font-medium text-amber-700 mb-2">Monthly Provision Entry</div>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-red-600">Dr. Leave Provision Expense</span>
                <span className="font-bold">₹63,075.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">Cr. Leave Encashment Liability</span>
                <span className="font-bold">₹63,075.00</span>
              </div>
              <div className="text-xs text-gray-500 pt-2 border-t">
                Narration: "Monthly leave encashment provision for [Month] [Year] based on actuarial
                valuation"
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-amber-200">
            <div className="font-medium text-amber-700 mb-2">Actuarial Adjustment Entry</div>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-green-600">Dr. Leave Encashment Liability</span>
                <span className="font-bold">₹7,975.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600">Cr. Leave Provision Expense</span>
                <span className="font-bold">₹7,975.00</span>
              </div>
              <div className="text-xs text-gray-500 pt-2 border-t">
                Narration: "Actuarial gain adjustment for H1 FY 2024-25 as per actuarial report [Ref
                No.]"
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audit & Documentation */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-xl p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-red-800 mb-2">🔍 Audit Requirements & Documentation</h3>
            <p className="text-red-700 text-sm">
              Ensure all supporting documents are maintained for statutory audit and tax assessment
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
            <FiDownload className="w-4 h-4" />
            Download Checklist
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded-lg border border-red-200">
            <div className="font-medium text-red-700 text-sm mb-2">Mandatory Documents</div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <FiCheckCircle className="w-3 h-3 text-green-600" />
                Actuarial Valuation Certificate
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="w-3 h-3 text-green-600" />
                Board Approval Minutes
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="w-3 h-3 text-green-600" />
                HR Leave Policy Document
              </li>
            </ul>
          </div>

          <div className="bg-white p-3 rounded-lg border border-red-200">
            <div className="font-medium text-red-700 text-sm mb-2">Audit Trail</div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <FiCheckCircle className="w-3 h-3 text-green-600" />
                Monthly Journal Vouchers
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="w-3 h-3 text-green-600" />
                Employee-wise Leave Records
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="w-3 h-3 text-green-600" />
                Previous Year Comparatives
              </li>
            </ul>
          </div>

          <div className="bg-white p-3 rounded-lg border border-red-200">
            <div className="font-medium text-red-700 text-sm mb-2">Compliance Status</div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">AS 15 Compliance</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  Compliant
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Tax Compliance</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  Compliant
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Next Audit</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Mar 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaveProvisionFooter
