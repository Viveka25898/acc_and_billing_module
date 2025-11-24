/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import AddSiteForm from '../Components/AddSiteForm'
import RentAgreementForm from '../Components/RentAgreementForm'
import MonthlyVoucherGenerator from '../Components/MonthlyVoucherGenerator'
import { toast } from 'react-toastify'
import ViewVouchersModal from '../Components/ViewVouchersModal'
import RentExpenseVoucher from '../Components/RentExpenseVoucher'
import { processRentApproval } from '../../Master/utils/accountingHelpers'

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
  const [voucherViewSite, setVoucherViewSite] = useState(null)
  const [showViewVoucherModal, setShowViewVoucherModal] = useState(false)
  const [showExpenseVoucherModal, setShowExpenseVoucherModal] = useState(false)
  const [expenseVoucherData, setExpenseVoucherData] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [pendingRentVoucher, setPendingRentVoucher] = useState(null)

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

  // Generate voucher and auto-process without bank selection UI
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

      // Persist voucher with accounting details
      const updatedVoucher = {
        ...rentVoucher,
        accounting: {
          voucherNo: result.voucherNo,
          transactionId: result.transactionId,
          vendorGL: result.vendorGL,
          processedAt: new Date().toISOString(),
        },
        status: 'Processed',
      }
      setVouchers((prev) => [...prev, updatedVoucher])

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
      }
      setExpenseVoucherData(expenseData)
      setShowExpenseVoucherModal(true)
      toast.success(`✅ ${result.message}`)
    } catch (error) {
      console.error('Error in handleVoucherSubmit:', error)
      toast.error('Failed to process voucher')
    }
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
      <div className="min-h-screen bg-white shadow-md rounded-md px-4 py-6 md:px-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-green-700 mb-6">
          Rent Expense Booking
        </h1>

        {/* Filter UI with Add Site Button */}
        <div className="p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Filter Sites</h2>
            <button
              onClick={() => setShowAddSiteModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
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
              className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              value={filters.owner}
              onChange={(e) => setFilters({ ...filters, owner: e.target.value })}
            />
            <select
              className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
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
        <div className="p-4 mb-10 overflow-x-auto">
          {sites.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <p className="mt-4 text-gray-500">
                No sites found. Add your first site to get started.
              </p>
              <button
                onClick={() => setShowAddSiteModal(true)}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Add First Site
              </button>
            </div>
          ) : (
            <>
              <table className="min-w-full table-fixed border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1 w-10">#</th>
                    <th className="border px-2 py-1 w-28">Site</th>
                    <th className="border px-2 py-1 w-28">Location</th>
                    <th className="border px-2 py-1 w-24">State</th>
                    <th className="border px-2 py-1 w-24">City</th>
                    <th className="border px-2 py-1 w-28">Owner</th>
                    <th className="border px-2 py-1 w-14">GST</th>
                    <th className="border px-2 py-1 w-20">Agreement</th>
                    <th className="border px-2 py-1 w-32">Vouchers</th>
                    <th className="border px-2 py-1 w-44">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSites.map((site, index) => {
                    const agreement = getAgreementForSite(site.siteId)
                    const ownerName = site.owners?.[0]?.ownerName || 'No Owner'
                    return (
                      <tr key={site.siteId} className="text-center hover:bg-gray-50">
                        <td className="border px-2 py-1">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="border px-2 py-1">{site.siteName}</td>
                        <td className="border px-2 py-1">{site.location}</td>
                        <td className="border px-2 py-1">{site.state}</td>
                        <td className="border px-2 py-1">{site.city}</td>
                        <td className="border px-2 py-1">{ownerName}</td>
                        <td className="border px-2 py-1">
                          {agreement?.withGST
                            ? 'Yes'
                            : site.rentConfig?.gstExpected === 'yes'
                              ? 'Yes'
                              : 'No'}
                        </td>
                        <td className="border px-2 py-1">
                          {agreement ? (
                            <a
                              href={agreement.fileUrl || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline text-xs"
                            >
                              View
                            </a>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="border px-2 py-1">
                          {agreement ? (
                            <button
                              className="text-blue-600 underline text-xs hover:text-blue-800"
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
                        <td className="border px-2 py-1 space-x-2">
                          {site.isStandalone ? (
                            <button
                              onClick={() => {
                                setSelectedSite(site)
                                setShowAgreementModal(true)
                              }}
                              className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                            >
                              Add Owner & Agreement
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedSite(site)
                                if (!agreement) setShowAgreementModal(true)
                                else setShowVoucherModal(true)
                              }}
                              className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                            >
                              {agreement ? 'Generate Voucher' : 'Upload Agreement'}
                            </button>
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
      </div>
    </>
  )
}
