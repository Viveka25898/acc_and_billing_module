const dashboardData = {
  "July 2025": {
    totalSites: 5,
    totalStaff: 120,
    statusBreakdown: [
      {siteId: "SITE001", site: "Site A", client: "ABC Ltd", pending: 10, punched: 30, rejected: 5 },
      {siteId: "SITE002", site: "Site B", client: "XYZ Ltd", pending: 5, punched: 20, rejected: 2 },
      {siteId: "SITE003", site: "Site C", client: "LMN Pvt Ltd", pending: 0, punched: 10, rejected: 1 },
    ],
    punchedStats: {
      punched: 60,
      unpunched: 15,
    },
    errorStats: {
      totalExceedsMonth: 2,
      missingDays: 3,
      holidayMismatch: 1,
    },
  },
};

export default dashboardData;