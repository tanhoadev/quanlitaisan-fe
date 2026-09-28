import axiosClient from '../api/axiosClient'

const getAll = async () => {
    const response = await axiosClient.get('/departments')
    return response.data
}

const getById = async (id) => {
    const response = await axiosClient.get(`/departments/${id}`)
    return response.data
}

const create = async (data) => {
    const response = await axiosClient.post('/departments', data)
    return response.data
}

const update = async (id, data) => {
    const response = await axiosClient.put(`/departments/${id}`, data)
    return response.data
}

const departmentService = {
    getAll,
    getById,
    create,
    update,
}

export default departmentService