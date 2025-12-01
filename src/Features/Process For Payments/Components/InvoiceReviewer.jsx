import React, { useState } from 'react'

const InvoiceViewer = ({ selectedInvoice }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [imageLoading, setImageLoading] = useState(false)
  const [imageError, setImageError] = useState(false)

  React.useEffect(() => {
    if (selectedInvoice) {
      setIsLoading(true)
      setError(null)
      setImageError(false)

      // Only set image loading if it's a regular invoice with document
      if (selectedInvoice.documentUrl && !selectedInvoice.isRentVoucher) {
        setImageLoading(true)
      }

      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [selectedInvoice])

  const handleImageLoad = () => {
    setImageLoading(false)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

  // Get the image URL - remove '/public' from the path since public folder is served from root
  const getImageUrl = (documentUrl) => {
    if (!documentUrl) return null
    // Remove '/public' prefix if it exists, since files in public folder are accessible from root
    return documentUrl.replace('/public/', '/')
  }

  // Check if it's a rent voucher
  const isRentVoucher = selectedInvoice?.isRentVoucher || selectedInvoice?.rentDetails

  if (!selectedInvoice) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Invoice Selected</h3>
          <p className="text-sm text-gray-500 mb-4">
            Click on an invoice or voucher from the left table to view it here
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 font-medium">
            Loading {isRentVoucher ? 'Voucher' : 'Invoice'}...
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-600 mb-2">
            Error Loading {isRentVoucher ? 'Voucher' : 'Invoice'}
          </h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    )
  }

  const imageUrl = getImageUrl(selectedInvoice.documentUrl)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-2 bg-white border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            {selectedInvoice.invoiceNumber}
            {isRentVoucher && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                Rent Voucher
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-600">
            Amount: ₹{selectedInvoice.amount.toLocaleString()}
          </p>
          {isRentVoucher && selectedInvoice.rentDetails && (
            <p className="text-xs text-gray-600">
              {selectedInvoice.rentDetails.month} • {selectedInvoice.rentDetails.siteName}
            </p>
          )}
        </div>
        {imageUrl && !isRentVoucher && (
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Open Full Size
          </a>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-gray-100 relative overflow-hidden">
        {isRentVoucher ? (
          // Rent Voucher Details View
          <div className="absolute inset-0 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
              <h4 className="font-semibold text-gray-800 mb-4 text-lg border-b pb-2">
                Rent Voucher Details
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600 block text-xs font-medium">Voucher Number:</span>
                    <p className="font-medium text-gray-800">
                      {selectedInvoice.voucherNo || selectedInvoice.invoiceNumber}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 block text-xs font-medium">Month:</span>
                    <p className="font-medium text-gray-800">
                      {selectedInvoice.rentDetails?.month}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 block text-xs font-medium">Site Name:</span>
                    <p className="font-medium text-gray-800">
                      {selectedInvoice.rentDetails?.siteName}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 block text-xs font-medium">Location:</span>
                    <p className="font-medium text-gray-800">
                      {selectedInvoice.rentDetails?.siteLocation}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600 block text-xs font-medium">Base Rent:</span>
                    <p className="font-medium text-gray-800">
                      ₹
                      {selectedInvoice.rentDetails?.baseRent?.toLocaleString() ||
                        selectedInvoice.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 block text-xs font-medium">GST Amount:</span>
                    <p className="font-medium text-gray-800">
                      ₹{selectedInvoice.rentDetails?.gstAmount?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 block text-xs font-medium">GST Type:</span>
                    <p className="font-medium text-gray-800">
                      {selectedInvoice.rentDetails?.gstType || 'Without GST'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 block text-xs font-medium">Agreement ID:</span>
                    <p className="font-medium text-gray-800 text-xs">
                      {selectedInvoice.rentDetails?.agreementId || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Accounting Summary */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-3 text-sm">Accounting Summary</h5>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600 text-xs">Vendor GL Code:</span>
                    <p className="font-medium text-gray-800 font-mono">
                      {selectedInvoice.vendorGLCode || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs">Total Amount:</span>
                    <p className="font-semibold text-gray-800 text-lg">
                      ₹{selectedInvoice.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600 text-xs">Status:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        Approved for Payment
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                        Pending Payment
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {selectedInvoice.vendorDetails && (
                <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
                  <h5 className="font-semibold text-gray-700 mb-2 text-sm">Vendor Information</h5>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vendor Name:</span>
                      <span className="font-medium">
                        {selectedInvoice.vendorDetails.vendorName}
                      </span>
                    </div>
                    {selectedInvoice.vendorDetails.panNumber && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">PAN:</span>
                        <span className="font-medium">
                          {selectedInvoice.vendorDetails.panNumber}
                        </span>
                      </div>
                    )}
                    {selectedInvoice.vendorDetails.gstin && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">GSTIN:</span>
                        <span className="font-medium">{selectedInvoice.vendorDetails.gstin}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Regular Invoice Image View (existing code)
          <div className="absolute inset-0">
            {!imageUrl ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Document Available</h3>
                  <p className="text-sm text-gray-500">Invoice document not found</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 p-2">
                {/* Loading state for image */}
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <div className="text-gray-600 text-sm">Loading image...</div>
                    </div>
                  </div>
                )}

                {/* Error state for image */}
                {imageError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-red-600 mb-2">
                        Failed to Load Image
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">Could not load invoice image</p>
                      <p className="text-xs text-gray-500">Path: {selectedInvoice.documentUrl}</p>
                    </div>
                  </div>
                )}

                {/* Actual Image */}
                {!imageError && (
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={imageUrl}
                      alt={`Invoice ${selectedInvoice.invoiceNumber}`}
                      className="max-w-full max-h-full object-contain shadow-lg rounded border"
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                      style={{ display: imageLoading ? 'none' : 'block' }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default InvoiceViewer
