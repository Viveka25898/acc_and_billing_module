import React from 'react'
import { Outlet } from 'react-router-dom'
import BillingSidebar from '../Components/BillingSidebar'
import BillingManagerNavbar from '../../../Roles/Billing Manager/Components/BillingManagerNavbar'

const BillingLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Billing Sidebar - Fixed width */}
      <div className="w-64 flex-shrink-0 hidden lg:block">
        <BillingSidebar />
      </div>

      {/* Mobile Sidebar - Overlay */}
      <div className="lg:hidden">
        <MobileBillingSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <BillingManagerNavbar />

        {/* Page Content with Scroll */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

// Mobile Sidebar Component
const MobileBillingSidebar = () => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 lg:hidden bg-green-600 text-white p-3 rounded-lg shadow-lg hover:bg-green-700 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <BillingSidebar onBack={() => setIsOpen(false)} />
      </div>
    </>
  )
}

export default BillingLayout
