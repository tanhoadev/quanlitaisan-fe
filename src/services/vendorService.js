import axiosClient from '../api/axiosClient'

const getAll = async (filters = {}) => {
    const params = {}

    if (filters.search) {
        params.search = filters.search
    }

    if (filters.isActive !== undefined) {
        params.isActive = filters.isActive
    }

    const response = await axiosClient.get('/vendors', {
        params,
    })

    return response.data
}

const getById = async (id) => {
    const response = await axiosClient.get(
        `/vendors/${id}`
    )

    return response.data
}

const create = async (data) => {
    const response = await axiosClient.post('/vendors', data)
    return response.data
}

const update = async (id, data) => {
    const response = await axiosClient.put(`/vendors/${id}`, data)
    return response.data
}

const vendorService = {
    getAll,
    getById,
    create,
    update,
}

export default vendorService