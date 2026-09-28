import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import inventoryService from '../services/inventoryService'

function InventoryCreatePage() {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        code: '',
        name: '',
        description: '',
        startDate: '',
        endDate: '',
    })

    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    // =========================================================
    // CHANGE
    // =========================================================
    const handleChange = (event) => {
        const { name, value } = event.target

        setForm((current) => ({
            ...current,
            [name]: value,
        }))

        setError('')
    }

    // =========================================================
    // SUBMIT
    // =========================================================
    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!form.code.trim()) {
            setError('Campaign code is required.')
            return
        }

        if (!form.name.trim()) {
            setError('Campaign name is required.')
            return
        }

        if (!form.startDate) {
            setError('Start date is required.')
            return
        }

        if (!form.endDate) {
            setError('End date is required.')
            return
        }

        if (
            new Date(form.endDate) <
            new Date(form.startDate)
        ) {
            setError(
                'End date cannot be earlier than start date.'
            )
            return
        }

        try {
            setSubmitting(true)
            setError('')

            const payload = {
                code: form.code.trim(),
                name: form.name.trim(),
                description:
                    form.description.trim() || null,
                startDate: form.startDate,
                endDate: form.endDate,
            }

            console.log(
                'CREATE INVENTORY CAMPAIGN:',
                payload
            )

            const result =
                await inventoryService.createCampaign(
                    payload
                )

            console.log(
                'CREATE CAMPAIGN RESULT:',
                result
            )

            navigate(
                `/inventory/${result.campaignId}`
            )
        } catch (err) {
            console.error(
                'CREATE CAMPAIGN ERROR:',
                err
            )

            const status =
                err.response?.status

            const message =
                err.response?.data?.message

            if (status === 403) {
                setError(
                    'You do not have permission to create inventory campaigns.'
                )
            } else if (status === 409) {
                setError(
                    message ||
                    'Campaign code already exists.'
                )
            } else if (status === 400) {
                setError(
                    message ||
                    'Invalid campaign information.'
                )
            } else {
                setError(
                    message ||
                    'Unable to create inventory campaign.'
                )
            }
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="pb-10">

            {/* BACK */}
            <button
                type="button"
                onClick={() =>
                    navigate('/inventory')
                }
                className="mb-6 cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
            >
                ← Back to Inventory
            </button>

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">
                    Create Inventory Campaign
                </h1>

                <p className="mt-2 text-gray-500">
                    Create a new physical asset inventory campaign.
                </p>
            </div>

            {/* ERROR */}
            {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="mt-8"
            >

                <Section title="Campaign Information">

                    <div className="grid gap-6 md:grid-cols-2">

                        <FormField
                            label="Campaign Code"
                            required
                        >
                            <input
                                type="text"
                                name="code"
                                value={form.code}
                                onChange={handleChange}
                                placeholder="INV-2026-001"
                                className={inputClass}
                            />
                        </FormField>

                        <FormField
                            label="Campaign Name"
                            required
                        >
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Q4 2026 Asset Inventory"
                                className={inputClass}
                            />
                        </FormField>

                    </div>

                    <div className="mt-6">

                        <FormField label="Description">

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Physical inventory campaign for company assets."
                                className={inputClass}
                            />

                        </FormField>

                    </div>

                </Section>

                <div className="mt-6">

                    <Section title="Inventory Period">

                        <div className="grid gap-6 md:grid-cols-2">

                            <FormField
                                label="Start Date"
                                required
                            >
                                <input
                                    type="date"
                                    name="startDate"
                                    value={form.startDate}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </FormField>

                            <FormField
                                label="End Date"
                                required
                            >
                                <input
                                    type="date"
                                    name="endDate"
                                    value={form.endDate}
                                    onChange={handleChange}
                                    min={form.startDate || undefined}
                                    className={inputClass}
                                />
                            </FormField>

                        </div>

                    </Section>

                </div>

                <div className="mt-8 flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={() =>
                            navigate('/inventory')
                        }
                        disabled={submitting}
                        className="cursor-pointer rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitting
                            ? 'Creating...'
                            : 'Create Campaign'}
                    </button>

                </div>

            </form>

        </div>
    )
}

function Section({
    title,
    children,
}) {
    return (
        <div className="rounded-xl bg-white p-6 shadow-sm">

            <h2 className="border-b border-gray-100 pb-4 text-lg font-semibold text-slate-900">
                {title}
            </h2>

            <div className="mt-5">
                {children}
            </div>

        </div>
    )
}

function FormField({
    label,
    required = false,
    children,
}) {
    return (
        <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}
            </label>

            {children}

        </div>
    )
}

const inputClass =
    'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

export default InventoryCreatePage  