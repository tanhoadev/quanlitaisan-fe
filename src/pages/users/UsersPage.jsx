import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import userService from '../../services/userService'
import departmentService from '../../services/departmentService'

function UsersPage() {
    const [users, setUsers] = useState([])
    const [departments, setDepartments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [departmentFilter, setDepartmentFilter] =
        useState('all')

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)
            setError('')

            const [userData, departmentData] =
                await Promise.all([
                    userService.getAll(),
                    departmentService.getAll(),
                ])

            setUsers(
                Array.isArray(userData)
                    ? userData
                    : []
            )

            setDepartments(
                Array.isArray(departmentData)
                    ? departmentData
                    : []
            )
        } catch (err) {
            console.error('Load users error:', err)

            setError(
                err.response?.data?.message ||
                'Failed to load users.'
            )
        } finally {
            setLoading(false)
        }
    }

    const getDepartmentName = (departmentId) => {
        if (!departmentId) {
            return '-'
        }

        const department = departments.find(
            (x) => x.id === departmentId
        )

        return department?.name || `#${departmentId}`
    }

    const filteredUsers = useMemo(() => {
        let result = [...users]

        const keyword =
            search.trim().toLowerCase()

        if (keyword) {
            result = result.filter((user) => {
                const fullName =
                    user.fullName?.toLowerCase() || ''

                const email =
                    user.email?.toLowerCase() || ''

                return (
                    fullName.includes(keyword) ||
                    email.includes(keyword)
                )
            })
        }

        if (roleFilter !== 'all') {
            result = result.filter((user) =>
                user.roles?.includes(roleFilter)
            )
        }

        if (departmentFilter !== 'all') {
            if (departmentFilter === 'none') {
                result = result.filter(
                    (user) => !user.departmentId
                )
            } else {
                result = result.filter(
                    (user) =>
                        String(user.departmentId) ===
                        departmentFilter
                )
            }
        }

        return result
    }, [
        users,
        search,
        roleFilter,
        departmentFilter,
    ])

    const adminCount = users.filter((user) =>
        user.roles?.includes('Admin')
    ).length

    const assetManagerCount = users.filter((user) =>
        user.roles?.includes('AssetManager')
    ).length

    const employeeCount = users.filter((user) =>
        user.roles?.includes('Employee')
    ).length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        User Management
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage system users, departments and roles.
                    </p>
                </div>

                <Link
                    to="/users/create"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                    + Add User
                </Link>
            </div>

            {/* Summary */}
            {/* Summary */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Summary
                    label="Total Users"
                    value={users.length}
                />

                <Summary
                    label="Admins"
                    value={adminCount}
                />

                <Summary
                    label="Asset Managers"
                    value={assetManagerCount}
                />

                <Summary
                    label="Employees"
                    value={employeeCount}
                />
            </div>

            {/* Filters */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Search
                        </label>

                        <input
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search name or email..."
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Department
                        </label>

                        <select
                            value={departmentFilter}
                            onChange={(e) =>
                                setDepartmentFilter(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="all">
                                All Departments
                            </option>

                            <option value="none">
                                No Department
                            </option>

                            {departments.map(
                                (department) => (
                                    <option
                                        key={department.id}
                                        value={department.id}
                                    >
                                        {department.name}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Role
                        </label>

                        <select
                            value={roleFilter}
                            onChange={(e) =>
                                setRoleFilter(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="all">
                                All Roles
                            </option>

                            <option value="Admin">
                                Admin
                            </option>

                            <option value="AssetManager">
                                Asset Manager
                            </option>

                            <option value="Employee">
                                Employee
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
                                <Header>Name</Header>
                                <Header>Email</Header>
                                <Header>
                                    Department
                                </Header>
                                <Header>Role</Header>

                                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100 bg-white">
                            {loading ? (
                                <Empty
                                    text="Loading users..."
                                />
                            ) : filteredUsers.length ===
                                0 ? (
                                <Empty
                                    text="No users found."
                                />
                            ) : (
                                filteredUsers.map(
                                    (user) => (
                                        <tr
                                            key={user.id}
                                            className="transition hover:bg-gray-50"
                                        >
                                            <td className="px-5 py-4">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {user.fullName ||
                                                        '-'}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {user.email ||
                                                    '-'}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {getDepartmentName(
                                                    user.departmentId
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles
                                                        ?.length >
                                                        0 ? (
                                                        user.roles.map(
                                                            (
                                                                role
                                                            ) => (
                                                                <RoleBadge
                                                                    key={
                                                                        role
                                                                    }
                                                                    role={
                                                                        role
                                                                    }
                                                                />
                                                            )
                                                        )
                                                    ) : (
                                                        <span className="text-sm text-gray-400">
                                                            -
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-right text-sm">
                                                <Link
                                                    to={`/users/${user.id}/edit`}
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
                    Showing {filteredUsers.length} of{' '}
                    {users.length} users
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

function RoleBadge({ role }) {
    if (role === 'Admin') {
        return (
            <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700">
                Admin
            </span>
        )
    }

    if (role === 'AssetManager') {
        return (
            <span className="inline-flex rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700">
                Asset Manager
            </span>
        )
    }

    if (role === 'Employee') {
        return (
            <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                Employee
            </span>
        )
    }

    return (
        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
            {role}
        </span>
    )
}

function Empty({ text }) {
    return (
        <tr>
            <td
                colSpan="5"
                className="px-5 py-10 text-center text-sm text-gray-500"
            >
                {text}
            </td>
        </tr>
    )
}

export default UsersPage