import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import transferService from '../services/transferService'

function TransfersPage() {
    const navigate = useNavigate()

    const [transfers, setTransfers] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadTransfers = async () => {
            try {
                setLoading(true)
                setError('')

                const data =
                    await transferService.getAll()

                console.log(
                    'TRANSFERS:',
                    data
                )

                setTransfers(
                    Array.isArray(data)
                        ? data
                        : []
                )
            } catch (err) {
                console.error(
                    'TRANSFERS ERROR:',
                    err
                )

                setError(
                    'Unable to load transfer history.'
                )
            } finally {
                setLoading(false)
            }
        }

        loadTransfers()
    }, [])

    // =========================================================
    // SEARCH
    // =========================================================
    const filteredTransfers =
        transfers.filter((transfer) => {
            const keyword =
                search.toLowerCase().trim()

            if (!keyword) return true

            return (
                transfer.assetCode
                    ?.toLowerCase()
                    .includes(keyword) ||

                transfer.assetName
                    ?.toLowerCase()
                    .includes(keyword) ||

                transfer.fromDepartmentName
                    ?.toLowerCase()
                    .includes(keyword) ||

                transfer.toDepartmentName
                    ?.toLowerCase()
                    .includes(keyword) ||

                transfer.fromLocationName
                    ?.toLowerCase()
                    .includes(keyword) ||

                transfer.toLocationName
                    ?.toLowerCase()
                    .includes(keyword) ||

                transfer.transferredByUserName
                    ?.toLowerCase()
                    .includes(keyword)
            )
        })

    // =========================================================
    // UTC -> LOCAL
    // =========================================================
    const formatDate = (value) => {
        if (!value) return '-'

        const utcValue =
            value.endsWith('Z')
                ? value
                : `${value}Z`

        return new Date(
            utcValue
        ).toLocaleString('vi-VN')
    }

    if (loading) {
        return (
            <div className="text-sm text-gray-500">
                Loading transfers...
            </div>
        )
    }

    return (
        <div>

            {/* HEADER */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Transfers
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage asset department and
                        location transfers.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate('/transfers/create')
                    }
                    className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    + Transfer Asset
                </button>

            </div>

            {/* ERROR */}
            {error && (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* SEARCH */}
            <div className="mt-8 rounded-xl bg-white p-5 shadow-sm">

                <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                    placeholder="Search asset, department, location or user..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

            </div>

            {/* TABLE */}
            <div className="mt-5 overflow-hidden rounded-xl bg-white shadow-sm">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-slate-50">
                            <tr>

                                <TableHeader>
                                    Asset
                                </TableHeader>

                                <TableHeader>
                                    Department
                                </TableHeader>

                                <TableHeader>
                                    Location
                                </TableHeader>

                                <TableHeader>
                                    Transferred By
                                </TableHeader>

                                <TableHeader>
                                    Transferred At
                                </TableHeader>

                                <TableHeader align="right">
                                    Actions
                                </TableHeader>

                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            {filteredTransfers.map(
                                (transfer) => (
                                    <tr
                                        key={transfer.id}
                                        className="hover:bg-slate-50"
                                    >

                                        {/* ASSET */}
                                        <td className="whitespace-nowrap px-6 py-4">

                                            <div className="font-medium text-slate-900">
                                                {transfer.assetCode}
                                            </div>

                                            <div className="mt-1 text-xs text-gray-500">
                                                {transfer.assetName}
                                            </div>

                                        </td>

                                        {/* DEPARTMENT */}
                                        <td className="px-6 py-4 text-sm">

                                            <TransferValue
                                                from={
                                                    transfer.fromDepartmentName
                                                }
                                                to={
                                                    transfer.toDepartmentName
                                                }
                                            />

                                        </td>

                                        {/* LOCATION */}
                                        <td className="px-6 py-4 text-sm">

                                            <TransferValue
                                                from={
                                                    transfer.fromLocationName
                                                }
                                                to={
                                                    transfer.toLocationName
                                                }
                                            />

                                        </td>

                                        {/* USER */}
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                                            {transfer.transferredByUserName ||
                                                '-'}
                                        </td>

                                        {/* DATE */}
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                            {formatDate(
                                                transfer.transferredAt
                                            )}
                                        </td>

                                        {/* ACTION */}
                                        <td className="whitespace-nowrap px-6 py-4 text-right">

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
                            )}

                            {filteredTransfers.length ===
                                0 && (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-12 text-center text-sm text-gray-500"
                                        >
                                            No transfer history found.
                                        </td>
                                    </tr>
                                )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    )
}

function TransferValue({
    from,
    to,
}) {
    const fromValue = from || '-'
    const toValue = to || '-'

    // If unchanged, don't make it look like a transfer
    if (fromValue === toValue) {
        return (
            <span className="text-gray-500">
                {toValue}
            </span>
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

function TableHeader({
    children,
    align = 'left',
}) {
    const alignment =
        align === 'right'
            ? 'text-right'
            : 'text-left'

    return (
        <th
            className={`whitespace-nowrap px-6 py-4 ${alignment} text-xs font-semibold uppercase tracking-wide text-gray-500`}
        >
            {children}
        </th>
    )
}

export default TransfersPage