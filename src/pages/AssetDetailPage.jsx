import { useEffect, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'



import assetService from '../services/assetService'

import assignmentService from '../services/assignmentService'

import transferService from '../services/transferService'

import maintenanceService from '../services/maintenanceService'

import assetCostService from '../services/assetCostService'

import authService from '../services/authService'

function AssetDetailPage() {

    const { id } = useParams()

    const navigate = useNavigate()

    const currentUser = authService.getUser()
    const userRoles = Array.isArray(currentUser?.roles)
        ? currentUser.roles
        : []

    const isAdmin = userRoles.includes('Admin')
    const isAssetManager = userRoles.includes('AssetManager')
    const canManageAssets = isAdmin || isAssetManager
    const canViewCosts = isAdmin || isAssetManager



    const [asset, setAsset] = useState(null)



    const [assignments, setAssignments] = useState([])

    const [assignmentLoading, setAssignmentLoading] = useState(true)

    const [assignmentError, setAssignmentError] = useState('')



    const [transfers, setTransfers] = useState([])

    const [transferLoading, setTransferLoading] = useState(true)

    const [transferError, setTransferError] = useState('')



    const [maintenanceRequests, setMaintenanceRequests] = useState([])

    const [maintenanceLoading, setMaintenanceLoading] = useState(true)

    const [maintenanceError, setMaintenanceError] = useState('')



    const [costs, setCosts] = useState([])

    const [costSummary, setCostSummary] = useState(null)

    const [costLoading, setCostLoading] = useState(true)

    const [costError, setCostError] = useState('')



    const [loading, setLoading] = useState(true)

    const [error, setError] = useState('')

    const [deleteError, setDeleteError] = useState('')

    const [deleting, setDeleting] = useState(false)



    // =========================================================

    // LOAD ASSET

    // =========================================================

    useEffect(() => {

        const loadData = async () => {

            // =====================================================

            // LOAD MAIN ASSET

            // =====================================================

            try {

                setLoading(true)

                setError('')



                const assetData =

                    await assetService.getById(id)



                console.log(

                    'ASSET DETAIL:',

                    assetData

                )



                setAsset(assetData)

            } catch (err) {

                console.error(

                    'ASSET DETAIL ERROR:',

                    err

                )



                if (err.response?.status === 404) {

                    setError('Asset not found.')

                } else {

                    setError(

                        'Unable to load asset information.'

                    )

                }

            } finally {

                setLoading(false)

            }



            // =====================================================

            // LOAD ASSIGNMENT HISTORY

            // =====================================================

            try {

                setAssignmentLoading(true)

                setAssignmentError('')



                const assignmentData =

                    await assignmentService.getByAssetId(id)



                console.log(

                    'ASSIGNMENT HISTORY:',

                    assignmentData

                )



                setAssignments(

                    Array.isArray(assignmentData)

                        ? assignmentData

                        : []

                )

            } catch (err) {

                console.error(

                    'ASSIGNMENT HISTORY ERROR:',

                    err

                )



                setAssignments([])



                setAssignmentError(

                    'Unable to load assignment history.'

                )

            } finally {

                setAssignmentLoading(false)

            }

            // =====================================================

            // LOAD TRANSFER HISTORY

            // =====================================================

            try {

                setTransferLoading(true)

                setTransferError('')



                const transferData =

                    await transferService.getByAssetId(id)



                console.log(

                    'TRANSFER HISTORY:',

                    transferData

                )



                setTransfers(

                    Array.isArray(transferData)

                        ? transferData

                        : []

                )

            } catch (err) {

                console.error(

                    'TRANSFER HISTORY ERROR:',

                    err

                )



                setTransfers([])



                setTransferError(

                    'Unable to load transfer history.'

                )

            } finally {

                setTransferLoading(false)

            }

            // =====================================================

            // LOAD MAINTENANCE HISTORY

            // =====================================================

            try {

                setMaintenanceLoading(true)

                setMaintenanceError('')



                const maintenanceData =

                    await maintenanceService.getRequestsByAssetId(id)



                console.log(

                    'MAINTENANCE HISTORY:',

                    maintenanceData

                )



                setMaintenanceRequests(

                    Array.isArray(maintenanceData)

                        ? maintenanceData

                        : []

                )

            } catch (err) {

                console.error(

                    'MAINTENANCE HISTORY ERROR:',

                    err

                )



                setMaintenanceRequests([])



                setMaintenanceError(

                    'Unable to load maintenance history.'

                )

            } finally {

                setMaintenanceLoading(false)

            }
            // =====================================================
            // LOAD COST HISTORY
            // Admin / AssetManager only
            // =====================================================

            if (canViewCosts) {
                try {
                    setCostLoading(true)
                    setCostError('')

                    const [costData, summaryData] = await Promise.all([
                        assetCostService.getByAssetId(id),
                        assetCostService.getSummaryByAssetId(id),
                    ])

                    console.log('COST HISTORY:', costData)
                    console.log('COST SUMMARY:', summaryData)

                    setCosts(Array.isArray(costData) ? costData : [])
                    setCostSummary(summaryData)
                } catch (err) {
                    console.error('COST HISTORY ERROR:', err)

                    setCosts([])
                    setCostSummary(null)
                    setCostError('Unable to load cost history.')
                } finally {
                    setCostLoading(false)
                }
            } else {
                setCosts([])
                setCostSummary(null)
                setCostError('')
                setCostLoading(false)
            }

        }



        loadData()

    }, [id, canViewCosts])



    // =========================================================

    // DELETE ASSET

    // =========================================================

    const handleDelete = async () => {

        if (!asset) return



        const confirmed = window.confirm(

            `Are you sure you want to delete ${asset.assetCode} - ${asset.assetName}?`

        )



        if (!confirmed) return



        try {

            setDeleting(true)

            setDeleteError('')



            await assetService.remove(id)



            navigate('/assets')

        } catch (err) {

            console.error('DELETE ASSET ERROR:', err)



            const status = err.response?.status

            const message = err.response?.data?.message



            if (status === 403) {

                setDeleteError(

                    'Only administrators can delete assets.'

                )

            } else if (status === 404) {

                setDeleteError('Asset not found.')

            } else if (status === 409) {

                setDeleteError(

                    message ||

                    'This asset already has transaction/history data and cannot be deleted.'

                )

            } else {

                setDeleteError(

                    message || 'Unable to delete asset.'

                )

            }

        } finally {

            setDeleting(false)

        }

    }



    // =========================================================

    // FORMATTERS

    // =========================================================

    const formatCurrency = (value) => {

        if (value === null || value === undefined) {

            return '-'

        }



        return `${new Intl.NumberFormat('vi-VN').format(value)} VND`

    }



    const formatDate = (value) => {

        if (!value) return '-'



        const utcValue =

            value.endsWith('Z')

                ? value

                : `${value}Z`



        return new Date(utcValue).toLocaleString(

            'vi-VN'

        )

    }



    // =========================================================

    // STATUS STYLE

    // =========================================================

    const getStatusClass = (status) => {

        switch (status?.toLowerCase()) {

            case 'available':

                return 'bg-green-100 text-green-700'



            case 'inuse':

            case 'in use':

                return 'bg-blue-100 text-blue-700'



            case 'maintenance':

                return 'bg-amber-100 text-amber-700'



            case 'retired':

            case 'inactive':

                return 'bg-gray-200 text-gray-700'



            default:

                return 'bg-gray-100 text-gray-700'

        }

    }



    // =========================================================

    // LOADING

    // =========================================================

    if (loading) {

        return (

            <div className="text-sm text-gray-500">

                Loading asset information...

            </div>

        )

    }



    // =========================================================

    // ERROR

    // =========================================================

    if (error || !asset) {

        return (

            <div>

                <button

                    type="button"

                    onClick={() => navigate('/assets')}

                    className="mb-6 cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"

                >

                    ← Back to Assets

                </button>



                <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">

                    {error || 'Asset not found.'}

                </div>

            </div>

        )

    }



    // =========================================================

    // PAGE

    // =========================================================

    return (

        <div className="pb-10">



            {/* BACK */}

            <button

                type="button"

                onClick={() => navigate('/assets')}

                className="mb-6 cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"

            >

                ← Back to Assets

            </button>



            {/* =====================================================

          HEADER

      ===================================================== */}

            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">



                <div>

                    <div className="flex flex-wrap items-center gap-3">



                        <h1 className="text-3xl font-bold text-slate-900">

                            {asset.assetName}

                        </h1>



                        <span

                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(

                                asset.status

                            )}`}

                        >

                            {asset.status || 'Unknown'}

                        </span>



                    </div>



                    <p className="mt-2 text-gray-500">

                        {asset.assetCode}

                    </p>

                </div>



                {/* ACTIONS */}
                {canManageAssets && (
                    <div className="flex items-center gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(`/assets/${id}/edit`)
                            }
                            className="cursor-pointer rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-gray-50"
                        >
                            Edit Asset
                        </button>

                        {isAdmin && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="cursor-pointer rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {deleting
                                    ? 'Deleting...'
                                    : 'Delete Asset'}
                            </button>
                        )}

                    </div>
                )}
            </div>



            {/* DELETE ERROR */}

            {deleteError && (

                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">

                    {deleteError}

                </div>

            )}



            {/* =====================================================

          GENERAL + ORGANIZATION

      ===================================================== */}

            <div className="mt-8 grid gap-6 xl:grid-cols-2">



                {/* GENERAL */}

                <Section title="General Information">



                    <DetailRow

                        label="Asset Code"

                        value={asset.assetCode}

                    />



                    <DetailRow

                        label="Asset Name"

                        value={asset.assetName}

                    />



                    <DetailRow

                        label="Serial Number"

                        value={asset.serialNumber}

                    />



                    <DetailRow

                        label="Category"

                        value={asset.assetCategoryName}

                    />



                    <DetailRow

                        label="QR Code"

                        value={asset.qrCode}

                    />



                    <div className="flex items-center justify-between border-b border-gray-100 py-4 last:border-0">

                        <span className="text-sm text-gray-500">

                            Status

                        </span>



                        <span

                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(

                                asset.status

                            )}`}

                        >

                            {asset.status || '-'}

                        </span>

                    </div>



                    <DetailRow

                        label="Active"

                        value={asset.isActive ? 'Yes' : 'No'}

                    />



                </Section>



                {/* ORGANIZATION */}

                <Section title="Organization & Location">



                    <DetailRow

                        label="Department"

                        value={asset.departmentName}

                    />



                    <DetailRow

                        label="Location"

                        value={asset.locationName}

                    />



                    <DetailRow

                        label="Department ID"

                        value={asset.departmentId}

                    />



                    <DetailRow

                        label="Location ID"

                        value={asset.locationId}

                    />



                </Section>



            </div>



            {/* =====================================================

          PURCHASE + SYSTEM

      ===================================================== */}

            <div className="mt-6 grid gap-6 xl:grid-cols-2">



                {/* PURCHASE */}

                <Section title="Purchase Information">



                    <DetailRow

                        label="Purchase Date"

                        value={formatDate(asset.purchaseDate)}

                    />



                    <DetailRow

                        label="Purchase Price"

                        value={formatCurrency(

                            asset.purchasePrice

                        )}

                    />



                </Section>



                {/* SYSTEM */}

                <Section title="System Information">



                    <DetailRow

                        label="Asset ID"

                        value={asset.id}

                    />



                    <DetailRow

                        label="Created At"

                        value={formatDate(asset.createdAt)}

                    />



                    <DetailRow

                        label="Updated At"

                        value={formatDate(asset.updatedAt)}

                    />



                </Section>



            </div>



            {/* =====================================================

          DESCRIPTION

      ===================================================== */}

            <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">



                <h2 className="text-lg font-semibold text-slate-900">

                    Description

                </h2>



                <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">

                    {asset.description ||

                        'No description available.'}

                </div>



            </div>



            {/* =====================================================

          ASSET HISTORY PLACEHOLDER

      ===================================================== */}

            <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">



                <div>

                    <h2 className="text-lg font-semibold text-slate-900">

                        Asset History

                    </h2>



                    <p className="mt-1 text-sm text-gray-500">

                        {canViewCosts
                            ? 'Assignment, transfer, maintenance and cost history.'
                            : 'Assignment, transfer and maintenance history.'}

                    </p>

                </div>



                {/* ASSIGNMENT HISTORY */}

                <div className="mt-6">



                    <div className="flex items-center justify-between">



                        <div>

                            <h3 className="font-semibold text-slate-800">

                                Assignment History

                            </h3>



                            <p className="mt-1 text-sm text-gray-500">

                                Asset assignment and return records.

                            </p>

                        </div>



                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">

                            {assignments.length} records

                        </span>



                    </div>



                    {assignmentLoading ? (

                        <div className="mt-5 rounded-lg bg-slate-50 p-5 text-sm text-gray-500">

                            Loading assignment history...

                        </div>

                    ) : assignmentError ? (

                        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-600">

                            {assignmentError}

                        </div>

                    ) : assignments.length === 0 ? (

                        <div className="mt-5 rounded-lg bg-slate-50 p-8 text-center text-sm text-gray-500">

                            No assignment history found.

                        </div>

                    ) : (

                        <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">



                            <div className="overflow-x-auto">



                                <table className="w-full">



                                    <thead className="bg-slate-50">

                                        <tr>



                                            <HistoryHeader>

                                                Assigned To

                                            </HistoryHeader>



                                            <HistoryHeader>

                                                Assigned By

                                            </HistoryHeader>



                                            <HistoryHeader>

                                                Assigned At

                                            </HistoryHeader>



                                            <HistoryHeader>

                                                Returned At

                                            </HistoryHeader>



                                            <HistoryHeader>

                                                Status

                                            </HistoryHeader>



                                            <HistoryHeader align="right">

                                                Action

                                            </HistoryHeader>



                                        </tr>

                                    </thead>



                                    <tbody className="divide-y divide-gray-100">



                                        {assignments.map(

                                            (assignment) => {

                                                const active =

                                                    !assignment.returnedAt



                                                return (

                                                    <tr

                                                        key={assignment.id}

                                                        className="hover:bg-slate-50"

                                                    >



                                                        <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-800">

                                                            {assignment.assignedToUserName ||

                                                                '-'}

                                                        </td>



                                                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">

                                                            {assignment.assignedByUserName ||

                                                                '-'}

                                                        </td>



                                                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">

                                                            {formatDate(

                                                                assignment.assignedAt

                                                            )}

                                                        </td>



                                                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">

                                                            {formatDate(

                                                                assignment.returnedAt

                                                            )}

                                                        </td>



                                                        <td className="whitespace-nowrap px-5 py-4">



                                                            <span

                                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${active

                                                                    ? 'bg-green-100 text-green-700'

                                                                    : 'bg-gray-100 text-gray-600'

                                                                    }`}

                                                            >

                                                                {active

                                                                    ? 'Active'

                                                                    : 'Returned'}

                                                            </span>



                                                        </td>



                                                        <td className="whitespace-nowrap px-5 py-4 text-right">



                                                            <button

                                                                type="button"

                                                                onClick={() =>

                                                                    navigate(

                                                                        `/assignments/${assignment.id}`

                                                                    )

                                                                }

                                                                className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"

                                                            >

                                                                View

                                                            </button>



                                                        </td>



                                                    </tr>

                                                )

                                            }

                                        )}



                                    </tbody>



                                </table>



                            </div>



                        </div>

                    )}



                </div>



                {/* OTHER HISTORY MODULES */}

                <div className="mt-6 grid gap-4 md:grid-cols-3">



                    <div className="md:col-span-3">



                        <div className="rounded-xl border border-gray-200 p-5">



                            {/* HEADER */}

                            <div className="flex items-center justify-between">



                                <div>

                                    <h3 className="font-semibold text-slate-800">

                                        Transfer History

                                    </h3>



                                    <p className="mt-1 text-sm text-gray-500">

                                        Department and location transfer records.

                                    </p>

                                </div>



                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">

                                    {transfers.length} records

                                </span>



                            </div>



                            {/* LOADING */}

                            {transferLoading ? (

                                <div className="mt-5 rounded-lg bg-slate-50 p-5 text-sm text-gray-500">

                                    Loading transfer history...

                                </div>

                            ) : transferError ? (



                                /* ERROR */

                                <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-600">

                                    {transferError}

                                </div>



                            ) : transfers.length === 0 ? (



                                /* EMPTY */

                                <div className="mt-5 rounded-lg bg-slate-50 p-8 text-center text-sm text-gray-500">

                                    No transfer history found.

                                </div>



                            ) : (



                                /* TABLE */

                                <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">



                                    <div className="overflow-x-auto">



                                        <table className="w-full">



                                            <thead className="bg-slate-50">



                                                <tr>



                                                    <HistoryHeader>

                                                        Department

                                                    </HistoryHeader>



                                                    <HistoryHeader>

                                                        Location

                                                    </HistoryHeader>



                                                    <HistoryHeader>

                                                        Transferred By

                                                    </HistoryHeader>



                                                    <HistoryHeader>

                                                        Transferred At

                                                    </HistoryHeader>



                                                    <HistoryHeader align="right">

                                                        Action

                                                    </HistoryHeader>



                                                </tr>



                                            </thead>



                                            <tbody className="divide-y divide-gray-100">



                                                {transfers.map((transfer) => {



                                                    const departmentChanged =

                                                        transfer.fromDepartmentId !==

                                                        transfer.toDepartmentId



                                                    const locationChanged =

                                                        transfer.fromLocationId !==

                                                        transfer.toLocationId



                                                    return (

                                                        <tr

                                                            key={transfer.id}

                                                            className="hover:bg-slate-50"

                                                        >



                                                            {/* DEPARTMENT */}

                                                            <td className="px-5 py-4 text-sm">



                                                                <HistoryTransferValue

                                                                    from={

                                                                        transfer.fromDepartmentName

                                                                    }

                                                                    to={

                                                                        transfer.toDepartmentName

                                                                    }

                                                                    changed={

                                                                        departmentChanged

                                                                    }

                                                                />



                                                            </td>



                                                            {/* LOCATION */}

                                                            <td className="px-5 py-4 text-sm">



                                                                <HistoryTransferValue

                                                                    from={

                                                                        transfer.fromLocationName

                                                                    }

                                                                    to={

                                                                        transfer.toLocationName

                                                                    }

                                                                    changed={

                                                                        locationChanged

                                                                    }

                                                                />



                                                            </td>



                                                            {/* BY */}

                                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-700">

                                                                {transfer.transferredByUserName ||

                                                                    '-'}

                                                            </td>



                                                            {/* DATE */}

                                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">

                                                                {formatDate(

                                                                    transfer.transferredAt

                                                                )}

                                                            </td>



                                                            {/* VIEW */}

                                                            <td className="whitespace-nowrap px-5 py-4 text-right">



                                                                <button

                                                                    type="button"

                                                                    onClick={() =>

                                                                        navigate(

                                                                            `/transfers/${transfer.id}`

                                                                        )

                                                                    }

                                                                    className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"

                                                                >

                                                                    View

                                                                </button>



                                                            </td>



                                                        </tr>

                                                    )

                                                })}



                                            </tbody>



                                        </table>



                                    </div>



                                </div>

                            )}



                        </div>



                    </div>



                    <div className="md:col-span-3 rounded-xl border border-gray-200 bg-white">

                        {/* HEADER */}

                        <div className="border-b border-gray-200 px-6 py-4">

                            <h2 className="text-lg font-semibold text-gray-900">

                                Maintenance

                            </h2>



                            <p className="mt-1 text-sm text-gray-500">

                                Maintenance history

                            </p>

                        </div>



                        {/* CONTENT */}

                        <div className="overflow-x-auto">



                            {maintenanceLoading ? (

                                <div className="px-6 py-8 text-sm text-gray-500">

                                    Loading maintenance history...

                                </div>

                            ) : maintenanceError ? (

                                <div className="px-6 py-8 text-sm text-red-600">

                                    {maintenanceError}

                                </div>

                            ) : maintenanceRequests.length === 0 ? (

                                <div className="px-6 py-8 text-sm text-gray-500">

                                    No maintenance history for this asset.

                                </div>

                            ) : (

                                <table className="w-full">



                                    <thead className="bg-gray-50">

                                        <tr>

                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">

                                                Request

                                            </th>



                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">

                                                Type

                                            </th>



                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">

                                                Priority

                                            </th>



                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">

                                                Status

                                            </th>



                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">

                                                Plan

                                            </th>



                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">

                                                Requested By

                                            </th>



                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">

                                                Requested At

                                            </th>



                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">

                                                Completed At

                                            </th>



                                            <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500">

                                                Action

                                            </th>

                                        </tr>

                                    </thead>



                                    <tbody className="divide-y divide-gray-200">



                                        {maintenanceRequests.map((item) => (

                                            <tr

                                                key={item.id}

                                                className="hover:bg-gray-50"

                                            >



                                                {/* REQUEST */}

                                                <td className="px-6 py-4">

                                                    <div className="font-medium text-gray-900">

                                                        {item.title}

                                                    </div>



                                                    <div className="mt-1 text-xs text-gray-500">

                                                        Request #{item.id}

                                                    </div>

                                                </td>



                                                {/* TYPE */}

                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">

                                                    {item.requestType || '-'}

                                                </td>



                                                {/* PRIORITY */}

                                                <td className="whitespace-nowrap px-6 py-4">

                                                    <span className="text-sm text-gray-700">

                                                        {item.priority || '-'}

                                                    </span>

                                                </td>



                                                {/* STATUS */}

                                                <td className="whitespace-nowrap px-6 py-4">

                                                    <span className="text-sm font-medium text-gray-700">

                                                        {item.status || '-'}

                                                    </span>

                                                </td>



                                                {/* MAINTENANCE PLAN */}

                                                <td className="px-6 py-4 text-sm text-gray-700">

                                                    {item.maintenancePlanName ? (

                                                        <>

                                                            <div>

                                                                {item.maintenancePlanName}

                                                            </div>



                                                            <div className="mt-1 text-xs text-gray-500">

                                                                Plan #{item.maintenancePlanId}

                                                            </div>

                                                        </>

                                                    ) : (

                                                        <span className="text-gray-500">

                                                            Manual Request

                                                        </span>

                                                    )}

                                                </td>



                                                {/* REQUESTED BY */}

                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">

                                                    {item.requestedByUserName || '-'}

                                                </td>



                                                {/* REQUESTED AT */}

                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">

                                                    {item.requestedAt

                                                        ? formatDate(item.requestedAt)

                                                        : '-'}

                                                </td>



                                                {/* COMPLETED AT */}

                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">

                                                    {item.completedAt

                                                        ? formatDate(item.completedAt)

                                                        : '-'}

                                                </td>



                                                {/* VIEW */}

                                                <td className="whitespace-nowrap px-6 py-4 text-right">

                                                    <button

                                                        type="button"

                                                        onClick={() =>

                                                            navigate(

                                                                `/maintenance/requests/${item.id}`

                                                            )

                                                        }

                                                        className="font-medium text-blue-600 hover:text-blue-800"

                                                    >

                                                        View

                                                    </button>

                                                </td>



                                            </tr>

                                        ))}



                                    </tbody>



                                </table>

                            )}



                        </div>

                    </div>



                    {canViewCosts && (
                        <div className="md:col-span-3">

                            <div className="rounded-xl border border-gray-200 bg-white p-5">



                                {/* HEADER */}

                                <div className="flex items-center justify-between">

                                    <div>

                                        <h3 className="font-semibold text-slate-800">

                                            Cost History

                                        </h3>



                                        <p className="mt-1 text-sm text-gray-500">

                                            Purchase price and additional asset costs.

                                        </p>

                                    </div>



                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">

                                        {costs.length} records

                                    </span>

                                </div>



                                {costLoading ? (

                                    <div className="mt-5 rounded-lg bg-slate-50 p-5 text-sm text-gray-500">

                                        Loading cost history...

                                    </div>

                                ) : costError ? (

                                    <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-600">

                                        {costError}

                                    </div>

                                ) : (

                                    <>

                                        {/* SUMMARY */}

                                        {costSummary && (

                                            <div className="mt-5 grid gap-4 md:grid-cols-4">



                                                <div className="rounded-xl bg-slate-50 p-4">

                                                    <p className="text-xs font-medium uppercase text-gray-500">

                                                        Purchase Price

                                                    </p>



                                                    <p className="mt-2 text-lg font-semibold text-slate-900">

                                                        {formatMoney(costSummary.purchasePrice)}

                                                    </p>

                                                </div>



                                                <div className="rounded-xl bg-slate-50 p-4">

                                                    <p className="text-xs font-medium uppercase text-gray-500">

                                                        Additional Cost

                                                    </p>



                                                    <p className="mt-2 text-lg font-semibold text-slate-900">

                                                        {formatMoney(costSummary.additionalCost)}

                                                    </p>

                                                </div>



                                                <div className="rounded-xl bg-slate-50 p-4">

                                                    <p className="text-xs font-medium uppercase text-gray-500">

                                                        Total Cost

                                                    </p>



                                                    <p className="mt-2 text-lg font-semibold text-slate-900">

                                                        {formatMoney(costSummary.totalCost)}

                                                    </p>

                                                </div>



                                                <div className="rounded-xl bg-slate-50 p-4">

                                                    <p className="text-xs font-medium uppercase text-gray-500">

                                                        Cost Records

                                                    </p>



                                                    <p className="mt-2 text-lg font-semibold text-slate-900">

                                                        {costSummary.numberOfCostRecords ?? 0}

                                                    </p>

                                                </div>



                                            </div>

                                        )}



                                        {/* EMPTY */}

                                        {costs.length === 0 ? (

                                            <div className="mt-5 rounded-lg bg-slate-50 p-8 text-center text-sm text-gray-500">

                                                No additional costs found.

                                            </div>

                                        ) : (

                                            /* TABLE */

                                            <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">



                                                <div className="overflow-x-auto">



                                                    <table className="w-full">



                                                        <thead className="bg-slate-50">

                                                            <tr>

                                                                <HistoryHeader>

                                                                    Type

                                                                </HistoryHeader>



                                                                <HistoryHeader>

                                                                    Amount

                                                                </HistoryHeader>



                                                                <HistoryHeader>

                                                                    Date

                                                                </HistoryHeader>



                                                                <HistoryHeader>

                                                                    Vendor

                                                                </HistoryHeader>



                                                                <HistoryHeader>

                                                                    Maintenance

                                                                </HistoryHeader>



                                                                <HistoryHeader>

                                                                    Description

                                                                </HistoryHeader>

                                                            </tr>

                                                        </thead>



                                                        <tbody className="divide-y divide-gray-100">



                                                            {costs.map((cost) => (

                                                                <tr

                                                                    key={cost.id}

                                                                    className="hover:bg-slate-50"

                                                                >

                                                                    {/* TYPE */}

                                                                    <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-800">

                                                                        {cost.costType || '-'}

                                                                    </td>



                                                                    {/* AMOUNT */}

                                                                    <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-900">

                                                                        {formatMoney(cost.amount)}

                                                                    </td>



                                                                    {/* DATE */}

                                                                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">

                                                                        {formatDateOnly(cost.costDate)}

                                                                    </td>



                                                                    {/* VENDOR */}

                                                                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-700">

                                                                        {cost.vendorName || '-'}

                                                                    </td>



                                                                    {/* MAINTENANCE */}

                                                                    <td className="whitespace-nowrap px-5 py-4 text-sm">

                                                                        {cost.maintenanceRequestId ? (

                                                                            <button

                                                                                type="button"

                                                                                onClick={() =>

                                                                                    navigate(

                                                                                        `/maintenance/requests/${cost.maintenanceRequestId}`

                                                                                    )

                                                                                }

                                                                                className="cursor-pointer font-medium text-blue-600 hover:text-blue-800"

                                                                            >

                                                                                Request #{cost.maintenanceRequestId}

                                                                            </button>

                                                                        ) : (

                                                                            <span className="text-gray-400">

                                                                                -

                                                                            </span>

                                                                        )}

                                                                    </td>



                                                                    {/* DESCRIPTION */}

                                                                    <td className="px-5 py-4 text-sm text-slate-600">

                                                                        {cost.description || '-'}

                                                                    </td>

                                                                </tr>

                                                            ))}



                                                        </tbody>



                                                    </table>



                                                </div>



                                            </div>

                                        )}

                                    </>

                                )}



                            </div>

                        </div>
                    )}



                </div>



            </div>



        </div>

    )

}



// =========================================================

// SECTION COMPONENT

// =========================================================

function Section({ title, children }) {

    return (

        <div className="rounded-xl bg-white p-6 shadow-sm">



            <h2 className="border-b border-gray-100 pb-4 text-lg font-semibold text-slate-900">

                {title}

            </h2>



            <div>

                {children}

            </div>



        </div>

    )

}



// =========================================================

// DETAIL ROW

// =========================================================

function DetailRow({ label, value }) {

    const displayValue =

        value === null ||

            value === undefined ||

            value === ''

            ? '-'

            : value



    return (

        <div className="flex items-center justify-between gap-6 border-b border-gray-100 py-4 last:border-0">



            <span className="text-sm text-gray-500">

                {label}

            </span>



            <span className="text-right text-sm font-medium text-slate-800">

                {displayValue}

            </span>



        </div>

    )

}

function HistoryHeader({

    children,

    align = 'left',

}) {

    const alignment =

        align === 'right'

            ? 'text-right'

            : 'text-left'



    return (

        <th

            className={`whitespace-nowrap px-5 py-3 ${alignment} text-xs font-semibold uppercase tracking-wide text-gray-500`}

        >

            {children}

        </th>

    )

}

function HistoryTransferValue({

    from,

    to,

    changed,

}) {

    const fromValue =

        from || 'Not assigned'



    const toValue =

        to || 'Not assigned'



    if (!changed) {

        return (

            <div className="flex items-center gap-2">



                <span className="text-slate-600">

                    {toValue}

                </span>



                <span className="text-xs text-gray-400">

                    Unchanged

                </span>



            </div>

        )

    }



    return (

        <div className="flex min-w-[180px] items-center gap-2">



            <span className="text-gray-500">

                {fromValue}

            </span>



            <span className="text-gray-400">

                →

            </span>



            <span className="font-medium text-slate-800">

                {toValue}

            </span>



        </div>

    )

}



function formatMoney(value) {

    if (value === null || value === undefined) {

        return '-'

    }



    return new Intl.NumberFormat('vi-VN', {

        style: 'currency',

        currency: 'VND',

    }).format(value)

}

function formatDateOnly(value) {

    if (!value) return '-'



    return new Date(value).toLocaleDateString('vi-VN')

}

// =========================================================

// HISTORY CARD

// =========================================================

function HistoryCard({

    title,

    description,

}) {

    return (

        <div className="rounded-xl border border-gray-200 bg-slate-50 p-5">



            <h3 className="font-semibold text-slate-800">

                {title}

            </h3>



            <p className="mt-2 text-sm leading-5 text-gray-500">

                {description}

            </p>



            <div className="mt-4 text-xs font-medium text-gray-400">

                No data loaded yet

            </div>



        </div>

    )

}



export default AssetDetailPage