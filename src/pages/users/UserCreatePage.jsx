import { useEffect, useState } from 'react'
import {
    Link,
    useNavigate,
} from 'react-router-dom'

import userService from '../../services/userService'
import departmentService from '../../services/departmentService'

function UserCreatePage() {
    const navigate = useNavigate()

    const [departments, setDepartments] = useState([])

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        departmentId: '',
        role: 'Employee',
    })

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        loadDepartments()
    }, [])

    const loadDepartments = async () => {
        try {
            setLoading(true)
            setError('')

            const data =
                await departmentService.getAll()

            setDepartments(
                Array.isArray(data)
                    ? data
                    : []
            )
        } catch (err) {
            console.error(
                'Load departments error:',
                err
            )

            setError(
                err.response?.data?.message ||
                'Failed to load departments.'
            )
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError('')

        if (!formData.fullName.trim()) {
            setError('Full name is required.')
            return
        }

        if (!formData.email.trim()) {
            setError('Email is required.')
            return
        }

        if (!formData.password) {
            setError('Password is required.')
            return
        }

        if (
            formData.password !==
            formData.confirmPassword
        ) {
            setError(
                'Password and confirm password do not match.'
            )
            return
        }

        try {
            setSaving(true)

            await userService.create({
                fullName:
                    formData.fullName.trim(),

                email:
                    formData.email.trim(),

                password:
                    formData.password,

                departmentId:
                    formData.departmentId
                        ? Number(
                            formData.departmentId
                        )
                        : null,

                role:
                    formData.role,
            })

            navigate('/users')
        } catch (err) {
            console.error(
                'Create user error:',
                err
            )

            const apiErrors =
                err.response?.data?.errors

            if (
                Array.isArray(apiErrors) &&
                apiErrors.length > 0
            ) {
                setError(
                    apiErrors.join(' ')
                )
            } else {
                setError(
                    err.response?.data?.message ||
                    err.response?.data?.title ||
                    'Failed to create user.'
                )
            }
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="py-10 text-center text-sm text-gray-500">
                Loading...
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <Link
                    to="/users"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                    ← Back to User Management
                </Link>

                <h1 className="mt-3 text-2xl font-bold text-gray-900">
                    Add User
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Create a new system user and
                    assign department and role.
                </p>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
                <div className="grid gap-5 md:grid-cols-2">
                    {/* Full Name */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Full Name *
                        </label>

                        <input
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter full name"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Email *
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="user@asset.local"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Password *
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Confirm Password *
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={
                                formData.confirmPassword
                            }
                            onChange={handleChange}
                            placeholder="Confirm password"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* Department */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Department
                        </label>

                        <select
                            name="departmentId"
                            value={
                                formData.departmentId
                            }
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">
                                No Department
                            </option>

                            {departments
                                .filter(
                                    (department) =>
                                        department.isActive
                                )
                                .map(
                                    (department) => (
                                        <option
                                            key={
                                                department.id
                                            }
                                            value={
                                                department.id
                                            }
                                        >
                                            {
                                                department.code
                                            }{' '}
                                            -{' '}
                                            {
                                                department.name
                                            }
                                        </option>
                                    )
                                )}
                        </select>
                    </div>

                    {/* Role */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Role *
                        </label>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="Employee">
                                Employee
                            </option>

                            <option value="AssetManager">
                                Asset Manager
                            </option>

                            <option value="Admin">
                                Admin
                            </option>
                        </select>
                    </div>
                </div>

                {/* Role information */}
                {formData.role ===
                    'AssetManager' && (
                        <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
                            <p className="text-sm font-medium text-blue-800">
                                Asset Manager access
                            </p>

                            <p className="mt-1 text-xs text-blue-700">
                                Asset Managers can manage
                                asset operations, inventory,
                                maintenance and related
                                activities.
                            </p>
                        </div>
                    )}

                {formData.role === 'Admin' && (
                    <div className="mt-5 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3">
                        <p className="text-sm font-medium text-yellow-800">
                            Administrator access
                        </p>

                        <p className="mt-1 text-xs text-yellow-700">
                            Admin users have access to
                            administrative functions and
                            user management.
                        </p>
                    </div>
                )}

                <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5">
                    <Link
                        to="/users"
                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving
                            ? 'Creating...'
                            : 'Create User'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UserCreatePage