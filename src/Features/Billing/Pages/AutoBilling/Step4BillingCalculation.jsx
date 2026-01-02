import React, { useState, useEffect } from 'react'
import { AlertCircle, Loader, FileText, Calculator, TrendingUp, TrendingDown } from 'lucide-react'
import { RATE_CARDS, PAYROLL_DATA, PREVIOUS_MONTH_BILLING } from '../../data/billingCalculationData'
import { BRANCHES } from '../../data/autoBillingData'

const Step4BillingCalculation = ({ formData, setFormData, onNext, onPrevious }) => {
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})
  const [billingLines, setBillingLines] = useState([])
  const [adjustForLeave, setAdjustForLeave] = useState(false)
  const [poWoNumber, setPoWoNumber] = useState('')
  const [calculations, setCalculations] = useState({
    subtotal: 0,
    machineryCharges: 0,
    consumables: 0,
    managementFees: 0,
    totalBeforeTax: 0,
    cgst: 0,
    sgst: 0,
    totalTax: 0,
    grandTotal: 0,
    previousMonth: 0,
    difference: 0,
    percentageChange: 0,
  })

  // Generate PO/WO Number
  useEffect(() => {
    if (formData.branch && formData.invoiceSeries) {
      const generatedNumber = generatePoWoNumber()
      setPoWoNumber(generatedNumber)
      console.log('📝 Auto-generated PO/WO Number:', generatedNumber)
    }
  }, [formData.branch, formData.invoiceSeries, formData.customer])

  const generatePoWoNumber = () => {
    try {
      // Find branch code
      const branch = BRANCHES.find((b) => b.name === formData.branch)
      const branchCode = branch ? branch.code : 'XXX'

      // Get invoice series prefix
      const prefix = formData.invoiceSeries === 'proforma' ? 'PO' : 'INV'

      // Generate sequential number (in production, this would come from backend)
      // For now, using date-based sequential number
      const date = new Date()
      const year = date.getFullYear().toString().slice(-2)
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const random = Math.floor(Math.random() * 999) + 1
      const sequentialNumber = `${year}${month}${random.toString().padStart(3, '0')}`

      return `${prefix}-${branchCode}-${sequentialNumber}`
    } catch (error) {
      console.error('Error generating PO/WO number:', error)
      return 'PO-XXX-001'
    }
  }

  useEffect(() => {
    generateBillingCalculation()
  }, [formData, adjustForLeave])

  const generateBillingCalculation = async () => {
    try {
      setLoading(true)
      console.log('🔍 Step 4 - Starting Billing Calculation...')
      console.log('📋 Full formData:', formData)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const customer = formData.customer
      const selectedSites = formData.selectedSites || []
      const billingCycle = formData.selectedBillingCycle

      console.log('👤 Selected Customer:', customer)
      console.log('🏢 Selected Sites:', selectedSites)
      console.log('📅 Billing Cycle:', billingCycle)

      if (!customer || !billingCycle) {
        console.error('❌ Missing customer or billing cycle!')
        throw new Error('Missing required billing information')
      }

      const totalDaysInCycle = billingCycle.totalDays
      console.log('📊 Total Days in Cycle:', totalDaysInCycle)

      const rateCard = RATE_CARDS[customer]
      const payrollData = PAYROLL_DATA[customer]
      const previousMonthData = PREVIOUS_MONTH_BILLING[customer]

      console.log('💰 Rate Card Found:', !!rateCard, rateCard)
      console.log('👥 Payroll Data Found:', !!payrollData, payrollData)
      console.log('📈 Previous Month Data:', previousMonthData)

      if (!rateCard || !payrollData) {
        console.error('❌ Rate card or payroll data missing for:', customer)
        console.log('Available customers in RATE_CARDS:', Object.keys(RATE_CARDS))
        console.log('Available customers in PAYROLL_DATA:', Object.keys(PAYROLL_DATA))
        throw new Error('Rate card or payroll data not found for selected customer')
      }

      let lineItems = []
      let lineIdCounter = 1

      console.log('🔄 Processing sites...')
      // Process each selected site
      selectedSites.forEach((site, index) => {
        const siteName = site.name
        console.log(`\n🏢 Site ${index + 1}:`, siteName)

        const siteRateCard = rateCard.sites[siteName]
        const sitePayroll = payrollData.sites[siteName]

        console.log('  💰 Site Rate Card:', !!siteRateCard, siteRateCard)
        console.log('  👥 Site Payroll:', !!sitePayroll, sitePayroll)

        if (!siteRateCard || !sitePayroll) {
          console.warn(`  ⚠️ Skipping site ${siteName} - missing rate card or payroll data`)
          console.log(
            '  Available sites in rate card:',
            rateCard.sites ? Object.keys(rateCard.sites) : 'none'
          )
          console.log(
            '  Available sites in payroll:',
            payrollData.sites ? Object.keys(payrollData.sites) : 'none'
          )
          return
        }

        // Process each service/designation
        console.log(`  📝 Processing ${siteRateCard.services.length} services...`)
        siteRateCard.services.forEach((service, svcIndex) => {
          const payrollEntry = sitePayroll.find((p) => p.designation === service.designation)

          console.log(`    Service ${svcIndex + 1}: ${service.designation}`)
          console.log(`      Monthly Rate: ₹${service.monthlyRate}`)
          console.log(`      Payroll Entry:`, payrollEntry)

          if (payrollEntry) {
            const ratePerDay = service.monthlyRate / totalDaysInCycle
            const dutyDays = payrollEntry.totalDays
            const amount = ratePerDay * dutyDays

            console.log(
              `      ✅ Calculated - Rate/Day: ₹${ratePerDay.toFixed(2)}, Days: ${dutyDays}, Amount: ₹${amount.toFixed(2)}`
            )

            lineItems.push({
              id: lineIdCounter++,
              location: siteName,
              product: service.product,
              designation: service.designation,
              dutyDays: dutyDays,
              rate: ratePerDay,
              monthlyRate: service.monthlyRate,
              amount: amount,
              hsnCode: service.hsnCode,
              gstRate: service.gstRate,
              editable: true,
            })
          } else {
            console.log(`      ⚠️ No payroll entry found for ${service.designation}`)
          }
        })
      })

      console.log('\n✅ Total Line Items Generated:', lineItems.length)
      console.log('📋 Line Items:', lineItems)

      setBillingLines(lineItems)
      calculateTotals(lineItems, rateCard, previousMonthData, selectedSites)

      console.log('✅ Billing calculation completed successfully!')
      setLoading(false)
    } catch (error) {
      console.error('❌ Error generating billing calculation:', error)
      setErrors({ general: error.message })
      setLoading(false)
    }
  }

  const calculateTotals = (lines, rateCard, previousMonthData, selectedSites) => {
    try {
      // Calculate subtotal from line items (includes machinery & consumables now)
      const subtotal = lines.reduce((sum, line) => sum + line.amount, 0)

      // Calculate management fees
      const managementFeesPercent = rateCard.managementFees || 0
      const managementFeesAmount = (subtotal * managementFeesPercent) / 100

      // Total before tax
      const totalBeforeTax = subtotal + managementFeesAmount

      // Calculate GST (18% = 9% CGST + 9% SGST)
      const cgst = (totalBeforeTax * 9) / 100
      const sgst = (totalBeforeTax * 9) / 100
      const totalTax = cgst + sgst

      // Grand total
      const grandTotal = totalBeforeTax + totalTax

      // Previous month comparison
      let previousMonthTotal = 0
      selectedSites.forEach((site) => {
        previousMonthTotal += previousMonthData?.[site.name] || 0
      })

      const difference = grandTotal - previousMonthTotal
      const percentageChange = previousMonthTotal > 0 ? (difference / previousMonthTotal) * 100 : 0

      setCalculations({
        subtotal,
        machineryCharges: 0,
        consumables: 0,
        managementFees: managementFeesAmount,
        totalBeforeTax,
        cgst,
        sgst,
        totalTax,
        grandTotal,
        previousMonth: previousMonthTotal,
        difference,
        percentageChange,
      })
    } catch (error) {
      console.error('Error calculating totals:', error)
      setErrors({ calculation: 'Error calculating totals' })
    }
  }

  const handleDutyDaysChange = (lineId, newDays) => {
    try {
      const updatedLines = billingLines.map((line) => {
        if (line.id === lineId) {
          const newAmount = line.rate * parseFloat(newDays || 0)
          return { ...line, dutyDays: parseFloat(newDays || 0), amount: newAmount }
        }
        return line
      })

      setBillingLines(updatedLines)

      // Recalculate totals
      const customer = formData.customer
      const rateCard = RATE_CARDS[customer]
      const previousMonthData = PREVIOUS_MONTH_BILLING[customer]
      const selectedSites = formData.selectedSites || []

      calculateTotals(updatedLines, rateCard, previousMonthData, selectedSites)
    } catch (error) {
      console.error('Error updating duty days:', error)
    }
  }

  const handleRemoveLine = (lineId) => {
    try {
      const updatedLines = billingLines.filter((line) => line.id !== lineId)
      setBillingLines(updatedLines)

      const customer = formData.customer
      const rateCard = RATE_CARDS[customer]
      const previousMonthData = PREVIOUS_MONTH_BILLING[customer]
      const selectedSites = formData.selectedSites || []

      calculateTotals(updatedLines, rateCard, previousMonthData, selectedSites)
    } catch (error) {
      console.error('Error removing line:', error)
    }
  }

  const handleRateCardClick = () => {
    alert('Rate Card modal will be implemented in next phase')
    // TODO: Open rate card modal showing all rates for selected customer
  }

  const validateStep = () => {
    const newErrors = {}

    if (billingLines.length === 0) {
      newErrors.lines = 'No billing lines generated. Please check your selections.'
    }

    if (!poWoNumber.trim()) {
      newErrors.poWo = 'Please enter PO/WO number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      // Save calculation data to formData
      setFormData((prev) => ({
        ...prev,
        billingLines,
        calculations,
        poWoNumber,
        adjustForLeave,
      }))
      onNext()
    }
  }

  const handleSaveAsDraft = () => {
    try {
      const draftData = {
        ...formData,
        billingLines,
        calculations,
        poWoNumber,
        adjustForLeave,
        savedAt: new Date().toISOString(),
      }

      localStorage.setItem('billing_draft', JSON.stringify(draftData))
      alert('Draft saved successfully!')
    } catch (error) {
      console.error('Error saving draft:', error)
      alert('Failed to save draft')
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 flex flex-col items-center justify-center min-h-[400px]">
        <Loader className="w-12 h-12 text-green-600 animate-spin mb-4" />
        <p className="text-gray-600 text-lg font-medium">Calculating billing...</p>
        <p className="text-gray-500 text-sm mt-2">Please wait while we process the data</p>
      </div>
    )
  }

  if (errors.general) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Billing Data</h3>
            <p className="text-gray-600 mb-4">{errors.general}</p>
            <button
              onClick={onPrevious}
              className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Billing Calculation - {formData.customer}
          </h2>
          <p className="text-gray-600 text-sm flex items-center">
            <Calculator className="w-4 h-4 mr-2" />
            {formData.selectedBillingCycle?.month || 'Current Period'}
            {' | '}
            {formData.selectedBillingCycle?.cycleFrom} to {formData.selectedBillingCycle?.cycleTo}
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <label className="flex items-center cursor-pointer bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
            <input
              type="checkbox"
              checked={adjustForLeave}
              onChange={(e) => setAdjustForLeave(e.target.checked)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Adjust for Leave Days</span>
          </label>
          <button
            onClick={handleRateCardClick}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center text-sm"
          >
            <FileText className="w-4 h-4 mr-2" />
            Rate Card
          </button>
        </div>
      </div>

      {/* Billing Table */}
      <div className="overflow-x-auto mb-6 border border-gray-300 rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Location
              </th>
              <th className="border border-gray-300 px-3 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Product/Service
              </th>
              <th className="border border-gray-300 px-3 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Designation
              </th>
              <th className="border border-gray-300 px-3 py-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                Duty Days
              </th>
              <th className="border border-gray-300 px-3 py-3 text-right text-xs sm:text-sm font-semibold text-gray-700">
                Rate (₹)
              </th>
              <th className="border border-gray-300 px-3 py-3 text-right text-xs sm:text-sm font-semibold text-gray-700">
                Amount (₹)
              </th>
              <th className="border border-gray-300 px-3 py-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {billingLines.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                >
                  No billing data available
                </td>
              </tr>
            ) : (
              billingLines.map((line) => (
                <tr key={line.id} className="hover:bg-gray-50 transition-colors">
                  <td className="border border-gray-300 px-3 py-2 text-xs sm:text-sm text-gray-900">
                    {line.location}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-xs sm:text-sm text-gray-700">
                    {line.product}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-xs sm:text-sm font-medium text-blue-700">
                    {line.designation}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <input
                      type="number"
                      value={line.dutyDays}
                      onChange={(e) => handleDutyDaysChange(line.id, e.target.value)}
                      className="w-16 sm:w-20 px-2 py-1 border border-gray-300 rounded text-center text-xs sm:text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="0"
                      step="0.5"
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right text-xs sm:text-sm font-medium text-gray-900">
                    {line.rate.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right text-xs sm:text-sm font-bold text-gray-900">
                    {line.amount.toLocaleString('en-IN', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <button
                      onClick={() => handleRemoveLine(line.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left: Comparison with Previous Month */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
            <Calculator className="w-4 h-4 mr-2" />
            Previous Month Comparison
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Previous Month:</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(calculations.previousMonth)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Current Month:</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(calculations.grandTotal)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-blue-300">
              <span className="text-gray-600">Difference:</span>
              <span
                className={`font-bold flex items-center ${calculations.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {calculations.difference >= 0 ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {formatCurrency(Math.abs(calculations.difference))}
                <span className="ml-2 text-xs">
                  ({calculations.percentageChange.toFixed(2)}%{' '}
                  {calculations.difference >= 0 ? 'increase' : 'decrease'})
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Amount Breakdown */}
        <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Amount Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal (incl. Machinery & Consumables):</span>
              <span className="font-semibold">{formatCurrency(calculations.subtotal)}</span>
            </div>
            {calculations.managementFees > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Management Fees:</span>
                <span className="font-semibold">{formatCurrency(calculations.managementFees)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-green-300">
              <span className="text-gray-700 font-semibold">Total Amount:</span>
              <span className="font-bold text-gray-900">
                {formatCurrency(calculations.totalBeforeTax)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">+ 18% GST:</span>
              <span className="font-semibold text-blue-700">
                {formatCurrency(calculations.totalTax)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t-2 border-green-400">
              <span className="text-lg font-bold text-gray-800">Grand Total:</span>
              <span className="text-lg font-bold text-green-700">
                {formatCurrency(calculations.grandTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PO/WO Number */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          PO/WO Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={poWoNumber}
          onChange={(e) => {
            setPoWoNumber(e.target.value)
            setErrors((prev) => ({ ...prev, poWo: '' }))
          }}
          placeholder="Enter Purchase Order or Work Order number"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
            errors.poWo ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.poWo && (
          <div className="mt-2 flex items-center text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.poWo}
          </div>
        )}
      </div>

      {/* Error Messages */}
      {errors.lines && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <span className="text-sm font-medium">{errors.lines}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-between items-center pt-6 mt-6 border-t gap-3">
        <button
          onClick={onPrevious}
          className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous Step
        </button>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleSaveAsDraft}
            className="px-6 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium flex items-center"
          >
            <FileText className="w-5 h-5 mr-2" />
            Save as Draft
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
          >
            Review & Generate
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Step4BillingCalculation
