import React, { useState } from 'react';

const InvoiceViewer = ({ selectedInvoice }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  React.useEffect(() => {
    if (selectedInvoice) {
      setIsLoading(true);
      setError(null);
      setImageError(false);
      setImageLoading(true);
      
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300); // Reduced loading time since we're showing real images
      
      return () => clearTimeout(timer);
    }
  }, [selectedInvoice]);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  // Get the image URL - remove '/public' from the path since public folder is served from root
  const getImageUrl = (documentUrl) => {
    if (!documentUrl) return null;
    // Remove '/public' prefix if it exists, since files in public folder are accessible from root
    return documentUrl.replace('/public/', '/');
  };

  if (!selectedInvoice) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Invoice Selected</h3>
          <p className="text-sm text-gray-500 mb-4">
            Click on an invoice from the left table to view it here
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 font-medium">Loading Invoice...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Invoice</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(selectedInvoice.documentUrl);

  return (
    <div className="h-full flex flex-col">
      {/* Invoice Header */}
      <div className="p-2 bg-white border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">
            {selectedInvoice.invoiceNumber}
          </h3>
          <p className="text-xs text-gray-600">
            Amount: ₹{selectedInvoice.amount.toLocaleString()}
          </p>
        </div>
        {imageUrl && (
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

      {/* Invoice Image Viewer */}
      <div className="flex-1 bg-gray-100 relative overflow-hidden">
        {!imageUrl ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Document Available</h3>
              <p className="text-sm text-gray-500">
                Invoice document not found
              </p>
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
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-red-600 mb-2">Failed to Load Image</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Could not load invoice image
                  </p>
                  <p className="text-xs text-gray-500">
                    Path: {selectedInvoice.documentUrl}
                  </p>
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
    </div>
  );
};

export default InvoiceViewer;