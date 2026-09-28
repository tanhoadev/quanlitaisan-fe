import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import maintenanceService from '../services/maintenanceService'

function MaintenancePlanDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [plan, setPlan] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [generating, setGenerating] = useState(false)
    const [actionError, setActionError] = useState('')

    // =========================================================
    // LOAD PLAN
    // =========================================================
    const loadPlan = async () => {
        try {
            setError('')

            const data =
                await maintenanceService.getPlanById(id)

            setPlan(data)
        } catch (err) {
            console.error(
                'LOAD MAINTENANCE PLAN ERROR:',
                err
            )

            setError(
                err.response?.data?.message ||
                'Unable to load maintenance plan.'
            )
        }
    }

    useEffect(() => {
        const initialize = async () => {
            try {
                setLoading(true)
                await loadPlan()
            } finally {
                setLoading(false)
            }
        }

        initialize()
    }, [id])

    // =========================================================
    // GENERATE REQUEST
    // =========================================================
    const handleGenerateRequest = async () => {
        const confirmed = window.confirm(
            'Generate a maintenance request from this plan?'
        )

        if (!confirmed) return

        try {
            setGenerating(true)
            setActionError('')

            const result =
                await maintenanceService.generateRequest(id)

            navigate(
                `/maintenance/requests/${result.requestId}`
            )
        } catch (err) {
            console.error(
                'GENERATE MAINTENANCE REQUEST ERROR:',
                err
            )

            setActionError(
                err.response?.data?.message ||
                'Unable to generate maintenance request.'
            )
        } finally {
            setGenerating(false)
        }
    }

    // =========================================================
    // DATE
    // =========================================================
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

    // =========================================================
    // LOADING
    // =========================================================
    if (loading) {
        return (
            <div className="text-sm text-gray-500">
                Loading maintenance plan...
            </div>
        )
    }

    // =========================================================
    // ERROR
    // =========================================================
    if (error || !plan) {
        return (
            <div>

                <button
                    type="button"
                    onClick={() =>
                        navigate('/maintenance')
                    }
                    className="mb-5 cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                    ← Back to Maintenance
                </button>

                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error ||
                        'Maintenance plan not found.'}
                </div>

            </div>
        )
    }

    return (
        <div className="pb-10">

            {/* BACK */}
            <button
                type="button"
                onClick={() =>
                    navigate('/maintenance')
                }
                className="mb-5 cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
            >
                ← Back to Maintenance
            </button>

            {/* HEADER */}
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                <div>

                    <div className="flex flex-wrap items-center gap-3">

                        <h1 className="text-3xl font-bold text-slate-900">
                            {plan.name}
                        </h1>

                        <ActiveBadge
                            active={plan.isActive}
                        />

                        {plan.isDue && (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                Due
                            </span>
                        )}

                        {!plan.isDue &&
                            plan.isActive && (
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                    Scheduled
                                </span>
                            )}

                    </div>

                    <p className="mt-2 text-gray-500">
                        Maintenance Plan #{plan.id}
                    </p>

                </div>

                {/* GENERATE */}
                {plan.isActive &&
                    plan.isDue && (
                        <button
                            type="button"
                            onClick={
                                handleGenerateRequest
                            }
                            disabled={generating}
                            className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {generating
                                ? 'Generating...'
                                : 'Generate Maintenance Request'}
                        </button>
                    )}

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
                    value={
                        plan.isActive
                            ? 'Active'
                            : 'Inactive'
                    }
                />

                <SummaryCard
                    label="Interval"
                    value={`${plan.intervalDays} days`}
                />

                <SummaryCard
                    label="Schedule"
                    value={
                        plan.isDue
                            ? 'Due'
                            : 'Scheduled'
                    }
                />

            </div>

            {/* INFORMATION */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">

                {/* PLAN */}
                <section className="rounded-xl bg-white p-6 shadow-sm">

                    <h2 className="text-lg font-semibold text-slate-900">
                        Plan Information
                    </h2>

                    <div className="mt-6 space-y-5">

                        <InfoRow
                            label="Plan ID"
                            value={`#${plan.id}`}
                        />

                        <InfoRow
                            label="Interval"
                            value={`${plan.intervalDays} days`}
                        />

                        <InfoRow
                            label="Last Maintenance"
                            value={formatDate(
                                plan.lastMaintenanceDate
                            )}
                        />

                        <InfoRow
                            label="Next Maintenance"
                            value={formatDate(
                                plan.nextMaintenanceDate
                            )}
                        />

                        <InfoRow
                            label="Created At"
                            value={formatDateTime(
                                plan.createdAt
                            )}
                        />

                        <InfoRow
                            label="Status"
                            value={
                                plan.isActive
                                    ? 'Active'
                                    : 'Inactive'
                            }
                        />

                    </div>

                </section>

                {/* ASSET */}
                <section className="rounded-xl bg-white p-6 shadow-sm">

                    <h2 className="text-lg font-semibold text-slate-900">
                        Asset
                    </h2>

                    <div className="mt-6">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/assets/${plan.assetId}`
                                )
                            }
                            className="cursor-pointer text-left"
                        >

                            <div className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                                {plan.assetCode}
                            </div>

                            <div className="mt-1 text-sm text-gray-500">
                                {plan.assetName}
                            </div>

                        </button>

                    </div>

                    <div className="mt-8">

                        <h3 className="text-sm font-semibold text-slate-700">
                            Description
                        </h3>

                        <div className="mt-3 min-h-32 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                            {plan.description ||
                                'No description provided.'}
                        </div>

                    </div>

                </section>

            </div>

            {/* SCHEDULE EXPLANATION */}
            <section className="mt-6 rounded-xl bg-white p-6 shadow-sm">

                <h2 className="text-lg font-semibold text-slate-900">
                    Maintenance Schedule
                </h2>

                <div className="mt-5 grid gap-5 md:grid-cols-3">

                    <ScheduleCard
                        label="Last Maintenance"
                        value={formatDate(
                            plan.lastMaintenanceDate
                        )}
                    />

                    <ScheduleCard
                        label="Next Maintenance"
                        value={formatDate(
                            plan.nextMaintenanceDate
                        )}
                    />

                    <ScheduleCard
                        label="Current Status"
                        value={
                            plan.isDue
                                ? 'Maintenance is due'
                                : 'Waiting for next cycle'
                        }
                    />

                </div>

            </section>

        </div>
    )
}

// =========================================================
// COMPONENTS
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

function ScheduleCard({
    label,
    value,
}) {
    return (
        <div className="rounded-lg bg-slate-50 p-5">

            <div className="text-sm text-gray-500">
                {label}
            </div>

            <div className="mt-2 font-semibold text-slate-900">
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

function ActiveBadge({
    active,
}) {
    return (
        <span
            className={
                active
                    ? 'rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700'
                    : 'rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600'
            }
        >
            {active
                ? 'Active'
                : 'Inactive'}
        </span>
    )
}

export default MaintenancePlanDetailPage