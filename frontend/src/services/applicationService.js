import api from './api'

/**
 * Applications API – plan endpoints:
 * POST /api/applications – create application (draft or submit)
 * GET /api/applications – list (filter by user or status; staff can see all)
 * GET /api/applications/:id – application detail + documents
 * PATCH /api/applications/:id – update draft or staff status/notes
 */
const applicationService = {
    async create(payload) {
        const response = await api.post('/applications', payload)
        return response.data
    },

    async getAll(params = {}) {
        const response = await api.get('/applications', { params })
        return response.data
    },

    async getById(id) {
        const response = await api.get(`/applications/${id}`)
        return response.data
    },

    async update(id, payload) {
        const response = await api.patch(`/applications/${id}`, payload)
        return response.data
    }
}

export default applicationService
