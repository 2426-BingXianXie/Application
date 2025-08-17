import { api } from './api'

/**
 * Generic permit service for common operations
 * Works with both building and gas permits through polymorphism
 */
export const permitService = {
    // Get all permits with pagination
    getAll: async (permitType = '', params = {}) => {
        const endpoint = permitType ? `/${permitType}-permits` : '/permits'
        const response = await api.get(endpoint, { params })
        return response.data
    },

    // Get permit by ID
    getById: async (id, permitType = '') => {
        const endpoint = permitType ? `/${permitType}-permits/${id}` : `/permits/${id}`
        const response = await api.get(endpoint)
        return response.data
    },

    // Get permit by permit number
    getByNumber: async (permitNumber, permitType = '') => {
        const endpoint = permitType
                         ? `/${permitType}-permits/number/${permitNumber}`
                         : `/permits/number/${permitNumber}`
        const response = await api.get(endpoint)
        return response.data
    },

    // Create new permit
    create: async (permitData, permitType = '') => {
        const endpoint = permitType ? `/${permitType}-permits` : '/permits'
        const response = await api.post(endpoint, permitData)
        return response.data
    },

    // Update existing permit
    update: async (id, permitData, permitType = '') => {
        const endpoint = permitType ? `/${permitType}-permits/${id}` : `/permits/${id}`
        const response = await api.put(endpoint, permitData)
        return response.data
    },

    // Delete permit
    delete: async (id, permitType = '') => {
        const endpoint = permitType ? `/${permitType}-permits/${id}` : `/permits/${id}`
        await api.delete(endpoint)
        return true
    },

    // Submit permit for review
    submit: async (id, permitType = '') => {
        const endpoint = permitType
                         ? `/${permitType}-permits/${id}/submit`
                         : `/permits/${id}/submit`
        const response = await api.post(endpoint)
        return response.data
    },

    // Approve permit
    approve: async (id, notes = '', permitType = '') => {
        const endpoint = permitType
                         ? `/${permitType}-permits/${id}/approve`
                         : `/permits/${id}/approve`
        const response = await api.post(endpoint, { notes })
        return response.data
    },

    // Reject permit
    reject: async (id, reason, permitType = '') => {
        const endpoint = permitType
                         ? `/${permitType}-permits/${id}/reject`
                         : `/permits/${id}/reject`
        const response = await api.post(endpoint, { reason })
        return response.data
    },

    // Get permits by status
    getByStatus: async (status, permitType = '', params = {}) => {
        const endpoint = permitType
                         ? `/${permitType}-permits/status/${status}`
                         : `/permits/status/${status}`
        const response = await api.get(endpoint, { params })
        return response.data
    },

    // Get permits by applicant type
    getByApplicantType: async (applicantType, permitType = '', params = {}) => {
        const endpoint = permitType
                         ? `/${permitType}-permits/applicant-type/${applicantType}`
                         : `/permits/applicant-type/${applicantType}`
        const response = await api.get(endpoint, { params })
        return response.data
    },

    // Get permits by email
    getByEmail: async (email, permitType = '') => {
        const endpoint = permitType
                         ? `/${permitType}-permits/email/${email}`
                         : `/permits/email/${email}`
        const response = await api.get(endpoint)
        return response.data
    },

    // Search permits
    search: async (searchTerm, permitType = '', params = {}) => {
        const endpoint = permitType
                         ? `/${permitType}-permits/search`
                         : '/permits/search'
        const response = await api.get(endpoint, {
            params: { searchTerm, ...params }
        })
        return response.data
    },

    // Get permit statistics
    getStatistics: async (permitType = '') => {
        const endpoint = permitType
                         ? `/${permitType}-permits/statistics`
                         : '/permits/statistics'
        const response = await api.get(endpoint)
        return response.data
    },

    // Get expiring permits
    getExpiring: async (days = 30, permitType = '') => {
        const endpoint = permitType
                         ? `/${permitType}-permits/expiring`
                         : '/permits/expiring'
        const response = await api.get(endpoint, { params: { days } })
        return response.data
    },

    // Get permits by date range
    getByDateRange: async (startDate, endDate, permitType = '', params = {}) => {
        const endpoint = permitType
                         ? `/${permitType}-permits/date-range`
                         : '/permits/date-range'
        const response = await api.get(endpoint, {
            params: { startDate, endDate, ...params }
        })
        return response.data
    },

    // Validate permit data
    validate: async (permitData, permitType = '') => {
        const endpoint = permitType
                         ? `/${permitType}-permits/validate`
                         : '/permits/validate'
        const response = await api.post(endpoint, permitData)
        return response.data
    },
}

export default permitService