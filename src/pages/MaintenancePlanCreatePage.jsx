import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import assetService from '../services/assetService'
import maintenanceService from '../services/maintenanceService'

function MaintenancePlanCreatePage() {
    const navigate = useNavigate()

    const [assets, setAssets] = useState([])
    const [plans, setPlans] = useState([])

    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    const [form, setForm] = useState({
        assetId: '',
        name: '',
        intervalDays: '90',
        nextMaintenanceDate: '',
        description: '',
    })

    // =========================================================
    // LOAD ASSETS + EXISTING PLANS
    // =========================================================
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                setError('')

                const [
                    assetData,
                    planData,
                ] = await Promise.all([
                    assetService.getAll(),
                    maintenanceService.getPlans(),
                ])

                setAssets(
                    Array.isArray(assetData)
                        ? assetData
                        : []
                )

                setPlans(
                    Array.isArray(planData)
                        ? planData
                        : []
                )
            } catch (err) {
                console.error(
                    'LOAD MAINTENANCE PLAN DATA ERROR:',
                    err
                )

                setError(
                    'Unable to load maintenance plan data.'
                )
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    // =========================================================
    // AVAILABLE ASSETS
    // Active asset + no active maintenance plan
    // =========================================================
    const availableAssets = useMemo(() => {
        const assetsWithActivePlan = new Set(
            plans
                .filter((plan) => plan.isActive)
                .map((plan) => plan.assetId)
        )

        return assets.filter(
            (asset) =>
                asset.isActive &&
                !assetsWithActivePlan.has(asset.id)
        )
    }, [assets, plans])

    // =========================================================
    // CHANGE
    // =========================================================
    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }))
    }

    // =========================================================
    // SUBMIT
    // =========================================================
    const handleSubmit = async (event) => {
        event.preventDefault()

        setError('')

        if (!form.assetId) {
            setError('Asset is required.')
            return
        }

        if (!form.name.trim()) {
            setError('Plan name is required.')
            return
        }

        const intervalDays =
            Number(form.intervalDays)

        if (
            !Number.isInteger(intervalDays) ||
            intervalDays <= 0
        ) {
            setError(
                'Interval days must be greater than 0.'
            )
            return
        }

        if (!form.nextMaintenanceDate) {
            setError(
                'Next maintenance date is required.'
            )
            return
        }

        try {
            setSubmitting(true)

            const payload = {
                assetId: Number(form.assetId),
                name: form.name.trim(),
                description:
                    form.description.trim() || null,
                intervalDays,
                nextMaintenanceDate:
                    form.nextMaintenanceDate,
            }

            console.log(
                'CREATE MAINTENANCE PLAN:',
                payload
            )

            const result =
                await maintenanceService.createPlan(
                    payload
                )

            navigate(
                `/maintenance/plans/${result.planId}`
            )
        } catch (err) {
            console.error(
                'CREATE MAINTENANCE PLAN ERROR:',
                err
            )

            setError(
                err.response?.data?.message ||
                'Unable to create maintenance plan.'
            )
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="text-sm text-gray-500">
                Loading maintenance plan data...
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-4xl pb-10">

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
            <div>
                <h1 className="text-3xl font-bold text-slate-900">
                    Create Maintenance Plan
                </h1>

                <p className="mt-2 text-gray-500">
                    Schedule recurring preventive maintenance for an asset.
                </p>
            </div>

            {/* FORM */}
            <form
                onSubmit={handleSubmit}
                className="mt-8 rounded-xl bg-white p-8 shadow-sm"
            >

                {/* ERROR */}
                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">

                    {/* ASSET */}
                    <div className="md:col-span-2">

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Asset
                            <span className="text-red-500">
                                {' '}*
                            </span>
                        </label>

                        <select
                            name="assetId"
                            value={form.assetId}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">
                                Select asset
                            </option>

                            {availableAssets.map(
                                (asset) => (
                                    <option
                                        key={asset.id}
                                        value={asset.id}
                                    >
                                        {asset.assetCode}
                                        {' - '}
                                        {asset.assetName}
                                    </option>
                                )
                            )}

                        </select>

                        {availableAssets.length === 0 && (
                            <p className="mt-2 text-sm text-orange-600">
                                No eligible assets are available.
                                An asset may already have an active maintenance plan.
                            </p>
                        )}

                    </div>

                    {/* PLAN NAME */}
                    <div className="md:col-span-2">

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Plan Name
                            <span className="text-red-500">
                                {' '}*
                            </span>
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Example: Quarterly Laptop Maintenance"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>

                    {/* INTERVAL */}
                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Interval Days
                            <span className="text-red-500">
                                {' '}*
                            </span>
                        </label>

                        <input
                            type="number"
                            name="intervalDays"
                            min="1"
                            value={form.intervalDays}
                            onChange={handleChange}
                            placeholder="90"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <p className="mt-2 text-xs text-gray-400">
                            Number of days between maintenance cycles.
                        </p>

                    </div>

                    {/* NEXT MAINTENANCE */}
                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Next Maintenance Date
                            <span className="text-red-500">
                                {' '}*
                            </span>
                        </label>

                        <input
                            type="date"
                            name="nextMaintenanceDate"
                            value={form.nextMaintenanceDate}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>

                    {/* DESCRIPTION */}
                    <div className="md:col-span-2">

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows="6"
                            placeholder="Describe the scheduled maintenance activities..."
                            className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>

                </div>

                {/* ACTIONS */}
                <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">

                    <button
                        type="button"
                        onClick={() =>
                            navigate('/maintenance')
                        }
                        disabled={submitting}
                        className="cursor-pointer rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={
                            submitting ||
                            availableAssets.length === 0
                        }
                        className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitting
                            ? 'Creating...'
                            : 'Create Plan'}
                    </button>

                </div>

            </form>

        </div>
    )
}

export default MaintenancePlanCreatePage