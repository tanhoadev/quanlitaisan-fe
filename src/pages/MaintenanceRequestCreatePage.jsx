import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import assetService from '../services/assetService'
import maintenanceService from '../services/maintenanceService'

function MaintenanceRequestCreatePage() {
    const navigate = useNavigate()

    const [assets, setAssets] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const [error, setError] = useState('')

    const [form, setForm] = useState({
        assetId: '',
        requestType: 'Repair',
        priority: 'Medium',
        title: '',
        description: '',
    })

    // =========================================================
    // LOAD ASSETS
    // =========================================================
    useEffect(() => {
        const loadAssets = async () => {
            try {
                setLoading(true)
                setError('')

                const data = await assetService.getAll()

                setAssets(
                    Array.isArray(data)
                        ? data
                        : []
                )
            } catch (err) {
                console.error(
                    'LOAD ASSETS ERROR:',
                    err
                )

                setError(
                    'Unable to load assets.'
                )
            } finally {
                setLoading(false)
            }
        }

        loadAssets()
    }, [])

    // =========================================================
    // ONLY ACTIVE ASSETS
    // =========================================================
    const availableAssets = useMemo(() => {
        return assets.filter(
            (asset) => asset.isActive
        )
    }, [assets])

    // =========================================================
    // INPUT CHANGE
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

        if (!form.title.trim()) {
            setError('Title is required.')
            return
        }

        try {
            setSubmitting(true)

            const payload = {
                assetId: Number(form.assetId),
                requestType: form.requestType,
                title: form.title.trim(),
                description:
                    form.description.trim() || null,
                priority: form.priority,
            }

            console.log(
                'CREATE MAINTENANCE REQUEST:',
                payload
            )

            const result =
                await maintenanceService.createRequest(
                    payload
                )

            navigate(
                `/maintenance/requests/${result.requestId}`
            )
        } catch (err) {
            console.error(
                'CREATE MAINTENANCE REQUEST ERROR:',
                err
            )

            setError(
                err.response?.data?.message ||
                'Unable to create maintenance request.'
            )
        } finally {
            setSubmitting(false)
        }
    }

    // =========================================================
    // LOADING
    // =========================================================
    if (loading) {
        return (
            <div className="text-sm text-gray-500">
                Loading assets...
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
                    New Maintenance Request
                </h1>

                <p className="mt-2 text-gray-500">
                    Report an asset issue or request maintenance work.
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
                    </div>

                    {/* REQUEST TYPE */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Request Type
                            <span className="text-red-500">
                                {' '}*
                            </span>
                        </label>

                        <select
                            name="requestType"
                            value={form.requestType}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="Repair">
                                Repair
                            </option>

                            <option value="Maintenance">
                                Maintenance
                            </option>
                        </select>
                    </div>

                    {/* PRIORITY */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Priority
                            <span className="text-red-500">
                                {' '}*
                            </span>
                        </label>

                        <select
                            name="priority"
                            value={form.priority}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="Low">
                                Low
                            </option>

                            <option value="Medium">
                                Medium
                            </option>

                            <option value="High">
                                High
                            </option>

                            <option value="Critical">
                                Critical
                            </option>
                        </select>
                    </div>

                    {/* TITLE */}
                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Title
                            <span className="text-red-500">
                                {' '}*
                            </span>
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Example: Laptop battery issue"
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
                            placeholder="Describe the issue or maintenance requirement..."
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
                        disabled={submitting}
                        className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitting
                            ? 'Creating...'
                            : 'Create Request'}
                    </button>

                </div>

            </form>

        </div>
    )
}

export default MaintenanceRequestCreatePage