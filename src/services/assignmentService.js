import axiosClient from '../api/axiosClient'

const getAll = async () => {
    const response = await axiosClient.get('/assetassignments')
    return response.data
}

const getById = async (id) => {
    const response = await axiosClient.get(`/assetassignments/${id}`)
    return response.data
}

const create = async (data) => {
    const response = await axiosClient.post('/assetassignments', data)
    return response.data
}

const returnAsset = async (id, data) => {
    const response = await axiosClient.post(
        `/assetassignments/${id}/return`,
        data
    )

    return response.data
}

const getByAssetId = async (assetId) => {
    const response = await axiosClient.get(
        `/assetassignments/asset/${assetId}`
    )

    return response.data
}


const assignmentService = {
    getAll,
    getById,
    create,
    returnAsset,
    getByAssetId,
}

export default assignmentService