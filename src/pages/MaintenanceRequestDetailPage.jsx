import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import maintenanceService from '../services/maintenanceService'

function MaintenanceRequestDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [request, setRequest] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [starting, setStarting] = useState(false)
    const [completing, setCompleting] = useState(false)
    const [actionError, setActionError] = useState('')

    // =========================================================
    // LOAD REQUEST
    // =========================================================
    const loadRequest = async () => {
        try {
            setError('')

            const data =
                await maintenanceService.getRequestById(id)

            setRequest(data)
        } catch (err) {
            console.error(
                'LOAD MAINTENANCE REQUEST ERROR:',
                err
            )

            setError(
                err.response?.data?.message ||
                'Unable to load maintenance request.'
            )
        }
    }

    useEffect(() => {
        const initialize = async () => {
            try {
                setLoading(true)
                await loadRequest()
            } finally {
                setLoading(false)
            }
        }

        initialize()
    }, [id])

    // =========================================================
    // START
    // =========================================================
    const handleStart = async () => {
        const confirmed = window.confirm(
            'Start maintenance work? The asset status will be changed to Maintenance.'
        )

        if (!confirmed) return

        try {
            setStarting(true)
            setActionError('')

            await maintenanceService.startRequest(id)

            await loadRequest()
        } catch (err) {
            console.error(
                'START MAINTENANCE ERROR:',
                err
            )

            setActionError(
                err.response?.data?.message ||
                'Unable to start maintenance.'
            )
        } finally {
            setStarting(false)
        }
    }

    // =========================================================
    // COMPLETE
    // =========================================================
    const handleComplete = async () => {
        const confirmed = window.confirm(
            'Complete this maintenance request? The asset status will be changed back to Available.'
        )

        if (!confirmed) return

        try {
            setCompleting(true)
            setActionError('')

            await maintenanceService.completeRequest(id)

            await loadRequest()
        } catch (err) {
            console.error(
                'COMPLETE MAINTENANCE ERROR:',
                err
            )

            setActionError(
                err.response?.data?.message ||
                'Unable to complete maintenance.'
            )
        } finally {
            setCompleting(false)
        }
    }

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

    if (loading) {
        return (
            <div className="text-sm text-gray-500">
                Loading maintenance request...
            </div>
        )
    }

    if (error || !request) {
        return (
            <div>
                <button
                    type="button"
                    onClick={() => navigate('/maintenance')}
                    className="mb-5 cursor-pointer text-sm font-medium text-blue-600"
                >
                    ← Back to Maintenance
                </button>

                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error || 'Maintenance request not found.'}
                </div>
            </div>
        )
    }

    return (
        <div className="pb-10">

            {/* BACK */}
            <button
                type="button"
                onClick={() => navigate('/maintenance')}
                className="mb-5 cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
            >
                ← Back to Maintenance
            </button>

            {/* HEADER */}
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                <div>
                    <div className="flex flex-wrap items-center gap-3">

                        <h1 className="text-3xl font-bold text-slate-900">
                            {request.title}
                        </h1>

                        <StatusBadge
                            status={request.status}
                        />

                    </div>

                    <p className="mt-2 text-gray-500">
                        Maintenance Request #{request.id}
                    </p>
                </div>

                {/* WORKFLOW ACTIONS */}
                <div className="flex gap-3">

                    {request.status === 'Open' && (
                        <button
                            type="button"
                            onClick={handleStart}
                            disabled={starting}
                            className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {starting
                                ? 'Starting...'
                                : 'Start Maintenance'}
                        </button>
                    )}

                    {request.status === 'InProgress' && (
                        <button
                            type="button"
                            onClick={handleComplete}
                            disabled={completing}
                            className="cursor-pointer rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {completing
                                ? 'Completing...'
                                : 'Complete Maintenance'}
                        </button>
                    )}

                </div>

            </div>

            {/* ACTION ERROR */}
            {actionError && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {actionError}
                </div>
            )}

            {/* SUMMARY */}
            <div className="mt-8 grid gap-5 md:grid-cols-3">

                <SummaryCard
                    label="Status"
                    value={request.status}
                />

                <SummaryCard
                    label="Type"
                    value={request.requestType}
                />

                <SummaryCard
                    label="Priority"
                    value={request.priority}
                />

            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">

                {/* REQUEST INFORMATION */}
                <section className="rounded-xl bg-white p-6 shadow-sm">

                    <h2 className="text-lg font-semibold text-slate-900">
                        Request Information
                    </h2>

                    <div className="mt-6 space-y-5">

                        <InfoRow
                            label="Request ID"
                            value={`#${request.id}`}
                        />

                        <InfoRow
                            label="Request Type"
                            value={request.requestType}
                        />

                        <InfoRow
                            label="Priority"
                            value={request.priority}
                        />

                        <InfoRow
                            label="Requested By"
                            value={
                                request.requestedByUserName ||
                                '-'
                            }
                        />

                        <InfoRow
                            label="Requested At"
                            value={formatDateTime(
                                request.requestedAt
                            )}
                        />

                        <InfoRow
                            label="Completed At"
                            value={formatDateTime(
                                request.completedAt
                            )}
                        />

                        <InfoRow
                            label="Maintenance Plan"
                            value={
                                request.maintenancePlanName
                                    ? `${request.maintenancePlanName} (#${request.maintenancePlanId})`
                                    : 'Manual Request'
                            }
                        />

                    </div>

                </section>

                {/* ASSET INFORMATION */}
                <section className="rounded-xl bg-white p-6 shadow-sm">

                    <h2 className="text-lg font-semibold text-slate-900">
                        Asset
                    </h2>

                    <div className="mt-6">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/assets/${request.assetId}`
                                )
                            }
                            className="cursor-pointer text-left"
                        >
                            <div className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                                {request.assetCode}
                            </div>

                            <div className="mt-1 text-sm text-gray-500">
                                {request.assetName}
                            </div>
                        </button>

                    </div>

                    <div className="mt-8">

                        <h3 className="text-sm font-semibold text-slate-700">
                            Description
                        </h3>

                        <div className="mt-3 min-h-28 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                            {request.description ||
                                'No description provided.'}
                        </div>

                    </div>

                </section>

            </div>

            {/* HISTORY */}
            <section className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">

                <div className="border-b border-gray-100 px-6 py-5">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Maintenance History
                    </h2>
                </div>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-slate-50">
                            <tr>
                                <Header>Action</Header>
                                <Header>Description</Header>
                                <Header>Performed By</Header>
                                <Header>Performed At</Header>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            {request.histories?.map(
                                (history) => (
                                    <tr
                                        key={history.id}
                                        className="hover:bg-slate-50"
                                    >

                                        <td className="whitespace-nowrap px-6 py-4">
                                            <HistoryBadge
                                                action={history.action}
                                            />
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-700">
                                            {history.description ||
                                                '-'}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                                            {history.performedByUserName ||
                                                '-'}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                            {formatDateTime(
                                                history.performedAt
                                            )}
                                        </td>

                                    </tr>
                                )
                            )}

                            {(!request.histories ||
                                request.histories.length ===
                                0) && (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-6 py-10 text-center text-sm text-gray-500"
                                        >
                                            No maintenance history.
                                        </td>
                                    </tr>
                                )}

                        </tbody>

                    </table>

                </div>

            </section>

        </div>
    )
}

// =========================================================
// SMALL COMPONENTS
// =========================================================

function SummaryCard({
    label,
    value,
}) {
    return (
        <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="text-sm text-gray-500">
                {label}
            </div>

            <div className="mt-2 text-xl font-semibold text-slate-900">
                {value || '-'}
            </div>
        </div>
    )
}

function InfoRow({
    label,
    value,
}) {
    return (
        <div className="flex items-start justify-between gap-6 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">

            <span className="text-sm text-gray-500">
                {label}
            </span>

            <span className="text-right text-sm font-medium text-slate-800">
                {value || '-'}
            </span>

        </div>
    )
}

function StatusBadge({
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
            {status}
        </span>
    )
}

function HistoryBadge({
    action,
}) {
    let style =
        'bg-gray-100 text-gray-700'

    if (action === 'Received') {
        style =
            'bg-yellow-100 text-yellow-700'
    } else if (action === 'Repairing') {
        style =
            'bg-blue-100 text-blue-700'
    } else if (action === 'Completed') {
        style =
            'bg-green-100 text-green-700'
    }

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${style}`}
        >
            {action}
        </span>
    )
}

function Header({
    children,
}) {
    return (
        <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            {children}
        </th>
    )
}

export default MaintenanceRequestDetailPage