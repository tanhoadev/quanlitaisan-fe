import { useEffect, useState } from 'react'
import {
    useNavigate,
    useParams,
} from 'react-router-dom'

import assignmentService from '../services/assignmentService'

function AssignmentDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [assignment, setAssignment] =
        useState(null)

    const [returnNote, setReturnNote] =
        useState('')

    const [loading, setLoading] =
        useState(true)

    const [returning, setReturning] =
        useState(false)

    const [error, setError] =
        useState('')

    const [showReturnForm, setShowReturnForm] =
        useState(false)

    // =========================================================
    // LOAD ASSIGNMENT
    // =========================================================
    useEffect(() => {
        loadAssignment()
    }, [id])

    const loadAssignment = async () => {
        try {
            setLoading(true)
            setError('')

            const data =
                await assignmentService.getById(id)

            setAssignment(data)
        } catch (err) {
            console.error(
                'LOAD ASSIGNMENT ERROR:',
                err
            )

            if (err.response?.status === 404) {
                setError('Assignment not found.')
            } else {
                setError(
                    'Unable to load assignment.'
                )
            }
        } finally {
            setLoading(false)
        }
    }

    // =========================================================
    // RETURN ASSET
    // =========================================================
    const handleReturn = async (event) => {
        event.preventDefault()

        if (!assignment) return

        const confirmed = window.confirm(
            `Return asset ${assignment.assetCode}?`
        )

        if (!confirmed) return

        try {
            setReturning(true)
            setError('')

            await assignmentService.returnAsset(
                assignment.id,
                {
                    note:
                        returnNote.trim() || null,
                }
            )

            // Reload detail after return
            await loadAssignment()

            setReturnNote('')
            setShowReturnForm(false)
        } catch (err) {
            console.error(
                'RETURN ASSET ERROR:',
                err
            )

            const status = err.response?.status
            const message =
                err.response?.data?.message

            if (status === 403) {
                setError(
                    'You do not have permission to return assets.'
                )
            } else if (status === 404) {
                setError(
                    message ||
                    'Assignment not found.'
                )
            } else if (status === 409) {
                setError(
                    message ||
                    'This asset cannot be returned.'
                )
            } else {
                setError(
                    message ||
                    'Unable to return asset.'
                )
            }
        } finally {
            setReturning(false)
        }
    }

    // =========================================================
    // FORMAT DATE
    // =========================================================
    const formatDate = (value) => {
        if (!value) return '-'

        const utcValue =
            value.endsWith('Z')
                ? value
                : `${value}Z`

        return new Date(utcValue).toLocaleString(
            'vi-VN'
        )
    }

    if (loading) {
        return (
            <div className="text-sm text-gray-500">
                Loading assignment...
            </div>
        )
    }

    if (!assignment) {
        return (
            <div>
                <button
                    type="button"
                    onClick={() =>
                        navigate('/assignments')
                    }
                    className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                    ← Back to Assignments
                </button>

                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error || 'Assignment not found.'}
                </div>
            </div>
        )
    }

    const isActive =
        !assignment.returnedAt

    return (
        <div className="max-w-5xl">

            {/* BACK */}
            <button
                type="button"
                onClick={() =>
                    navigate('/assignments')
                }
                className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
            >
                ← Back to Assignments
            </button>

            {/* HEADER */}
            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Assignment Detail
                    </h1>

                    <p className="mt-2 text-gray-500">
                        View assignment information and
                        asset return status.
                    </p>
                </div>

                <StatusBadge
                    active={isActive}
                />

            </div>

            {/* ERROR */}
            {error && (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* ASSET */}
            <Section title="Asset Information">

                <InfoGrid>

                    <InfoItem
                        label="Asset Code"
                        value={assignment.assetCode}
                    />

                    <InfoItem
                        label="Asset Name"
                        value={assignment.assetName}
                    />

                    <InfoItem
                        label="Asset ID"
                        value={assignment.assetId}
                    />

                    <InfoItem
                        label="Status"
                        value={
                            isActive
                                ? 'In Use'
                                : 'Returned'
                        }
                    />

                </InfoGrid>

            </Section>

            {/* ASSIGNMENT */}
            <Section title="Assignment Information">

                <InfoGrid>

                    <InfoItem
                        label="Assignment ID"
                        value={assignment.id}
                    />

                    <InfoItem
                        label="Assigned To"
                        value={
                            assignment.assignedToUserName
                        }
                    />

                    <InfoItem
                        label="Assigned By"
                        value={
                            assignment.assignedByUserName
                        }
                    />

                    <InfoItem
                        label="Assigned At"
                        value={formatDate(
                            assignment.assignedAt
                        )}
                    />

                    <InfoItem
                        label="Returned At"
                        value={formatDate(
                            assignment.returnedAt
                        )}
                    />

                </InfoGrid>

            </Section>

            {/* NOTE */}
            <Section title="Note">

                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {assignment.note || '-'}
                </p>

            </Section>

            {/* RETURN */}
            {isActive && (
                <div className="mt-6 rounded-xl border border-amber-200 bg-white p-6 shadow-sm">

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Return Asset
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Mark this asset as returned
                                and make it available again.
                            </p>
                        </div>

                        {!showReturnForm && (
                            <button
                                type="button"
                                onClick={() =>
                                    setShowReturnForm(true)
                                }
                                className="cursor-pointer rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
                            >
                                Return Asset
                            </button>
                        )}

                    </div>

                    {showReturnForm && (
                        <form
                            onSubmit={handleReturn}
                            className="mt-6"
                        >

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Return Note
                            </label>

                            <textarea
                                value={returnNote}
                                onChange={(event) =>
                                    setReturnNote(
                                        event.target.value
                                    )
                                }
                                rows="4"
                                placeholder="Example: Asset returned in good working condition."
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                            <div className="mt-4 flex justify-end gap-3">

                                <button
                                    type="button"
                                    disabled={returning}
                                    onClick={() => {
                                        setShowReturnForm(false)
                                        setReturnNote('')
                                    }}
                                    className="cursor-pointer rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={returning}
                                    className="cursor-pointer rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {returning
                                        ? 'Returning...'
                                        : 'Confirm Return'}
                                </button>

                            </div>

                        </form>
                    )}

                </div>
            )}

        </div>
    )
}

// =========================================================
// COMPONENTS
// =========================================================

function Section({
    title,
    children,
}) {
    return (
        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-lg font-semibold text-slate-900">
                {title}
            </h2>

            {children}

        </div>
    )
}

function InfoGrid({ children }) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {children}
        </div>
    )
}

function InfoItem({
    label,
    value,
}) {
    return (
        <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {label}
            </div>

            <div className="mt-2 text-sm font-medium text-slate-800">
                {value ?? '-'}
            </div>
        </div>
    )
}

function StatusBadge({ active }) {
    return (
        <span
            className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${active
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
                }`}
        >
            {active
                ? 'Active'
                : 'Returned'}
        </span>
    )
}

export default AssignmentDetailPage