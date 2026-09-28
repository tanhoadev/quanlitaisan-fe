import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import locationService from '../../services/locationService'

function LocationEditPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        address: '',
        description: '',
        isActive: true,
    })

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        loadLocation()
    }, [id])

    const loadLocation = async () => {
        try {
            setLoading(true)

            const location =
                await locationService.getById(id)

            setFormData({
                code: location.code || '',
                name: location.name || '',
                address: location.address || '',
                description: location.description || '',
                isActive: location.isActive ?? true,
            })
        } catch (err) {
            console.error('Load location error:', err)
            setError('Failed to load location.')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.code.trim()) {
            setError('Location code is required.')
            return
        }

        if (!formData.name.trim()) {
            setError('Location name is required.')
            return
        }

        try {
            setSaving(true)
            setError('')

            await locationService.update(id, {
                code: formData.code.trim(),
                name: formData.name.trim(),
                address: formData.address.trim() || null,
                description:
                    formData.description.trim() || null,
                isActive: formData.isActive,
            })

            navigate('/locations')
        } catch (err) {
            console.error('Update location error:', err)

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                'Failed to update location.'
            )
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="py-10 text-center text-sm text-gray-500">
                Loading location...
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <Link
                    to="/locations"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                    ← Back to Locations
                </Link>

                <h1 className="mt-3 text-2xl font-bold text-gray-900">
                    Edit Location
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Update location information and status.
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
                    <Input
                        label="Location Code *"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                    />

                    <Input
                        label="Location Name *"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <div className="md:col-span-2">
                        <Input
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300"
                            />

                            <span>
                                <span className="block text-sm font-medium text-gray-700">
                                    Active
                                </span>
                                <span className="text-xs text-gray-500">
                                    Inactive locations should not be
                                    used for new transactions.
                                </span>
                            </span>
                        </label>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5">
                    <Link
                        to="/locations"
                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    )
}

function Input({ label, name, value, onChange }) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {label}
            </label>

            <input
                name={name}
                value={value}
                onChange={onChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
        </div>
    )
}

export default LocationEditPage