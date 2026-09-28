import { useEffect, useState } from 'react'

import assetCategoryService from '../../services/assetCategoryService'
import departmentService from '../../services/departmentService'
import locationService from '../../services/locationService'

const emptyForm = {
    assetCode: '',
    assetName: '',
    description: '',
    serialNumber: '',
    qrCode: '',
    status: 'Available',
    purchaseDate: '',
    purchasePrice: '',
    assetCategoryId: '',
    departmentId: '',
    locationId: '',
    isActive: true,
}

function AssetForm({
    initialData = null,
    onSubmit,
    onCancel,
    submitText = 'Save',
    submitting = false,
    error = '',
}) {
    const [form, setForm] = useState(emptyForm)

    const [categories, setCategories] = useState([])
    const [departments, setDepartments] = useState([])
    const [locations, setLocations] = useState([])

    const [loadingMasterData, setLoadingMasterData] = useState(true)
    const [masterDataError, setMasterDataError] = useState('')

    // =========================================================
    // LOAD CATEGORY / DEPARTMENT / LOCATION
    // =========================================================
    useEffect(() => {
        const loadMasterData = async () => {
            try {
                setLoadingMasterData(true)
                setMasterDataError('')

                const [
                    categoryData,
                    departmentData,
                    locationData,
                ] = await Promise.all([
                    assetCategoryService.getAll(),
                    departmentService.getAll(),
                    locationService.getAll(),
                ])

                setCategories(
                    Array.isArray(categoryData) ? categoryData : []
                )

                setDepartments(
                    Array.isArray(departmentData) ? departmentData : []
                )

                setLocations(
                    Array.isArray(locationData) ? locationData : []
                )
            } catch (err) {
                console.error('MASTER DATA ERROR:', err)

                setMasterDataError(
                    'Unable to load category, department or location data.'
                )
            } finally {
                setLoadingMasterData(false)
            }
        }

        loadMasterData()
    }, [])

    // =========================================================
    // FILL DATA WHEN EDITING
    // =========================================================
    useEffect(() => {
        if (!initialData) {
            return
        }

        setForm({
            assetCode: initialData.assetCode ?? '',
            assetName: initialData.assetName ?? '',
            description: initialData.description ?? '',
            serialNumber: initialData.serialNumber ?? '',
            qrCode: initialData.qrCode ?? '',
            status: initialData.status ?? 'Available',

            purchaseDate: initialData.purchaseDate
                ? initialData.purchaseDate.substring(0, 10)
                : '',

            purchasePrice:
                initialData.purchasePrice ?? '',

            assetCategoryId:
                initialData.assetCategoryId?.toString() ?? '',

            departmentId:
                initialData.departmentId?.toString() ?? '',

            locationId:
                initialData.locationId?.toString() ?? '',

            isActive:
                initialData.isActive ?? true,
        })
    }, [initialData])

    // =========================================================
    // INPUT CHANGE
    // =========================================================
    const handleChange = (event) => {
        const { name, value, type, checked } = event.target

        setForm((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    // =========================================================
    // SUBMIT
    // =========================================================
    const handleSubmit = (event) => {
        event.preventDefault()

        const payload = {
            assetCode: form.assetCode.trim(),
            assetName: form.assetName.trim(),

            description:
                form.description.trim() || null,

            serialNumber:
                form.serialNumber.trim() || null,

            qrCode: form.qrCode.trim(),

            status: form.status,

            purchaseDate:
                form.purchaseDate || null,

            purchasePrice:
                form.purchasePrice === ''
                    ? null
                    : Number(form.purchasePrice),

            assetCategoryId:
                Number(form.assetCategoryId),

            departmentId:
                form.departmentId
                    ? Number(form.departmentId)
                    : null,

            locationId:
                form.locationId
                    ? Number(form.locationId)
                    : null,

            isActive: form.isActive,
        }

        onSubmit(payload)
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-8"
        >
            {/* ERROR */}
            {(error || masterDataError) && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error || masterDataError}
                </div>
            )}

            {/* GENERAL */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
                    General Information
                </h2>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <FormField label="Asset Code" required>
                        <input
                            name="assetCode"
                            value={form.assetCode}
                            onChange={handleChange}
                            required
                            placeholder="e.g. LAP-0002"
                            className={inputClass}
                        />
                    </FormField>

                    <FormField label="Asset Name" required>
                        <input
                            name="assetName"
                            value={form.assetName}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Lenovo ThinkPad T14"
                            className={inputClass}
                        />
                    </FormField>

                    <FormField label="Serial Number">
                        <input
                            name="serialNumber"
                            value={form.serialNumber}
                            onChange={handleChange}
                            placeholder="Serial number"
                            className={inputClass}
                        />
                    </FormField>

                    <FormField label="QR Code" required>
                        <input
                            name="qrCode"
                            value={form.qrCode}
                            onChange={handleChange}
                            required
                            placeholder="e.g. ASSET-LAP-0002"
                            className={inputClass}
                        />
                    </FormField>

                    <FormField label="Status" required>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            required
                            className={inputClass}
                        >
                            <option value="Available">
                                Available
                            </option>

                            <option value="InUse">
                                In Use
                            </option>

                            <option value="Maintenance">
                                Maintenance
                            </option>

                            <option value="Retired">
                                Retired
                            </option>
                        </select>
                    </FormField>

                    <FormField label="Category" required>
                        <select
                            name="assetCategoryId"
                            value={form.assetCategoryId}
                            onChange={handleChange}
                            required
                            disabled={loadingMasterData}
                            className={inputClass}
                        >
                            <option value="">
                                Select category
                            </option>

                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </FormField>
                </div>
            </div>

            {/* ORGANIZATION */}
            <div className="mt-5 rounded-xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
                    Organization & Location
                </h2>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <FormField label="Department">
                        <select
                            name="departmentId"
                            value={form.departmentId}
                            onChange={handleChange}
                            disabled={loadingMasterData}
                            className={inputClass}
                        >
                            <option value="">
                                No department
                            </option>

                            {departments.map((department) => (
                                <option
                                    key={department.id}
                                    value={department.id}
                                >
                                    {department.name}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    <FormField label="Location">
                        <select
                            name="locationId"
                            value={form.locationId}
                            onChange={handleChange}
                            disabled={loadingMasterData}
                            className={inputClass}
                        >
                            <option value="">
                                No location
                            </option>

                            {locations.map((location) => (
                                <option
                                    key={location.id}
                                    value={location.id}
                                >
                                    {location.name}
                                </option>
                            ))}
                        </select>
                    </FormField>
                </div>
            </div>

            {/* PURCHASE */}
            <div className="mt-5 rounded-xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
                    Purchase Information
                </h2>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <FormField label="Purchase Date">
                        <input
                            type="date"
                            name="purchaseDate"
                            value={form.purchaseDate}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </FormField>

                    <FormField label="Purchase Price">
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            name="purchasePrice"
                            value={form.purchasePrice}
                            onChange={handleChange}
                            placeholder="0"
                            className={inputClass}
                        />
                    </FormField>
                </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-5 rounded-xl bg-white p-6 shadow-sm">
                <FormField label="Description">
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Asset description..."
                        className={inputClass}
                    />
                </FormField>

                <label className="mt-6 flex cursor-pointer items-center gap-3">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={form.isActive}
                        onChange={handleChange}
                        className="h-4 w-4"
                    />

                    <span className="text-sm font-medium text-slate-700">
                        Active
                    </span>
                </label>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting}
                    className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={
                        submitting ||
                        loadingMasterData ||
                        Boolean(masterDataError)
                    }
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {submitting
                        ? 'Saving...'
                        : submitText}
                </button>
            </div>
        </form>
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
    'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100'

export default AssetForm