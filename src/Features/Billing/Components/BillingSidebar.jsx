import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  TrendingUp,
  Gift,
  FolderOpen,
  FileCheck,
  List,
  CreditCard,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Bell,
} from 'lucide-react'

const BillingSidebar = ({ onBack }) => {
  const [billingExpanded, setBillingExpanded] = useState(true)
  const [managementExpanded, setManagementExpanded] = useState(true)
  const [notificationCount, setNotificationCount] = useState(0)
  const navigate = useNavigate()

  // Load notification count from localStorage
  useEffect(() => {
    const loadNotificationCount = () => {
      try {
        const saved = localStorage.getItem('rateChangeNotifications')
        if (saved) {
          const notifications = JSON.parse(saved)
          const unreadCount = notifications.filter((n) => !n.read).length
          setNotificationCount(unreadCount)
        }
      } catch (err) {
        console.error('Error loading notifications:', err)
      }
    }

    loadNotificationCount()

    // Listen for storage changes to update count in real-time
    window.addEventListener('storage', loadNotificationCount)

    // Also check every second for changes (for same-tab updates)
    const interval = setInterval(loadNotificationCount, 1000)

    return () => {
      window.removeEventListener('storage', loadNotificationCount)
      clearInterval(interval)
    }
  }, [])

  const handleBackClick = () => {
    if (onBack) {
      onBack()
    } else {
      navigate('/dashboard/billing-manager')
    }
  }

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      path: '/dashboard/billing-manager/billing-dashboard',
      icon: LayoutDashboard,
      isExpandable: false,
    },
    {
      id: 'billing',
      title: 'Billing',
      icon: FileText,
      isExpandable: true,
      expanded: billingExpanded,
      setExpanded: setBillingExpanded,
      children: [
        {
          id: 'auto-billing',
          title: 'Auto Billing',
          path: '/dashboard/billing-manager/auto-billing',
          icon: FileText,
        },
        {
          id: 'manual-billing',
          title: 'Manual Billing',
          path: '/dashboard/billing-manager/manual-billing',
          icon: FilePlus,
        },
        {
          id: 'arrear-billing',
          title: 'Arrear Billing',
          path: '/dashboard/billing-manager/arrear-billing',
          icon: TrendingUp,
        },
        {
          id: 'bonus-billing',
          title: 'Bonus/Leave Encashment Billing',
          path: '/dashboard/billing-manager/bonus-billing',
          icon: Gift,
        },
      ],
    },
    {
      id: 'management',
      title: 'Management',
      icon: FolderOpen,
      isExpandable: true,
      expanded: managementExpanded,
      setExpanded: setManagementExpanded,
      children: [
        {
          id: 'rate-card',
          title: 'Rate Card',
          path: '/dashboard/billing-manager/rate-card',
          icon: CreditCard,
        },
        {
          id: 'proforma-invoices',
          title: 'Proforma Invoices',
          path: '/dashboard/billing-manager/proforma-invoices',
          icon: FileCheck,
        },
        {
          id: 'irn-invoices',
          title: 'IRN Generated Invoices',
          path: '/dashboard/billing-manager/irn-invoices',
          icon: FileCheck,
        },
        {
          id: 'invoice-list',
          title: 'Invoice List',
          path: '/dashboard/billing-manager/invoice-list',
          icon: List,
        },
      ],
    },
  ]

  return (
    <div className="h-full bg-white shadow-lg flex flex-col border-r border-gray-200">
      {/* Header with Back Button */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={handleBackClick}
          className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors duration-200 mb-3 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:translate-x-[-3px] transition-transform" />
          <span className="text-sm font-medium">Back to Main Menu</span>
        </button>
        <h2 className="text-lg font-bold text-gray-800">Billing Module</h2>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuItems.map((item) => (
          <div key={item.id}>
            {item.isExpandable ? (
              // Expandable Menu Item
              <div>
                <button
                  onClick={() => item.setExpanded(!item.expanded)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 text-gray-600 group-hover:text-green-600" />
                    <span className="font-medium text-sm">{item.title}</span>
                  </div>
                  {item.expanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                {/* Submenu */}
                {item.expanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.id}
                        to={child.path}
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 relative ${
                            isActive
                              ? 'bg-green-600 text-white shadow-md'
                              : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                          }`
                        }
                      >
                        <child.icon className="w-4 h-4" />
                        <span>{child.title}</span>
                        {child.id === 'arrear-billing' && notificationCount > 0 && (
                          <span className="absolute right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                            {notificationCount}
                          </span>
                        )}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Non-expandable Menu Item
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.title}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>Billing Module v1.0</p>
          <p className="mt-1">© 2025 iSmart ERP</p>
        </div>
      </div>
    </div>
  )
}

export default BillingSidebar
