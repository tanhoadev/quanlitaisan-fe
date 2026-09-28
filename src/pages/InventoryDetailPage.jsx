import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import inventoryService from '../services/inventoryService'
import assetService from '../services/assetService'
import locationService from '../services/locationService'

function InventoryDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [campaign, setCampaign] = useState(null)
    const [items, setItems] = useState([])
    const [assets, setAssets] = useState([])
    const [starting, setStarting] = useState(false)
    const [actionError, setActionError] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [locations, setLocations] = useState([])
    const [completing, setCompleting] = useState(false)
    const [completeError, setCompleteError] = useState('')

    const [scanForm, setScanForm] = useState({
        qrCode: '',
        actualLocationId: '',
        note: '',
    })

    const [scanning, setScanning] = useState(false)
    const [scanError, setScanError] = useState('')
    const [scanSuccess, setScanSuccess] = useState('')
    const [showAddAssets, setShowAddAssets] =
        useState(false)

    const [selectedAssetIds, setSelectedAssetIds] =
        useState([])

    const [assetSearch, setAssetSearch] =
        useState('')

    const [adding, setAdding] =
        useState(false)

    const [addError, setAddError] =
        useState('')

    // =========================================================
    // LOAD CAMPAIGN
    // =========================================================
    const loadCampaign = async () => {
        const data =
            await inventoryService.getCampaignById(id)

        setCampaign(data)
    }

    // =========================================================
    // LOAD ITEMS
    // =========================================================
    const loadItems = async () => {
        const data =
            await inventoryService.getItems(id)

        setItems(
            Array.isArray(data)
                ? data
                : []
        )
    }

    // =========================================================
    // INITIAL LOAD
    // =========================================================
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                setError('')

                const [
                    campaignData,
                    itemData,
                    assetData,
                    locationData,
                ] = await Promise.all([
                    inventoryService.getCampaignById(id),
                    inventoryService.getItems(id),
                    assetService.getAll(),
                    locationService.getAll(),
                ])

                console.log('LOCATIONS:', locationData)

                setCampaign(campaignData)

                setItems(
                    Array.isArray(itemData)
                        ? itemData
                        : []
                )

                setAssets(
                    Array.isArray(assetData)
                        ? assetData
                        : []
                )

                setLocations(
                    Array.isArray(locationData)
                        ? locationData
                        : []
                )

                setAssets(
                    Array.isArray(assetData)
                        ? assetData
                        : []
                )
            } catch (err) {
                console.error(
                    'INVENTORY DETAIL ERROR:',
                    err
                )

                if (err.response?.status === 404) {
                    setError(
                        'Inventory campaign not found.'
                    )
                } else {
                    setError(
                        'Unable to load inventory campaign.'
                    )
                }
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [id])

    // =========================================================
    // AVAILABLE ASSETS
    // =========================================================
    const availableAssets = useMemo(() => {
        const existingIds =
            new Set(
                items.map(
                    (item) => Number(item.assetId)
                )
            )

        const keyword =
            assetSearch.trim().toLowerCase()

        return assets.filter((asset) => {
            if (!asset.isActive) {
                return false
            }

            if (
                existingIds.has(
                    Number(asset.id)
                )
            ) {
                return false
            }

            if (!keyword) {
                return true
            }

            return (
                asset.assetCode
                    ?.toLowerCase()
                    .includes(keyword) ||
                asset.assetName
                    ?.toLowerCase()
                    .includes(keyword) ||
                asset.qrCode
                    ?.toLowerCase()
                    .includes(keyword)
            )
        })
    }, [
        assets,
        items,
        assetSearch,
    ])

    // =========================================================
    // SELECT ASSET
    // =========================================================
    const toggleAsset = (assetId) => {
        setSelectedAssetIds(
            (current) => {
                if (
                    current.includes(assetId)
                ) {
                    return current.filter(
                        (id) =>
                            id !== assetId
                    )
                }

                return [
                    ...current,
                    assetId,
                ]
            }
        )
    }

    // =========================================================
    // ADD ASSETS
    // =========================================================
    const handleAddAssets = async () => {
        if (
            selectedAssetIds.length === 0
        ) {
            setAddError(
                'Select at least one asset.'
            )
            return
        }

        try {
            setAdding(true)
            setAddError('')

            await inventoryService.addAssets(
                id,
                {
                    assetIds:
                        selectedAssetIds,
                }
            )

            await Promise.all([
                loadCampaign(),
                loadItems(),
            ])

            setSelectedAssetIds([])
            setAssetSearch('')
            setShowAddAssets(false)
        } catch (err) {
            console.error(
                'ADD INVENTORY ASSETS ERROR:',
                err
            )

            setAddError(
                err.response?.data?.message ||
                'Unable to add assets.'
            )
        } finally {
            setAdding(false)
        }
    }

    // =========================================================
    // FORMAT
    // =========================================================
    const formatDate = (value) => {
        if (!value) return '-'

        const utcValue =
            value.endsWith('Z')
                ? value
                : `${value}Z`

        return new Date(
            utcValue
        ).toLocaleDateString(
            'vi-VN'
        )
    }

    if (loading) {
        return (
            <div className="text-sm text-gray-500">
                Loading inventory campaign...
            </div>
        )
    }

    if (error || !campaign) {
        return (
            <div>
                <button
                    onClick={() =>
                        navigate('/inventory')
                    }
                    className="mb-5 cursor-pointer text-sm font-medium text-blue-600"
                >
                    ← Back to Inventory
                </button>

                <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-600">
                    {error}
                </div>
            </div>
        )
    }
    const handleStartCampaign = async () => {
        const confirmed = window.confirm(
            'Start this inventory campaign? Assets can no longer be added after the campaign starts.'
        )

        if (!confirmed) return

        try {
            setStarting(true)
            setActionError('')

            await inventoryService.startCampaign(id)

            await Promise.all([
                loadCampaign(),
                loadItems(),
            ])
        } catch (err) {
            console.error(
                'START CAMPAIGN ERROR:',
                err
            )

            setActionError(
                err.response?.data?.message ||
                'Unable to start inventory campaign.'
            )
        } finally {
            setStarting(false)
        }
    }
    const handleScan = async (event) => {
        event.preventDefault()

        if (!scanForm.qrCode.trim()) {
            setScanError('QR code is required.')
            return
        }

        if (!scanForm.actualLocationId) {
            setScanError('Actual location is required.')
            return
        }

        try {
            setScanning(true)
            setScanError('')
            setScanSuccess('')

            const result =
                await inventoryService.scanAsset(
                    id,
                    {
                        qrCode:
                            scanForm.qrCode.trim(),

                        actualLocationId:
                            Number(
                                scanForm.actualLocationId
                            ),

                        note:
                            scanForm.note.trim() ||
                            null,
                    }
                )

            setScanSuccess(
                `Asset ${result.assetCode} checked successfully: ${result.resultStatus}`
            )

            setScanForm({
                qrCode: '',
                actualLocationId: '',
                note: '',
            })

            await Promise.all([
                loadCampaign(),
                loadItems(),
            ])
        } catch (err) {
            console.error(
                'SCAN INVENTORY ERROR:',
                err
            )

            setScanError(
                err.response?.data?.message ||
                'Unable to check asset.'
            )
        } finally {
            setScanning(false)
        }
    }

    const handleCompleteCampaign = async () => {
        const confirmed = window.confirm(
            'Complete this inventory campaign? Any remaining pending assets will be marked as Missing.'
        )

        if (!confirmed) return

        try {
            setCompleting(true)
            setCompleteError('')

            await inventoryService.completeCampaign(id)

            await Promise.all([
                loadCampaign(),
                loadItems(),
            ])

            setScanSuccess('')
        } catch (err) {
            console.error(
                'COMPLETE CAMPAIGN ERROR:',
                err
            )

            setCompleteError(
                err.response?.data?.message ||
                'Unable to complete inventory campaign.'
            )
        } finally {
            setCompleting(false)
        }
    }

    const isDraft =
        campaign.status === 'Draft'

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
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                {/* LEFT */}
                <div>
                    <div className="flex items-center gap-3">

                        <h1 className="text-3xl font-bold text-slate-900">
                            {campaign.name}
                        </h1>

                        <StatusBadge
                            status={campaign.status}
                        />

                    </div>

                    <p className="mt-2 text-gray-500">
                        {campaign.code}
                    </p>
                </div>


                {/* RIGHT - ACTION BUTTONS */}
                <div className="flex gap-3">

                    {/* DRAFT */}
                    {isDraft && (
                        <>
                            <button
                                type="button"
                                onClick={() => {
                                    setAddError('')
                                    setShowAddAssets(true)
                                }}
                                className="cursor-pointer rounded-lg border border-blue-600 bg-white px-5 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                            >
                                + Add Assets
                            </button>

                            <button
                                type="button"
                                onClick={handleStartCampaign}
                                disabled={
                                    starting ||
                                    items.length === 0
                                }
                                className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {starting
                                    ? 'Starting...'
                                    : 'Start Campaign'}
                            </button>
                        </>
                    )}


                    {/* IN PROGRESS */}
                    {campaign.status === 'InProgress' && (
                        <button
                            type="button"
                            onClick={handleCompleteCampaign}
                            disabled={completing}
                            className="cursor-pointer rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {completing
                                ? 'Completing...'
                                : 'Complete Campaign'}
                        </button>
                    )}

                </div>

            </div>

            {/* SUMMARY */}
            <div className="mt-8 grid gap-4 md:grid-cols-4">

                <SummaryCard
                    label="Total Assets"
                    value={
                        campaign.totalItems ?? 0
                    }
                />

                <SummaryCard
                    label="Pending"
                    value={
                        campaign.pendingItems ?? 0
                    }
                />

                <SummaryCard
                    label="Checked"
                    value={
                        campaign.checkedItems ?? 0
                    }
                />

                <SummaryCard
                    label="Progress"
                    value={
                        campaign.totalItems
                            ? `${Math.round(
                                (
                                    campaign.checkedItems /
                                    campaign.totalItems
                                ) * 100
                            )}%`
                            : '0%'
                    }
                />

            </div>

            {/* CAMPAIGN INFO */}
            <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

                <h2 className="text-lg font-semibold text-slate-900">
                    Campaign Information
                </h2>

                <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

                    <Info
                        label="Start Date"
                        value={formatDate(
                            campaign.startDate
                        )}
                    />

                    <Info
                        label="End Date"
                        value={formatDate(
                            campaign.endDate
                        )}
                    />

                    <Info
                        label="Created By"
                        value={
                            campaign.createdByUserName ||
                            '-'
                        }
                    />

                    <Info
                        label="Created At"
                        value={formatDate(
                            campaign.createdAt
                        )}
                    />

                </div>

                {campaign.description && (
                    <div className="mt-6 border-t border-gray-100 pt-5">

                        <Info
                            label="Description"
                            value={
                                campaign.description
                            }
                        />

                    </div>
                )}

            </div>
            {/* INVENTORY CHECK */}
            {campaign.status === 'InProgress' && (
                <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Inventory Check
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Scan an asset QR code and confirm its actual location.
                        </p>
                    </div>

                    {scanError && (
                        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                            {scanError}
                        </div>
                    )}

                    {scanSuccess && (
                        <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                            {scanSuccess}
                        </div>
                    )}

                    <form
                        onSubmit={handleScan}
                        className="mt-6"
                    >

                        <div className="grid gap-6 md:grid-cols-2">

                            {/* QR */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    QR Code
                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    value={scanForm.qrCode}
                                    onChange={(event) => {
                                        setScanForm(
                                            (current) => ({
                                                ...current,
                                                qrCode:
                                                    event.target.value,
                                            })
                                        )

                                        setScanError('')
                                        setScanSuccess('')
                                    }}
                                    placeholder="Scan or enter QR code"
                                    autoFocus
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* LOCATION */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Actual Location
                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </label>

                                <select
                                    value={
                                        scanForm.actualLocationId
                                    }
                                    onChange={(event) => {
                                        setScanForm(
                                            (current) => ({
                                                ...current,
                                                actualLocationId:
                                                    event.target.value,
                                            })
                                        )

                                        setScanError('')
                                        setScanSuccess('')
                                    }}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="">
                                        Select actual location
                                    </option>

                                    {locations
                                        .filter(
                                            (location) =>
                                                location.isActive !==
                                                false
                                        )
                                        .map(
                                            (location) => (
                                                <option
                                                    key={location.id}
                                                    value={location.id}
                                                >
                                                    {location.name}
                                                </option>
                                            )
                                        )}

                                </select>
                            </div>

                        </div>

                        {/* NOTE */}
                        <div className="mt-6">

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Note
                            </label>

                            <textarea
                                value={scanForm.note}
                                onChange={(event) =>
                                    setScanForm(
                                        (current) => ({
                                            ...current,
                                            note:
                                                event.target.value,
                                        })
                                    )
                                }
                                rows="3"
                                placeholder="Optional inventory note..."
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>

                        <div className="mt-6 flex justify-end">

                            <button
                                type="submit"
                                disabled={scanning}
                                className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {scanning
                                    ? 'Checking...'
                                    : 'Check Asset'}
                            </button>

                        </div>

                    </form>

                </div>
            )}
            {/* ITEMS */}
            <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">

                <div className="flex items-center justify-between border-b border-gray-100 p-6">

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Campaign Assets
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Assets included in this inventory campaign.
                        </p>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {items.length} assets
                    </span>

                </div>

                {items.length === 0 ? (

                    <div className="p-12 text-center">

                        <div className="text-sm text-gray-500">
                            No assets have been added to this campaign.
                        </div>

                        {isDraft && (
                            <button
                                type="button"
                                onClick={() =>
                                    setShowAddAssets(true)
                                }
                                className="mt-4 cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-800"
                            >
                                Add your first assets
                            </button>
                        )}

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-slate-50">
                                <tr>
                                    <Header>Asset</Header>
                                    <Header>Expected Department</Header>
                                    <Header>Expected Location</Header>
                                    <Header>Actual Location</Header>
                                    <Header>Status</Header>
                                    <Header>Result</Header>
                                    <Header>Checked By</Header>
                                    <Header>Checked At</Header>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {items.map(
                                    (item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50"
                                        >
                                            {/* ASSET */}
                                            <td className="px-6 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(`/assets/${item.assetId}`)
                                                    }
                                                    className="cursor-pointer text-left"
                                                >
                                                    <div className="font-medium text-blue-600 hover:text-blue-800">
                                                        {item.assetCode}
                                                    </div>

                                                    <div className="mt-1 text-xs text-gray-500">
                                                        {item.assetName}
                                                    </div>

                                                    {item.qrCode && (
                                                        <div className="mt-1 text-xs text-gray-400">
                                                            {item.qrCode}
                                                        </div>
                                                    )}
                                                </button>
                                            </td>

                                            {/* EXPECTED DEPARTMENT */}
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                                                {item.expectedDepartmentName || '-'}
                                            </td>

                                            {/* EXPECTED LOCATION */}
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                                                {item.expectedLocationName || '-'}
                                            </td>

                                            {/* ACTUAL LOCATION */}
                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                {item.actualLocationName ? (
                                                    <span
                                                        className={
                                                            item.actualLocationId ===
                                                                item.expectedLocationId
                                                                ? 'text-green-700'
                                                                : 'font-medium text-orange-600'
                                                        }
                                                    >
                                                        {item.actualLocationName}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">
                                                        -
                                                    </span>
                                                )}
                                            </td>

                                            {/* STATUS */}
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <ItemStatus status={item.status} />
                                            </td>

                                            {/* RESULT */}
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <ResultBadge
                                                    status={item.resultStatus}
                                                />
                                            </td>

                                            {/* CHECKED BY */}
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                                                {item.checkedByUserName || '-'}
                                            </td>

                                            {/* CHECKED AT */}
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                {item.checkedAt
                                                    ? formatDateTime(item.checkedAt)
                                                    : '-'}
                                            </td>
                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

            {/* ADD ASSET MODAL */}
            {showAddAssets && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

                    <div className="max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">

                        <div className="flex items-center justify-between border-b border-gray-100 p-6">

                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">
                                    Add Assets
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Select assets for this inventory campaign.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowAddAssets(false)
                                }
                                className="cursor-pointer text-2xl text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>

                        </div>

                        <div className="p-6">

                            <input
                                type="text"
                                value={assetSearch}
                                onChange={(event) =>
                                    setAssetSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search asset code, name or QR code..."
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                            {addError && (
                                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                                    {addError}
                                </div>
                            )}

                            <div className="mt-4 max-h-[400px] overflow-y-auto rounded-lg border border-gray-200">

                                {availableAssets.length === 0 ? (

                                    <div className="p-8 text-center text-sm text-gray-500">
                                        No available assets found.
                                    </div>

                                ) : (

                                    availableAssets.map(
                                        (asset) => {
                                            const selected =
                                                selectedAssetIds.includes(
                                                    asset.id
                                                )

                                            return (
                                                <label
                                                    key={asset.id}
                                                    className="flex cursor-pointer items-center gap-4 border-b border-gray-100 p-4 last:border-b-0 hover:bg-slate-50"
                                                >

                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            selected
                                                        }
                                                        onChange={() =>
                                                            toggleAsset(
                                                                asset.id
                                                            )
                                                        }
                                                        className="h-4 w-4"
                                                    />

                                                    <div className="min-w-0 flex-1">

                                                        <div className="font-medium text-slate-800">
                                                            {asset.assetCode}
                                                        </div>

                                                        <div className="mt-1 text-sm text-gray-500">
                                                            {asset.assetName}
                                                        </div>

                                                    </div>

                                                    <div className="text-xs text-gray-400">
                                                        {asset.qrCode ||
                                                            'No QR'}
                                                    </div>

                                                </label>
                                            )
                                        }
                                    )
                                )}

                            </div>

                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 p-6">

                            <span className="text-sm text-gray-500">
                                {selectedAssetIds.length}{' '}
                                selected
                            </span>

                            <div className="flex gap-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowAddAssets(false)
                                    }
                                    disabled={adding}
                                    className="cursor-pointer rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleAddAssets
                                    }
                                    disabled={
                                        adding ||
                                        selectedAssetIds.length ===
                                        0
                                    }
                                    className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {adding
                                        ? 'Adding...'
                                        : `Add ${selectedAssetIds.length} Assets`}
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            )}

        </div>
    )
}

