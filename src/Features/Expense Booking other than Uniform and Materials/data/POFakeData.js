const POFakeData = Array.from({ length: 25 }, (_, i) => {
  const services = [
    "Audit service",
    "Legal consultancy", 
    "Office maintenance",
    "HR outsourcing",
    "Annual IT support",
    "Electrical inspection",
    "Catering service",
    "Cleaning contract",
    "Recruitment agency",
    "Cloud subscription",
  ];

  const vendors = [
    "ABC Solutions Pvt Ltd",
    "XYZ Consultancy Services", 
    "Tech Support India",
    "Legal Associates",
    "Audit & Co.",
    "Cleaning Services Ltd",
    "Security Solutions",
    "HR Partners Ltd",
    "Maintenance Corp",
    "Finance Consultants"
  ];

  // Define vendor status flow
  const getVendorStatusFlow = (index) => {
    const statusFlow = [
      { status: "po-sent", label: "PO Sent" },
      { status: "invoice-pending", label: "Invoice Pending" }, 
      { status: "invoice-uploaded", label: "Invoice Uploaded" },
      { status: "under-review", label: "Under Review" },
      { status: "approved", label: "Approved" },
      { status: "rejected", label: "Rejected" }
    ];

    // Create different scenarios based on index
    if (index % 8 === 0) return statusFlow[5]; // rejected
    if (index % 7 === 0) return statusFlow[4]; // approved  
    if (index % 6 === 0) return statusFlow[3]; // under review
    if (index % 5 === 0) return statusFlow[2]; // invoice uploaded
    if (index % 4 === 0) return statusFlow[1]; // invoice pending
    return statusFlow[0]; // po sent
  };

  const vendorStatus = getVendorStatusFlow(i);
  const isRejected = vendorStatus.status === "rejected";
  const isApproved = vendorStatus.status === "approved";

  // Overall PO status based on vendor status
  const getOverallStatus = (vendorStatus) => {
    switch (vendorStatus.status) {
      case "po-sent":
      case "invoice-pending":
        return "pending";
      case "invoice-uploaded":
      case "under-review":
        return "in-progress";
      case "approved":
        return "approved";
      case "rejected":
        return "rejected";
      default:
        return "pending";
    }
  };

  return {
    id: i + 1,
    poNumber: `PO-2025-${(i + 1).toString().padStart(3, '0')}`,
    vendorName: vendors[i % vendors.length],
    expenseType: i % 2 === 0 ? "professional-fees" : "one-time-service",
    poType: i % 3 === 0 ? "yearly" : "one-time", 
    amount: (10000 + i * 500).toFixed(2),
    description: services[i % services.length],
    createdDate: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    startDate: new Date(Date.now() + (i * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    endDate: i % 3 === 0 ? new Date(Date.now() + ((i + 365) * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] : null,
    
    // Vendor-specific status
    vendorStatus: vendorStatus,
    
    // Overall approval status
    managerApproval: "approved", // All POs from manager are approved by default
    financeApproval: isApproved ? "approved" : isRejected ? "rejected" : "pending",
    
    // Overall PO status
    status: getOverallStatus(vendorStatus),
    
    // Additional tracking
    invoiceAmount: vendorStatus.status === "invoice-uploaded" || isApproved ? (parseFloat((10000 + i * 500).toFixed(2)) + Math.random() * 1000).toFixed(2) : null,
    lastUpdated: new Date(Date.now() - (Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
    
    rejectionReason: isRejected ? [
      "Missing GST details in invoice",
      "Invoice amount mismatch with PO",
      "Incomplete supporting documents", 
      "Invalid vendor credentials",
      "Service not delivered as per PO terms"
    ][i % 5] : null,
  };
});

export default POFakeData;