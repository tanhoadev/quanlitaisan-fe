import { useEffect, useState } from 'react'
import authService from '../services/authService'
import dashboardService from '../services/dashboardService'

function DashboardPage() {
    const user = authService.getUser()

    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true)
                setError('')

                const data = await dashboardService.getSummary()

                console.log('DASHBOARD SUMMARY:', data)

                setSummary(data)
            } catch (error) {
                console.error('DASHBOARD ERROR:', error)
                setError('Unable to load dashboard data.')
            } finally {
                setLoading(false)
            }
        }

        loadDashboard()
    }, [])

    if (loading) {
        return (
            <div className="text-gray-500">
                Loading dashboard...
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-lg bg-red-50 p-4 text-red-600">
                {error}
            </div>
        )
    }

    return (
        <div>
            <div>
                <h1 className="text-3xl font-bold text-slate-900">
                    Dashboard
                </h1>

                <p className="mt-2 text-gray-500">
                    Welcome back, {user?.fullName}.
                </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Total Assets
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {summary?.totalAssets ?? 0}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                        {summary?.inactiveAssets ?? 0} inactive
                    </p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Active Assignments
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {summary?.activeAssignments ?? 0}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                        {summary?.inUseAssets ?? 0} assets in use
                    </p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Maintenance
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {summary?.maintenanceAssets ?? 0}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                        {summary?.openMaintenanceRequests ?? 0} open requests
                    </p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Active Inventory
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {summary?.activeInventoryCampaigns ?? 0}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                        Inventory campaigns
                    </p>
                </div>

            </div>
        </div>
    )
}

export default DashboardPage