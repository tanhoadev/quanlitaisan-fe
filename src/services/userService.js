import axiosClient from '../api/axiosClient'

const getAll = async () => {
    const response = await axiosClient.get('/users')
    return response.data
}

const getById = async (id) => {
    const response = await axiosClient.get(`/users/${id}`)
    return response.data
}

const update = async (id, data) => {
    const response = await axiosClient.put(`/users/${id}`, data)
    return response.data
}

const updateRole = async (id, role) => {
    const response = await axiosClient.put(
        `/users/${id}/roles`, { role }
    )

    return response.data
}
const create = async (data) => {
    const response = await axiosClient.post('/users', data)
    return response.data
}
const userService = {
    getAll,
    getById,
    update,
    updateRole,
    create
}

export default userService