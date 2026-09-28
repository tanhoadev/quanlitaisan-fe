import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import assetService from '../services/assetService'
import departmentService from '../services/departmentService'
import locationService from '../services/locationService'
import transferService from '../services/transferService'

function TransferCreatePage() {
    const navigate = useNavigate()

    const [assets, setAssets] = useState([])
    const [departments, setDepartments] = useState([])
    const [locations, setLocations] = useState([])

    const [form, setForm] = useState({
        assetId: '',
        toDepartmentId: '',
        toLocationId: '',
        note: '',
    })

    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    // =========================================================
    // LOAD MASTER DATA
    // =========================================================
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                setError('')

                const [
                    assetData,
                    departmentData,
                    locationData,
                ] = await Promise.all([
                    assetService.getAll(),
                    departmentService.getAll(),
                    locationService.getAll(),
                ])

                const activeAssets = (
                    Array.isArray(assetData)
                        ? assetData
                        : []
                ).filter(
                    (asset) =>
                        asset.isActive === true
                )

                const activeDepartments = (
                    Array.isArray(departmentData)
                        ? departmentData
                        : []
                ).filter(
                    (department) =>
                        department.isActive !== false
                )

                const activeLocations = (
                    Array.isArray(locationData)
                        ? locationData
                        : []
                ).filter(
                    (location) =>
                        location.isActive !== false
                )

                setAssets(activeAssets)
                setDepartments(activeDepartments)
                setLocations(activeLocations)
            } catch (err) {
                console.error(
                    'LOAD TRANSFER DATA ERROR:',
                    err
                )

                setError(
                    'Unable to load transfer data.'
                )
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    // =========================================================
    // SELECTED ASSET
    // =========================================================
    const selectedAsset = useMemo(() => {
        if (!form.assetId) return null

        return assets.find(
            (asset) =>
                Number(asset.id) ===
                Number(form.assetId)
        )
    }, [assets, form.assetId])

    // =========================================================
    // CHANGE
    // =========================================================
    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target

        setForm((current) => ({
            ...current,
            [name]: value,
        }))

        setError('')
    }

    // =========================================================
    // SUBMIT
    // =========================================================
    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!form.assetId) {
            setError(
                'Please select an asset.'
            )
            return
        }

        if (
            !form.toDepartmentId &&
            !form.toLocationId
        ) {
            setError(
                'Please select a destination department or location.'
            )
            return
        }

        // Check whether anything actually changed
        const currentDepartmentId =
            selectedAsset?.departmentId

        const currentLocationId =
            selectedAsset?.locationId

        const finalDepartmentId =
            form.toDepartmentId
                ? Number(form.toDepartmentId)
                : currentDepartmentId

        const finalLocationId =
            form.toLocationId
                ? Number(form.toLocationId)
                : currentLocationId

        if (
            Number(finalDepartmentId) ===
            Number(currentDepartmentId) &&
            Number(finalLocationId) ===
            Number(currentLocationId)
        ) {
            setError(
                'The selected destination is the same as the current department and location.'
            )
            return
        }

        try {
            setSubmitting(true)
            setError('')

            const payload = {
                assetId: Number(
                    form.assetId
                ),

                toDepartmentId:
                    form.toDepartmentId
                        ? Number(
                            form.toDepartmentId
                        )
                        : null,

                toLocationId:
                    form.toLocationId
                        ? Number(
                            form.toLocationId
                        )
                        : null,

                note:
                    form.note.trim() ||
                    null,
            }

            console.log(
                'TRANSFER PAYLOAD:',
                payload
            )

            const result =
                await transferService.create(
                    payload
                )

            console.log(
                'TRANSFER RESULT:',
                result
            )

            navigate(
                `/transfers/${result.transferId}`
            )
        } catch (err) {
            console.error(
                'CREATE TRANSFER ERROR:',
                err
            )

            const status =
                err.response?.status

            const message =
                err.response?.data?.message

            if (status === 403) {
                setError(
                    'You do not have permission to transfer assets.'
                )
            } else if (status === 400) {
                setError(
                    message ||
                    'Invalid transfer information.'
                )
            } else if (status === 409) {
                setError(
                    message ||
                    'The asset is already in the selected destination.'
                )
            } else {
                setError(
                    message ||
                    'Unable to transfer asset.'
                )
            }
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
                Loading transfer form...
            </div>
        )
    }

    // =========================================================
    // PAGE
    // =========================================================
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
            <div>
                <h1 className="text-3xl font-bold text-slate-900">
                    Transfer Asset
                </h1>

                <p className="mt-2 text-gray-500">
                    Transfer an asset to another
                    department, location, or both.
                </p>
            </div>

            {/* ERROR */}
            {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="mt-8"
            >

                {/* ASSET */}
                <Section title="Asset">

                    <FormField
                        label="Asset"
                        required
                    >
                        <select
                            name="assetId"
                            value={form.assetId}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option value="">
                                Select asset
                            </option>

                            {assets.map((asset) => (
                                <option
                                    key={asset.id}
                                    value={asset.id}
                                >
                                    {asset.assetCode}
                                    {' - '}
                                    {asset.assetName}
                                </option>
                            ))}
                        </select>
                    </FormField>

                </Section>

                {/* CURRENT INFORMATION */}
                {selectedAsset && (
                    <div className="mt-6">

                        <Section title="Current Information">

                            <div className="grid gap-6 md:grid-cols-2">

                                <CurrentValue
                                    label="Current Department"
                                    value={
                                        selectedAsset.departmentName ||
                                        'Not assigned'
                                    }
                                />

                                <CurrentValue
                                    label="Current Location"
                                    value={
                                        selectedAsset.locationName ||
                                        'Not assigned'
                                    }
                                />

                            </div>

                            <div className="mt-5 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
                                Current asset location is shown
                                for reference. Select only the
                                destination values you want to
                                change.
                            </div>

                        </Section>

                    </div>
                )}

                {/* DESTINATION */}
                <div className="mt-6">

                    <Section title="Destination">

                        <div className="grid gap-6 md:grid-cols-2">

                            {/* DEPARTMENT */}
                            <FormField label="To Department">

                                <select
                                    name="toDepartmentId"
                                    value={
                                        form.toDepartmentId
                                    }
                                    onChange={handleChange}
                                    className={inputClass}
                                >
                                    <option value="">
                                        Keep current department
                                    </option>

                                    {departments.map(
                                        (department) => (
                                            <option
                                                key={
                                                    department.id
                                                }
                                                value={
                                                    department.id
                                                }
                                            >
                                                {department.name}
                                            </option>
                                        )
                                    )}

                                </select>

                            </FormField>

                            {/* LOCATION */}
                            <FormField label="To Location">

                                <select
                                    name="toLocationId"
                                    value={
                                        form.toLocationId
                                    }
                                    onChange={handleChange}
                                    className={inputClass}
                                >
                                    <option value="">
                                        Keep current location
                                    </option>

                                    {locations.map(
                                        (location) => (
                                            <option
                                                key={location.id}
                                                value={location.id}
                                            >
                                                {location.name}
                                            </option>
                                        )
                                    )}

                                </select>

                            </FormField>

                        </div>

                    </Section>

                </div>

                {/* NOTE */}
                <div className="mt-6">

                    <Section title="Transfer Note">

                        <FormField label="Note">

                            <textarea
                                name="note"
                                value={form.note}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Example: Transfer asset to Finance department for project use."
                                className={inputClass}
                            />

                        </FormField>

                    </Section>

                </div>

                {/* ACTIONS */}
                <div className="mt-8 flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={() =>
                            navigate('/transfers')
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
                            ? 'Transferring...'
                            : 'Transfer Asset'}
                    </button>

                </div>

            </form>

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

            <div className="mt-5">
                {children}
            </div>

        </div>
    )
}

// =========================================================
// FORM FIELD
// =========================================================
function FormField({
    label,
    required = false,
    children,
}) {
    return (
        <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">

                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}

            </label>

            {children}

        </div>
    )
}

// =========================================================
// CURRENT VALUE
// =========================================================
function CurrentValue({
    label,
    value,
}) {
    return (
        <div className="rounded-lg bg-slate-50 p-4">

            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {label}
            </div>

            <div className="mt-2 font-semibold text-slate-800">
                {value}
            </div>

        </div>
    )
}

const inputClass =
    'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

export default TransferCreatePage