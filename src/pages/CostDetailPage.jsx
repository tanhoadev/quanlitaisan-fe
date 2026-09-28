import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import assetCostService from '../services/assetCostService'

function formatMoney(value) {
    if (value === null || value === undefined) return '-'

    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(value)
}

function formatDateOnly(value) {
    if (!value) return '-'

    return new Date(value).toLocaleDateString('vi-VN')
}

function CostDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [cost, setCost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const loadCost = async () => {
            try {
                setLoading(true)
                setError('')

                const data = await assetCostService.getById(id)

                console.log('COST DETAIL:', data)

                setCost(data)
            } catch (err) {
                console.error('COST DETAIL ERROR:', err)

                if (err.response?.status === 404) {
                    setError('Asset cost not found.')
                } else {
                    setError('Unable to load asset cost.')
                }
            } finally {
                setLoading(false)
            }
        }

        loadCost()
    }, [id])

    const handleDelete = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this cost record?'
        )

        if (!confirmed) return

        try {
            setDeleting(true)
            setError('')

            await assetCostService.remove(id)

            navigate('/costs')
        } catch (err) {
            console.error('DELETE COST ERROR:', err)

            setError(
                err.response?.data?.message ||
                'Unable to delete asset cost.'
            )
        } finally {
            setDeleting(false)
        }
    }

    if (loading) {
        return (
            <div className="text-sm text-gray-500">
                Loading cost information...
            </div>
        )
    }

    if (error && !cost) {
        return (
            <div className="space-y-4">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>

                <button
                    type="button"
                    onClick={() => navigate('/costs')}
                    className="font-medium text-blue-600 hover:text-blue-800"
                >
                    ← Back to Costs
                </button>
            </div>
        )
    }

    if (!cost) return null

    return (
        <div className="mx-auto max-w-5xl space-y-6">

            {/* HEADER */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div>
                    <button
                        type="button"
                        onClick={() => navigate('/costs')}
                        className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                        ← Back to Costs
                    </button>

                    <h1 className="mt-3 text-2xl font-bold text-slate-900">
                        Cost #{cost.id}
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Asset cost information
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(`/costs/${cost.id}/edit`)
                        }
                        className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="cursor-pointer rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>

            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* MAIN INFORMATION */}
            <div className="rounded-xl border border-gray-200 bg-white">

                <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="font-semibold text-slate-900">
                        Cost Information
                    </h2>
                </div>

                <div className="grid gap-6 p-6 md:grid-cols-2">

                    <DetailItem
                        label="Cost Type"
                        value={cost.costType}
                    />

                    <DetailItem
                        label="Amount"
                        value={formatMoney(cost.amount)}
                    />

                    <DetailItem
                        label="Cost Date"
                        value={formatDateOnly(cost.costDate)}
                    />

                    <DetailItem
                        label="Vendor"
                        value={cost.vendorName || '-'}
                    />

                    <DetailItem
                        label="Description"
                        value={cost.description || '-'}
                    />

                </div>
            </div>

            {/* ASSET */}
            <div className="rounded-xl border border-gray-200 bg-white">

                <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="font-semibold text-slate-900">
                        Asset
                    </h2>
                </div>

                <div className="p-6">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(`/assets/${cost.assetId}`)
                        }
                        className="cursor-pointer text-left"
                    >
                        <div className="font-semibold text-blue-600 hover:text-blue-800">
                            {cost.assetCode}
                        </div>

                        <div className="mt-1 text-sm text-gray-500">
                            {cost.assetName}
                        </div>
                    </button>
                </div>

            </div>

            {/* MAINTENANCE */}
            <div className="rounded-xl border border-gray-200 bg-white">

                <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="font-semibold text-slate-900">
                        Maintenance Request
                    </h2>
                </div>

                <div className="p-6">
                    {cost.maintenanceRequestId ? (
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/maintenance/requests/${cost.maintenanceRequestId}`
                                )
                            }
                            className="cursor-pointer font-medium text-blue-600 hover:text-blue-800"
                        >
                            Request #{cost.maintenanceRequestId}
                        </button>
                    ) : (
                        <span className="text-sm text-gray-500">
                            This cost is not linked to a maintenance request.
                        </span>
                    )}
                </div>

            </div>

        </div>
    )
}

function DetailItem({ label, value }) {
    return (
        <div>
            <p className="text-xs font-semibold uppercase text-gray-500">
                {label}
            </p>

            <p className="mt-2 text-sm font-medium text-slate-900">
                {value ?? '-'}
            </p>
        </div>
    )
}

export default CostDetailPage