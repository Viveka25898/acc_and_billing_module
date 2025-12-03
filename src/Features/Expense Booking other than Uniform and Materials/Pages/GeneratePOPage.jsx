/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import POForm from '../Components/POForm'
import { useNavigate } from 'react-router-dom'

export default function GeneratePOPage() {
  const navigate = useNavigate()
  const handleSubmit = async (formData) => {
    try {
      // Get TDS section details if selected
      let tdsDetails = null
      if (formData.tdsSection) {
        const statutoryData = JSON.parse(localStorage.getItem('statutoryData') || '[]')
        const tdsInfo = statutoryData.find((item) => item.section === formData.tdsSection)
        if (tdsInfo) {
          tdsDetails = {
            section: tdsInfo.section,
            rate: tdsInfo.rate,
            description: tdsInfo.description,
            applicableFrom: tdsInfo.applicableFrom,
            remarks: tdsInfo.remarks,
          }
        }
      }

      const poToSave = {
        id: Date.now().toString(),
        poNumber: formData.poNumber,
        vendorName: formData.vendorName,
        poType: formData.poType,
        expenseType: formData.expenseType,
        description: formData.description,
        amount: parseFloat(formData.amount) || 0,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        attachment: formData.attachment
          ? {
              name: formData.attachment.name,
              type: formData.attachment.type,
              size: formData.attachment.size,
            }
          : null,
        isNewVendor: !!formData.isNewVendor,
        tdsSection: formData.tdsSection || null,
        tdsDetails: tdsDetails, // NEW: Store TDS details
        tdsApplicable: !!formData.tdsSection, // NEW: Flag for TDS applicability
        createdAt: new Date().toISOString(),
        status: 'submitted',
        createdBy: 'm1',
      }

      console.log('PO with TDS:', poToSave)

      const existing = JSON.parse(localStorage.getItem('oneTimePo') || '[]')
      existing.unshift(poToSave)
      localStorage.setItem('oneTimePo', JSON.stringify(existing))

      window.dispatchEvent(new Event('poCreated'))
      toast.success('PO generated successfully!')
    } catch (error) {
      console.error('Error submitting PO:', error)
      toast.error('Failed to generate PO.')
    }
  }

  return (
    <div className="p-4 max-w-4xl mx-auto w-full bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-600">Generate Purchase Order</h1>
      </div>
      <POForm onSubmit={handleSubmit} />
    </div>
  )
}
