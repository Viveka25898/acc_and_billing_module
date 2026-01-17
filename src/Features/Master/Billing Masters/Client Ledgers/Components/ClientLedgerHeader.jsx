// Client Ledger Header Component
import React from 'react'
import { Building2, MapPin, Phone, Mail, CreditCard, AlertCircle } from 'lucide-react'

const ClientLedgerHeader = ({ ledgerInfo }) => {
  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 sm:p-6">
      {/* Top Section - Client Name & Location */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-6 h-6" />
            <h1 className="text-2xl sm:text-3xl font-bold">Client Ledger</h1>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold">{ledgerInfo.clientName}</h2>
          <div className="flex items-center gap-2 mt-1 text-green-100">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{ledgerInfo.location}</span>
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
          <div className="text-xs text-green-100">Current Outstanding</div>
          <div className="text-2xl sm:text-3xl font-bold">{ledgerInfo.outstandingBalance}</div>
          <div className="text-xs text-green-100">Debit Balance</div>
        </div>
      </div>

      {/* Grid Section - Client Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Client Code */}
        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
          <div className="text-xs text-green-100 mb-1">Client Code</div>
          <div className="font-semibold text-lg">{ledgerInfo.clientCode}</div>
        </div>

        {/* Client Name */}
        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
          <div className="text-xs text-green-100 mb-1">Client Name</div>
          <div className="font-semibold text-sm truncate">{ledgerInfo.clientName}</div>
        </div>

        {/* GL Account Code */}
        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
          <div className="text-xs text-green-100 mb-1">GL Account Code</div>
          <div className="font-semibold">{ledgerInfo.glAccountCode}</div>
        </div>

        {/* Account Name */}
        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
          <div className="text-xs text-green-100 mb-1">Account Name</div>
          <div className="font-semibold text-sm truncate">{ledgerInfo.glAccountName}</div>
        </div>

        {/* GSTIN */}
        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
          <div className="text-xs text-green-100 mb-1">GSTIN</div>
          <div className="font-semibold text-sm">{ledgerInfo.gstin}</div>
        </div>

        {/* PAN */}
        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
          <div className="text-xs text-green-100 mb-1">PAN</div>
          <div className="font-semibold">{ledgerInfo.pan}</div>
        </div>

        {/* Payment Terms */}
        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
          <div className="text-xs text-green-100 mb-1 flex items-center gap-1">
            <CreditCard className="w-3 h-3" />
            Payment Terms
          </div>
          <div className="font-semibold">{ledgerInfo.paymentTerms}</div>
        </div>

        {/* Credit Limit */}
        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
          <div className="text-xs text-green-100 mb-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Credit Limit
          </div>
          <div className="font-semibold">{ledgerInfo.creditLimit}</div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
          <div className="text-xs text-green-100 mb-1">Contact Person</div>
          <div className="font-semibold text-sm">{ledgerInfo.contactPerson}</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
          <div className="text-xs text-green-100 mb-1 flex items-center gap-1">
            <Phone className="w-3 h-3" />
            Phone
          </div>
          <div className="font-semibold text-sm">{ledgerInfo.phone}</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
          <div className="text-xs text-green-100 mb-1 flex items-center gap-1">
            <Mail className="w-3 h-3" />
            Email
          </div>
          <div className="font-semibold text-sm truncate">{ledgerInfo.email}</div>
        </div>
      </div>

      {/* Opening Balance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
          <div className="text-xs text-green-100 mb-1">Opening Balance (01 Apr 2025)</div>
          <div className="font-semibold text-lg">{ledgerInfo.openingBalance}</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
          <div className="text-xs text-green-100 mb-1">Current Outstanding</div>
          <div className="font-semibold text-lg">{ledgerInfo.outstandingBalance}</div>
        </div>
      </div>
    </div>
  )
}

export default ClientLedgerHeader
