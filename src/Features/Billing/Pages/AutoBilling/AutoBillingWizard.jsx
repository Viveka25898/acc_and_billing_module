/* eslint-disable no-undef */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Stepper from '../../Components/Stepper'
import Step1ClientScope from './Step1ClientScope'
import Step2BillingCycle from './Step2BillingCycle'
import Step3InvoiceConfig from './Step3InvoiceConfig'
import Step4BillingCalculation from './Step4BillingCalculation'
import { WIZARD_STEPS } from '../../data/autoBillingData'

const AutoBillingWizard = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1 data
    branch: '',
    state: '',
    city: '',
    customer: '',
    billingScope: '',
    selectedSites: [],
    // Step 2 data
    selectedMonth: '',
    selectedBillingCycle: null,
    // Step 3 data
    invoiceSeries: '',
    invoiceType: '',
    siteFilter: 'all',
    // Step 4 data
    billingLines: [],
    calculations: {},
    poWoNumber: '',
    adjustForLeave: false,
  })

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep((prev) => prev + 1)
      toast.success(`Step ${currentStep} completed!`, { autoClose: 2000 })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved data will be lost.')) {
      toast.info('Auto billing wizard cancelled')
      navigate('/dashboard/billing-manager/billing-dashboard')
    }
  }

  const handleFinish = () => {
    // Final submission logic
    toast.success('Invoice generated successfully! 🎉')
    console.log('Final Form Data:', formData)
    // Navigate to invoice view or dashboard
    navigate('/dashboard/billing-manager/billing-dashboard')
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1ClientScope
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onCancel={handleCancel}
          />
        )
      case 2:
        return (
          <Step2BillingCycle
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 3:
        return (
          <Step3InvoiceConfig
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )
      case 4:
        return (
          <Step4BillingCalculation
            formData={formData}
            setFormData={setFormData}
            onNext={handleFinish}
            onPrevious={handlePrevious}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <span className="mr-3">🧾</span>
          Auto Billing Wizard
        </h1>
        <p className="text-gray-600 mt-1">
          Generate automated invoices for your clients - Step by step
        </p>
      </div>

      {/* Stepper */}
      <Stepper steps={WIZARD_STEPS} currentStep={currentStep} />

      {/* Step Content */}
      <div className="max-w-5xl mx-auto">{renderStep()}</div>

      {/* Debug Info (Remove in production)
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 max-w-5xl mx-auto">
          <details className="bg-gray-100 p-4 rounded-lg">
            <summary className="cursor-pointer font-semibold text-gray-700">
              Debug: Form Data
            </summary>
            <pre className="mt-2 text-xs overflow-auto">{JSON.stringify(formData, null, 2)}</pre>
          </details>
        </div>
      )} */}
    </div>
  )
}

export default AutoBillingWizard
