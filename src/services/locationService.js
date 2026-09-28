import axiosClient from '../api/axiosClient'

const getAll = async () => {
    const response = await axiosClient.get('/locations')
    return response.data
}

const getById = async (id) => {
    const response = await axiosClient.get(`/locations/${id}`)
    return response.data
}

const create = async (data) => {
    const response = await axiosClient.post('/locations', data)
    return response.data
}

const update = async (id, data) => {
    const response = await axiosClient.put(`/locations/${id}`, data)
    return response.data
}

const locationService = {
    getAll,
    getById,
    create,
    update,
}

export default locationService