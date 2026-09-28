import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import maintenanceService from '../services/maintenanceService'

function MaintenancePage() {
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState('requests')

    const [requests, setRequests] = useState([])
    const [plans, setPlans] = useState([])

    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // =========================================================
    // LOAD DATA
    // =========================================================
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                setError('')

                const [
                    requestData,
                    planData,
                ] = await Promise.all([
                    maintenanceService.getRequests(),
                    maintenanceService.getPlans(),
                ])

                setRequests(
                    Array.isArray(requestData)
                        ? requestData
                        : []
                )

                setPlans(
                    Array.isArray(planData)
                        ? planData
                        : []
                )
            } catch (err) {
                console.error(
                    'MAINTENANCE LOAD ERROR:',
                    err
                )

                setError(
                    'Unable to load maintenance data.'
                )
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    // =========================================================
    // FILTER REQUESTS
    // =========================================================
    const filteredRequests = useMemo(() => {
        const keyword =
            search.trim().toLowerCase()

        if (!keyword) {
            return requests
        }

        return requests.filter((request) => {
            return (
                request.assetCode
                    ?.toLowerCase()
                    .includes(keyword) ||
                request.assetName
                    ?.toLowerCase()
                    .includes(keyword) ||
                request.title
                    ?.toLowerCase()
                    .includes(keyword) ||
                request.requestType
                    ?.toLowerCase()
                    .includes(keyword) ||
                request.priority
                    ?.toLowerCase()
                    .includes(keyword) ||
                request.status
                    ?.toLowerCase()
                    .includes(keyword) ||
                request.requestedByUserName
                    ?.toLowerCase()
                    .includes(keyword)
            )
        })
    }, [requests, search])

    // =========================================================
    // FILTER PLANS
    // =========================================================
    const filteredPlans = useMemo(() => {
        const keyword =
            search.trim().toLowerCase()

        if (!keyword) {
            return plans
        }

        return plans.filter((plan) => {
            return (
                plan.assetCode
                    ?.toLowerCase()
                    .includes(keyword) ||
                plan.assetName
                    ?.toLowerCase()
                    .includes(keyword) ||
                plan.name
                    ?.toLowerCase()
                    .includes(keyword)
            )
        })
    }, [plans, search])

    // =========================================================
    // DATE
    // =========================================================
    const formatDateTime = (value) => {
        if (!value) return '-'

        const utcValue =
            value.endsWith('Z')
                ? value
                : `${value}Z`

        return new Date(
            utcValue
        ).toLocaleString('vi-VN')
    }

    const formatDate = (value) => {
        if (!value) return '-'

        const utcValue =
            value.endsWith('Z')
                ? value
                : `${value}Z`

        return new Date(
            utcValue
        ).toLocaleDateString('vi-VN')
    }

    // =========================================================
    // TAB
    // =========================================================
    const changeTab = (tab) => {
        setActiveTab(tab)
        setSearch('')
    }

    if (loading) {
        return (
            <div className="text-sm text-gray-500">
                Loading maintenance data...
            </div>
        )
    }

    return (
        <div className="pb-10">

            {/* HEADER */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Maintenance
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage asset maintenance requests and scheduled maintenance plans.
                    </p>
                </div>

                {activeTab === 'requests' ? (
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                '/maintenance/requests/create'
                            )
                        }
                        className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        + New Request
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                '/maintenance/plans/create'
                            )
                        }
                        className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        + Create Plan
                    </button>
                )}

            </div>

            {/* ERROR */}
            {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* TABS */}
            <div className="mt-8 border-b border-gray-200">

                <div className="flex gap-8">

                    <TabButton
                        active={
                            activeTab === 'requests'
                        }
                        onClick={() =>
                            changeTab('requests')
                        }
                    >
                        Requests
                    </TabButton>

                    <TabButton
                        active={
                            activeTab === 'plans'
                        }
                        onClick={() =>
                            changeTab('plans')
                        }
                    >
                        Maintenance Plans
                    </TabButton>

                </div>

            </div>

            {/* SEARCH */}
            <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">

                <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                    placeholder={
                        activeTab === 'requests'
                            ? 'Search asset, title, type, priority, status or requester...'
                            : 'Search asset or maintenance plan...'
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

            </div>

            {/* REQUEST TAB */}
            {activeTab === 'requests' && (
                <div className="mt-5 overflow-hidden rounded-xl bg-white shadow-sm">

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-slate-50">
                                <tr>
                                    <Header>Request</Header>
                                    <Header>Asset</Header>
                                    <Header>Type</Header>
                                    <Header>Priority</Header>
                                    <Header>Status</Header>
                                    <Header>Requested By</Header>
                                    <Header>Requested At</Header>
                                    <Header align="right">
                                        Actions
                                    </Header>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {filteredRequests.map(
                                    (request) => (
                                        <tr
                                            key={request.id}
                                            className="hover:bg-slate-50"
                                        >

                                            {/* REQUEST */}
                                            <td className="px-6 py-4">

                                                <div className="font-medium text-slate-900">
                                                    {request.title}
                                                </div>

                                                <div className="mt-1 text-xs text-gray-400">
                                                    Request #{request.id}
                                                </div>

                                            </td>

                                            {/* ASSET */}
                                            <td className="px-6 py-4">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/assets/${request.assetId}`
                                                        )
                                                    }
                                                    className="cursor-pointer text-left"
                                                >
                                                    <div className="font-medium text-blue-600 hover:text-blue-800">
                                                        {request.assetCode}
                                                    </div>

                                                    <div className="mt-1 text-xs text-gray-500">
                                                        {request.assetName}
                                                    </div>
                                                </button>

                                            </td>

                                            {/* TYPE */}
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                                                {request.requestType}
                                            </td>

                                            {/* PRIORITY */}
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <PriorityBadge
                                                    priority={
                                                        request.priority
                                                    }
                                                />
                                            </td>

                                            {/* STATUS */}
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <RequestStatusBadge
                                                    status={
                                                        request.status
                                                    }
                                                />
                                            </td>

                                            {/* REQUESTED BY */}
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                                                {request.requestedByUserName ||
                                                    '-'}
                                            </td>

                                            {/* DATE */}
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                {formatDateTime(
                                                    request.requestedAt
                                                )}
                                            </td>

                                            {/* ACTION */}
                                            <td className="whitespace-nowrap px-6 py-4 text-right">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/maintenance/requests/${request.id}`
                                                        )
                                                    }
                                                    className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
                                                >
                                                    View
                                                </button>

                                            </td>

                                        </tr>
                                    )
                                )}

                                {filteredRequests.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-6 py-12 text-center text-sm text-gray-500"
                                        >
                                            No maintenance requests found.
                                        </td>
                                    </tr>
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>
            )}

            {/* PLAN TAB */}
            {activeTab === 'plans' && (
                <div className="mt-5 overflow-hidden rounded-xl bg-white shadow-sm">

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-slate-50">
                                <tr>
                                    <Header>Plan</Header>
                                    <Header>Asset</Header>
                                    <Header>Interval</Header>
                                    <Header>
                                        Last Maintenance
                                    </Header>
                                    <Header>
                                        Next Maintenance
                                    </Header>
                                    <Header>Status</Header>
                                    <Header>Due</Header>
                                    <Header align="right">
                                        Actions
                                    </Header>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {filteredPlans.map(
                                    (plan) => (
                                        <tr
                                            key={plan.id}
                                            className="hover:bg-slate-50"
                                        >

                                            {/* PLAN */}
                                            <td className="px-6 py-4">

                                                <div className="font-medium text-slate-900">
                                                    {plan.name}
                                                </div>

                                                <div className="mt-1 text-xs text-gray-400">
                                                    Plan #{plan.id}
                                                </div>

                                            </td>

                                            {/* ASSET */}
                                            <td className="px-6 py-4">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/assets/${plan.assetId}`
                                                        )
                                                    }
                                                    className="cursor-pointer text-left"
                                                >
                                                    <div className="font-medium text-blue-600 hover:text-blue-800">
                                                        {plan.assetCode}
                                                    </div>

                                                    <div className="mt-1 text-xs text-gray-500">
                                                        {plan.assetName}
                                                    </div>
                                                </button>

                                            </td>

                                            {/* INTERVAL */}
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                                                {plan.intervalDays}{' '}
                                                days
                                            </td>

                                            {/* LAST */}
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                {formatDate(
                                                    plan.lastMaintenanceDate
                                                )}
                                            </td>

                                            {/* NEXT */}
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                {formatDate(
                                                    plan.nextMaintenanceDate
                                                )}
                                            </td>

                                            {/* ACTIVE */}
                                            <td className="whitespace-nowrap px-6 py-4">

                                                <span
                                                    className={
                                                        plan.isActive
                                                            ? 'rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700'
                                                            : 'rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600'
                                                    }
                                                >
                                                    {plan.isActive
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </span>

                                            </td>

                                            {/* DUE */}
                                            <td className="whitespace-nowrap px-6 py-4">

                                                {plan.isDue ? (
                                                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                                        Due
                                                    </span>
                                                ) : (
                                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                                        Scheduled
                                                    </span>
                                                )}

                                            </td>

                                            {/* ACTION */}
                                            <td className="whitespace-nowrap px-6 py-4 text-right">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/maintenance/plans/${plan.id}`
                                                        )
                                                    }
                                                    className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
                                                >
                                                    View
                                                </button>

                                            </td>

                                        </tr>
                                    )
                                )}

                                {filteredPlans.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-6 py-12 text-center text-sm text-gray-500"
                                        >
                                            No maintenance plans found.
                                        </td>
                                    </tr>
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>
            )}

        </div>
    )
}


