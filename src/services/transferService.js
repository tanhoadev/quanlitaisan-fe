import axiosClient from '../api/axiosClient'

const getAll = async () => {
    const response = await axiosClient.get(
        '/assettransfers'
    )

    return response.data
}

const getById = async (id) => {
    const response = await axiosClient.get(
        `/assettransfers/${id}`
    )

    return response.data
}

const create = async (data) => {
    const response = await axiosClient.post(
        '/assettransfers',
        data
    )

    return response.data
}

const getByAssetId = async (assetId) => {
    const response = await axiosClient.get(
        `/assettransfers/asset/${assetId}`
    )

    return response.data
}

const transferService = {
    getAll,
    getById,
    create,
    getByAssetId,
}

export default transferService