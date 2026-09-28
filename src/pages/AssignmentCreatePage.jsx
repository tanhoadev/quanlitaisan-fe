import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import assetService from '../services/assetService'
import assignmentService from '../services/assignmentService'
import userService from '../services/userService'

function AssignmentCreatePage() {
    const navigate = useNavigate()

    const [assets, setAssets] = useState([])
    const [users, setUsers] = useState([])

    const [form, setForm] = useState({
        assetId: '',
        assignedToUserId: '',
        note: '',
    })

    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    // =========================================================
    // LOAD AVAILABLE ASSETS + USERS
    // =========================================================
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                setError('')

                const [assetData, userData] =
                    await Promise.all([
                        assetService.getAll(),
                        userService.getAll(),
                    ])

                const availableAssets = (
                    Array.isArray(assetData)
                        ? assetData
                        : []
                ).filter(
                    (asset) =>
                        asset.isActive === true &&
                        asset.status === 'Available'
                )

                const employeeUsers = (
                    Array.isArray(userData)
                        ? userData
                        : []
                ).filter((user) =>
                    user.roles?.includes('Employee')
                )

                setAssets(availableAssets)
                setUsers(employeeUsers)
            } catch (err) {
                console.error(
                    'LOAD ASSIGNMENT DATA ERROR:',
                    err
                )

                setError(
                    'Unable to load assets or users.'
                )
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    // =========================================================
    // CHANGE
    // =========================================================
    const handleChange = (event) => {
        const { name, value } = event.target

        setForm((current) => ({
            ...current,
            [name]: value,
        }))
    }

    // =========================================================
    // SUBMIT
    // =========================================================
    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!form.assetId) {
            setError('Please select an asset.')
            return
        }

        if (!form.assignedToUserId) {
            setError('Please select a user.')
            return
        }

        try {
            setSubmitting(true)
            setError('')

            const payload = {
                assetId: Number(form.assetId),
                assignedToUserId:
                    form.assignedToUserId,
                note: form.note.trim() || null,
            }

            console.log(
                'ASSIGNMENT PAYLOAD:',
                payload
            )

            const result =
                await assignmentService.create(
                    payload
                )

            console.log(
                'ASSIGNMENT CREATED:',
                result
            )

            navigate(
                `/assignments/${result.assignmentId}`
            )
        } catch (err) {
            console.error(
                'CREATE ASSIGNMENT ERROR:',
                err
            )

            const status = err.response?.status
            const message =
                err.response?.data?.message

            if (status === 403) {
                setError(
                    'You do not have permission to assign assets.'
                )
            } else if (status === 400) {
                setError(
                    message ||
                    'Invalid assignment information.'
                )
            } else if (status === 409) {
                setError(
                    message ||
                    'This asset cannot be assigned.'
                )
            } else {
                setError(
                    message ||
                    'Unable to assign asset.'
                )
            }
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="text-sm text-gray-500">
                Loading assignment data...
            </div>
        )
    }

    return (
        <div className="max-w-4xl">

            {/* BACK */}
            <button
                type="button"
                onClick={() =>
                    navigate('/assignments')
                }
                className="mb-6 cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
            >
                ← Back to Assignments
            </button>

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">
                    Assign Asset
                </h1>

                <p className="mt-2 text-gray-500">
                    Assign an available asset to a
                    user.
                </p>
            </div>

            {/* ERROR */}
            {error && (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* FORM */}
            <form
                onSubmit={handleSubmit}
                className="mt-8 rounded-xl bg-white p-6 shadow-sm"
            >

                {/* ASSET */}
                <FormField
                    label="Asset"
                    required
                >
                    <select
                        name="assetId"
                        value={form.assetId}
                        onChange={handleChange}
                        required
                        className={inputClass}
                    >
                        <option value="">
                            Select available asset
                        </option>

                        {assets.map((asset) => (
                            <option
                                key={asset.id}
                                value={asset.id}
                            >
                                {asset.assetCode} -{' '}
                                {asset.assetName}
                            </option>
                        ))}
                    </select>

                    {assets.length === 0 && (
                        <p className="mt-2 text-xs text-amber-600">
                            No available assets found.
                        </p>
                    )}
                </FormField>

                {/* USER */}
                <div className="mt-6">
                    <FormField
                        label="Assign To"
                        required
                    >
                        <select
                            name="assignedToUserId"
                            value={
                                form.assignedToUserId
                            }
                            onChange={handleChange}
                            required
                            className={inputClass}
                        >
                            <option value="">
                                Select user
                            </option>

                            {users.map((user) => (
                                <option
                                    key={user.id}
                                    value={user.id}
                                >
                                    {user.fullName ||
                                        user.email}
                                    {' - '}
                                    {user.email}
                                </option>
                            ))}
                        </select>
                    </FormField>
                </div>

                {/* NOTE */}
                <div className="mt-6">
                    <FormField label="Note">
                        <textarea
                            name="note"
                            value={form.note}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Enter assignment note..."
                            className={inputClass}
                        />
                    </FormField>
                </div>

                {/* ACTIONS */}
                <div className="mt-8 flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={() =>
                            navigate('/assignments')
                        }
                        disabled={submitting}
                        className="cursor-pointer rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={
                            submitting ||
                            assets.length === 0
                        }
                        className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitting
                            ? 'Assigning...'
                            : 'Assign Asset'}
                    </button>

                </div>

            </form>
        </div>
    )
}

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

const inputClass =
    'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

export default AssignmentCreatePage