// =========================================================
// COMPONENTS
// =========================================================

function TabButton({
    active,
    onClick,
    children,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={
                active
                    ? 'cursor-pointer border-b-2 border-blue-600 px-1 pb-4 text-sm font-semibold text-blue-600'
                    : 'cursor-pointer border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 hover:text-slate-800'
            }
        >
            {children}
        </button>
    )
}

function PriorityBadge({
    priority,
}) {
    let style =
        'bg-gray-100 text-gray-700'

    if (priority === 'Low') {
        style =
            'bg-slate-100 text-slate-600'
    } else if (priority === 'Medium') {
        style =
            'bg-blue-100 text-blue-700'
    } else if (priority === 'High') {
        style =
            'bg-orange-100 text-orange-700'
    } else if (priority === 'Critical') {
        style =
            'bg-red-100 text-red-700'
    }

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${style}`}
        >
            {priority || '-'}
        </span>
    )
}

function RequestStatusBadge({
    status,
}) {
    let style =
        'bg-gray-100 text-gray-700'

    if (status === 'Open') {
        style =
            'bg-yellow-100 text-yellow-700'
    } else if (status === 'InProgress') {
        style =
            'bg-blue-100 text-blue-700'
    } else if (status === 'Completed') {
        style =
            'bg-green-100 text-green-700'
    }

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${style}`}
        >
            {status || '-'}
        </span>
    )
}

function Header({
    children,
    align = 'left',
}) {
    const alignment =
        align === 'right'
            ? 'text-right'
            : 'text-left'

    return (
        <th
            className={`whitespace-nowrap px-6 py-4 ${alignment} text-xs font-semibold uppercase tracking-wide text-gray-500`}
        >
            {children}
        </th>
    )
}

export default MaintenancePage