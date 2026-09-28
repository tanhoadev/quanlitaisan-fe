import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import vendorService from '../../services/vendorService'

function VendorsPage() {
    const [vendors, setVendors] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    useEffect(() => {
        loadVendors()
    }, [])

    const loadVendors = async () => {
        try {
            setLoading(true)
            setError('')

            const data = await vendorService.getAll()

            setVendors(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Load vendors error:', err)
            setError(
                err.response?.data?.message ||
                'Failed to load vendors.'
            )
        } finally {
            setLoading(false)
        }
    }

    const filteredVendors = useMemo(() => {
        let result = [...vendors]

        // Status filter
        if (statusFilter === 'active') {
            result = result.filter(
                (vendor) => vendor.isActive === true
            )
        }

        if (statusFilter === 'inactive') {
            result = result.filter(
                (vendor) => vendor.isActive === false
            )
        }

        // Search
        const keyword = search.trim().toLowerCase()

        if (keyword) {
            result = result.filter((vendor) => {
                const code = vendor.code?.toLowerCase() || ''
                const name = vendor.name?.toLowerCase() || ''
                const email = vendor.email?.toLowerCase() || ''
                const phone = vendor.phone?.toLowerCase() || ''

                return (
                    code.includes(keyword) ||
                    name.includes(keyword) ||
                    email.includes(keyword) ||
                    phone.includes(keyword)
                )
            })
        }

        return result
    }, [vendors, search, statusFilter])

    const activeCount = vendors.filter(
        (vendor) => vendor.isActive
    ).length

    const inactiveCount = vendors.filter(
        (vendor) => !vendor.isActive
    ).length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Vendors
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage suppliers and service providers.
                    </p>
                </div>

                <Link
                    to="/vendors/create"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                    + Add Vendor
                </Link>
            </div>

            {/* Summary */}
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                        Total Vendors
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {vendors.length}
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
                            placeholder="Search code, name, email or phone..."
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
                                    Code
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Name
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Email
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Phone
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
                                        Loading vendors...
                                    </td>
                                </tr>
                            ) : filteredVendors.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-5 py-10 text-center text-sm text-gray-500"
                                    >
                                        No vendors found.
                                    </td>
                                </tr>
                            ) : (
                                filteredVendors.map((vendor) => (
                                    <tr
                                        key={vendor.id}
                                        className="transition hover:bg-gray-50"
                                    >
                                        <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-900">
                                            {vendor.code || '-'}
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-900">
                                            {vendor.name || '-'}
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-600">
                                            {vendor.email || '-'}
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                                            {vendor.phone || '-'}
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4">
                                            {vendor.isActive ? (
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
                                                to={`/vendors/${vendor.id}/edit`}
                                                className="font-medium text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Result count */}
            {!loading && (
                <div className="text-sm text-gray-500">
                    Showing {filteredVendors.length} of{' '}
                    {vendors.length} vendors
                </div>
            )}
        </div>
    )
}

export default VendorsPage