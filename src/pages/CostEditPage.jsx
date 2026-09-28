import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import assetCostService from '../services/assetCostService'
import assetService from '../services/assetService'
import maintenanceService from '../services/maintenanceService'
import vendorService from '../services/vendorService'

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

function CostEditPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [assets, setAssets] = useState([])
    const [maintenanceRequests, setMaintenanceRequests] = useState([])
    const [vendors, setVendors] = useState([])

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const [form, setForm] = useState({
        assetId: '',
        costType: '',
        amount: '',
        costDate: '',
        description: '',
        vendorId: '',
        maintenanceRequestId: '',
    })

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                setError('')

                const [costData, assetData, requestData, vendorData] =
                    await Promise.all([
                        assetCostService.getById(id),
                        assetService.getAll(),
                        maintenanceService.getRequests(),
                        vendorService.getAll({
                            isActive: true,
                        }),
                    ])

                setAssets(
                    Array.isArray(assetData)
                        ? assetData.filter((x) => x.isActive)
                        : []
                )

                setMaintenanceRequests(
                    Array.isArray(requestData)
                        ? requestData
                        : []
                )
                setVendors(
                    Array.isArray(vendorData)
                        ? vendorData
                        : []
                )
                setForm({
                    assetId: costData.assetId?.toString() || '',
                    costType: costData.costType || '',
                    amount: costData.amount?.toString() || '',

                    costDate: costData.costDate
                        ? costData.costDate.substring(0, 10)
                        : '',

                    description: costData.description || '',

                    vendorId: costData.vendorId
                        ? costData.vendorId.toString()
                        : '',

                    maintenanceRequestId:
                        costData.maintenanceRequestId
                            ? costData.maintenanceRequestId.toString()
                            : '',
                })
            } catch (err) {
                console.error('LOAD COST EDIT ERROR:', err)

                setError(
                    err.response?.data?.message ||
                    'Unable to load asset cost.'
                )
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [id])

    const filteredMaintenanceRequests = useMemo(() => {
        if (!form.assetId) return []

        return maintenanceRequests.filter(
            (request) =>
                Number(request.assetId) ===
                Number(form.assetId)
        )
    }, [maintenanceRequests, form.assetId])

    const handleChange = (e) => {
        const { name, value } = e.target

        setForm((prev) => ({
            ...prev,
            [name]: value,

            ...(name === 'assetId'
                ? { maintenanceRequestId: '' }
                : {}),
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setSaving(true)
            setError('')

            if (!form.assetId) {
                setError('Please select an asset.')
                return
            }

            if (!form.costType) {
                setError('Please select a cost type.')
                return
            }

            if (!form.amount || Number(form.amount) <= 0) {
                setError('Amount must be greater than 0.')
                return
            }

            if (!form.costDate) {
                setError('Please select a cost date.')
                return
            }

            const payload = {
                assetId: Number(form.assetId),
                costType: form.costType,
                amount: Number(form.amount),
                costDate: form.costDate,

                description:
                    form.description.trim() || null,

                vendorId:
                    form.vendorId
                        ? Number(form.vendorId)
                        : null,

                maintenanceRequestId:
                    form.maintenanceRequestId
                        ? Number(form.maintenanceRequestId)
                        : null,
            }

            console.log('UPDATE COST PAYLOAD:', payload)

            await assetCostService.update(id, payload)

            navigate(`/costs/${id}`)
        } catch (err) {
            console.error('UPDATE COST ERROR:', err)

            setError(
                err.response?.data?.message ||
                'Unable to update asset cost.'
            )
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="text-sm text-gray-500">
                Loading cost...
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6">

            {/* HEADER */}
            <div>
                <button
                    type="button"
                    onClick={() => navigate(`/costs/${id}`)}
                    className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                    ← Back to Cost
                </button>

                <h1 className="mt-3 text-2xl font-bold text-slate-900">
                    Edit Cost #{id}
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Update asset cost information.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="rounded-xl border border-gray-200 bg-white p-6"
            >
                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="grid gap-5 md:grid-cols-2">

                    {/* ASSET */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Asset *
                        </label>

                        <select
                            name="assetId"
                            value={form.assetId}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        >
                            <option value="">
                                Select Asset
                            </option>

                            {assets.map((asset) => (
                                <option
                                    key={asset.id}
                                    value={asset.id}
                                >
                                    {asset.assetCode} - {asset.assetName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* TYPE */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Cost Type *
                        </label>

                        <select
                            name="costType"
                            value={form.costType}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        >
                            <option value="">
                                Select Cost Type
                            </option>

                            {COST_TYPES.map((type) => (
                                <option
                                    key={type}
                                    value={type}
                                >
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* AMOUNT */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Amount (VND) *
                        </label>

                        <input
                            type="number"
                            name="amount"
                            min="1"
                            value={form.amount}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* DATE */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Cost Date *
                        </label>

                        <input
                            type="date"
                            name="costDate"
                            value={form.costDate}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* MAINTENANCE REQUEST */}
                    <div className="md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Maintenance Request
                        </label>

                        <select
                            name="maintenanceRequestId"
                            value={form.maintenanceRequestId}
                            onChange={handleChange}
                            disabled={!form.assetId}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none disabled:bg-gray-100 focus:border-blue-500"
                        >
                            <option value="">
                                No Maintenance Request
                            </option>

                            {filteredMaintenanceRequests.map(
                                (request) => (
                                    <option
                                        key={request.id}
                                        value={request.id}
                                    >
                                        #{request.id} - {request.title} ({request.status})
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {/* VENDOR */}
                    <div className="md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Vendor ID
                        </label>

                        <div className="md:col-span-2">
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Vendor
                            </label>

                            <select
                                name="vendorId"
                                value={form.vendorId}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            >
                                <option value="">
                                    No Vendor
                                </option>

                                {vendors.map((vendor) => (
                                    <option
                                        key={vendor.id}
                                        value={vendor.id}
                                    >
                                        {vendor.code} - {vendor.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />
                    </div>

                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5">
                    <button
                        type="button"
                        onClick={() => navigate(`/costs/${id}`)}
                        disabled={saving}
                        className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving
                            ? 'Saving...'
                            : 'Save Changes'}
                    </button>
                </div>

            </form>
        </div>
    )
}

export default CostEditPage