function SummaryCard({
    label,
    value,
}) {
    return (
        <div className="rounded-xl bg-white p-5 shadow-sm">

            <div className="text-sm text-gray-500">
                {label}
            </div>

            <div className="mt-2 text-2xl font-bold text-slate-900">
                {value}
            </div>

        </div>
    )
}

function Info({
    label,
    value,
}) {
    return (
        <div>

            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {label}
            </div>

            <div className="mt-2 text-sm text-slate-800">
                {value || '-'}
            </div>

        </div>
    )
}

function StatusBadge({
    status,
}) {
    let style =
        'bg-gray-100 text-gray-700'

    if (status === 'InProgress') {
        style =
            'bg-blue-100 text-blue-700'
    }

    if (status === 'Completed') {
        style =
            'bg-green-100 text-green-700'
    }

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${style}`}
        >
            {status}
        </span>
    )
}
const formatDateTime = (value) => {
    if (!value) return '-'

    const utcValue =
        value.endsWith('Z')
            ? value
            : `${value}Z`

    return new Date(
        utcValue
    ).toLocaleString('vi-VN')
}

function ItemStatus({
    status,
}) {
    const style =
        status === 'Checked'
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${style}`}
        >
            {status}
        </span>
    )
}
function ResultBadge({ status }) {
    if (!status) {
        return (
            <span className="text-sm text-gray-400">
                -
            </span>
        )
    }

    let style =
        'bg-gray-100 text-gray-700'

    if (status === 'Found') {
        style =
            'bg-green-100 text-green-700'
    } else if (
        status === 'LocationMismatch'
    ) {
        style =
            'bg-orange-100 text-orange-700'
    } else if (status === 'Missing') {
        style =
            'bg-red-100 text-red-700'
    }

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${style}`}
        >
            {status}
        </span>
    )
}

function Header({
    children,
}) {
    return (
        <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            {children}
        </th>
    )
}

export default InventoryDetailPage