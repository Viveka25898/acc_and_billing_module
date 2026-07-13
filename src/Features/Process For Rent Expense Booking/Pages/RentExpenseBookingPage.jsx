/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import AddSiteForm from '../Components/AddSiteForm'
import RentAgreementForm from '../Components/RentAgreementForm'
import MonthlyVoucherGenerator from '../Components/MonthlyVoucherGenerator'
import { toast } from 'react-toastify'
import ViewVouchersModal from '../Components/ViewVouchersModal'
import RentExpenseVoucher from '../Components/RentExpenseVoucher'
import { processRentApproval } from '../../Master/utils/accountingHelpers'
import TerminateAgreementModal from '../Components/TerminateAgreementModal'

export default function RentExpenseBookingPage() {
  // Load sites from localStorage
  const [sites, setSites] = useState(() => {
    const stored = localStorage.getItem('sites')
    return stored ? JSON.parse(stored) : []
  })

  const [selectedSite, setSelectedSite] = useState(null)
  const [agreements, setAgreements] = useState(() => {
    const stored = localStorage.getItem('agreements')
    return stored ? JSON.parse(stored) : []
  })
  const [vouchers, setVouchers] = useState(() => {
    const stored = localStorage.getItem('vouchers')
    return stored ? JSON.parse(stored) : []
  })

  const [filters, setFilters] = useState({ owner: '', city: '', state: '' })
  const [showAddSiteModal, setShowAddSiteModal] = useState(false)
  const [showAgreementModal, setShowAgreementModal] = useState(false)
  const [showVoucherModal, setShowVoucherModal] = useState(false)
  const [showTerminateModal, setShowTerminateModal] = useState(false)
  const [terminateSite, setTerminateSite] = useState(null)
  const [voucherViewSite, setVoucherViewSite] = useState(null)
  const [showViewVoucherModal, setShowViewVoucherModal] = useState(false)
  const [showExpenseVoucherModal, setShowExpenseVoucherModal] = useState(false)
  const [expenseVoucherData, setExpenseVoucherData] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [pendingRentVoucher, setPendingRentVoucher] = useState(null)
  const [vendorVouchers, setVendorVouchers] = useState(() => {
    const stored = localStorage.getItem('vendorVouchers')
    return stored ? JSON.parse(stored) : []
  })

  // Save vendor vouchers to localStorage
  useEffect(() => {
    localStorage.setItem('vendorVouchers', JSON.stringify(vendorVouchers))
  }, [vendorVouchers])

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('sites', JSON.stringify(sites))
  }, [sites])

  useEffect(() => {
    localStorage.setItem('agreements', JSON.stringify(agreements))
  }, [agreements])

  useEffect(() => {
    localStorage.setItem('vouchers', JSON.stringify(vouchers))
  }, [vouchers])

  const handleAddSite = (newSite) => {
    setSites((prev) => [...prev, newSite])
    setShowAddSiteModal(false)
    toast.success('Site added successfully!')
  }

  const handleAgreementSubmit = (agreementData) => {
    const newAgreement = { ...agreementData, siteId: selectedSite.siteId }
    setAgreements((prev) => [...prev, newAgreement])
    setSelectedSite(null)
    setShowAgreementModal(false)
    toast.success('Rent agreement uploaded successfully')
  }

  const handleTerminateSubmit = (siteId, data) => {
    try {
      const activeAgreement = agreements.find((a) => a.siteId === siteId && a.status !== 'terminated')
      if (!activeAgreement) {
        toast.error('No active agreement found for this site.')
        return
      }

      // Update agreement status and metadata
      const updatedAgreements = agreements.map((a) =>
        a.agreementId === activeAgreement.agreementId
          ? {
              ...a,
              status: 'terminated',
              terminationDate: data.effectiveMonth,
              terminationReason: data.reason,
            }
          : a
      )
      setAgreements(updatedAgreements)
      localStorage.setItem('agreements', JSON.stringify(updatedAgreements))

      // If user chose to cancel unpaid future vouchers
      if (data.cancelUnpaid) {
        // Update general vouchers
        const updatedVouchers = vouchers.map((v) => {
          if (v.siteId === siteId && v.paymentStatus !== 'Paid' && v.month > data.effectiveMonth) {
            return {
              ...v,
              status: 'Cancelled',
              paymentStatus: 'Cancelled',
            }
          }
          return v
        })
        setVouchers(updatedVouchers)
        localStorage.setItem('vouchers', JSON.stringify(updatedVouchers))

        // Update vendor vouchers (pending payments queue)
        const updatedVendorVouchers = vendorVouchers.map((v) => {
          if (v.siteId === siteId && v.paymentStatus !== 'Paid' && v.month > data.effectiveMonth) {
            return {
              ...v,
              status: 'Cancelled',
              paymentStatus: 'Cancelled',
            }
          }
          return v
        })
        setVendorVouchers(updatedVendorVouchers)
      }

      toast.success('Rent agreement terminated prematurely and future vouchers blocked!')
      setShowTerminateModal(false)
      setTerminateSite(null)
    } catch (error) {
      console.error('Error terminating agreement:', error)
      toast.error('Failed to terminate rent agreement')
    }
  }

  const handleVoucherSubmit = async (voucherData) => {
    try {
      // Prepare rent voucher data
      const agreement = getAgreementForSite(selectedSite.siteId)
      const rentVoucher = {
        ...voucherData,
        siteId: selectedSite.siteId,
        siteName: selectedSite.siteName,
        siteLocation: selectedSite.location,
        ownerName: agreement?.owner || selectedSite.owners?.[0]?.ownerName,
        ownerId: selectedSite.owners?.[0]?.ownerId,
        ownerGLCode: selectedSite.owners?.[0]?.glCode,
        agreementId: agreement?.agreementId,
      }

      // Auto-select a default bank behind the scenes
      const defaultBank = {
        bankCode: 'A3004003002',
        bankName: 'HDFC Bank - Current Account',
        bankId: 'HDFC001',
      }

      // Process accounting immediately
      const result = await processRentApproval(rentVoucher, defaultBank)

      if (!result.success) throw new Error(result.message || 'Processing failed')

      // Create enhanced voucher with approval workflow tracking
      const updatedVoucher = {
        ...rentVoucher,
        voucherId: `VOUCH-${Date.now()}`,
        accounting: {
          voucherNo: result.voucherNo,
          transactionId: result.transactionId,
          vendorGL: result.vendorGL,
          processedAt: new Date().toISOString(),
        },
        status: 'Approved', // Changed to 'Approved' for payment processing
        paymentStatus: 'Pending Payment',
        workflow: {
          generatedBy: 'Billing Executive',
          generatedAt: new Date().toISOString(),
          approvedBy: 'Auto-Approval System',
          approvedAt: new Date().toISOString(),
          paidBy: null,
          paidAt: null,
        },
        // Enhanced vendor details for payment processing
        vendorDetails: {
          vendorId: selectedSite.owners?.[0]?.ownerId,
          vendorName: agreement?.owner || selectedSite.owners?.[0]?.ownerName,
          vendorGL: result.vendorGL,
          panNumber: selectedSite.owners?.[0]?.panNumber,
          gstin: selectedSite.owners?.[0]?.gstin,
          contactNumber: selectedSite.owners?.[0]?.contactNumber,
          email: selectedSite.owners?.[0]?.email,
          address: selectedSite.owners?.[0]?.address,
          state: selectedSite.state, // Important for GST compliance
        },
        // Payment details (to be filled during payment processing)
        paymentDetails: {
          bankAccount: null,
          ifscCode: null,
          paymentMode: null,
          utrNumber: null,
          paidAmount: null,
          paymentDate: null,
        },
        // Additional metadata for payment processing
        paymentReady: true,
        priority: 'Normal',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0], // 7 days from now
      }

      // Save to main vouchers list
      setVouchers((prev) => [...prev, updatedVoucher])

      // ✅ CRITICAL: Save to vendor vouchers for payment processing
      const existingVendorVouchers = JSON.parse(localStorage.getItem('vendorVouchers') || '[]')
      const vendorVoucherForPayment = {
        ...updatedVoucher,
        // Ensure all required fields for payment processing
        id: `VENDOR-VOUCH-${Date.now()}`,
        type: 'rent_payment',
        category: 'Rent Expense',
        department: 'Operations',
      }

      const updatedVendorVouchers = [...existingVendorVouchers, vendorVoucherForPayment]
      localStorage.setItem('vendorVouchers', JSON.stringify(updatedVendorVouchers))

      // Update site owner with GL code if needed
      if (result.vendorGL && !selectedSite.owners[0]?.glCode) {
        const updatedSites = sites.map((site) => {
          if (site.siteId === selectedSite.siteId && site.owners?.[0]) {
            return {
              ...site,
              owners: [{ ...site.owners[0], glCode: result.vendorGL }],
            }
          }
          return site
        })
        setSites(updatedSites)
      }

      // Build expense voucher data for viewing
      const expenseData = {
        voucherNo: result.voucherNo,
        date: new Date().toISOString().split('T')[0],
        company: 'iSmart',
        financialYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        reference: `Monthly rent payment for ${selectedSite.siteName}`,
        preparedBy: 'Billing Executive',
        siteDetails: {
          siteName: selectedSite.siteName,
          location: selectedSite.location,
          city: selectedSite.city,
          state: selectedSite.state,
          owner: rentVoucher.ownerName || 'N/A',
          agreementPeriod: agreement ? `${agreement.startDate} to ${agreement.endDate}` : 'N/A',
        },
        rentDetails: {
          month: rentVoucher.month,
          baseRent: rentVoucher.breakdown?.baseRent || rentVoucher.amount,
          gstAmount: rentVoucher.breakdown?.gst || 0,
          totalAmount: rentVoucher.amount,
          gstType: rentVoucher.gstType,
          withGST: rentVoucher.gstDetails?.applicable || false,
        },
        entries: createRentAccountingEntries(rentVoucher, result.vendorGL),
        // Add payment workflow info to the view
        paymentWorkflow: {
          status: 'Approved for Payment',
          nextStep: 'Process Payment',
          paymentDeadline: new Date(
            new Date().setDate(new Date().getDate() + 7)
          ).toLocaleDateString(),
        },
      }

      setExpenseVoucherData(expenseData)
      setShowExpenseVoucherModal(true)
      toast.success(`✅ ${result.message} - Voucher approved for payment processing!`)

      // Log for debugging
      console.log('Vendor voucher saved for payment:', vendorVoucherForPayment)
      console.log('Total vendor vouchers pending payment:', updatedVendorVouchers.length)
    } catch (error) {
      console.error('Error in handleVoucherSubmit:', error)
      toast.error('Failed to process voucher')
    }
  }

  const approveVoucher = (voucherId) => {
    const voucherToApprove = vouchers.find((v) => v.voucherId === voucherId)

    if (!voucherToApprove) {
      toast.error('Voucher not found')
      return
    }

    // Update voucher status
    const updatedVouchers = vouchers.map((v) =>
      v.voucherId === voucherId
        ? {
            ...v,
            status: 'Approved',
            paymentStatus: 'Pending Payment',
            workflow: {
              ...v.workflow,
              approvedBy: 'Finance Manager', // Replace with actual user
              approvedAt: new Date().toISOString(),
            },
          }
        : v
    )

    setVouchers(updatedVouchers)

    // Add to vendor vouchers for payment processing
    const vendorVoucher = {
      ...voucherToApprove,
      status: 'Approved',
      paymentStatus: 'Pending Payment',
      workflow: {
        ...voucherToApprove.workflow,
        approvedBy: 'Finance Manager',
        approvedAt: new Date().toISOString(),
      },
      // Add payment-specific fields
      paymentReady: true,
      priority: 'Normal',
    }

    setVendorVouchers((prev) => [...prev, vendorVoucher])
    toast.success('Voucher approved and moved to payment processing')
  }
  // ✅ FUNCTION TO CREATE REAL ACCOUNTING ENTRIES WITH ACTUAL GL CODES
  const createRentAccountingEntries = (rentVoucher, vendorGL) => {
    const entries = []
    const baseRent = rentVoucher.breakdown?.baseRent || rentVoucher.amount
    const gstAmount = rentVoucher.breakdown?.gst || 0

    // 1. Rent Expense Debit (Your actual GL code)
    entries.push({
      id: 1,
      particulars: 'BRANCH OFFICE RENT',
      gl: 'X2001002002', // Your actual rent expense GL code
      costCenter: rentVoucher.siteLocation || 'OPS-001',
      debit: baseRent,
      credit: 0,
      note: `Monthly rent for ${rentVoucher.siteName} - ${rentVoucher.month}`,
    })

    // 2. GST Input Debit (if applicable) - Your actual GST GL codes
    if (rentVoucher.gstDetails?.applicable) {
      if (rentVoucher.gstDetails.type === 'CGST+SGST') {
        entries.push(
          {
            id: 2,
            particulars: 'CGST INPUT @ 9%',
            gl: 'A3007001001', // Your actual CGST GL code
            costCenter: rentVoucher.siteLocation || 'OPS-001',
            debit: rentVoucher.gstDetails.cgst,
            credit: 0,
            note: `CGST on rent payment - ${rentVoucher.month}`,
          },
          {
            id: 3,
            particulars: 'SGST INPUT @ 9%',
            gl: 'A3007001002', // Your actual SGST GL code
            costCenter: rentVoucher.siteLocation || 'OPS-001',
            debit: rentVoucher.gstDetails.sgst,
            credit: 0,
            note: `SGST on rent payment - ${rentVoucher.month}`,
          }
        )
      } else {
        entries.push({
          id: 2,
          particulars: 'IGST INPUT @ 18%',
          gl: 'A3007001003', // Your actual IGST GL code
          costCenter: rentVoucher.siteLocation || 'OPS-001',
          debit: rentVoucher.gstDetails.igst,
          credit: 0,
          note: `IGST on rent payment - ${rentVoucher.month}`,
        })
      }
    }

    // 3. Vendor Payable Credit (Use the actual vendor GL from accounting)
    entries.push({
      id: entries.length + 1,
      particulars: `RENT PAYABLE - ${rentVoucher.ownerName}`,
      gl: vendorGL, // Actual vendor GL code from accounting
      costCenter: '',
      debit: 0,
      credit: rentVoucher.amount,
      note: `Payment due to ${rentVoucher.ownerName} for ${rentVoucher.month}`,
    })

    return entries
  }
  // (Bank selection flow removed)

  const getAgreementForSite = (siteId) => agreements.find((a) => a.siteId === siteId)
  const getVouchersForSite = (siteId) => vouchers.filter((v) => v.siteId === siteId)

  const uniqueStates = [...new Set(sites.map((site) => site.state))]
  const uniqueCities = [...new Set(sites.map((site) => site.city))]

  const filteredSites = sites.filter((site) => {
    const { owner, city, state } = filters
    const siteOwner = site.owners?.[0]?.ownerName || ''
    return (
      (!owner || siteOwner.toLowerCase().includes(owner.toLowerCase())) &&
      (!city || site.city === city) &&
      (!state || site.state === state)
    )
  })

  const totalPages = Math.ceil(filteredSites.length / itemsPerPage)
  const paginatedSites = filteredSites.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <>
      <div className="min-h-screen bg-white shadow-sm rounded-2xl border border-green-100 px-6 py-6 md:px-8">
        {/* Title Header Banner with Green Background */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-6 mb-8 shadow-sm text-left relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-white/5 transform skew-x-12 translate-x-8 pointer-events-none"></div>
          <h1 className="text-2xl md:text-3xl font-black mb-2 flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
            Rent Expense Booking
          </h1>
          <p className="text-xs text-green-100/90 max-w-xl leading-relaxed">
            Manage your retail and corporate rental sites, track rent agreements, upload files, and generate monthly accounting vouchers.
          </p>
        </div>

        {/* Filter UI with Add Site Button */}
        <div className="bg-green-50/20 rounded-xl p-5 border border-green-100/50 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center">
              <span className="inline-block w-1.5 h-3.5 bg-green-600 rounded-full mr-2"></span>
              Filter Sites
            </h2>
            <button
              onClick={() => setShowAddSiteModal(true)}
              className="bg-green-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg hover:bg-green-700 shadow-sm hover:shadow hover:scale-[1.01] active:scale-95 transition-all duration-150 cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Site
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Owner Ledger Name"
              className="p-2.5 border border-gray-250 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm transition"
              value={filters.owner}
              onChange={(e) => setFilters({ ...filters, owner: e.target.value })}
            />
            <select
              className="p-2.5 border border-gray-250 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm transition cursor-pointer"
              value={filters.state}
              onChange={(e) => setFilters({ ...filters, state: e.target.value })}
            >
              <option value="">Select State</option>
              {uniqueStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <select
              className="p-2.5 border border-gray-250 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm transition cursor-pointer"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            >
              <option value="">Select City</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sites Table */}
        <div className="mb-10 overflow-x-auto rounded-xl border border-green-100 shadow-sm bg-white">
          {sites.length === 0 ? (
            <div className="text-center py-16 px-4">
              <svg
                className="mx-auto h-14 w-14 text-gray-350"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <p className="mt-4 text-gray-500 text-sm font-medium">
                No sites found. Add your first site to get started.
              </p>
              <button
                onClick={() => setShowAddSiteModal(true)}
                className="mt-5 bg-green-600 text-white font-semibold text-xs px-6 py-2.5 rounded-lg hover:bg-green-700 shadow-sm hover:shadow transition duration-150 cursor-pointer"
              >
                Add First Site
              </button>
            </div>
          ) : (
            <>
              <table className="min-w-full text-sm divide-y divide-gray-100 border-collapse">
                <thead className="bg-green-600 text-white font-semibold">
                  <tr>
                    <th className="px-4 py-3 text-center w-12">#</th>
                    <th className="px-4 py-3 text-left">Site</th>
                    <th className="px-4 py-3 text-left">Location</th>
                    <th className="px-4 py-3 text-left w-24">State</th>
                    <th className="px-4 py-3 text-left w-24">City</th>
                    <th className="px-4 py-3 text-left">Owner</th>
                    <th className="px-4 py-3 text-center w-16">GST</th>
                    <th className="px-4 py-3 text-center w-24">Agreement</th>
                    <th className="px-4 py-3 text-center w-32">Vouchers</th>
                    <th className="px-4 py-3 text-center w-52">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedSites.map((site, index) => {
                    const agreement = getAgreementForSite(site.siteId)
                    const ownerName = site.owners?.[0]?.ownerName || 'No Owner'
                    return (
                      <tr key={site.siteId} className="hover:bg-green-50/20 transition duration-75">
                        <td className="px-4 py-3 text-center text-gray-500 font-medium">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{site.siteName}</td>
                        <td className="px-4 py-3 text-gray-600">{site.location}</td>
                        <td className="px-4 py-3 text-gray-600">{site.state}</td>
                        <td className="px-4 py-3 text-gray-600">{site.city}</td>
                        <td className="px-4 py-3 text-gray-700">{ownerName}</td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-md ${
                              agreement?.withGST || site.rentConfig?.gstExpected === 'yes'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {agreement?.withGST || site.rentConfig?.gstExpected === 'yes' ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {agreement ? (
                            <a
                              href={agreement.fileUrl || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-700 hover:text-green-900 font-bold hover:underline transition duration-150"
                            >
                              View PDF
                            </a>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {agreement ? (
                            <button
                              className="text-blue-600 hover:text-blue-800 font-bold hover:underline transition duration-150 cursor-pointer text-xs"
                              onClick={() => {
                                setVoucherViewSite(site)
                                setShowViewVoucherModal(true)
                              }}
                            >
                              View Vouchers
                            </button>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          {site.isStandalone ? (
                            <button
                              onClick={() => {
                                setSelectedSite(site)
                                setShowAgreementModal(true)
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3 py-1.5 rounded-lg shadow-sm hover:shadow transition duration-150 cursor-pointer"
                            >
                              Add Owner & Agreement
                            </button>
                          ) : (
                            <>
                              {agreement && agreement.status === 'terminated' ? (
                                <div className="flex flex-col items-center gap-0.5">
                                  <span className="inline-block bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200">
                                    Terminated
                                  </span>
                                  <span className="text-[9px] text-gray-500 font-medium">
                                    Closed: {agreement.terminationDate || '-'}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex justify-center items-center gap-1.5">
                                  <button
                                    onClick={() => {
                                      setSelectedSite(site)
                                      if (!agreement) setShowAgreementModal(true)
                                      else setShowVoucherModal(true)
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold text-xs px-3 py-1.5 rounded-lg shadow-sm hover:shadow transition duration-150 cursor-pointer"
                                  >
                                    {agreement ? 'Gen Voucher' : 'Upload Agr'}
                                  </button>
                                  {agreement && (
                                    <button
                                      onClick={() => {
                                        setTerminateSite(site)
                                        setShowTerminateModal(true)
                                      }}
                                      className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-3 py-1.5 rounded-lg shadow-sm hover:shadow transition duration-150 cursor-pointer"
                                    >
                                      Terminate
                                    </button>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border bg-white text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded border ${
                        currentPage === i + 1
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-gray-800 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border bg-white text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Add Site Modal */}
        {showAddSiteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[95vh] overflow-y-auto my-4 relative">
              <button
                className="sticky top-2 right-2 float-right text-gray-600 hover:text-red-600 text-2xl font-bold z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow"
                onClick={() => setShowAddSiteModal(false)}
              >
                ✕
              </button>
              <AddSiteForm onSuccess={handleAddSite} onCancel={() => setShowAddSiteModal(false)} />
            </div>
          </div>
        )}

        {/* Agreement Upload Modal */}
        {showAgreementModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md h-auto max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
                onClick={() => setShowAgreementModal(false)}
              >
                ✕
              </button>
              <RentAgreementForm site={selectedSite} onSuccess={handleAgreementSubmit} />
            </div>
          </div>
        )}

        {/* Voucher Generation Modal */}
        {showVoucherModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md h-auto max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
                onClick={() => setShowVoucherModal(false)}
              >
                ✕
              </button>
              <MonthlyVoucherGenerator
                site={selectedSite}
                agreement={getAgreementForSite(selectedSite?.siteId)}
                onSuccess={handleVoucherSubmit}
              />
            </div>
          </div>
        )}

        {/* View Voucher List Modal */}
        {showViewVoucherModal && (
          <ViewVouchersModal
            site={voucherViewSite}
            agreement={getAgreementForSite(voucherViewSite?.siteId)}
            vouchers={getVouchersForSite(voucherViewSite?.siteId)}
            onClose={() => {
              setShowViewVoucherModal(false)
              setVoucherViewSite(null)
            }}
            onApproveVoucher={approveVoucher} // Add this prop
          />
        )}

        {/* Rent Expense Voucher Modal */}
        {showExpenseVoucherModal && (
          <RentExpenseVoucher
            data={expenseVoucherData}
            onClose={() => {
              setShowExpenseVoucherModal(false)
              setExpenseVoucherData(null)
            }}
          />
        )}

        {/* Terminate Rent Agreement Modal */}
        {showTerminateModal && terminateSite && (
          <TerminateAgreementModal
            site={terminateSite}
            agreement={getAgreementForSite(terminateSite.siteId)}
            onClose={() => {
              setShowTerminateModal(false)
              setTerminateSite(null)
            }}
            onSubmit={(data) => handleTerminateSubmit(terminateSite.siteId, data)}
          />
        )}
      </div>
    </>
  )
}
