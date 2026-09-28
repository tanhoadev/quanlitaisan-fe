import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import inventoryService from '../services/inventoryService'

function InventoryPage() {
    const navigate = useNavigate()

    const [campaigns, setCampaigns] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadCampaigns = async () => {
            try {
                setLoading(true)
                setError('')

                const data =
                    await inventoryService.getCampaigns()

                setCampaigns(
                    Array.isArray(data)
                        ? data
                        : []
                )
            } catch (err) {
                console.error(
                    'INVENTORY CAMPAIGNS ERROR:',
                    err
                )

                setError(
                    'Unable to load inventory campaigns.'
                )
            } finally {
                setLoading(false)
            }
        }

        loadCampaigns()
    }, [])

    const filteredCampaigns =
        campaigns.filter((campaign) => {
            const keyword =
                search.trim().toLowerCase()

            if (!keyword) return true

            return (
                campaign.code
                    ?.toLowerCase()
                    .includes(keyword) ||
                campaign.name
                    ?.toLowerCase()
                    .includes(keyword) ||
                campaign.status
                    ?.toLowerCase()
                    .includes(keyword) ||
                campaign.createdByUserName
                    ?.toLowerCase()
                    .includes(keyword)
            )
        })

    const formatDate = (value) => {
        if (!value) return '-'

        const utcValue =
            value.endsWith('Z')
                ? value
                : `${value}Z`

        return new Date(
            utcValue
        ).toLocaleDateString('vi-VN')
    }

    if (loading) {
        return (
            <div className="text-sm text-gray-500">
                Loading inventory campaigns...
            </div>
        )
    }

    return (
        <div>

            {/* HEADER */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Inventory
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage physical asset inventory campaigns.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate('/inventory/create')
                    }
                    className="cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    + Create Campaign
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
                    placeholder="Search campaign code, name, status or creator..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

            </div>

            {/* TABLE */}
            <div className="mt-5 overflow-hidden rounded-xl bg-white shadow-sm">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-slate-50">
                            <tr>
                                <Header>Campaign</Header>
                                <Header>Period</Header>
                                <Header>Status</Header>
                                <Header>Progress</Header>
                                <Header>Created By</Header>
                                <Header align="right">
                                    Actions
                                </Header>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            {filteredCampaigns.map(
                                (campaign) => (
                                    <tr
                                        key={campaign.id}
                                        className="hover:bg-slate-50"
                                    >

                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">
                                                {campaign.code}
                                            </div>

                                            <div className="mt-1 text-xs text-gray-500">
                                                {campaign.name}
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                            {formatDate(
                                                campaign.startDate
                                            )}
                                            {' → '}
                                            {formatDate(
                                                campaign.endDate
                                            )}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4">
                                            <StatusBadge
                                                status={campaign.status}
                                            />
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-slate-700">
                                                {campaign.checkedItems ?? 0}
                                                {' / '}
                                                {campaign.totalItems ?? 0}
                                            </div>

                                            <div className="mt-1 text-xs text-gray-500">
                                                {campaign.pendingItems ?? 0} pending
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                                            {campaign.createdByUserName ||
                                                '-'}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-right">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/inventory/${campaign.id}`
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

                            {filteredCampaigns.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-12 text-center text-sm text-gray-500"
                                    >
                                        No inventory campaigns found.
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

function StatusBadge({ status }) {
    let style =
        'bg-gray-100 text-gray-700'

    if (status === 'Draft') {
        style =
            'bg-gray-100 text-gray-700'
    } else if (status === 'InProgress') {
        style =
            'bg-blue-100 text-blue-700'
    } else if (status === 'Completed') {
        style =
            'bg-green-100 text-green-700'
    }

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${style}`}
        >
            {status || 'Unknown'}
        </span>
    )
}

function Header({
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

export default InventoryPage