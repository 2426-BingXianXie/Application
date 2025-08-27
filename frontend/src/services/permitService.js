import api from './api'

const permitService = {
    // Generic CRUD operations
    getAll: async (params = {}) => {
        const response = await api.get('/permits', { params })
        return response.data
    },

    getById: async (id) => {
        const response = await api.get(`/permits/${id}`)
        return response.data
    },

    getByPermitNumber: async (permitNumber) => {
        const response = await api.get(`/permits/number/${permitNumber}`)
        return response.data
    },

    create: async (permitData) => {
        const response = await api.post('/permits', permitData)
        return response.data
    },

    update: async (id, permitData) => {
        const response = await api.put(`/permits/${id}`, permitData)
        return response.data
    },

    delete: async (id) => {
        const response = await api.delete(`/permits/${id}`)
        return response.data
    },

    // Workflow operations
    submit: async (id) => {
        const response = await api.post(`/permits/${id}/submit`)
        return response.data
    },

    approve: async (id, notes = '') => {
        const response = await api.post(`/permits/${id}/approve`, { notes })
        return response.data
    },

    reject: async (id, reason) => {
        const response = await api.post(`/permits/${id}/reject`, { reason })
        return response.data
    },

    withdraw: async (id, reason) => {
        const response = await api.post(`/permits/${id}/withdraw`, { reason })
        return response.data
    },

    // Search and filtering
    search: async (query, params = {}) => {
        const response = await api.get('/permits/search', {
            params: { q: query, ...params }
        })
        return response.data
    },

    // Get permits by status
    getByStatus: async (status, params = {}) => {
        const response = await api.get(`/permits/status/${status}`, { params })
        return response.data
    },

    // Get permits by user
    getByUser: async (userId, params = {}) => {
        const response = await api.get(`/permits/user/${userId}`, { params })
        return response.data
    },

    // Statistics
    getStatistics: async (params = {}) => {
        const response = await api.get('/permits/statistics', { params })
        return response.data
    },

    // Get permit history
    getPermitHistory: async (id) => {
        const response = await api.get(`/permits/${id}/history`)
        return response.data
    },

    // Add comment to permit
    addComment: async (id, comment) => {
        const response = await api.post(`/permits/${id}/comments`, { comment })
        return response.data
    },

    // Get permit comments
    getComments: async (id) => {
        const response = await api.get(`/permits/${id}/comments`)
        return response.data
    },

    // Validate permit data
    validatePermit: async (permitData, permitType) => {
        const response = await api.post('/permits/validate', {
            permitData,
            permitType
        })
        return response.data
    }
}

export default permitService