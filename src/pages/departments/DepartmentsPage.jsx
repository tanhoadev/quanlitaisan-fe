import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import departmentService from '../../services/departmentService'

function DepartmentsPage() {
    const [departments, setDepartments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    useEffect(() => {
        loadDepartments()
    }, [])

    const loadDepartments = async () => {
        try {
            setLoading(true)
            setError('')

            const data = await departmentService.getAll()

            console.log('DEPARTMENT DATA:', data)

            setDepartments(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Load departments error:', err)

            setError(
                err.response?.data?.message ||
                'Failed to load departments.'
            )
        } finally {
            setLoading(false)
        }
    }

    const filteredDepartments = useMemo(() => {
        let result = [...departments]

        // Status filter
        if (statusFilter === 'active') {
            result = result.filter(
                (department) => department.isActive === true
            )
        }

        if (statusFilter === 'inactive') {
            result = result.filter(
                (department) => department.isActive === false
            )
        }

        // Search
        const keyword = search.trim().toLowerCase()

        if (keyword) {
            result = result.filter((department) => {
                const code =
                    department.code?.toLowerCase() || ''

                const name =
                    department.name?.toLowerCase() || ''

                const description =
                    department.description?.toLowerCase() || ''

                return (
                    code.includes(keyword) ||
                    name.includes(keyword) ||
                    description.includes(keyword)
                )
            })
        }

        return result
    }, [departments, search, statusFilter])

    const activeCount = departments.filter(
        (department) => department.isActive
    ).length

    const inactiveCount = departments.filter(
        (department) => !department.isActive
    ).length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Departments
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage departments in the organization.
                    </p>
                </div>

                <Link
                    to="/departments/create"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                    + Add Department
                </Link>
            </div>

            {/* Summary */}
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                        Total Departments
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {departments.length}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                        Active
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {activeCount}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                        Inactive
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {inactiveCount}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Search
                        </label>

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search code, name or description..."
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Status
                        </label>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="all">
                                All Status
                            </option>

                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    ID
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Code
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Name
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Description
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Status
                                </th>

                                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100 bg-white">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-5 py-10 text-center text-sm text-gray-500"
                                    >
                                        Loading departments...
                                    </td>
                                </tr>
                            ) : filteredDepartments.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-5 py-10 text-center text-sm text-gray-500"
                                    >
                                        No departments found.
                                    </td>
                                </tr>
                            ) : (
                                filteredDepartments.map(
                                    (department) => (
                                        <tr
                                            key={department.id}
                                            className="transition hover:bg-gray-50"
                                        >
                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                                                {department.id}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-900">
                                                {department.code || '-'}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-900">
                                                {department.name || '-'}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {department.description || '-'}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                {department.isActive ? (
                                                    <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-right text-sm">
                                                <Link
                                                    to={`/departments/${department.id}/edit`}
                                                    className="font-medium text-blue-600 hover:text-blue-800"
                                                >
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {!loading && (
                <div className="text-sm text-gray-500">
                    Showing {filteredDepartments.length} of{' '}
                    {departments.length} departments
                </div>
            )}
        </div>
    )
}

export default DepartmentsPage