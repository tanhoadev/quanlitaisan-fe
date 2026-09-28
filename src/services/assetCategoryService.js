import axiosClient from '../api/axiosClient'

const getAll = async () => {
    const response = await axiosClient.get('/assetcategories')
    return response.data
}

const getById = async (id) => {
    const response = await axiosClient.get(
        `/assetcategories/${id}`
    )
    return response.data
}

const create = async (data) => {
    const response = await axiosClient.post(
        '/assetcategories',
        data
    )
    return response.data
}

const update = async (id, data) => {
    const response = await axiosClient.put(
        `/assetcategories/${id}`,
        data
    )
    return response.data
}

const assetCategoryService = {
    getAll,
    getById,
    create,
    update,
}

export default assetCategoryService