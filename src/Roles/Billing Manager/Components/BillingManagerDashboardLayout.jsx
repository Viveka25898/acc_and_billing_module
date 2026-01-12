import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import BillingManagerSidebar from './BillingManagerSidebar'
import BillingManagerNavbar from './BillingManagerNavbar'
import BillingSidebar from '../../../Features/Billing/Components/BillingSidebar'

const BillingManagerDashboardLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showBillingSidebar, setShowBillingSidebar] = useState(false)

  // Check if current route is a billing module route
  useEffect(() => {
    const billingRoutes = [
      '/dashboard/billing-manager/billing-dashboard',
      '/dashboard/billing-manager/auto-billing',
      '/dashboard/billing-manager/manual-billing',
      '/dashboard/billing-manager/arrear-billing',
      '/dashboard/billing-manager/bonus-leave-encashment',
      '/dashboard/billing-manager/rate-card',
      '/dashboard/billing-manager/proforma-invoices',
      '/dashboard/billing-manager/irn-invoices',
      '/dashboard/billing-manager/invoice-list',
    ]

    const isBillingRoute = billingRoutes.some((route) => location.pathname.startsWith(route))
    setShowBillingSidebar(isBillingRoute)
  }, [location.pathname])

  //Toaster
  useEffect(() => {
    // Check if login flag is set
    if (localStorage.getItem('showLoginToast') === 'true') {
      toast.success('Login Successful! 🎉', {
        position: 'top-right',
        autoClose: 3000,
      })

      // Remove flag so it doesn’t show again
      localStorage.removeItem('showLoginToast')
    }
  }, [])

  const handleBackToMainSidebar = () => {
    setShowBillingSidebar(false)
    navigate('/dashboard/billing-manager')
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar (Fixed Left & Always on Top) - Dynamic based on route */}
      <div
        className={`flex-shrink-0 transition-all duration-300 ${showBillingSidebar ? 'w-64' : 'w-48'}`}
      >
        {showBillingSidebar ? (
          <BillingSidebar onBack={handleBackToMainSidebar} />
        ) : (
          <BillingManagerSidebar />
        )}
      </div>

      {/* Main Content Wrapper */}
      <div className="flex flex-col flex-1">
        {/* Navbar (Below Sidebar, but Fixed at Top) */}
        <BillingManagerNavbar />

        {/* Page Content Area */}
        <div className="p-6 bg-gray-100 flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default BillingManagerDashboardLayout
