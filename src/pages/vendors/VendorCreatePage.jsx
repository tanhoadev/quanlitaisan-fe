import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import vendorService from '../../services/vendorService'

function VendorCreatePage() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        isActive: true,
    })

    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

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
            setError('Vendor code is required.')
            return
        }

        if (!formData.name.trim()) {
            setError('Vendor name is required.')
            return
        }

        try {
            setSaving(true)
            setError('')

            await vendorService.create({
                code: formData.code.trim(),
                name: formData.name.trim(),
                email: formData.email.trim() || null,
                phone: formData.phone.trim() || null,
                address: formData.address.trim() || null,
                isActive: formData.isActive,
            })

            navigate('/vendors')
        } catch (err) {
            console.error('Create vendor error:', err)

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                'Failed to create vendor.'
            )
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <Link
                    to="/vendors"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                    ← Back to Vendors
                </Link>

                <h1 className="mt-3 text-2xl font-bold text-gray-900">
                    Add Vendor
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Create a new supplier or service provider.
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
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Vendor Code *
                        </label>

                        <input
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            placeholder="VEN002"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Vendor Name *
                        </label>

                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="ABC Technology"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="contact@example.com"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Phone
                        </label>

                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="0901234567"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Address
                        </label>

                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Vendor address..."
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
                                    Active vendors can be selected in
                                    asset cost transactions.
                                </span>
                            </span>
                        </label>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5">
                    <Link
                        to="/vendors"
                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving ? 'Creating...' : 'Create Vendor'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default VendorCreatePage