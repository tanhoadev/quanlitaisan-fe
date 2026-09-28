import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assetCostService from '../services/assetCostService'

const COST_TYPES = [
    'Purchase',
    'Installation',
    'Transport',
    'Maintenance',
    'Repair',
    'Inspection',
    'Upgrade',
    'Other',
]

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

function CostsPage() {
    const navigate = useNavigate()

    const [costs, setCosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [search, setSearch] = useState('')
    const [costType, setCostType] = useState('')
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')

    const loadCosts = async () => {
        try {
            setLoading(true)
            setError('')

            const data = await assetCostService.getAll({
                costType,
                fromDate,
                toDate,
            })

            setCosts(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('LOAD COSTS ERROR:', err)
            setCosts([])
            setError('Unable to load asset costs.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCosts()
    }, [costType, fromDate, toDate])

    const filteredCosts = useMemo(() => {
        const keyword = search.trim().toLowerCase()

        if (!keyword) {
            return costs
        }

        return costs.filter((cost) => {
            return (
                cost.assetCode?.toLowerCase().includes(keyword) ||
                cost.assetName?.toLowerCase().includes(keyword) ||
                cost.vendorName?.toLowerCase().includes(keyword) ||
                cost.description?.toLowerCase().includes(keyword) ||
                cost.costType?.toLowerCase().includes(keyword)
            )
        })
    }, [costs, search])

    const totalAdditionalCost = useMemo(() => {
        return filteredCosts.reduce(
            (sum, cost) => sum + Number(cost.amount || 0),
            0
        )
    }, [filteredCosts])

    const clearFilters = () => {
        setSearch('')
        setCostType('')
        setFromDate('')
        setToDate('')
    }

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Asset Costs
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage purchase, maintenance, repair and other asset costs.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate('/costs/create')}
                    className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    + Add Cost
                </button>
            </div>

            {/* SUMMARY */}
            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase text-gray-500">
                        Cost Records
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-900">
                        {filteredCosts.length}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase text-gray-500">
                        Additional Cost
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-900">
                        {formatMoney(totalAdditionalCost)}
                    </p>
                </div>
            </div>

            {/* FILTER */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="grid gap-4 lg:grid-cols-4">

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Search
                        </label>

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Asset, vendor, description..."
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Cost Type
                        </label>

                        <select
                            value={costType}
                            onChange={(e) => setCostType(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        >
                            <option value="">All Types</option>

                            {COST_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            From Date
                        </label>

                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            To Date
                        </label>

                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        />
                    </div>

                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* TABLE */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

                {loading ? (
                    <div className="p-8 text-sm text-gray-500">
                        Loading costs...
                    </div>
                ) : error ? (
                    <div className="p-8 text-sm text-red-600">
                        {error}
                    </div>
                ) : filteredCosts.length === 0 ? (
                    <div className="p-10 text-center text-sm text-gray-500">
                        No cost records found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">

                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Asset
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Type
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Amount
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Cost Date
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Vendor
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Maintenance
                                    </th>

                                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                        Description
                                    </th>

                                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {filteredCosts.map((cost) => (
                                    <tr
                                        key={cost.id}
                                        className="hover:bg-slate-50"
                                    >
                                        <td className="px-5 py-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(`/assets/${cost.assetId}`)
                                                }
                                                className="cursor-pointer text-left"
                                            >
                                                <div className="font-medium text-blue-600 hover:text-blue-800">
                                                    {cost.assetCode}
                                                </div>

                                                <div className="mt-1 text-xs text-gray-500">
                                                    {cost.assetName}
                                                </div>
                                            </button>
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-700">
                                            {cost.costType || '-'}
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-900">
                                            {formatMoney(cost.amount)}
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                                            {formatDateOnly(cost.costDate)}
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-700">
                                            {cost.vendorName || '-'}
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-sm">
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
                                                <span className="text-gray-400">
                                                    -
                                                </span>
                                            )}
                                        </td>

                                        <td className="max-w-xs px-5 py-4 text-sm text-slate-600">
                                            {cost.description || '-'}
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(`/costs/${cost.id}`)
                                                }
                                                className="cursor-pointer font-medium text-blue-600 hover:text-blue-800"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>

                        </table>
                    </div>
                )}

            </div>

        </div>
    )
}

export default CostsPage