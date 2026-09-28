import axiosClient from '../api/axiosClient'

const getCampaigns = async () => {
    const response = await axiosClient.get(
        '/inventory/campaigns'
    )
    return response.data
}

const getCampaignById = async (id) => {
    const response = await axiosClient.get(
        `/inventory/campaigns/${id}`
    )
    return response.data
}

const createCampaign = async (data) => {
    const response = await axiosClient.post(
        '/inventory/campaigns',
        data
    )
    return response.data
}

const addAssets = async (id, data) => {
    const response = await axiosClient.post(
        `/inventory/campaigns/${id}/assets`,
        data
    )
    return response.data
}

const getItems = async (id) => {
    const response = await axiosClient.get(
        `/inventory/campaigns/${id}/items`
    )
    return response.data
}

const startCampaign = async (id) => {
    const response = await axiosClient.post(
        `/inventory/campaigns/${id}/start`
    )
    return response.data
}

const scanAsset = async (id, data) => {
    const response = await axiosClient.post(
        `/inventory/campaigns/${id}/scan`,
        data
    )
    return response.data
}

const completeCampaign = async (id) => {
    const response = await axiosClient.post(
        `/inventory/campaigns/${id}/complete`
    )
    return response.data
}

const inventoryService = {
    getCampaigns,
    getCampaignById,
    createCampaign,
    addAssets,
    getItems,
    startCampaign,
    scanAsset,
    completeCampaign,
}

export default inventoryService