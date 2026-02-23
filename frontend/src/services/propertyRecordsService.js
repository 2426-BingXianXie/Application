import api from './api'

/**
 * Property records API – plan endpoint:
 * GET /api/property-records/search – search by address, parcel, etc.
 */
const propertyRecordsService = {
    async search(params = {}) {
        const response = await api.get('/property-records/search', { params })
        return response.data
    }
}

export default propertyRecordsService
