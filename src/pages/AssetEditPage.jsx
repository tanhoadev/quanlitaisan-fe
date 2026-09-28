import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import AssetForm from '../components/assets/AssetForm'
import assetService from '../services/assetService'

function AssetEditPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [asset, setAsset] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    // Load current asset
    useEffect(() => {
        const loadAsset = async () => {
            try {
                setLoading(true)
                setError('')

                const data = await assetService.getById(id)

                console.log('EDIT ASSET:', data)

                setAsset(data)
            } catch (err) {
                console.error('LOAD ASSET ERROR:', err)

                setError('Unable to load asset information.')
            } finally {
                setLoading(false)
            }
        }

        loadAsset()
    }, [id])

    // Update asset
    const handleSubmit = async (payload) => {
        try {
            setSubmitting(true)
            setError('')

            console.log('UPDATE ASSET PAYLOAD:', payload)

            await assetService.update(id, payload)

            navigate(`/assets/${id}`)
        } catch (err) {
            console.error('UPDATE ASSET ERROR:', err)

            const status = err.response?.status
            const message = err.response?.data?.message

            if (status === 403) {
                setError('You do not have permission to update assets.')
            } else if (status === 404) {
                setError('Asset not found.')
            } else if (status === 409) {
                setError(message || 'Asset code or QR code already exists.')
            } else if (status === 400) {
                setError(message || 'Invalid asset information.')
            } else {
                setError(message || 'Unable to update asset.')
            }
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="text-gray-500">
                Loading asset...
            </div>
        )
    }

    if (!asset) {
        return (
            <div>
                <button
                    type="button"
                    onClick={() => navigate('/assets')}
                    className="mb-6 text-sm font-medium text-blue-600"
                >
                    ← Back to Assets
                </button>

                <div className="rounded-lg bg-red-50 p-4 text-red-600">
                    {error || 'Asset not found.'}
                </div>
            </div>
        )
    }

    return (
        <div>
            <button
                type="button"
                onClick={() => navigate(`/assets/${id}`)}
                className="mb-6 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
                ← Back to Asset
            </button>

            <h1 className="text-3xl font-bold text-slate-900">
                Edit Asset
            </h1>

            <p className="mt-2 text-gray-500">
                Update {asset.assetCode} - {asset.assetName}
            </p>

            <AssetForm
                initialData={asset}
                onSubmit={handleSubmit}
                onCancel={() => navigate(`/assets/${id}`)}
                submitText="Save Changes"
                submitting={submitting}
                error={error}
            />
        </div>
    )
}

export default AssetEditPage