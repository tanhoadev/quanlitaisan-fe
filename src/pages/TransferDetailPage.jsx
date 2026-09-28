import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import transferService from '../services/transferService'

function TransferDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [transfer, setTransfer] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // =========================================================
    // LOAD TRANSFER
    // =========================================================
    useEffect(() => {
        const loadTransfer = async () => {
            try {
                setLoading(true)
                setError('')

                const data =
                    await transferService.getById(id)

                console.log(
                    'TRANSFER DETAIL:',
                    data
                )

                setTransfer(data)
            } catch (err) {
                console.error(
                    'TRANSFER DETAIL ERROR:',
                    err
                )

                if (err.response?.status === 404) {
                    setError(
                        'Asset transfer not found.'
                    )
                } else {
                    setError(
                        'Unable to load transfer information.'
                    )
                }
            } finally {
                setLoading(false)
            }
        }

        loadTransfer()
    }, [id])

    // =========================================================
    // FORMAT DATE
    // =========================================================
    const formatDate = (value) => {
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
                Loading transfer information...
            </div>
        )
    }

    // =========================================================
    // ERROR
    // =========================================================
    if (error || !transfer) {
        return (
            <div>

                <button
                    type="button"
                    onClick={() =>
                        navigate('/transfers')
                    }
                    className="mb-6 cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                    ← Back to Transfers
                </button>

                <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
                    {error ||
                        'Asset transfer not found.'}
                </div>

            </div>
        )
    }

    // =========================================================
    // CHECK WHAT CHANGED
    // =========================================================
    const departmentChanged =
        transfer.fromDepartmentId !==
        transfer.toDepartmentId

    const locationChanged =
        transfer.fromLocationId !==
        transfer.toLocationId

    return (
        <div className="pb-10">

            {/* BACK */}
            <button
                type="button"
                onClick={() =>
                    navigate('/transfers')
                }
                className="mb-6 cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
            >
                ← Back to Transfers
            </button>

            {/* HEADER */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                <div>

                    <div className="flex flex-wrap items-center gap-3">

                        <h1 className="text-3xl font-bold text-slate-900">
                            Transfer Detail
                        </h1>

                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Completed
                        </span>

                    </div>

                    <p className="mt-2 text-gray-500">
                        Transfer #{transfer.id}
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/assets/${transfer.assetId}`
                        )
                    }
                    className="cursor-pointer rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-gray-50"
                >
                    View Asset
                </button>

            </div>

            {/* ASSET */}
            <div className="mt-8">

                <Section title="Asset Information">

                    <DetailRow
                        label="Asset Code"
                        value={transfer.assetCode}
                    />

                    <DetailRow
                        label="Asset Name"
                        value={transfer.assetName}
                    />

                    <DetailRow
                        label="Asset ID"
                        value={transfer.assetId}
                    />

                </Section>

            </div>

            {/* TRANSFER */}
            <div className="mt-6">

                <Section title="Transfer Information">

                    {/* DEPARTMENT */}
                    <TransferRow
                        label="Department"
                        from={
                            transfer.fromDepartmentName
                        }
                        to={
                            transfer.toDepartmentName
                        }
                        changed={departmentChanged}
                    />

                    {/* LOCATION */}
                    <TransferRow
                        label="Location"
                        from={
                            transfer.fromLocationName
                        }
                        to={
                            transfer.toLocationName
                        }
                        changed={locationChanged}
                    />

                    <DetailRow
                        label="Transferred By"
                        value={
                            transfer.transferredByUserName
                        }
                    />

                    <DetailRow
                        label="Transferred At"
                        value={formatDate(
                            transfer.transferredAt
                        )}
                    />

                </Section>

            </div>

            {/* NOTE */}
            <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

                <h2 className="text-lg font-semibold text-slate-900">
                    Transfer Note
                </h2>

                <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    {transfer.note ||
                        'No transfer note.'}
                </div>

            </div>

        </div>
    )
}

// =========================================================
// SECTION
// =========================================================
function Section({
    title,
    children,
}) {
    return (
        <div className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="border-b border-gray-100 pb-4 text-lg font-semibold text-slate-900">
                {title}
            </h2>

            <div>
                {children}
            </div>

        </div>
    )
}

// =========================================================
// DETAIL ROW
// =========================================================
function DetailRow({
    label,
    value,
}) {
    const displayValue =
        value === null ||
            value === undefined ||
            value === ''
            ? '-'
            : value

    return (
        <div className="flex items-center justify-between gap-6 border-b border-gray-100 py-4 last:border-0">

            <span className="text-sm text-gray-500">
                {label}
            </span>

            <span className="text-right text-sm font-medium text-slate-800">
                {displayValue}
            </span>

        </div>
    )
}

// =========================================================
// TRANSFER ROW
// =========================================================
function TransferRow({
    label,
    from,
    to,
    changed,
}) {
    return (
        <div className="border-b border-gray-100 py-4">

            <div className="mb-3 text-sm text-gray-500">
                {label}
            </div>

            {changed ? (
                <div className="flex flex-wrap items-center gap-3">

                    <div className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
                        {from || 'Not assigned'}
                    </div>

                    <span className="text-gray-400">
                        →
                    </span>

                    <div className="rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                        {to || 'Not assigned'}
                    </div>

                </div>
            ) : (
                <div className="flex items-center gap-3">

                    <div className="rounded-lg bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                        {to ||
                            from ||
                            'Not assigned'}
                    </div>

                    <span className="text-xs font-medium text-gray-400">
                        Unchanged
                    </span>

                </div>
            )}

        </div>
    )
}

export default TransferDetailPage