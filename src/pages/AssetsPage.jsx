import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assetService from '../services/assetService'

function AssetsPage() {
    const navigate = useNavigate()

    const [assets, setAssets] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [deleting, setDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState('')

    // Load asset list
    useEffect(() => {
        const loadAssets = async () => {
            try {
                setLoading(true)
                setError('')

                const data = await assetService.getAll()

                console.log('ASSETS RESPONSE:', data)

                setAssets(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error('ASSETS ERROR:', error)
                setError('Unable to load assets.')
            } finally {
                setLoading(false)
            }
        }

        loadAssets()
    }, [])

    // Search/filter
    const filteredAssets = assets.filter((asset) => {
        const keyword = search.toLowerCase().trim()

        if (!keyword) {
            return true
        }

        return (
            asset.assetCode?.toLowerCase().includes(keyword) ||
            asset.assetName?.toLowerCase().includes(keyword) ||
            asset.serialNumber?.toLowerCase().includes(keyword) ||
            asset.assetCategoryName?.toLowerCase().includes(keyword) ||
            asset.departmentName?.toLowerCase().includes(keyword) ||
            asset.locationName?.toLowerCase().includes(keyword) ||
            asset.status?.toLowerCase().includes(keyword)
        )
    })
    const handleDelete = async (asset) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${asset.assetCode} - ${asset.assetName}?`
        )

        if (!confirmed) {
            return
        }

        try {
            setDeleting(true)
            setDeleteError('')

            await assetService.remove(asset.id)

            setAssets((currentAssets) =>
                currentAssets.filter((item) => item.id !== asset.id)
            )
        } catch (err) {
            console.error('DELETE ASSET ERROR:', err)

            const status = err.response?.status
            const message = err.response?.data?.message

            if (status === 403) {
                setDeleteError('Only administrators can delete assets.')
            } else if (status === 404) {
                setDeleteError('Asset not found.')
            } else if (status === 409) {
                setDeleteError(
                    message ||
                    'This asset already has transaction/history data and cannot be deleted.'
                )
            } else {
                setDeleteError(message || 'Unable to delete asset.')
            }
        } finally {
            setDeleting(false)
        }
    }
    return (
        <div>
            {/* PAGE HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Assets
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage assets in the system.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate('/assets/create')}
                    className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    + Add Asset
                </button>
            </div>

            {/* SEARCH */}
            <div className="mt-8 rounded-xl bg-white p-5 shadow-sm">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by asset code, name, serial number..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
            </div>

            {/* ASSET TABLE */}
            <div className="mt-5 overflow-hidden rounded-xl bg-white shadow-sm">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">
                        Loading assets...
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-600">
                        {error}
                    </div>
                ) : filteredAssets.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No assets found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-gray-50">
                                <tr className="text-left text-xs uppercase text-gray-500">
                                    <th className="px-6 py-4">
                                        Asset Code
                                    </th>

                                    <th className="px-6 py-4">
                                        Asset Name
                                    </th>

                                    <th className="px-6 py-4">
                                        Serial Number
                                    </th>

                                    <th className="px-6 py-4">
                                        Category
                                    </th>

                                    <th className="px-6 py-4">
                                        Department
                                    </th>

                                    <th className="px-6 py-4">
                                        Location
                                    </th>

                                    <th className="px-6 py-4">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {filteredAssets.map((asset) => (
                                    <tr
                                        key={asset.id}
                                        className="hover:bg-gray-50"
                                    >
                                        {/* ASSET CODE */}
                                        <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                                            {asset.assetCode}
                                        </td>

                                        {/* ASSET NAME */}
                                        <td className="px-6 py-4 text-slate-800">
                                            {asset.assetName}
                                        </td>

                                        {/* SERIAL NUMBER */}
                                        <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                                            {asset.serialNumber || '-'}
                                        </td>

                                        {/* CATEGORY */}
                                        <td className="px-6 py-4 text-gray-600">
                                            {asset.assetCategoryName || '-'}
                                        </td>

                                        {/* DEPARTMENT */}
                                        <td className="px-6 py-4 text-gray-600">
                                            {asset.departmentName || '-'}
                                        </td>

                                        {/* LOCATION */}
                                        <td className="px-6 py-4 text-gray-600">
                                            {asset.locationName || '-'}
                                        </td>

                                        {/* STATUS */}
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                                {asset.status || '-'}
                                            </span>
                                        </td>

                                        {/* ACTION */}
                                        <td className="whitespace-nowrap px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-4">

                                                <button
                                                    type="button"
                                                    onClick={() => navigate(`/assets/${asset.id}`)}
                                                    className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800"
                                                >
                                                    View
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => navigate(`/assets/${asset.id}/edit`)}
                                                    className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-gray-50"
                                                >
                                                    Edit Asset
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(asset)}
                                                    disabled={deleting}
                                                    className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {deleting ? 'Deleting...' : 'Delete Asset'}
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AssetsPage