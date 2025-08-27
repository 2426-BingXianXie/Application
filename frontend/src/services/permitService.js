import api from './api'

// Generic permit service that can be extended by specific permit types
class PermitService {
    constructor(basePath) {
        this.basePath = basePath
    }

    // Create new permit
    async createPermit(permitData) {
        const response = await api.post(`${this.basePath}`, permitData)
        return response.data
    }

    // Get permit by ID
    async getPermitById(id) {
        const response = await api.get(`${this.basePath}/${id}`)
        return response.data
    }

    // Get permit by permit number
    async getPermitByNumber(permitNumber) {
        const response = await api.get(`${this.basePath}/number/${permitNumber}`)
        return response.data
    }

    // Update permit
    async updatePermit(id, permitData) {
        const response = await api.put(`${this.basePath}/${id}`, permitData)
        return response.data
    }

    // Partially update permit
    async patchPermit(id, updates) {
        const response = await api.patch(`${this.basePath}/${id}`, updates)
        return response.data
    }

    // Delete permit
    async deletePermit(id) {
        const response = await api.delete(`${this.basePath}/${id}`)
        return response.data
    }

    // Get all permits with pagination
    async getAllPermits(params = {}) {
        const response = await api.getPaginated(this.basePath, params)
        return response
    }

    // Submit permit for review
    async submitPermit(id) {
        const response = await api.post(`${this.basePath}/${id}/submit`)
        return response.data
    }

    // Approve permit
    async approvePermit(id, approvalData = {}) {
        const response = await api.post(`${this.basePath}/${id}/approve`, {
            notes: approvalData.notes,
            conditions: approvalData.conditions,
            expirationDate: approvalData.expirationDate
        })
        return response.data
    }

    // Reject permit
    async rejectPermit(id, rejectionData) {
        const response = await api.post(`${this.basePath}/${id}/reject`, {
            reason: rejectionData.reason,
            notes: rejectionData.notes,
            requiredChanges: rejectionData.requiredChanges
        })
        return response.data
    }

    // Cancel permit
    async cancelPermit(id, reason) {
        const response = await api.post(`${this.basePath}/${id}/cancel`, {
            reason
        })
        return response.data
    }

    // Renew permit
    async renewPermit(id, renewalData = {}) {
        const response = await api.post(`${this.basePath}/${id}/renew`, renewalData)
        return response.data
    }

    // Get permit history/timeline
    async getPermitHistory(id) {
        const response = await api.get(`${this.basePath}/${id}/history`)
        return response.data
    }

    // Get permits by status
    async getPermitsByStatus(status, params = {}) {
        const response = await api.getPaginated(`${this.basePath}/status/${status}`, params)
        return response
    }

    // Get permits by applicant
    async getPermitsByApplicant(applicantId, params = {}) {
        const response = await api.getPaginated(`${this.basePath}/applicant/${applicantId}`, params)
        return response
    }

    // Search permits
    async searchPermits(searchTerm, params = {}) {
        const response = await api.getPaginated(`${this.basePath}/search`, {
            q: searchTerm,
            ...params
        })
        return response
    }

    // Advanced search with filters
    async advancedSearch(filters, params = {}) {
        const response = await api.post(`${this.basePath}/search/advanced`, {
            filters,
            ...params
        })
        return response.data
    }

    // Validate permit data
    async validatePermit(permitData) {
        const response = await api.post(`${this.basePath}/validate`, permitData)
        return response.data
    }

    // Get permit statistics
    async getPermitStatistics(params = {}) {
        const response = await api.get(`${this.basePath}/statistics`, { params })
        return response.data
    }

    // Get permit reports
    async getPermitReports(reportType, params = {}) {
        const response = await api.get(`${this.basePath}/reports/${reportType}`, { params })
        return response.data
    }

    // Export permits
    async exportPermits(format = 'csv', filters = {}) {
        const response = await api.post(`${this.basePath}/export`, {
            format,
            filters
        }, {
                                            responseType: 'blob'
                                        })
        return response.data
    }

    // Bulk operations
    async bulkUpdateStatus(permitIds, status, notes = '') {
        const response = await api.post(`${this.basePath}/bulk/update-status`, {
            permitIds,
            status,
            notes
        })
        return response.data
    }

    async bulkDelete(permitIds, reason = '') {
        const response = await api.post(`${this.basePath}/bulk/delete`, {
            permitIds,
            reason
        })
        return response.data
    }

