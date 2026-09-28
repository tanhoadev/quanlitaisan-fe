import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import assignmentService from '../services/assignmentService'

function AssignmentsPage() {
    const navigate = useNavigate()

    const [assignments, setAssignments] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        loadAssignments()
    }, [])

    const loadAssignments = async () => {
        try {
            setLoading(true)
            setError('')

            const data = await assignmentService.getAll()

            console.log('ASSIGNMENTS:', data)

            setAssignments(
                Array.isArray(data) ? data : []
            )
        } catch (err) {
            console.error(
                'ASSIGNMENTS ERROR:',
                err
            )

            setError(
                'Unable to load assignments.'
            )
        } finally {
            setLoading(false)
        }
    }

    // =========================================================
    // SEARCH
    // =========================================================
    const filteredAssignments =
        assignments.filter((assignment) => {
            const keyword =
                search.toLowerCase().trim()

            if (!keyword) return true

            return (
                assignment.assetCode
                    ?.toLowerCase()
                    .includes(keyword) ||
                assignment.assetName
                    ?.toLowerCase()
                    .includes(keyword) ||
                assignment.assignedToUserName
                    ?.toLowerCase()
                    .includes(keyword) ||
                assignment.assignedByUserName
                    ?.toLowerCase()
                    .includes(keyword)
            )
        })

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

    // =========================================================
    // STATUS
    // =========================================================
    const getAssignmentStatus = (
        assignment
    ) => {
        return assignment.returnedAt
            ? 'Returned'
            : 'Active'
    }

    // =========================================================
    // LOADING
    // =========================================================
    if (loading) {
        return (
            <div className="text-sm text-gray-500">
                Loading assignments...
            </div>
        )
    }

    return (
        <div>

            {/* HEADER */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Assignments
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage asset assignments and returns.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate('/assignments/create')
                    }
                    className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    + Assign Asset
                </button>

            </div>

            {/* ERROR */}
            {error && (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* SEARCH */}
            <div className="mt-8 rounded-xl bg-white p-5 shadow-sm">

                <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                    placeholder="Search asset or employee..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

            </div>

            {/* TABLE */}
            <div className="mt-5 overflow-hidden rounded-xl bg-white shadow-sm">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-slate-50">
                            <tr>

                                <TableHeader>
                                    Asset
                                </TableHeader>

                                <TableHeader>
                                    Assigned To
                                </TableHeader>

                                <TableHeader>
                                    Assigned By
                                </TableHeader>

                                <TableHeader>
                                    Assigned At
                                </TableHeader>

                                <TableHeader>
                                    Returned At
                                </TableHeader>

                                <TableHeader>
                                    Status
                                </TableHeader>

                                <TableHeader align="right">
                                    Actions
                                </TableHeader>

                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            {filteredAssignments.map(
                                (assignment) => {
                                    const status =
                                        getAssignmentStatus(
                                            assignment
                                        )

                                    return (
                                        <tr
                                            key={assignment.id}
                                            className="hover:bg-slate-50"
                                        >

                                            {/* ASSET */}
                                            <td className="whitespace-nowrap px-6 py-4">

                                                <div className="font-medium text-slate-900">
                                                    {assignment.assetCode}
                                                </div>

                                                <div className="mt-1 text-xs text-gray-500">
                                                    {assignment.assetName}
                                                </div>

                                            </td>

                                            {/* ASSIGNED TO */}
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                                                {assignment.assignedToUserName ||
                                                    '-'}
                                            </td>

                                            {/* ASSIGNED BY */}
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                                                {assignment.assignedByUserName ||
                                                    '-'}
                                            </td>

                                            {/* ASSIGNED AT */}
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                {formatDate(
                                                    assignment.assignedAt
                                                )}
                                            </td>

                                            {/* RETURNED AT */}
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                {formatDate(
                                                    assignment.returnedAt
                                                )}
                                            </td>

                                            {/* STATUS */}
                                            <td className="whitespace-nowrap px-6 py-4">

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${status === 'Active'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                        }`}
                                                >
                                                    {status}
                                                </span>

                                            </td>

                                            {/* ACTIONS */}
                                            <td className="whitespace-nowrap px-6 py-4 text-right">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/assignments/${assignment.id}`
                                                        )
                                                    }
                                                    className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
                                                >
                                                    View
                                                </button>

                                            </td>

                                        </tr>
                                    )
                                }
                            )}

                            {filteredAssignments.length ===
                                0 && (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-12 text-center text-sm text-gray-500"
                                        >
                                            No assignments found.
                                        </td>
                                    </tr>
                                )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    )
}

// =========================================================
// TABLE HEADER
// =========================================================
function TableHeader({
    children,
    align = 'left',
}) {
    const alignment =
        align === 'right'
            ? 'text-right'
            : 'text-left'

    return (
        <th
            className={`whitespace-nowrap px-6 py-4 ${alignment} text-xs font-semibold uppercase tracking-wide text-gray-500`}
        >
            {children}
        </th>
    )
}

export default AssignmentsPage