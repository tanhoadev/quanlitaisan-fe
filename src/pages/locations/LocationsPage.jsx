import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import locationService from '../../services/locationService'

function LocationsPage() {
    const [locations, setLocations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    useEffect(() => {
        loadLocations()
    }, [])

    const loadLocations = async () => {
        try {
            setLoading(true)
            setError('')

            const data = await locationService.getAll()
            setLocations(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Load locations error:', err)
            setError(
                err.response?.data?.message ||
                'Failed to load locations.'
            )
        } finally {
            setLoading(false)
        }
    }

    const filteredLocations = useMemo(() => {
        let result = [...locations]

        if (statusFilter === 'active') {
            result = result.filter((x) => x.isActive === true)
        }

        if (statusFilter === 'inactive') {
            result = result.filter((x) => x.isActive === false)
        }

        const keyword = search.trim().toLowerCase()

        if (keyword) {
            result = result.filter((x) =>
                [
                    x.code,
                    x.name,
                    x.address,
                    x.description,
                ].some((value) =>
                    value?.toLowerCase().includes(keyword)
                )
            )
        }

        return result
    }, [locations, search, statusFilter])

    const activeCount = locations.filter(
        (x) => x.isActive
    ).length

    const inactiveCount = locations.filter(
        (x) => !x.isActive
    ).length

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Locations
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage asset locations.
                    </p>
                </div>

                <Link
                    to="/locations/create"
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                    + Add Location
                </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <Summary
                    label="Total Locations"
                    value={locations.length}
                />
                <Summary
                    label="Active"
                    value={activeCount}
                />
                <Summary
                    label="Inactive"
                    value={inactiveCount}
                />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Search
                        </label>

                        <input
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search code, name, address..."
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">
                                Inactive
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <Header>ID</Header>
                                <Header>Code</Header>
                                <Header>Name</Header>
                                <Header>Address</Header>
                                <Header>Description</Header>
                                <Header>Status</Header>

                                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <Empty text="Loading locations..." />
                            ) : filteredLocations.length === 0 ? (
                                <Empty text="No locations found." />
                            ) : (
                                filteredLocations.map((location) => (
                                    <tr
                                        key={location.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <Cell>{location.id}</Cell>

                                        <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-900">
                                            {location.code || '-'}
                                        </td>

                                        <Cell>{location.name || '-'}</Cell>
                                        <Cell>{location.address || '-'}</Cell>
                                        <Cell>
                                            {location.description || '-'}
                                        </Cell>

                                        <td className="whitespace-nowrap px-5 py-4">
                                            {location.isActive ? (
                                                <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-right text-sm">
                                            <Link
                                                to={`/locations/${location.id}/edit`}
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

            {!loading && (
                <p className="text-sm text-gray-500">
                    Showing {filteredLocations.length} of{' '}
                    {locations.length} locations
                </p>
            )}
        </div>
    )
}

function Summary({ label, value }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
                {label}
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
                {value}
            </p>
        </div>
    )
}

function Header({ children }) {
    return (
        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
            {children}
        </th>
    )
}

function Cell({ children }) {
    return (
        <td className="px-5 py-4 text-sm text-gray-600">
            {children}
        </td>
    )
}

function Empty({ text }) {
    return (
        <tr>
            <td
                colSpan="7"
                className="px-5 py-10 text-center text-sm text-gray-500"
            >
                {text}
            </td>
        </tr>
    )
}

export default LocationsPage