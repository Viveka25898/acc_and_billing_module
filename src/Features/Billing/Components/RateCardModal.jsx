/* eslint-disable no-unused-vars */
import React from 'react'
import { X, FileText, MapPin } from 'lucide-react'
import { PAYROLL_DATA } from '../data/billingCalculationData'

const RateCardModal = ({ isOpen, onClose, formData, rateCardData }) => {
  if (!isOpen) return null

  const selectedSites = formData.selectedSites || []
  const customer = formData.customer
  const billingCycle = formData.selectedBillingCycle
  const totalDaysInMonth = billingCycle?.totalDays || 30

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const [day, month, year] = dateStr.split('/')
    return `${day}/${month}/${year}`
  }

  // Get payroll data for a specific service
  const getPayrollInfo = (siteName, designation) => {
    const sitePayroll = PAYROLL_DATA[customer]?.sites?.[siteName]
    if (!sitePayroll) return { count: 0, expectedDuties: 0 }

    const payrollEntry = sitePayroll.find((entry) => entry.designation === designation)
    if (!payrollEntry) return { count: 0, expectedDuties: 0 }

    // For machinery/consumables, expected duties = 1
    // For personnel, expected duties = count × totalDaysInMonth
    const count = payrollEntry.numberOfWorkers || 0
    const expectedDuties =
      payrollEntry.isMachinery || payrollEntry.isConsumable ? 1 : count * totalDaysInMonth

    return { count, expectedDuties }
  }

  const calculateSiteTotals = (site) => {
    const siteRateCard = rateCardData?.sites?.[site.name]
    if (!siteRateCard)
      return {
        personnelTotal: 0,
        machineryTotal: 0,
        grandTotal: 0,
        expectedBill: 0,
      }

    let personnelTotal = 0
    let machineryTotal = 0
    let expectedBill = 0

    siteRateCard.services.forEach((service) => {
      const { count } = getPayrollInfo(site.name, service.designation)
      // Simple calculation: Rate × Count (no leave adjustment)
      const expectedAmount = service.monthlyRate * count

      expectedBill += expectedAmount

      if (service.isMachinery || service.isConsumable) {
        machineryTotal += expectedAmount
      } else {
        personnelTotal += expectedAmount
      }
    })

    return {
      personnelTotal,
      machineryTotal,
      grandTotal: personnelTotal + machineryTotal,
      expectedBill,
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <FileText className="w-6 h-6 mr-3" />
            <div>
              <h2 className="text-xl font-bold">Rate Card</h2>
              <p className="text-sm text-green-100 mt-1">{customer}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-green-800 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Billing Period */}
        {billingCycle && (
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
            <p className="text-sm font-semibold text-gray-700">
              <span className="text-gray-600">Billing Period:</span>{' '}
              {formatDate(billingCycle.cycleFrom)} to {formatDate(billingCycle.cycleTo)} (
              {billingCycle.totalDays} days)
            </p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {selectedSites.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No sites selected</p>
            </div>
          ) : (
            <div className="space-y-8">
              {selectedSites.map((site, index) => {
                const siteRateCard = rateCardData?.sites?.[site.name]
                if (!siteRateCard) {
                  return (
                    <div key={site.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center mb-2">
                        <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                        <h3 className="text-lg font-bold text-gray-800">{site.name}</h3>
                      </div>
                      <p className="text-sm text-gray-500">No rate card data available</p>
                    </div>
                  )
                }

                const personnelServices = siteRateCard.services.filter(
                  (s) => !s.isMachinery && !s.isConsumable
                )
                const machineryServices = siteRateCard.services.filter(
                  (s) => s.isMachinery || s.isConsumable
                )
                const totals = calculateSiteTotals(site)

                return (
                  <div key={site.id} className="border border-gray-300 rounded-lg overflow-hidden">
                    {/* Site Header */}
                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-3 border-b border-gray-300">
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-green-600 mr-2" />
                        <h3 className="text-lg font-bold text-gray-800">{site.name}</h3>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{site.location}</p>
                    </div>

                    {/* Personnel Section */}
                    {personnelServices.length > 0 && (
                      <div className="p-4">
                        <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                          Personnel Rates
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700 w-12">
                                  Sr No
                                </th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700">
                                  Designation
                                </th>
                                <th className="border border-gray-300 px-3 py-2 text-right text-xs font-semibold text-gray-700">
                                  Rate (₹/Month)
                                </th>
                                <th className="border border-gray-300 px-3 py-2 text-center text-xs font-semibold text-gray-700">
                                  Count
                                </th>
                                <th className="border border-gray-300 px-3 py-2 text-right text-xs font-semibold text-gray-700">
                                  Total Duties
                                  <br />
                                  <span className="font-normal text-gray-500">(Expected)</span>
                                </th>
                                <th className="border border-gray-300 px-3 py-2 text-right text-xs font-semibold text-gray-700">
                                  Total Amount (₹)
                                  <br />
                                  <span className="font-normal text-gray-500">(Expected)</span>
                                </th>
                                <th className="border border-gray-300 px-3 py-2 text-center text-xs font-semibold text-gray-700">
                                  HSN/SAC
                                </th>
                                <th className="border border-gray-300 px-3 py-2 text-center text-xs font-semibold text-gray-700">
                                  GST %
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {personnelServices.map((service, idx) => {
                                const { count, expectedDuties } = getPayrollInfo(
                                  site.name,
                                  service.designation
                                )
                                const totalAmount = service.monthlyRate * count
                                return (
                                  <tr
                                    key={service.id}
                                    className="hover:bg-gray-50 transition-colors"
                                  >
                                    <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-700">
                                      {idx + 1}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900">
                                      {service.designation}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-right text-sm font-semibold text-gray-900">
                                      {service.monthlyRate.toLocaleString('en-IN')}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-700 font-medium">
                                      {count}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-right text-sm text-gray-700 font-medium">
                                      {expectedDuties}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-right text-sm font-bold text-green-700">
                                      {totalAmount.toLocaleString('en-IN')}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-700">
                                      {service.hsnCode}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-700">
                                      {service.gstRate}%
                                    </td>
                                  </tr>
                                )
                              })}
                              <tr className="bg-blue-50 font-semibold">
                                <td
                                  colSpan="5"
                                  className="border border-gray-300 px-3 py-2 text-right text-sm text-gray-800"
                                >
                                  Subtotal (Personnel):
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-right text-sm text-blue-700 font-bold">
                                  {formatCurrency(totals.personnelTotal)}
                                </td>
                                <td colSpan="2" className="border border-gray-300"></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Machinery & Materials Section */}
                    {machineryServices.length > 0 && (
                      <div className="p-4 pt-0">
                        <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide mt-4">
                          Machinery & Materials
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700 w-12">
                                  Sr No
                                </th>
                                <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold text-gray-700">
                                  Item
                                </th>
                                <th className="border border-gray-300 px-3 py-2 text-right text-xs font-semibold text-gray-700">
                                  Rate (₹/Month)
                                </th>
                                <th className="border border-gray-300 px-3 py-2 text-center text-xs font-semibold text-gray-700">
                                  Count
                                </th>
                                <th className="border border-gray-300 px-3 py-2 text-right text-xs font-semibold text-gray-700">
                                  Total Duties
                                  <br />
                                  <span className="font-normal text-gray-500">(Expected)</span>
                                </th>
                                <th className="border border-gray-300 px-3 py-2 text-right text-xs font-semibold text-gray-700">
                                  Total Amount (₹)
                                  <br />
                                  <span className="font-normal text-gray-500">(Expected)</span>
                                </th>
                                <th className="border border-gray-300 px-3 py-2 text-center text-xs font-semibold text-gray-700">
                                  HSN/SAC
                                </th>
                                <th className="border border-gray-300 px-3 py-2 text-center text-xs font-semibold text-gray-700">
                                  GST %
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {machineryServices.map((service, idx) => {
                                const { count, expectedDuties } = getPayrollInfo(
                                  site.name,
                                  service.designation
                                )
                                const totalAmount = service.monthlyRate * count
                                return (
                                  <tr
                                    key={service.id}
                                    className="hover:bg-gray-50 transition-colors"
                                  >
                                    <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-700">
                                      {personnelServices.length + idx + 1}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900">
                                      {service.designation}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-right text-sm font-semibold text-gray-900">
                                      {service.monthlyRate.toLocaleString('en-IN')}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-700 font-medium">
                                      {count}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-right text-sm text-gray-700 font-medium">
                                      {expectedDuties}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-right text-sm font-bold text-green-700">
                                      {totalAmount.toLocaleString('en-IN')}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-700">
                                      {service.hsnCode}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-700">
                                      {service.gstRate}%
                                    </td>
                                  </tr>
                                )
                              })}
                              <tr className="bg-orange-50 font-semibold">
                                <td
                                  colSpan="5"
                                  className="border border-gray-300 px-3 py-2 text-right text-sm text-gray-800"
                                >
                                  Subtotal (Machinery):
                                </td>
                                <td className="border border-gray-300 px-3 py-2 text-right text-sm text-orange-700 font-bold">
                                  {formatCurrency(totals.machineryTotal)}
                                </td>
                                <td colSpan="2" className="border border-gray-300"></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Grand Total for Site */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-bold text-base">
                          Expected Bill ({site.name}):
                        </span>
                        <span className="text-white font-bold text-xl">
                          {formatCurrency(totals.expectedBill)}
                        </span>
                      </div>
                      <p className="text-green-100 text-xs mt-1">
                        Based on commercial rate card (Rate × Count)
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 px-6 py-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default RateCardModal
