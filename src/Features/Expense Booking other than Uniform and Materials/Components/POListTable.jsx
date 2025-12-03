/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { FaEye, FaEdit, FaDownload, FaCalendar } from 'react-icons/fa'

export default function POListTable({ pos }) {
  const [selectedReason, setSelectedReason] = useState(null)
  const [selectedPO, setSelectedPO] = useState(null)

  const getFinanceStatusColor = (status) => {
    const financeStatusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    }
    return financeStatusColors[status] || 'bg-gray-100 text-gray-800'
  }

  const getVendorStatusColor = (status) => {
    const vendorStatusColors = {
      'po-sent': 'bg-purple-100 text-purple-800',
      'invoice-pending': 'bg-orange-100 text-orange-800',
      'invoice-uploaded': 'bg-blue-100 text-blue-800',
      'under-review': 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    }
    return vendorStatusColors[status] || 'bg-gray-100 text-gray-800'
  }

  const handleViewDetails = (po) => {
    setSelectedPO(po)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return '-'
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  // Try to fetch vendor details from localStorage 'vendors' key.
  // If not found, fallback to a dummy vendor object using the vendorName.
  const getVendorDetails = (vendorName) => {
    try {
      const vendorsRaw = JSON.parse(localStorage.getItem('vendors') || 'null')
      if (Array.isArray(vendorsRaw)) {
        const found = vendorsRaw.find(
          (v) =>
            (v.name && v.name.toString().toLowerCase() === vendorName.toString().toLowerCase()) ||
            (v.companyName &&
              v.companyName.toString().toLowerCase() === vendorName.toString().toLowerCase())
        )
        if (found) {
          // Normalize expected fields
          return {
            name: found.name || found.companyName || vendorName,
            website: found.website || '-',
            address: found.address || found.street || '-',
            city: found.city || '-',
            state: found.state || '-',
            zip: found.zip || '-',
            phone: found.phone || '-',
            email: found.email || '-',
            gstin: found.gstin || '-',
            contactPerson: found.contactPerson || '-',
            ...found,
          }
        }
      }
    } catch (err) {
      // ignore parse errors
      // console.error('Error parsing vendors from localStorage', err)
    }

    // If no vendors key or no match, return dummy vendor using vendorName
    return {
      name: vendorName || 'Unknown Vendor',
      website: '-',
      address: '123 Vendor Street',
      city: 'Mumbai',
      state: 'MH',
      zip: '400001',
      phone: '000-000-0000',
      email: 'vendor@example.com',
      gstin: '27ABCDE1234F2Z5',
      contactPerson: 'Vendor Contact',
    }
  }

  // Hardcoded company details (use dummy where needed)
  const COMPANY = {
    name: 'iSmart Facitech',
    logoText: 'iSmart Facitech', // used as text when logo not available
    addressLine1: 'Plot No. 45, Tech Park',
    addressLine2: 'Andheri East, Mumbai - 400093',
    phone: '+91-22-4000-0000',
    email: 'info@ismartfacitech.com',
    website: 'https://www.ismartfacitech.com',
    gstin: '27ISMTF1234P1Z9',
  }

  // Build a printable HTML for the given PO (simple, self-contained)
  const buildPOHtml = (po, vendor) => {
    const createdDate = po.createdDate ? formatDate(po.createdDate) : formatDate(new Date())
    const startDate = po.startDate ? formatDate(po.startDate) : '-'
    const endDate = po.endDate ? formatDate(po.endDate) : '-'

    const subtotal = Number(po.amount || 0)
    const taxRate = po.taxRate !== undefined ? Number(po.taxRate) : 0
    const taxTotal = +(subtotal * (taxRate / 100)).toFixed(2)
    const shipping = po.shipping ? Number(po.shipping) : 0
    const other = po.other ? Number(po.other) : 0
    const total = +(subtotal + taxTotal + shipping + other).toFixed(2)

    // Minimal styles to make the PDF look decent
    return `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <title>Purchase Order - ${po.poNumber}</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; color: #222; margin: 24px; }
            .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
            .logo { font-weight:700; font-size:20px; color:#0b5e3b; }
            .company-details { text-align:right; font-size:12px; }
            h1 { color:#0b5e3b; margin:0; font-size:28px; }
            .section { display:flex; gap:20px; margin-top:12px; }
            .box { flex:1; }
            .box h3 { background:#0b5e3b; color:#fff; padding:6px 8px; margin:0 0 8px 0; font-size:13px; }
            .small { font-size:12px; color:#333; margin:2px 0; }
            table { width:100%; border-collapse:collapse; margin-top:12px; }
            table th, table td { border:1px solid #ddd; padding:8px; font-size:12px; }
            table th { background:#f3f6f4; text-align:left; }
            .text-right { text-align:right; }
            .totals { width:300px; float:right; margin-top:8px; }
            .totals table td { border:none; padding:6px 8px; }
            .authorized { margin-top:60px; display:flex; justify-content:space-between; font-size:12px; }
            .footer { margin-top:30px; text-align:center; font-size:11px; color:#666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">${COMPANY.logoText}</div>
              <div style="font-size:14px; font-weight:700; margin-top:8px">${COMPANY.name}</div>
            </div>
            <div class="company-details">
              <div class="small">${COMPANY.addressLine1}</div>
              <div class="small">${COMPANY.addressLine2}</div>
              <div class="small">Phone: ${COMPANY.phone}</div>
              <div class="small">Email: ${COMPANY.email}</div>
              <div class="small">GSTIN: ${COMPANY.gstin}</div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <h1>Purchase Order</h1>
            <div style="text-align:right; font-size:13px;">
              <div><strong>Date:</strong> ${createdDate}</div>
              <div><strong>P.O. #</strong> ${po.poNumber || '-'}</div>
            </div>
          </div>

          <div class="section">
            <div class="box">
              <h3>Vendor</h3>
              <div class="small"><strong>${vendor.name}</strong></div>
              <div class="small">${vendor.website || '-'}</div>
              <div class="small">${vendor.address}</div>
              <div class="small">${vendor.city}, ${vendor.state} - ${vendor.zip}</div>
              <div class="small">Phone: ${vendor.phone}</div>
              <div class="small">Email: ${vendor.email}</div>
              <div class="small">GSTIN: ${vendor.gstin || '-'}</div>
            </div>

            <div class="box">
              <h3>Ship To</h3>
              <div class="small">Attn: Procurement</div>
              <div class="small">${COMPANY.name}</div>
              <div class="small">${COMPANY.addressLine1}</div>
              <div class="small">${COMPANY.addressLine2}</div>
              <div class="small">Phone: ${COMPANY.phone}</div>
            </div>
          </div>

          <div style="margin-top:12px;">
            <table>
              <thead>
                <tr>
                  <th style="width:15%;">Item #</th>
                  <th style="width:50%;">Description</th>
                  <th style="width:10%;">QTY</th>
                  <th style="width:12%;">Unit Price</th>
                  <th style="width:13%;">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>${po.description || '-'}</td>
                  <td class="text-right">1</td>
                  <td class="text-right">₹${subtotal.toFixed(2)}</td>
                  <td class="text-right">₹${subtotal.toFixed(2)}</td>
                </tr>
                <!-- Empty rows for spacing -->
                <tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
                <tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
              </tbody>
            </table>

            <div class="totals">
              <table>
                <tbody>
                  <tr><td>SUBTOTAL</td><td class="text-right">₹${subtotal.toFixed(2)}</td></tr>
                  <tr><td>TAX RATE</td><td class="text-right">${taxRate}%</td></tr>
                  <tr><td>TAX TOTAL</td><td class="text-right">₹${taxTotal.toFixed(2)}</td></tr>
                  <tr><td>SHIPPING</td><td class="text-right">₹${shipping.toFixed(2)}</td></tr>
                  <tr><td>OTHER</td><td class="text-right">₹${other.toFixed(2)}</td></tr>
                  <tr style="border-top:1px solid #ddd;"><td><strong>TOTAL</strong></td><td class="text-right"><strong>₹${total.toFixed(2)}</strong></td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style="clear:both;"></div>

          <div class="authorized">
            <div>Authorized by ____________________</div>
            <div>Date: ____________________</div>
          </div>

          <div class="footer">
            This is a computer generated document. For any queries please contact ${COMPANY.email}
          </div>
        </body>
      </html>
    `
  }

  // Download PO - open printable window (user can Save as PDF via print dialog)
  const downloadPO = (po) => {
    try {
      const vendor = getVendorDetails(po.vendorName)
      const html = buildPOHtml(po, vendor)
      const printWindow = window.open('', '_blank', 'width=900,height=700')
      if (!printWindow) {
        alert('Please allow popups for this website to download the PO.')
        return
      }
      printWindow.document.open()
      printWindow.document.write(html)
      printWindow.document.close()
      // Give browser some time to render before triggering print
      setTimeout(() => {
        printWindow.focus()
        printWindow.print()
        // Optional: close after print dialog opens
        // printWindow.close()
      }, 600)
    } catch (err) {
      console.error('Error generating PO PDF', err)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  if (!pos || pos.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">No POs found matching your criteria</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left font-medium text-gray-700 border-b">PO Details</th>
              <th className="p-3 text-left font-medium text-gray-700 border-b">Vendor Info</th>
              <th className="p-3 text-left font-medium text-gray-700 border-b">Type & Amount</th>
              <th className="p-3 text-center font-medium text-gray-700 border-b">Vendor Status</th>
              <th className="p-3 text-center font-medium text-gray-700 border-b">
                Finance Head Status
              </th>
              <th className="p-3 text-center font-medium text-gray-700 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pos.map((po, i) => (
              <tr key={po.id} className="hover:bg-gray-50 border-b">
                {/* PO Details */}
                <td className="p-3">
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-900">{po.poNumber}</div>
                    <div className="text-xs text-gray-600 truncate max-w-40" title={po.description}>
                      {po.description}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <FaCalendar className="w-3 h-3" />
                      {formatDate(po.createdDate)}
                    </div>
                  </div>
                </td>

                {/* Vendor Info */}
                <td className="p-3">
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900">{po.vendorName}</div>
                  </div>
                </td>

                {/* Type & Amount */}
                <td className="p-3">
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-900">₹{po.amount}</div>
                    <div className="text-xs capitalize text-gray-600">
                      {po.poType} • {(po.expenseType || '').replace('-', ' ')}
                    </div>
                    {po.invoiceAmount && (
                      <div className="text-xs text-blue-600">Invoice: ₹{po.invoiceAmount}</div>
                    )}
                  </div>
                </td>

                {/* Vendor Status */}
                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getVendorStatusColor(
                      po.vendorStatus?.status || ''
                    )}`}
                  >
                    {po.vendorStatus?.label || (po.vendorStatus?.status || '').toUpperCase() || '-'}
                  </span>
                  {po.vendorStatus?.status === 'rejected' && po.rejectionReason && (
                    <button
                      onClick={() => setSelectedReason(po.rejectionReason)}
                      className="ml-1 text-red-600 hover:text-red-800"
                      title="View rejection reason"
                    >
                      <FaEye className="w-3 h-3" />
                    </button>
                  )}
                </td>

                {/* Finance Head Status */}
                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getFinanceStatusColor(
                      po.financeApproval
                    )}`}
                  >
                    {(po.financeApproval || '').toUpperCase() || '-'}
                  </span>
                  {po.financeApproval === 'rejected' && po.rejectionReason && (
                    <button
                      onClick={() => setSelectedReason(po.rejectionReason)}
                      className="ml-1 text-red-600 hover:text-red-800"
                      title="View rejection reason"
                    >
                      <FaEye className="w-3 h-3" />
                    </button>
                  )}
                </td>

                {/* Actions */}
                <td className="p-3">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleViewDetails(po)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                      title="View Details"
                    >
                      <FaEye className="w-4 h-4" />
                    </button>

                    {po.status === 'pending' && (
                      <button
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                        title="Edit PO"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => downloadPO(po)}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                      title="Download PO"
                    >
                      <FaDownload className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PO Details Modal */}
      {selectedPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">PO Details</h3>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setSelectedPO(null)}
              >
                ✕
              </button>
            </div>

            {/* Company + Vendor Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <div className="font-medium text-gray-700">Company</div>
                <div className="text-gray-900 font-semibold">{COMPANY.name}</div>
                <div className="text-xs text-gray-600">{COMPANY.addressLine1}</div>
                <div className="text-xs text-gray-600">{COMPANY.addressLine2}</div>
                <div className="text-xs text-gray-600">Phone: {COMPANY.phone}</div>
                <div className="text-xs text-gray-600">Email: {COMPANY.email}</div>
                <div className="text-xs text-gray-600">GSTIN: {COMPANY.gstin}</div>
              </div>

              <div>
                <div className="font-medium text-gray-700">Vendor</div>
                {(() => {
                  const vendor = getVendorDetails(selectedPO.vendorName)
                  return (
                    <>
                      <div className="text-gray-900 font-semibold">{vendor.name}</div>
                      <div className="text-xs text-gray-600">{vendor.address}</div>
                      <div className="text-xs text-gray-600">
                        {vendor.city}, {vendor.state} - {vendor.zip}
                      </div>
                      <div className="text-xs text-gray-600">Phone: {vendor.phone}</div>
                      <div className="text-xs text-gray-600">Email: {vendor.email}</div>
                      <div className="text-xs text-gray-600">GSTIN: {vendor.gstin}</div>
                    </>
                  )
                })()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="font-medium text-gray-700">PO Number:</label>
                <p className="text-gray-900">{selectedPO.poNumber}</p>
              </div>

              <div>
                <label className="font-medium text-gray-700">Amount:</label>
                <p className="text-gray-900">₹{selectedPO.amount}</p>
              </div>

              <div>
                <label className="font-medium text-gray-700">PO Type:</label>
                <p className="text-gray-900 capitalize">{selectedPO.poType}</p>
              </div>

              <div>
                <label className="font-medium text-gray-700">Expense Type:</label>
                <p className="text-gray-900 capitalize">
                  {(selectedPO.expenseType || '').replace('-', ' ')}
                </p>
              </div>

              <div>
                <label className="font-medium text-gray-700">Start Date:</label>
                <p className="text-gray-900">{formatDate(selectedPO.startDate)}</p>
              </div>

              <div>
                <label className="font-medium text-gray-700">End Date:</label>
                <p className="text-gray-900">{formatDate(selectedPO.endDate)}</p>
              </div>

              <div className="md:col-span-2">
                <label className="font-medium text-gray-700">Description:</label>
                <p className="text-gray-900 mt-1">{selectedPO.description}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                onClick={() => setSelectedPO(null)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => downloadPO(selectedPO)}
              >
                Download PO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {selectedReason && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 text-red-600">Rejection Reason</h3>
            <p className="text-sm text-gray-700 mb-4">{selectedReason}</p>
            <div className="text-right">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => setSelectedReason(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
