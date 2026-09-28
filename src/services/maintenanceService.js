import axiosClient from '../api/axiosClient'

// ==================================================
// MAINTENANCE REQUESTS
// ==================================================

const getRequests = async () => {
    const response = await axiosClient.get(
        '/maintenance/requests'
    )

    return response.data
}

const getRequestById = async (id) => {
    const response = await axiosClient.get(
        `/maintenance/requests/${id}`
    )

    return response.data
}

const createRequest = async (data) => {
    const response = await axiosClient.post(
        '/maintenance/requests',
        data
    )

    return response.data
}

const startRequest = async (id) => {
    const response = await axiosClient.post(
        `/maintenance/requests/${id}/start`
    )

    return response.data
}

const completeRequest = async (id) => {
    const response = await axiosClient.post(
        `/maintenance/requests/${id}/complete`
    )

    return response.data
}


// ==================================================
// MAINTENANCE PLANS
// ==================================================

const getPlans = async () => {
    const response = await axiosClient.get(
        '/maintenance/plans'
    )

    return response.data
}

const getDuePlans = async () => {
    const response = await axiosClient.get(
        '/maintenance/plans/due'
    )

    return response.data
}

const getPlanById = async (id) => {
    const response = await axiosClient.get(
        `/maintenance/plans/${id}`
    )

    return response.data
}

const createPlan = async (data) => {
    const response = await axiosClient.post(
        '/maintenance/plans',
        data
    )

    return response.data
}

const generateRequest = async (id) => {
    const response = await axiosClient.post(
        `/maintenance/plans/${id}/generate-request`
    )

    return response.data
}

const getRequestsByAssetId = async (assetId) => {
    const response = await axiosClient.get(
        `/maintenance/requests/asset/${assetId}`
    )

    return response.data
}


// ==================================================
// EXPORT
// ==================================================

const maintenanceService = {
    getRequests,
    getRequestById,
    createRequest,
    startRequest,
    completeRequest,

    getPlans,
    getDuePlans,
    getPlanById,
    createPlan,
    generateRequest,
    getRequestsByAssetId
}

export default maintenanceService