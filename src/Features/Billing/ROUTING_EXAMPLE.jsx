/* eslint-disable no-unused-vars */
// Example: How to add Proforma Invoices route to your routing system

/*
 * Add this route to your Routes/Route.jsx or wherever you manage routes
 */

// Import the component
import ProformaInvoices from '../Features/Billing/Pages/ProformaInvoices'

// Add to your routes array
const routes = [
  // ... other routes
  {
    path: '/billing-manager/proforma-invoices',
    element: <ProformaInvoices />,
    title: 'Proforma Invoices',
    role: ['Billing Manager', 'Financial Head'], // Adjust roles as needed
  },
  // ... other routes
]

/*
 * If using React Router, add to your router configuration:
 */

// <Route path="/billing-manager/proforma-invoices" element={<ProformaInvoices />} />

/*
 * Add to your sidebar navigation:
 */

const sidebarItems = [
  {
    title: 'Billing',
    icon: <FileText />,
    submenu: [
      {
        title: 'Auto Billing',
        path: '/billing/auto-billing',
        icon: <Zap />,
      },
      {
        title: 'Proforma Invoices',
        path: '/billing/proforma-invoices',
        icon: <FileText />,
      },
      // ... other items
    ],
  },
]

export default routes
