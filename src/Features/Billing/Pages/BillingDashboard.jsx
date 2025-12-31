import React, { useState, useEffect } from 'react'
import DashboardStats from '../Components/DashboardStats'
import QuickActions from '../Components/QuickActions'
import RecentActivity from '../Components/RecentActivity'
import { DASHBOARD_STATS, RECENT_ACTIVITIES } from '../data/billingConstants'
import { BillingService } from '../Services/billingService'

const BillingDashboard = () => {
  const [stats, setStats] = useState(DASHBOARD_STATS)
  const [activities, setActivities] = useState(RECENT_ACTIVITIES)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    const loadDashboardData = async () => {
      try {
        // Try to get actual stats from service, fallback to dummy data
        const actualStats = BillingService.getDashboardStats()
        const actualActivities = BillingService.getActivities(5)

        setStats(actualStats.monthlyRevenue > 0 ? actualStats : DASHBOARD_STATS)
        setActivities(actualActivities.length > 0 ? actualActivities : RECENT_ACTIVITIES)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        // Use dummy data on error
        setStats(DASHBOARD_STATS)
        setActivities(RECENT_ACTIVITIES)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
          <span className="mr-3">📊</span>
          Billing Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome to the Billing Module. Manage invoices, rate cards, and client billing.
        </p>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats stats={stats} />

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <QuickActions />
        <RecentActivity activities={activities} />
      </div>

      {/* Additional Info Section */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Getting Started</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:border-green-500 transition-colors">
            <div className="text-green-600 text-2xl mb-2">1️⃣</div>
            <h4 className="font-semibold text-gray-800 mb-1">Auto Billing</h4>
            <p className="text-sm text-gray-600">
              Generate automated invoices using attendance data and rate cards.
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:border-green-500 transition-colors">
            <div className="text-green-600 text-2xl mb-2">2️⃣</div>
            <h4 className="font-semibold text-gray-800 mb-1">Manual Billing</h4>
            <p className="text-sm text-gray-600">
              Create custom invoices for one-time services or special cases.
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:border-green-500 transition-colors">
            <div className="text-green-600 text-2xl mb-2">3️⃣</div>
            <h4 className="font-semibold text-gray-800 mb-1">Track & Manage</h4>
            <p className="text-sm text-gray-600">
              View proforma invoices, IRN generated invoices, and complete invoice history.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillingDashboard
