import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AssetForm from '../components/assets/AssetForm'
import assetService from '../services/assetService'

function AssetCreatePage() {
    const navigate = useNavigate()

    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (payload) => {
        try {
            setSubmitting(true)
            setError('')

            const createdAsset = await assetService.create(payload)

            console.log('CREATED ASSET:', createdAsset)

            navigate(`/assets/${createdAsset.id}`)
        } catch (err) {
            console.error('CREATE ASSET ERROR:', err)

            const status = err.response?.status
            const message = err.response?.data?.message

            if (status === 403) {
                setError('You do not have permission to create assets.')
            } else if (status === 409) {
                setError(message || 'Asset code or QR code already exists.')
            } else if (status === 400) {
                setError(message || 'Invalid asset information.')
            } else {
                setError(message || 'Unable to create asset.')
            }
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div>
            <button
                type="button"
                onClick={() => navigate('/assets')}
                className="mb-6 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
                ← Back to Assets
            </button>

            <h1 className="text-3xl font-bold text-slate-900">
                Add Asset
            </h1>

            <p className="mt-2 text-gray-500">
                Create a new asset in the system.
            </p>

            <AssetForm
                onSubmit={handleSubmit}
                onCancel={() => navigate('/assets')}
                submitText="Create Asset"
                submitting={submitting}
                error={error}
            />
        </div>
    )
}

export default AssetCreatePage