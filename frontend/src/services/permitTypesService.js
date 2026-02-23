import api from './api'

/**
 * Permit types API – plan endpoints:
 * GET /api/permit-types – list permit types (and categories)
 * GET /api/permit-types/:id – permit type detail + form schema/config
 */
const permitTypesService = {
    async getAll() {
        const response = await api.get('/permit-types')
        return response.data
    },

    async getById(id) {
        const response = await api.get(`/permit-types/${id}`)
        return response.data
    },

    async getBySlug(slug) {
        const response = await api.get('/permit-types', { params: { slug } })
        const list = Array.isArray(response.data) ? response.data : response.data?.content ?? response.data?.items ?? []
        const found = list.find((p) => (p.slug || p.id) === slug)
        if (found) return found
        const byId = await api.get(`/permit-types/${slug}`).catch(() => null)
        return byId?.data ?? null
    }
}

export default permitTypesService
