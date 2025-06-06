import React, { useState } from 'react'
import { IoMdCloseCircleOutline } from "react-icons/io";

const InvoiceDetailsModal = ({isOpen, onClose,invoice}) => {
     const [isIframeLoading, setIsIframeLoading] = useState(true);
    if (!isOpen || !invoice) return null
  return (
    <>
    <div className=' fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40  px-4'>
        <div className='bg-white rounded-lg shadow-lg w-full max-w-2xl relative p-6 overflow-y-auto max-h-[90vh]'>
            {/* Close Button  */}
            <button
            onClick={onClose}
            className='absolute top-3 right-3 text-gray-500 hover:text-red-600'
            >
                <IoMdCloseCircleOutline  size={20}/>

            </button>

            {/* Header  */}
            <h2 className='text-xl font-bold mb-4 border-b pb-2'>Invoice Details</h2>
            
            {/* Invoice Data  */}
            <div className='spaye-y-2 text-sm'>
                <p><span className='font-semibold'>Invoice Number:</span>{" "}{invoice.invoiceNumber}</p>
                <p><span className="font-semibold">Vendor Name:</span> {" "} {invoice.vendorName}</p>
                <p><span className="font-semibold">Uploaded Date:</span> {" "} {invoice.uploadedDate}</p>
                <p><span className="font-semibold">POs Covered:</span> {" "} {invoice.posCovered?.join(", ")}</p>
                <p><span className="font-semibold">Total Amount:</span> {" "} ₹{invoice.totalAmount?.toLocaleString()}</p>
                <p><span className="font-semibold">Uploaded By:</span> {" "} {invoice.uploadedBy || "N/A"}</p>
                <p><span className="font-semibold">Status:</span> {" "} {invoice.status}</p>
                {
                    invoice.status === "Rejected" && (
                        <p><span className="font-semibold">Remarks:</span> {" "}{invoice.remarks || "No Remarks"}</p>
                    )
                }

                {/* Document Preview  */}
                {
                    invoice.documentUrl && (
                        <div className='mt-4'>
                            <p className='font-semibold mb-2'>Invoice Document Preview</p>
                            {/* Loading Spinner  */}
                            {
                                isIframeLoading && (
                                     <div className="flex items-center justify-center h-96 border rounded bg-gray-100 text-gray-500 animate-pulse">
                                    Loading document...
                                    </div>
                                )
                            }
                            <iframe
                             src={invoice.documentUrl}
                            title='Invoice Document'
                           className={`w-full h-96 border rounded ${isIframeLoading ? "hidden" : "block"}`}
                            frameborder="0"
                            onLoad={()=>setIsIframeLoading(false)}
                            
                            />
                            <div className='mt-2'>
                                <a href={invoice.documentUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-blue-600 hover:underline text-sm'
                                >
                                    Open full Document in the Web
                                </a>

                            </div>
                        </div>
                    )
                }

            </div>

        </div>
    </div>
    
    </>
  )
}

export default InvoiceDetailsModal