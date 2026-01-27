import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PLReportDataService from '../../Services/PLReportDataService'
import PLReportViewer from '../Components/PLReportViewer'

const PLReportPage = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [reportData, setReportData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true)
                // Get period data from navigation state
                const periodData = location.state?.periodData

                if (!periodData) {
                    // If no state, redirect back to reports dashboard
                    navigate('/reports')
                    return
                }

                // Simulate a small delay for better UX (optional)
                await new Promise(r => setTimeout(r, 500))

                const data = PLReportDataService.getPLData(periodData)
                setReportData(data)
            } catch (err) {
                console.error('PLReportPage fetch error', err)
                setReportData({ success: false, error: 'Failed to load report data' })
            } finally {
                setLoading(false)
            }
        }

        fetchReport()
    }, [location.state, navigate])

    const handleBack = () => {
        navigate('/reports')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full" />
                    <p className="text-gray-600 font-medium">Generating Report...</p>
                </div>
            </div>
        )
    }

    return (
        <PLReportViewer
            data={reportData}
            onBack={handleBack}
        />
    )
}

export default PLReportPage
