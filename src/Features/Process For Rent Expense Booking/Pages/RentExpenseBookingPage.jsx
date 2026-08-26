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
import ViewAgreementModal from '../Components/ViewAgreementModal'

import { useDispatch, useSelector } from 'react-redux'
import {
  fetchRentalSites,
  fetchRentAgreementById,
  terminateRentAgreement,
  clearActiveAgreementDetails,
  selectRentalSites,
  selectRentPagination,
  selectRentSummary,
  selectRentLoading,
  selectRentError,
  selectTerminateLoading,
} from '../../../store/slices/rentExpenseSlice'

const val = (v) => (v === undefined || v === null || String(v).trim() === '' ? '-' : String(v))

export default function RentExpenseBookingPage() {
  const dispatch = useDispatch()
  const reduxSites = useSelector(selectRentalSites)
  const pagination = useSelector(selectRentPagination)
  const summary = useSelector(selectRentSummary)
  const loading = useSelector(selectRentLoading)
  const error = useSelector(selectRentError)
  const terminateLoading = useSelector(selectTerminateLoading)

  const [selectedSite, setSelectedSite] = useState(null)
  const [filters, setFilters] = useState({ owner: '', city: '', state: '' })
  const [showAddSiteModal, setShowAddSiteModal] = useState(false)
  const [showAgreementModal, setShowAgreementModal] = useState(false)
  const [showViewAgreementModal, setShowViewAgreementModal] = useState(false)
  const [viewAgreementSite, setViewAgreementSite] = useState(null)
  const [showVoucherModal, setShowVoucherModal] = useState(false)
  const [showTerminateModal, setShowTerminateModal] = useState(false)
  const [terminateSite, setTerminateSite] = useState(null)
  const [voucherViewSite, setVoucherViewSite] = useState(null)
  const [showViewVoucherModal, setShowViewVoucherModal] = useState(false)
  const [showExpenseVoucherModal, setShowExpenseVoucherModal] = useState(false)
  const [expenseVoucherData, setExpenseVoucherData] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [pendingRentVoucher, setPendingRentVoucher] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Fetch sites from API on mount and filter/page change
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      city: filters.city,
      state: filters.state,
      search: filters.owner,
    }
    dispatch(fetchRentalSites(params))
  }, [dispatch, currentPage, filters.city, filters.state, filters.owner])

  const handleAddSiteSuccess = (createdResult) => {
    setShowAddSiteModal(false)
    dispatch(fetchRentalSites({ page: 1, limit: itemsPerPage }))
  }

  const handleAddSite = () => {
    dispatch(fetchRentalSites({ page: 1, limit: itemsPerPage }))
    setShowAddSiteModal(false)
    toast.success('Site added successfully!')
  }

  const handleAgreementSubmit = () => {
    setSelectedSite(null)
    setShowAgreementModal(false)
    dispatch(
      fetchRentalSites({
        page: currentPage,
        limit: itemsPerPage,
        city: filters.city,
        state: filters.state,
        search: filters.owner,
      })
    )
  }

  const handleOpenViewAgreement = (siteObj) => {
    setViewAgreementSite(siteObj)
    setShowViewAgreementModal(true)
    const agrId =
      siteObj.currentAgreementId ||
      siteObj.agreementId ||
      siteObj.agreement?.agreementId
    if (agrId) {
      dispatch(fetchRentAgreementById(agrId))
    }
  }

  const handleTerminateSubmit = async (siteId, data) => {
    try {
      const site = reduxSites.find((s) => s.siteId === siteId || s.id === siteId) || terminateSite
      const agreementId =
        site?.currentAgreementId ||
        site?.agreementId ||
        site?.agreement?.agreementId

      if (!agreementId) {
        toast.error('No active agreement ID found for this site.')
        return
      }

      const payload = {
        terminationDate: data.effectiveDate || data.terminationDate,
        effectiveMonth: data.effectiveMonth,
        reason: data.reason || 'Office Premises Closed',
        cancelUnpaid: data.cancelUnpaid ?? true,
      }

      const result = await dispatch(terminateRentAgreement({ agreementId, payload })).unwrap()
      toast.success(result?.message || 'Rent agreement terminated successfully and future payments have been stopped.')

      setShowTerminateModal(false)
      setTerminateSite(null)

      dispatch(
        fetchRentalSites({
          page: currentPage,
          limit: itemsPerPage,
          city: filters.city,
          state: filters.state,
          search: filters.owner,
        })
      )
    } catch (err) {
      console.error('Error terminating agreement:', err)
      const errMsg = err?.message || err?.responseData?.message || 'Failed to terminate rent agreement.'
      toast.error(errMsg)
    }
  }

  const handleVoucherSubmit = async (serverVoucherData) => {
    try {
      setShowVoucherModal(false);
      setSelectedSite(null);
      dispatch(fetchRentalSites({ page: currentPage, limit: itemsPerPage }));

      // If server returned voucher accounting details, show rent expense voucher modal
      if (serverVoucherData?.accounting) {
        const expenseData = {
          voucherNo: serverVoucherData.accounting.voucherNo || serverVoucherData.voucherId,
          date: serverVoucherData.accounting.date || new Date().toISOString().split('T')[0],
          company: 'iSmart',
          financialYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
          reference: `Monthly rent voucher for ${serverVoucherData.siteName || 'Site'} (${serverVoucherData.month})`,
          preparedBy: serverVoucherData.workflow?.generatedBy || 'Billing Executive',
          siteDetails: {
            siteName: serverVoucherData.siteName,
            owner: serverVoucherData.ownerName || '-',
            month: serverVoucherData.month,
          },
          rentDetails: {
            month: serverVoucherData.month,
            baseRent: serverVoucherData.breakdown?.baseRent || serverVoucherData.amount,
            gstAmount: serverVoucherData.breakdown?.gst || 0,
            totalAmount: serverVoucherData.amount,
            withGST: serverVoucherData.gstDetails?.applicable || false,
          },
          entries: serverVoucherData.accounting.glEntries || [],
          paymentWorkflow: {
            status: serverVoucherData.status || 'Approved for Payment',
            paymentDeadline: serverVoucherData.dueDate || '-',
          },
        };
        setExpenseVoucherData(expenseData);
        setShowExpenseVoucherModal(true);
      }
    } catch (error) {
      console.error('Error handling generated voucher:', error);
    }
  };

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

  const getAgreementForSite = (siteId) => {
    const site = reduxSites.find((s) => s.siteId === siteId)
    return (
      site?.agreement ||
      (site?.hasActiveAgreement
        ? {
            siteId,
            agreementId: site.agreementId,
            status: 'active',
            owner: site.owners?.[0]?.ownerName || site.ownerDetails?.ownerName || 'Owner',
            startDate: site.agreementStartDate || '',
            endDate: site.agreementEndDate || '',
          }
        : null)
    )
  }
  const getVouchersForSite = (siteId) => vouchers.filter((v) => v.siteId === siteId)

  const uniqueStates = [...new Set(reduxSites.map((site) => site.state).filter(Boolean))]
  const uniqueCities = [...new Set(reduxSites.map((site) => site.city).filter(Boolean))]

  const totalPages = pagination?.totalPages || 1

  return (
    <>
      <div className="min-h-screen bg-white shadow-sm rounded-2xl border border-green-100 px-6 py-6 md:px-8">
        {/* Title Header Banner with Green Background */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-6 mb-6 shadow-sm text-left relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-white/5 transform skew-x-12 translate-x-8 pointer-events-none"></div>
          <h1 className="text-2xl md:text-3xl font-black mb-2 flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
            Rent Expense Booking
          </h1>
          <p className="text-xs text-green-100/90 max-w-xl leading-relaxed">
            Manage your retail and corporate rental sites, track rent agreements, upload files, and generate monthly accounting vouchers.
          </p>
        </div>

        {/* Summary Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
            <div className="text-xs text-gray-500 font-medium">Total Sites</div>
            <div className="text-2xl font-bold text-emerald-800 mt-1">{val(summary?.totalSites)}</div>
          </div>
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <div className="text-xs text-gray-500 font-medium">Active Sites</div>
            <div className="text-2xl font-bold text-blue-800 mt-1">{val(summary?.activeSites)}</div>
          </div>
          <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
            <div className="text-xs text-gray-500 font-medium">Active Agreements</div>
            <div className="text-2xl font-bold text-purple-800 mt-1">{val(summary?.sitesWithAgreements)}</div>
          </div>
          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
            <div className="text-xs text-gray-500 font-medium">Total Monthly Rent</div>
            <div className="text-2xl font-bold text-amber-800 mt-1">
              {summary?.totalMonthlyRent ? `₹${Number(summary.totalMonthlyRent).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}
            </div>
          </div>
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
              placeholder="Search Owner or Site Name..."
              className="p-2.5 border border-gray-250 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm transition"
              value={filters.owner}
              onChange={(e) => setFilters({ ...filters, owner: e.target.value })}
            />
            <select
              className="p-2.5 border border-gray-250 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm transition cursor-pointer"
              value={filters.state}
              onChange={(e) => setFilters({ ...filters, state: e.target.value })}
            >
              <option value="">All States</option>
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
              <option value="">All Cities</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error notification banner */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 flex items-center justify-between rounded-md">
            <p className="text-sm text-red-700 font-medium">{error}</p>
            <button
              onClick={() => dispatch(fetchRentalSites({ page: currentPage, limit: itemsPerPage }))}
              className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700 transition cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Sites Table */}
        <div className="mb-10 overflow-x-auto rounded-xl border border-green-100 shadow-sm bg-white">
          {loading ? (
            <div className="py-16 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-3"></div>
              <p className="text-sm text-gray-600 font-medium">Loading rental sites...</p>
            </div>
          ) : reduxSites.length === 0 ? (
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
                No rental sites found. Click below to add a new site.
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
                    <th className="px-4 py-3 text-left">Site Code & Name</th>
                    <th className="px-4 py-3 text-left">Location</th>
                    <th className="px-4 py-3 text-left w-24">City / State</th>
                    <th className="px-4 py-3 text-left">Owner / Vendor GL</th>
                    <th className="px-4 py-3 text-center w-16">GST</th>
                    <th className="px-4 py-3 text-center w-24">Agreement</th>
                    <th className="px-4 py-3 text-center w-32">Vouchers</th>
                    <th className="px-4 py-3 text-center w-52">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reduxSites.map((site, index) => {
                    const agreement = getAgreementForSite(site.siteId)
                    const ownerObj = site.owners?.[0]
                    const ownerName = ownerObj?.ownerName || '-'
                    const glCode = ownerObj?.glCode || '-'

                    return (
                      <tr key={site.siteId || index} className="hover:bg-green-50/20 transition duration-75">
                        <td className="px-4 py-3 text-center text-gray-500 font-medium">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-gray-900">{val(site.siteName)}</div>
                          <div className="text-xs text-green-700 font-mono font-semibold">{val(site.siteCode)}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{val(site.location)}</td>
                        <td className="px-4 py-3 text-gray-600">
                          <div>{val(site.city)}</div>
                          <div className="text-xs text-gray-400">{val(site.state)}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          <div className="font-semibold">{val(ownerName)}</div>
                          {glCode !== '-' && (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 mt-0.5">
                              {glCode}
                            </span>
                          )}
                        </td>
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
                          {site.hasActiveAgreement || site.agreementStatus === 'Active' || agreement ? (
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <span>Active</span>
                              <button
                                onClick={() => handleOpenViewAgreement(site)}
                                title="View Agreement Details & PDF"
                                className="w-5 h-5 rounded-full bg-emerald-100 hover:bg-emerald-600 text-emerald-800 hover:text-white flex items-center justify-center transition-all cursor-pointer text-xs"
                              >
                                👁️
                              </button>
                            </div>
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
                          {!site.owners || site.owners.length === 0 ? (
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
                <div className="flex justify-center items-center py-4 border-t border-gray-100 space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-xs rounded border bg-white text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer font-medium"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 text-xs rounded border cursor-pointer font-semibold ${
                        currentPage === i + 1
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-xs rounded border bg-white text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer font-medium"
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 px-2 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto my-4 relative border border-gray-100">
              <button
                className="sticky top-2 right-2 float-right text-gray-600 hover:text-red-600 text-xl font-bold z-10 bg-gray-100 hover:bg-red-50 rounded-full w-8 h-8 flex items-center justify-center shadow-xs transition cursor-pointer"
                onClick={() => setShowAddSiteModal(false)}
              >
                ✕
              </button>
              <AddSiteForm onSuccess={handleAddSiteSuccess} onCancel={() => setShowAddSiteModal(false)} />
            </div>
          </div>
        )}

        {/* Agreement Upload Modal */}
        {showAgreementModal && (
          <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto my-auto relative border border-slate-100 divide-y divide-slate-100 transform transition-all">
              <RentAgreementForm 
                site={selectedSite} 
                onSuccess={handleAgreementSubmit} 
                onCancel={() => setShowAgreementModal(false)} 
              />
            </div>
          </div>
        )}

        {/* Voucher Generation Modal */}
        {showVoucherModal && (
          <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto my-auto relative border border-slate-100 divide-y divide-slate-100 transform transition-all">
              <MonthlyVoucherGenerator
                site={selectedSite}
                agreement={getAgreementForSite(selectedSite?.siteId)}
                onSuccess={handleVoucherSubmit}
                onCancel={() => setShowVoucherModal(false)}
              />
            </div>
          </div>
        )}

        {/* View Voucher List Modal */}
        {showViewVoucherModal && (
          <ViewVouchersModal
            site={voucherViewSite}
            agreement={getAgreementForSite(voucherViewSite?.siteId)}
            onClose={() => {
              setShowViewVoucherModal(false);
              setVoucherViewSite(null);
            }}
            onViewVoucherDetails={(v) => {
              setExpenseVoucherData({
                voucherNo: v.voucherNo || v.voucherId,
                date: v.createdAt ? v.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
                company: 'iSmart',
                financialYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
                reference: `Rent voucher for ${v.month}`,
                preparedBy: 'Billing Executive',
                siteDetails: {
                  siteName: voucherViewSite?.siteName,
                  owner: voucherViewSite?.owners?.[0]?.ownerName || '-',
                  month: v.month,
                },
                rentDetails: {
                  month: v.month,
                  baseRent: v.breakdown?.baseRent || v.amount,
                  gstAmount: v.breakdown?.gst || 0,
                  totalAmount: v.amount,
                  withGST: !!(v.breakdown?.gst > 0),
                },
                entries: v.accounting?.glEntries || [],
                paymentWorkflow: {
                  status: v.status || 'Approved for Payment',
                  paymentDeadline: v.dueDate || '-',
                },
              });
              setShowExpenseVoucherModal(true);
            }}
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

        {/* View Agreement Details Modal */}
        {showViewAgreementModal && (
          <ViewAgreementModal
            site={viewAgreementSite}
            onClose={() => {
              setShowViewAgreementModal(false)
              setViewAgreementSite(null)
              dispatch(clearActiveAgreementDetails())
            }}
          />
        )}
      </div>
    </>
  )
}
