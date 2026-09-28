import axiosClient from '../api/axiosClient'

// =====================================================
// GET ALL COSTS + FILTER
// =====================================================
const getAll = async (filters = {}) => {
    const params = {}

    if (filters.assetId) {
        params.assetId = filters.assetId
    }

    if (filters.costType) {
        params.costType = filters.costType
    }

    if (filters.fromDate) {
        params.fromDate = filters.fromDate
    }

    if (filters.toDate) {
        params.toDate = filters.toDate
    }

    const response = await axiosClient.get('/assetcosts', {
        params,
    })

    return response.data
}

// =====================================================
// GET COST BY ID
// =====================================================
const getById = async (id) => {
    const response = await axiosClient.get(
        `/assetcosts/${id}`
    )

    return response.data
}

// =====================================================
// GET COST HISTORY BY ASSET
// =====================================================
const getByAssetId = async (assetId) => {
    const response = await axiosClient.get(
        `/assetcosts/asset/${assetId}`
    )

    return response.data
}

// =====================================================
// GET COST SUMMARY BY ASSET
// =====================================================
const getSummaryByAssetId = async (assetId) => {
    const response = await axiosClient.get(
        `/assetcosts/asset/${assetId}/summary`
    )

    return response.data
}

// =====================================================
// CREATE COST
// =====================================================
const create = async (data) => {
    const response = await axiosClient.post(
        '/assetcosts',
        data
    )

    return response.data
}

// =====================================================
// UPDATE COST
// =====================================================
const update = async (id, data) => {
    const response = await axiosClient.put(
        `/assetcosts/${id}`,
        data
    )

    return response.data
}

// =====================================================
// DELETE COST
// =====================================================
const remove = async (id) => {
    const response = await axiosClient.delete(
        `/assetcosts/${id}`
    )

    return response.data
}

const assetCostService = {
    getAll,
    getById,
    getByAssetId,
    getSummaryByAssetId,
    create,
    update,
    remove,
}

export default assetCostService