import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import assetCategoryService from '../../services/assetCategoryService'

function CategoryCreatePage() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        isActive: true,
    })

    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === 'checkbox'
                    ? checked
                    : value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.code.trim()) {
            setError('Category code is required.')
            return
        }

        if (!formData.name.trim()) {
            setError('Category name is required.')
            return
        }

        try {
            setSaving(true)
            setError('')

            await assetCategoryService.create({
                code: formData.code.trim(),
                name: formData.name.trim(),
                description:
                    formData.description.trim() || null,
                isActive: formData.isActive,
            })

            navigate('/categories')
        } catch (err) {
            console.error('Create category error:', err)

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                'Failed to create category.'
            )
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <Link
                    to="/categories"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                    ← Back to Categories
                </Link>

                <h1 className="mt-3 text-2xl font-bold text-gray-900">
                    Add Asset Category
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Create a new asset classification category.
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
                        label="Category Code *"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="PRINTER"
                    />

                    <Input
                        label="Category Name *"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Printer"
                    />

                    <div className="md:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Category description..."
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
                                    Active categories can be used
                                    when creating or editing assets.
                                </span>
                            </span>
                        </label>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5">
                    <Link
                        to="/categories"
                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving
                            ? 'Creating...'
                            : 'Create Category'}
                    </button>
                </div>
            </form>
        </div>
    )
}

function Input({
    label,
    name,
    value,
    onChange,
    placeholder,
}) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {label}
            </label>

            <input
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
        </div>
    )
}

export default CategoryCreatePage