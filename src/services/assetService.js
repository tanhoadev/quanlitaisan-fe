import axiosClient from '../api/axiosClient'

const getAll = async () => {
    const response = await axiosClient.get('/assets')
    return response.data
}

const getById = async (id) => {
    const response = await axiosClient.get(`/assets/${id}`)
    return response.data
}

const create = async (data) => {
    const response = await axiosClient.post('/assets', data)
    return response.data
}

const update = async (id, data) => {
    await axiosClient.put(`/assets/${id}`, data)
}

const remove = async (id) => {
    await axiosClient.delete(`/assets/${id}`)
}

const assetService = {
    getAll,
    getById,
    create,
    update,
    remove,
}

export default assetService