import api from './api'

/**
 * Generic Permit Service Class - Base class for all permit types
 * Implements common CRUD operations and permit workflow
 * Can be extended by specific permit types (Building, Gas, etc.)
 */
class PermitService {
    constructor(basePath) {
        this.basePath = basePath
    }

    // Create new permit
    async create(permitData) {
        const response = await api.post(`${this.basePath}`, permitData)
        return response.data
    }

    // Get permit by ID
    async getById(id) {
        const response = await api.get(`${this.basePath}/${id}`)
        return response.data
    }

    // Get permit by permit number
    async getByNumber(permitNumber) {
        const response = await api.get(`${this.basePath}/number/${permitNumber}`)
        return response.data
    }

    // Update permit
    async update(id, permitData) {
        const response = await api.put(`${this.basePath}/${id}`, permitData)
        return response.data
    }

    // Partially update permit
    async patch(id, updates) {
        const response = await api.patch(`${this.basePath}/${id}`, updates)
        return response.data
    }

    // Delete permit
    async delete(id) {
        const response = await api.delete(`${this.basePath}/${id}`)
        return response.data
    }

    // Get all permits with pagination
    async getAll(params = {}) {
        const response = await api.getPaginated(this.basePath, params)
        return response
    }

    // Submit permit for review
    async submit(id) {
        const response = await api.post(`${this.basePath}/${id}/submit`)
        return response.data
    }

    // Approve permit
    async approve(id, approvalData = {}) {
        const response = await api.post(`${this.basePath}/${id}/approve`, {
            notes: approvalData.notes,
            conditions: approvalData.conditions,
            expirationDate: approvalData.expirationDate
        })
        return response.data
    }

    // Reject permit
    async reject(id, rejectionData) {
        const response = await api.post(`${this.basePath}/${id}/reject`, {
            reason: rejectionData.reason,
            notes: rejectionData.notes,
            requiredChanges: rejectionData.requiredChanges
        })
        return response.data
    }


    // Search permits
    async search(query, params = {}) {
        const response = await api.get(`${this.basePath}/search`, {
            params: { q: query, ...params }
        })
        return response.data
    }

    // Get permits by status
    async getByStatus(status, params = {}) {
        const response = await api.get(`${this.basePath}/status/${status}`, { params })
        return response.data
    }

    // Get permits by applicant
    async getByApplicant(applicantId, params = {}) {
        const response = await api.get(`${this.basePath}/applicant/${applicantId}`, { params })
        return response.data
    }


    // Get permit statistics
    async getStatistics(params = {}) {
        const response = await api.get(`${this.basePath}/statistics`, { params })
        return response.data
    }

    // Get recent permits
    async getRecent(limit = 10) {
        const response = await api.get(`${this.basePath}/recent`, {
            params: { limit }
        })
        return response.data
    }

    // Get permits by date range
    async getByDateRange(startDate, endDate, params = {}) {
        const response = await api.get(`${this.basePath}/date-range`, {
            params: {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                ...params
            }
        })
        return response.data
    }


    // Validate permit data
    async validate(permitData) {
        const response = await api.post(`${this.basePath}/validate`, permitData)
        return response.data
    }

    // Check permit dependencies
    async checkDependencies(permitData) {
        const response = await api.post(`${this.basePath}/check-dependencies`, permitData)
        return response.data
    }


    // Download permit certificate
    async downloadCertificate(id, format = 'pdf') {
        return api.download(
            `${this.basePath}/${id}/certificate?format=${format}`,
            `permit-${id}.${format}`
        )
    }

    // Generate permit report
    async generateReport(id, reportType = 'detailed') {
        return api.download(
            `${this.basePath}/${id}/report?type=${reportType}`,
            `permit-${id}-report.pdf`
        )
    }


    // Get workflow status
    async getWorkflowStatus(id) {
        const response = await api.get(`${this.basePath}/${id}/workflow`)
        return response.data
    }

    // Advance workflow
    async advanceWorkflow(id, action, data = {}) {
        const response = await api.post(`${this.basePath}/${id}/workflow/${action}`, data)
        return response.data
    }
}

// Default permit service instance
const permitService = new PermitService('/permits')

// Export both the class and default instance
export { PermitService }
export default permitService