    // Get permit documents
    async getPermitDocuments(id) {
        const response = await api.get(`${this.basePath}/${id}/documents`)
        return response.data
    }

    // Get permit fees
    async getPermitFees(id) {
        const response = await api.get(`${this.basePath}/${id}/fees`)
        return response.data
    }

    // Calculate permit fees
    async calculateFees(permitData) {
        const response = await api.post(`${this.basePath}/calculate-fees`, permitData)
        return response.data
    }

    // Get permit inspections
    async getPermitInspections(id) {
        const response = await api.get(`${this.basePath}/${id}/inspections`)
        return response.data
    }

    // Schedule inspection
    async scheduleInspection(id, inspectionData) {
        const response = await api.post(`${this.basePath}/${id}/inspections`, {
            type: inspectionData.type,
            requestedDate: inspectionData.requestedDate,
            notes: inspectionData.notes,
            contactInfo: inspectionData.contactInfo
        })
        return response.data
    }

    // Get permit conditions
    async getPermitConditions(id) {
        const response = await api.get(`${this.basePath}/${id}/conditions`)
        return response.data
    }

    // Add permit condition
    async addPermitCondition(id, condition) {
        const response = await api.post(`${this.basePath}/${id}/conditions`, condition)
        return response.data
    }

    // Get permit comments/notes
    async getPermitComments(id) {
        const response = await api.get(`${this.basePath}/${id}/comments`)
        return response.data
    }

    // Add permit comment
    async addPermitComment(id, comment) {
        const response = await api.post(`${this.basePath}/${id}/comments`, {
            content: comment.content,
            isPublic: comment.isPublic || false,
            isInternal: comment.isInternal || false
        })
        return response.data
    }

    // Get permit notifications
    async getPermitNotifications(id) {
        const response = await api.get(`${this.basePath}/${id}/notifications`)
        return response.data
    }

    // Send permit notification
    async sendPermitNotification(id, notificationData) {
        const response = await api.post(`${this.basePath}/${id}/notifications`, {
            type: notificationData.type,
            recipients: notificationData.recipients,
            subject: notificationData.subject,
            message: notificationData.message,
            sendEmail: notificationData.sendEmail || true,
            sendSMS: notificationData.sendSMS || false
        })
        return response.data
    }

    // Get related permits
    async getRelatedPermits(id) {
        const response = await api.get(`${this.basePath}/${id}/related`)
        return response.data
    }

    // Link permits
    async linkPermits(id, relatedPermitIds, relationship) {
        const response = await api.post(`${this.basePath}/${id}/link`, {
            relatedPermitIds,
            relationship
        })
        return response.data
    }

    // Get permit timeline
    async getPermitTimeline(id) {
        const response = await api.get(`${this.basePath}/${id}/timeline`)
        return response.data
    }

    // Get permits expiring soon
    async getExpiringPermits(days = 30) {
        const response = await api.get(`${this.basePath}/expiring`, {
            params: { days }
        })
        return response.data
    }

    // Get recent permits
    async getRecentPermits(limit = 10) {
        const response = await api.get(`${this.basePath}/recent`, {
            params: { limit }
        })
        return response.data
    }

    // Get permits by date range
    async getPermitsByDateRange(startDate, endDate, params = {}) {
        const response = await api.get(`${this.basePath}/date-range`, {
            params: {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                ...params
            }
        })
        return response.data
    }

    // Get permit summary
    async getPermitSummary() {
        const response = await api.get(`${this.basePath}/summary`)
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

    // Check permit dependencies
    async checkDependencies(permitData) {
        const response = await api.post(`${this.basePath}/check-dependencies`, permitData)
        return response.data
    }

    // Get permit workflow status
    async getWorkflowStatus(id) {
        const response = await api.get(`${this.basePath}/${id}/workflow`)
        return response.data
    }

    // Advance permit to next workflow stage
    async advanceWorkflow(id, action, data = {}) {
        const response = await api.post(`${this.basePath}/${id}/workflow/${action}`, data)
        return response.data
    }
}

// Create instances for different permit types
const permitService = new PermitService('/permits')
const buildingPermitService = new PermitService('/building-permits')
const gasPermitService = new PermitService('/gas-permits')

export {
    PermitService,
    buildingPermitService,
    gasPermitService
}

export default permitService