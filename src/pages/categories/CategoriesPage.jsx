import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import assetCategoryService from '../../services/assetCategoryService'

function CategoriesPage() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    useEffect(() => {
        loadCategories()
    }, [])

    const loadCategories = async () => {
        try {
            setLoading(true)
            setError('')

            const data = await assetCategoryService.getAll()

            setCategories(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Load categories error:', err)

            setError(
                err.response?.data?.message ||
                'Failed to load categories.'
            )
        } finally {
            setLoading(false)
        }
    }

    const filteredCategories = useMemo(() => {
        let result = [...categories]

        if (statusFilter === 'active') {
            result = result.filter(
                (category) => category.isActive === true
            )
        }

        if (statusFilter === 'inactive') {
            result = result.filter(
                (category) => category.isActive === false
            )
        }

        const keyword = search.trim().toLowerCase()

        if (keyword) {
            result = result.filter((category) => {
                const code =
                    category.code?.toLowerCase() || ''

                const name =
                    category.name?.toLowerCase() || ''

                const description =
                    category.description?.toLowerCase() || ''

                return (
                    code.includes(keyword) ||
                    name.includes(keyword) ||
                    description.includes(keyword)
                )
            })
        }

        return result
    }, [categories, search, statusFilter])

    const activeCount = categories.filter(
        (category) => category.isActive
    ).length

    const inactiveCount = categories.filter(
        (category) => !category.isActive
    ).length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Asset Categories
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage asset classification categories.
                    </p>
                </div>

                <Link
                    to="/categories/create"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                    + Add Category
                </Link>
            </div>

            {/* Summary */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Summary
                    label="Total Categories"
                    value={categories.length}
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

            {/* Filters */}
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
                            placeholder="Search code, name or description..."
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
                                <Header>ID</Header>
                                <Header>Code</Header>
                                <Header>Name</Header>
                                <Header>Description</Header>
                                <Header>Status</Header>

                                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100 bg-white">
                            {loading ? (
                                <Empty text="Loading categories..." />
                            ) : filteredCategories.length === 0 ? (
                                <Empty text="No categories found." />
                            ) : (
                                filteredCategories.map(
                                    (category) => (
                                        <tr
                                            key={category.id}
                                            className="transition hover:bg-gray-50"
                                        >
                                            <Cell>
                                                {category.id}
                                            </Cell>

                                            <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-900">
                                                {category.code ||
                                                    '-'}
                                            </td>

                                            <Cell>
                                                {category.name ||
                                                    '-'}
                                            </Cell>

                                            <Cell>
                                                {category.description ||
                                                    '-'}
                                            </Cell>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                {category.isActive ? (
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
                                                    to={`/categories/${category.id}/edit`}
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
                <p className="text-sm text-gray-500">
                    Showing {filteredCategories.length} of{' '}
                    {categories.length} categories
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
                colSpan="6"
                className="px-5 py-10 text-center text-sm text-gray-500"
            >
                {text}
            </td>
        </tr>
    )
}

export default CategoriesPage