/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { selectAuthContext } from '../../../Auth/authSlice'
import {
  EXPENSE_TYPES,
  URGENCY_OPTIONS,
  ATTACHMENT_TYPES,
  ALLOWED_FILE_EXTENSIONS,
  MAX_FILE_SIZE_BYTES,
  MAX_ATTACHMENTS_COUNT,
  VALIDATION_LIMITS,
  formatAmountINR,
  WORKFLOW_STATUS,
  PAYMENT_STATUS,
} from '../config/nonPoExpenseConfig'
import {
  getSitesList,
  getClientsList,
  getExpenseCategoriesByType,
  createExpenseRequest,
  updateExpenseDraft,
  getExpenseRequestById,
} from '../data/nonPoExpenseMockData'
import NonPoConfirmDialog from './NonPoConfirmDialog'
import NonPoStatusBadge from './NonPoStatusBadge'
import NonPoUrgencyBadge from './NonPoUrgencyBadge'

const NonPoExpenseRequestForm = ({
  role = 'employee',
  myRequestsPath = '/dashboard/employee/my-non-po-requests',
  mode = 'create', // 'create' or 'edit'
}) => {
  const navigate = useNavigate()
  const { claimId } = useParams()
  const authContext = useSelector(selectAuthContext)

  // Determine starting approver label based on requester role
  const firstApproverLabel = useMemo(() => {
    if (role === 'regional-head') return 'AVP Operations'
    if (role === 'avp-operations') return 'VP Operations'
    return 'Regional Head (RH)'
  }, [role])

  // ─── Masters State ────────────────────────────────────────────────────────
  const [sites, setSites] = useState([])
  const [clients, setClients] = useState([])

  // ─── Form Data State ──────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    // Section A: Requester
    employeeCode: authContext?.empId || 'EMP0000012',
    employeeName: authContext?.empName || 'Karan Malhotra',
    requesterRole: authContext?.role || role,
    region: authContext?.region || 'W',

    // Section B: Expense Details
    expenseType: '',
    categoryId: '',
    categoryName: '',
    urgency: 'normal',
    incidentDate: '',
    siteId: '',
    siteName: '',
    costCentre: '',
    billable: 'No',
    clientId: '',
    clientName: '',
    expenseDate: new Date().toISOString().slice(0, 10),
    amountRequested: '',

    // GST Information
    isGstBill: 'No', // 'No' | 'Yes'
    vendorGstin: '',
    invoiceNumber: '',

    // Section C: Justification
    claimReason: '',
    nonPoJustification: '',

    // Section D: Bank Details for Payment
    accountHolderName: '',
    bankName: '',
    bankAccountNo: '',
    confirmBankAccountNo: '',
    ifscCode: '',
    passbookImage: null, // { fileName, size, rawFile, previewUrl }

    // Section E: Attachments
    attachments: [],
  })

  // ─── UI & Validation State ────────────────────────────────────────────────
  const [formErrors, setFormErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingClaim, setExistingClaim] = useState(null)
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  const fileInputRef = useRef(null)
  const passbookInputRef = useRef(null)

  // ─── Load Masters ─────────────────────────────────────────────────────────
  useEffect(() => {
    const loadAllMasters = async () => {
      try {
        const [sitesData, clientsData] = await Promise.all([
          getSitesList(),
          getClientsList(),
        ])
        setSites(sitesData)
        setClients(clientsData)

        // If in Edit Mode, fetch existing claim
        if (mode === 'edit' && claimId) {
          try {
            const claim = await getExpenseRequestById(claimId)
            setExistingClaim(claim)
            setFormData({
              ...claim,
              amountRequested: String(claim.amountRequested || ''),
              confirmBankAccountNo: claim.bankAccountNo || '',
              isGstBill: claim.isGstBill || (claim.vendorGstin ? 'Yes' : 'No'),
              vendorGstin: claim.vendorGstin || '',
              invoiceNumber: claim.invoiceNumber || '',
            })
          } catch (err) {
            toast.error('Could not load draft details')
          }
        }
        setIsDataLoaded(true)
      } catch (err) {
        console.error('Error loading masters', err)
      }
    }
    loadAllMasters()
  }, [mode, claimId])

  // ─── Filtered Categories based on Expense Type ────────────────────────────
  const availableCategories = useMemo(() => {
    if (!formData.expenseType) return []
    return getExpenseCategoriesByType(formData.expenseType)
  }, [formData.expenseType])

  // ─── Filtered Clients based on Selected Site ──────────────────────────────
  const availableClients = useMemo(() => {
    if (!formData.siteId) return clients
    const selectedSite = sites.find((s) => s.id === formData.siteId)
    if (!selectedSite || !selectedSite.clientIds) return clients
    return clients.filter((c) => selectedSite.clientIds.includes(c.id))
  }, [formData.siteId, sites, clients])

  // ─── Handle Site Change (Auto-sets Region & Cost Centre) ───────────────────
  const handleSiteChange = (e) => {
    const sId = e.target.value
    const selected = sites.find((s) => s.id === sId)
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        siteId: sId,
        siteName: selected.name,
        region: selected.region,
        costCentre: selected.costCentre,
        clientId: '',
        clientName: '',
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        siteId: '',
        siteName: '',
        costCentre: '',
        clientId: '',
        clientName: '',
      }))
    }
    clearFieldError('siteId')
  }

  // ─── Handle Expense Type Change ───────────────────────────────────────────
  const handleExpenseTypeChange = (e) => {
    const val = e.target.value
    setFormData((prev) => ({
      ...prev,
      expenseType: val,
      categoryId: '',
      categoryName: '',
      incidentDate: val === 'Emergency Repair' ? prev.incidentDate : '',
    }))
    clearFieldError('expenseType')
  }

  // ─── Standard Input Handler ───────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    clearFieldError(name)
  }

  // Auto-uppercase for IFSC Code
  const handleIfscChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11)
    setFormData((prev) => ({ ...prev, ifscCode: val }))
    clearFieldError('ifscCode')
  }

  const clearFieldError = (fieldName) => {
    if (formErrors[fieldName]) {
      setFormErrors((prev) => {
        const next = { ...prev }
        delete next[fieldName]
        return next
      })
    }
  }

  // ─── Bank Passbook Upload Handler ─────────────────────────────────────────
  const handlePassbookUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error('Bank passbook/cheque file exceeds 5MB size limit.')
      return
    }

    const ext = file.name.split('.').pop().toLowerCase()
    if (!['pdf', 'jpg', 'jpeg', 'png'].includes(ext)) {
      toast.error('Allowed passbook formats: PDF, JPG, JPEG, PNG')
      return
    }

    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null

    setFormData((prev) => ({
      ...prev,
      passbookImage: {
        fileName: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        rawFile: file,
        previewUrl,
        type: 'Bank Passbook / Cheque Proof',
      },
    }))
    clearFieldError('passbookImage')

    if (passbookInputRef.current) {
      passbookInputRef.current.value = ''
    }
  }

  const handleRemovePassbook = () => {
    if (formData.passbookImage?.previewUrl) {
      URL.revokeObjectURL(formData.passbookImage.previewUrl)
    }
    setFormData((prev) => ({
      ...prev,
      passbookImage: null,
    }))
  }

  // ─── General File Attachments Handler (Section E) ─────────────────────────
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    if (formData.attachments.length + files.length > MAX_ATTACHMENTS_COUNT) {
      toast.error(`Maximum ${MAX_ATTACHMENTS_COUNT} attachments permitted`)
      return
    }

    const newAttachments = []
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error(`File "${file.name}" exceeds 5MB limit`)
        continue
      }
      const ext = file.name.split('.').pop().toLowerCase()
      if (!ALLOWED_FILE_EXTENSIONS.includes(ext)) {
        toast.error(`Extension .${ext} not allowed.`)
        continue
      }

      newAttachments.push({
        id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        fileName: file.name,
        type: 'Invoice',
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        rawFile: file,
      })
    }

    if (newAttachments.length) {
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...newAttachments],
      }))
      clearFieldError('attachments')
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAttachmentTypeChange = (attachmentId, newType) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.map((att) =>
        att.id === attachmentId ? { ...att, type: newType } : att
      ),
    }))
  }

  const handleRemoveAttachment = (attachmentId) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((att) => att.id !== attachmentId),
    }))
  }

  // ─── Validation Engine ────────────────────────────────────────────────────
  const validateForm = () => {
    const errors = {}

    // Section B Validations
    if (!formData.siteId) errors.siteId = 'Please select an Operational Site.'
    if (!formData.expenseType) errors.expenseType = 'Expense Type is required.'
    if (!formData.categoryId) errors.categoryId = 'Expense Category is required.'

    if (formData.expenseType === 'Emergency Repair') {
      if (!formData.incidentDate) {
        errors.incidentDate = 'Incident Date is mandatory for Emergency Repairs.'
      } else if (new Date(formData.incidentDate) > new Date()) {
        errors.incidentDate = 'Incident Date cannot be in the future.'
      }
    }

    if (formData.billable === 'Yes' && !formData.clientId) {
      errors.clientId = 'Client selection is mandatory for billable claims.'
    }

    const amt = parseFloat(formData.amountRequested)
    if (!formData.amountRequested || isNaN(amt) || amt <= 0) {
      errors.amountRequested = 'Enter a valid amount greater than ₹0.00'
    } else if (amt > VALIDATION_LIMITS.MAX_AMOUNT) {
      errors.amountRequested = `Amount exceeds allowed limit of ₹99,99,99,999.99`
    }

    if (!formData.expenseDate) {
      errors.expenseDate = 'Expense Date is required.'
    } else {
      const expDate = new Date(formData.expenseDate)
      const today = new Date()
      const pastLimit = new Date()
      pastLimit.setDate(today.getDate() - VALIDATION_LIMITS.MAX_PAST_DAYS)

      if (expDate > today) {
        errors.expenseDate = 'Expense Date cannot be in the future.'
      } else if (expDate < pastLimit) {
        errors.expenseDate = `Expense Date cannot be older than ${VALIDATION_LIMITS.MAX_PAST_DAYS} days.`
      }
    }

    // GST Bill Validations
    if (formData.isGstBill === 'Yes') {
      const gstinTrim = (formData.vendorGstin || '').trim().toUpperCase()
      if (!gstinTrim) {
        errors.vendorGstin = 'Vendor GSTIN is required for GST bills.'
      } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstinTrim)) {
        errors.vendorGstin = 'Enter a valid 15-character GSTIN (e.g. 27ABCDE1234F1Z5).'
      }

      if (!(formData.invoiceNumber || '').trim()) {
        errors.invoiceNumber = 'Vendor Invoice / Bill Number is required.'
      }
    }

    // Section C Validations
    if (!formData.claimReason || formData.claimReason.trim().length < VALIDATION_LIMITS.REASON_MIN) {
      errors.claimReason = `Reason must be at least ${VALIDATION_LIMITS.REASON_MIN} characters.`
    }

    if (!formData.nonPoJustification || formData.nonPoJustification.trim().length < VALIDATION_LIMITS.JUSTIFICATION_MIN) {
      errors.nonPoJustification = `Non-PO justification must be at least ${VALIDATION_LIMITS.JUSTIFICATION_MIN} characters explaining why a PO was bypassed.`
    }

    // Section D: Bank Details Validations
    if (!formData.accountHolderName.trim()) {
      errors.accountHolderName = 'Beneficiary / Account Holder Name is required.'
    }

    if (!formData.bankName.trim()) {
      errors.bankName = 'Bank Name & Branch is required.'
    }

    const accTrim = formData.bankAccountNo.trim()
    if (!accTrim) {
      errors.bankAccountNo = 'Bank Account Number is required.'
    } else if (!/^\d{9,18}$/.test(accTrim)) {
      errors.bankAccountNo = 'Enter a valid 9 to 18-digit bank account number.'
    }

    if (!formData.confirmBankAccountNo.trim()) {
      errors.confirmBankAccountNo = 'Please confirm the bank account number.'
    } else if (formData.confirmBankAccountNo.trim() !== accTrim) {
      errors.confirmBankAccountNo = 'Bank account numbers do not match.'
    }

    const ifscTrim = formData.ifscCode.trim()
    if (!ifscTrim) {
      errors.ifscCode = 'IFSC Code is required.'
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscTrim)) {
      errors.ifscCode = 'Enter a valid 11-character IFSC Code (e.g. SBIN0001234, HDFC0000001).'
    }

    if (!formData.passbookImage) {
      errors.passbookImage = 'Bank Passbook / Cancelled Cheque image proof is required for disbursement.'
    }

    // Section E Validations (At least 1 supporting bill/attachment)
    if (formData.attachments.length === 0) {
      errors.attachments = 'At least one supporting bill or incident proof attachment is required.'
    }

    return errors
  }

  // ─── Actions: Submit Request ─────────────────────────────────────────────
  const handleSubmitClick = (e) => {
    e.preventDefault()
    setGeneralError('')
    const errors = validateForm()

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      setGeneralError('Please fill all required fields and correct the highlighted errors.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setShowConfirmModal(true)
  }

  const handleConfirmedSubmit = async () => {
    setIsSubmitting(true)
    try {
      if (mode === 'edit' && claimId) {
        const res = await updateExpenseDraft(claimId, formData, true)
        toast.success(`Claim ${res.claimId} submitted for ${firstApproverLabel} Approval!`)
      } else {
        const res = await createExpenseRequest(formData, false)
        toast.success(`Claim ${res.claimId} submitted successfully for ${firstApproverLabel} Approval!`)
      }
      setShowConfirmModal(false)
      navigate(myRequestsPath)
    } catch (err) {
      toast.error('Submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="px-4 pt-6 pb-28 max-w-5xl mx-auto">
      {/* ── Page Header Strip ──────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 rounded-2xl p-6 text-white shadow-lg mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">📝</span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {mode === 'edit' ? 'Edit Non-PO Expense Draft' : 'Create Non-PO / Emergency Expense Request'}
            </h1>
          </div>
          <p className="text-green-100 text-xs sm:text-sm">
            Raise genuine site emergency claims. Payment disbursement will be processed directly to the verified bank account.
          </p>
        </div>
        <NavLink
          to={myRequestsPath}
          className="bg-white/95 text-green-800 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl hover:bg-white shadow transition flex items-center gap-1.5"
        >
          <span>📋</span> My Requests
        </NavLink>
      </div>

      {/* ── Summary Status Strip (Draft/Edit Mode) ─────────────────────────── */}
      {mode === 'edit' && existingClaim && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
              {existingClaim.claimId}
            </span>
            <NonPoStatusBadge status={existingClaim.workflowStatus} />
          </div>
          <div className="text-gray-500 text-xs">
            Created on: <span className="font-medium text-gray-700">{existingClaim.claimDate}</span>
          </div>
        </div>
      )}

      {/* ── Global Error Banner ────────────────────────────────────────────── */}
      {generalError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-xs mb-6 text-red-700 text-sm flex items-center gap-3 animate-shake">
          <span className="text-lg">⚠️</span>
          <span className="font-medium">{generalError}</span>
        </div>
      )}

      {/* ── Main Form Container ───────────────────────────────────────────── */}
      <form onSubmit={handleSubmitClick} className="space-y-6">

        {/* ── SECTION A: REQUESTER DETAILS (READ-ONLY) ────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="bg-gray-50/80 px-6 py-3.5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-600"></span>
              Section A: Requester Information (System Auto-Filled)
            </h2>
            <span className="text-xs text-gray-500 font-medium">Read-Only</span>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50/30">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Employee Code</label>
              <input
                type="text"
                readOnly
                value={formData.employeeCode}
                className="w-full bg-gray-100/80 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 font-mono cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Employee Name</label>
              <input
                type="text"
                readOnly
                value={formData.employeeName}
                className="w-full bg-gray-100/80 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 cursor-not-allowed font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Designation / Role</label>
              <input
                type="text"
                readOnly
                value={formData.requesterRole}
                className="w-full bg-gray-100/80 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 cursor-not-allowed capitalize"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Home Region</label>
              <input
                type="text"
                readOnly
                value={formData.region || 'W'}
                className="w-full bg-gray-100/80 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 cursor-not-allowed font-semibold"
              />
            </div>
          </div>
        </div>

        {/* ── SECTION B: EXPENSE SPECIFICATION ────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="bg-gray-50/80 px-6 py-3.5 border-b border-gray-200">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-600"></span>
              Section B: Expense Details & Site Mapping
            </h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {/* Site Selection */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Operational Site <span className="text-red-500">*</span>
                </label>
                <select
                  name="siteId"
                  value={formData.siteId}
                  onChange={handleSiteChange}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                    formErrors.siteId ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Select Active Site in Your Region --</option>
                  {sites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.code} - {site.name} ({site.regionName} Region)
                    </option>
                  ))}
                </select>
                {formErrors.siteId && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.siteId}</p>
                )}
              </div>

              {/* Cost Centre (Auto-derived) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Cost Centre <span className="text-xs text-gray-400 font-normal">(Auto)</span>
                </label>
                <input
                  type="text"
                  readOnly
                  placeholder="Set by Site"
                  value={formData.costCentre}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-600 font-mono cursor-not-allowed"
                />
              </div>

              {/* Expense Type */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Expense Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="expenseType"
                  value={formData.expenseType}
                  onChange={handleExpenseTypeChange}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                    formErrors.expenseType ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- Select Expense Type --</option>
                  {EXPENSE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {formErrors.expenseType && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.expenseType}</p>
                )}
              </div>

              {/* Expense Category */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Expense Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => {
                    const cId = e.target.value
                    const found = availableCategories.find((c) => c.id === cId)
                    setFormData((prev) => ({
                      ...prev,
                      categoryId: cId,
                      categoryName: found ? found.name : '',
                    }))
                    clearFieldError('categoryId')
                  }}
                  disabled={!formData.expenseType}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    formErrors.categoryId ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                  }`}
                >
                  <option value="">
                    {formData.expenseType ? '-- Choose Category --' : 'Select Type First'}
                  </option>
                  {availableCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {formErrors.categoryId && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.categoryId}</p>
                )}
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Urgency Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                >
                  {URGENCY_OPTIONS.map((urg) => (
                    <option key={urg.value} value={urg.value}>
                      {urg.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Incident Date (Conditional: Emergency Repair) */}
              {formData.expenseType === 'Emergency Repair' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Incident Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="incidentDate"
                    max={new Date().toISOString().slice(0, 10)}
                    value={formData.incidentDate}
                    onChange={handleChange}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                      formErrors.incidentDate ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.incidentDate && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.incidentDate}</p>
                  )}
                </div>
              )}

              {/* Expense Date */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Expense Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="expenseDate"
                  max={new Date().toISOString().slice(0, 10)}
                  value={formData.expenseDate}
                  onChange={handleChange}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                    formErrors.expenseDate ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                  }`}
                />
                {formErrors.expenseDate && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.expenseDate}</p>
                )}
              </div>

              {/* Billable to Client */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Billable to Client? <span className="text-red-500">*</span>
                </label>
                <select
                  name="billable"
                  value={formData.billable}
                  onChange={(e) => {
                    const val = e.target.value
                    setFormData((prev) => ({
                      ...prev,
                      billable: val,
                      clientId: val === 'No' ? '' : prev.clientId,
                      clientName: val === 'No' ? '' : prev.clientName,
                    }))
                  }}
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                >
                  <option value="No">No (Internal Cost)</option>
                  <option value="Yes">Yes (Client Billable)</option>
                </select>
              </div>

              {/* Client Selection (Conditional: Billable = Yes) */}
              {formData.billable === 'Yes' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Client <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="clientId"
                    value={formData.clientId}
                    onChange={(e) => {
                      const cId = e.target.value
                      const selected = clients.find((c) => c.id === cId)
                      setFormData((prev) => ({
                        ...prev,
                        clientId: cId,
                        clientName: selected ? selected.name : '',
                      }))
                      clearFieldError('clientId')
                    }}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                      formErrors.clientId ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                    }`}
                  >
                    <option value="">-- Select Client Linked to Site --</option>
                    {availableClients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.clientId && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.clientId}</p>
                  )}
                </div>
              )}

              {/* Amount Requested */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Amount Requested (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    name="amountRequested"
                    placeholder="e.g. 25000.00"
                    value={formData.amountRequested}
                    onChange={handleChange}
                    className={`w-full pl-8 pr-3.5 py-2.5 border rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                      formErrors.amountRequested ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                    }`}
                  />
                </div>
                {formErrors.amountRequested ? (
                  <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.amountRequested}</p>
                ) : formData.amountRequested ? (
                  <p className="text-xs text-emerald-600 mt-1 font-medium">
                    Formatted: {formatAmountINR(formData.amountRequested)}
                  </p>
                ) : null}
              </div>

              {/* ── GST Bill Toggle & Details ── */}
              <div className="lg:col-span-2 pt-3 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Is this a GST Bill? (Tax Invoice) <span className="text-red-500">*</span></span>
                  <span className="text-[11px] font-normal text-gray-400">Select Yes if vendor issued a Tax Invoice with GST</span>
                </label>
                <div className="grid grid-cols-2 gap-3 sm:max-w-md">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        isGstBill: 'No',
                        vendorGstin: '',
                        invoiceNumber: '',
                      }))
                      clearFieldError('vendorGstin')
                      clearFieldError('invoiceNumber')
                    }}
                    className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      formData.isGstBill === 'No'
                        ? 'bg-gray-800 text-white border-gray-800 shadow-2xs'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span>📄</span> No (Cash Memo / Non-GST)
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, isGstBill: 'Yes' }))}
                    className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      formData.isGstBill === 'Yes'
                        ? 'bg-green-600 text-white border-green-600 shadow-2xs'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-green-50/50 hover:border-green-300'
                    }`}
                  >
                    <span>🧾</span> Yes (GST Tax Invoice)
                  </button>
                </div>
              </div>

              {/* Conditional GST Bill Fields (Vendor GSTIN & Vendor Invoice No.) */}
              {formData.isGstBill === 'Yes' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Vendor GSTIN Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="vendorGstin"
                      maxLength={15}
                      placeholder="e.g. 27ABCDE1234F1Z5"
                      value={formData.vendorGstin}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          vendorGstin: e.target.value.toUpperCase().trim(),
                        }))
                        clearFieldError('vendorGstin')
                      }}
                      className={`w-full border rounded-xl px-3.5 py-2.5 text-sm font-mono uppercase bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                        formErrors.vendorGstin ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.vendorGstin ? (
                      <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.vendorGstin}</p>
                    ) : (
                      <p className="text-[11px] text-gray-400 mt-1">15-digit GSTIN printed on vendor invoice</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Vendor Invoice / Bill No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="invoiceNumber"
                      placeholder="e.g. INV-2026-9901 or Bill #450"
                      value={formData.invoiceNumber}
                      onChange={handleChange}
                      className={`w-full border rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                        formErrors.invoiceNumber ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.invoiceNumber ? (
                      <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.invoiceNumber}</p>
                    ) : (
                      <p className="text-[11px] text-gray-400 mt-1">Invoice / bill number printed on vendor bill</p>
                    )}
                  </div>
                </>
              )}

            </div>
          </div>
        </div>

        {/* ── SECTION C: OPERATIONAL JUSTIFICATION ────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="bg-gray-50/80 px-6 py-3.5 border-b border-gray-200">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-600"></span>
              Section C: Reason & Emergency Justification
            </h2>
          </div>
          <div className="p-6 space-y-5">
            {/* Claim Reason */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Operational Claim Reason <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-gray-400">
                  {formData.claimReason.length} / {VALIDATION_LIMITS.REASON_MAX} chars (min 20)
                </span>
              </div>
              <textarea
                name="claimReason"
                rows={3}
                placeholder="Explain the incident, breakdown, or service required in detail..."
                value={formData.claimReason}
                onChange={handleChange}
                maxLength={VALIDATION_LIMITS.REASON_MAX}
                className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                  formErrors.claimReason ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                }`}
              />
              {formErrors.claimReason && (
                <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.claimReason}</p>
              )}
            </div>

            {/* Non-PO Justification */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Why could a Purchase Order (PO) NOT be raised in advance? <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-gray-400">
                  {formData.nonPoJustification.length} / {VALIDATION_LIMITS.JUSTIFICATION_MAX} chars (min 20)
                </span>
              </div>
              <textarea
                name="nonPoJustification"
                rows={3}
                placeholder="Explain why standard procurement workflow was bypassed (e.g. fire/safety emergency, weekend shutdown, immediate contractor mobilization)..."
                value={formData.nonPoJustification}
                onChange={handleChange}
                maxLength={VALIDATION_LIMITS.JUSTIFICATION_MAX}
                className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                  formErrors.nonPoJustification ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                }`}
              />
              {formErrors.nonPoJustification && (
                <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.nonPoJustification}</p>
              )}
            </div>
          </div>
        </div>

        {/* ── SECTION D: BANK DETAILS FOR PAYMENT DISBURSEMENT ────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="bg-gray-50/80 px-6 py-3.5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-600"></span>
              Section D: Bank Account Details for Payment Disbursement
            </h2>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Direct Payout Verification
            </span>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {/* Beneficiary Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Beneficiary / Account Holder Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="accountHolderName"
                  placeholder="e.g. Apex Power Controls / Rajesh Kumar"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                    formErrors.accountHolderName ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                  }`}
                />
                {formErrors.accountHolderName && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.accountHolderName}</p>
                )}
              </div>

              {/* Bank Name & Branch */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Bank Name & Branch <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="bankName"
                  placeholder="e.g. State Bank of India, Andheri East"
                  value={formData.bankName}
                  onChange={handleChange}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                    formErrors.bankName ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                  }`}
                />
                {formErrors.bankName && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.bankName}</p>
                )}
              </div>

              {/* IFSC Code */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  IFSC Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="ifscCode"
                  placeholder="e.g. SBIN0001234"
                  maxLength={11}
                  value={formData.ifscCode}
                  onChange={handleIfscChange}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                    formErrors.ifscCode ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                  }`}
                />
                {formErrors.ifscCode && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.ifscCode}</p>
                )}
              </div>

              {/* Bank Account Number */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Bank Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="bankAccountNo"
                  placeholder="Enter 9 to 18 digits account no."
                  value={formData.bankAccountNo}
                  onChange={handleChange}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                    formErrors.bankAccountNo ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                  }`}
                />
                {formErrors.bankAccountNo && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.bankAccountNo}</p>
                )}
              </div>

              {/* Confirm Bank Account Number */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Confirm Bank Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmBankAccountNo"
                  placeholder="Re-enter bank account no."
                  value={formData.confirmBankAccountNo}
                  onChange={handleChange}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                    formErrors.confirmBankAccountNo ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                  }`}
                />
                {formErrors.confirmBankAccountNo && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{formErrors.confirmBankAccountNo}</p>
                )}
              </div>

            </div>

            {/* Bank Passbook / Cheque Upload Section */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Bank Passbook / Cancelled Cheque Proof <span className="text-red-500">*</span>
                <span className="text-xs text-gray-400 font-normal ml-2">
                  (Upload clear photo or PDF showing Account No & IFSC)
                </span>
              </label>

              {formData.passbookImage ? (
                <div className="border border-green-200 bg-green-50/40 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {formData.passbookImage.previewUrl ? (
                      <img
                        src={formData.passbookImage.previewUrl}
                        alt="Bank proof preview"
                        className="w-14 h-14 object-cover rounded-lg border border-green-300 shadow-2xs"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-green-100 text-green-800 flex items-center justify-center font-bold text-lg">
                        📄
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-800 truncate max-w-xs sm:max-w-md">
                        {formData.passbookImage.fileName}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Size: {formData.passbookImage.size} | Status: <span className="text-green-700 font-semibold">Attached</span>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePassbook}
                    className="text-xs font-bold text-red-600 hover:text-red-800 bg-white border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                  >
                    Change / Remove ✕
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => passbookInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1.5 ${
                    formErrors.passbookImage
                      ? 'border-red-400 bg-red-50/30'
                      : 'border-green-300 bg-green-50/30 hover:bg-green-50/60'
                  }`}
                >
                  <span className="text-2xl">🏦</span>
                  <p className="text-sm font-semibold text-gray-800">
                    Click to upload Bank Passbook Front Page or Cancelled Cheque
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports JPG, PNG, PDF up to 5MB
                  </p>
                  <input
                    ref={passbookInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handlePassbookUpload}
                  />
                </div>
              )}
              {formErrors.passbookImage && (
                <p className="text-xs text-red-600 mt-1.5 font-medium">{formErrors.passbookImage}</p>
              )}
            </div>

          </div>
        </div>

        {/* ── SECTION E: SUPPORTING ATTACHMENTS ──────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="bg-gray-50/80 px-6 py-3.5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-600"></span>
              Section E: Supporting Proofs & Incident Documents <span className="text-red-500">*</span>
            </h2>
            <span className="text-xs text-gray-500">Max 5MB each, up to 10 files</span>
          </div>
          <div className="p-6 space-y-4">

            {/* Upload Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-green-300 bg-green-50/40 hover:bg-green-50/70 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xl shadow-xs">
                📎
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Click to select supporting bills, or drag and drop here
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Allowed: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX (Invoices, Quotations, Incident Photos)
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {formErrors.attachments && (
              <p className="text-xs text-red-600 font-semibold">{formErrors.attachments}</p>
            )}

            {/* Uploaded File List Table */}
            {formData.attachments.length > 0 && (
              <div className="border border-gray-200 rounded-xl overflow-hidden mt-3">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2.5">File Name</th>
                      <th className="px-4 py-2.5">Document Type</th>
                      <th className="px-4 py-2.5">Size</th>
                      <th className="px-4 py-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                    {formData.attachments.map((att) => (
                      <tr key={att.id} className="hover:bg-gray-50/60">
                        <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-2">
                          <span className="text-base">📄</span>
                          <span className="truncate max-w-[200px] sm:max-w-xs">{att.fileName}</span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={att.type}
                            onChange={(e) => handleAttachmentTypeChange(att.id, e.target.value)}
                            className="border border-gray-300 rounded-lg px-2.5 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                          >
                            {ATTACHMENT_TYPES.map((atype) => (
                              <option key={atype} value={atype}>
                                {atype}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs font-mono">{att.size}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(att.id)}
                            className="text-red-500 hover:text-red-700 font-bold px-2 py-1 hover:bg-red-50 rounded text-xs transition"
                          >
                            Remove ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ── FIXED BOTTOM ACTION BAR ─────────────────────────────────────── */}
        <div className="fixed bottom-0 right-0 left-0 lg:left-48 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-xl py-3 px-4 sm:px-8">
          <div className="max-w-5xl mx-auto flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(myRequestsPath)}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 active:scale-[0.98] rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-green-600 hover:bg-green-700 active:scale-[0.98] rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Submitting...
                </>
              ) : (
                '🚀 Submit Request'
              )}
            </button>
          </div>
        </div>

      </form>

      {/* ── Confirm Submit Modal ───────────────────────────────────────────── */}
      <NonPoConfirmDialog
        isOpen={showConfirmModal}
        title="Submit Non-PO Claim for Approval"
        message="Please verify your claim and bank disbursement details before submitting. Once submitted, all inputs will be locked."
        details={[
          { label: 'Site', value: formData.siteName || '—' },
          { label: 'Cost Centre', value: formData.costCentre || '—' },
          { label: 'Expense Type', value: formData.expenseType || '—' },
          { label: 'Beneficiary Name', value: formData.accountHolderName || '—' },
          { label: 'Bank Name', value: formData.bankName || '—' },
          { label: 'Account No.', value: formData.bankAccountNo ? `•••• ${formData.bankAccountNo.slice(-4)}` : '—' },
          { label: 'IFSC Code', value: formData.ifscCode || '—' },
          { label: 'Requested Amount', value: formatAmountINR(formData.amountRequested) },
          { label: 'GST Bill', value: formData.isGstBill === 'Yes' ? 'Yes (Tax Invoice)' : 'No (Non-GST / Cash Memo)' },
          ...(formData.isGstBill === 'Yes' ? [
            { label: 'Vendor GSTIN', value: formData.vendorGstin || '—' },
            { label: 'Vendor Invoice No.', value: formData.invoiceNumber || '—' },
          ] : []),
          { label: 'First Approver', value: firstApproverLabel },
        ]}
        confirmLabel={`Yes, Submit to ${firstApproverLabel}`}
        cancelLabel="Review Again"
        isSubmitting={isSubmitting}
        onConfirm={handleConfirmedSubmit}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  )
}

export default NonPoExpenseRequestForm
