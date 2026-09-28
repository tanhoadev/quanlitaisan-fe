import axiosClient from '../api/axiosClient'

const getSummary = async () => {
    const response = await axiosClient.get('/dashboard/summary')
    return response.data
}

const getAssetsByStatus = async () => {
    const response = await axiosClient.get('/dashboard/assets-by-status')
    return response.data
}

const getAssetsByDepartment = async () => {
    const response = await axiosClient.get('/dashboard/assets-by-department')
    return response.data
}

const getAssetsByCategory = async () => {
    const response = await axiosClient.get('/dashboard/assets-by-category')
    return response.data
}

const getCostsByType = async () => {
    const response = await axiosClient.get('/dashboard/costs-by-type')
    return response.data
}

const getCostsByMonth = async () => {
    const response = await axiosClient.get('/dashboard/costs-by-month')
    return response.data
}

const getMaintenanceByStatus = async () => {
    const response = await axiosClient.get('/dashboard/maintenance-by-status')
    return response.data
}

const getMaintenanceByPriority = async () => {
    const response = await axiosClient.get('/dashboard/maintenance-by-priority')
    return response.data
}

const getUpcomingMaintenance = async () => {
    const response = await axiosClient.get('/dashboard/upcoming-maintenance')
    return response.data
}

const dashboardService = {
    getSummary,
    getAssetsByStatus,
    getAssetsByDepartment,
    getAssetsByCategory,
    getCostsByType,
    getCostsByMonth,
    getMaintenanceByStatus,
    getMaintenanceByPriority,
    getUpcomingMaintenance,
}

export default dashboardService