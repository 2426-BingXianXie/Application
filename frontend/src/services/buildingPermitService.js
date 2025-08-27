import api from './api'

/**
 * Building permit specific service
 * Contains building-specific operations and inherits common permit functionality
 */
const buildingPermitService = {
    // Generic CRUD operations for building permits
    getAll: async (params = {}) => {
        const response = await api.get('/building-permits', { params })
        return response.data
    },

    getById: async (id) => {
        const response = await api.get(`/building-permits/${id}`)
        return response.data
    },

    getByPermitNumber: async (permitNumber) => {
        const response = await api.get(`/building-permits/number/${permitNumber}`)
        return response.data
    },

    create: async (permitData) => {
        const response = await api.post('/building-permits', permitData)
        return response.data
    },

    update: async (id, permitData) => {
        const response = await api.put(`/building-permits/${id}`, permitData)
        return response.data
    },

    delete: async (id) => {
        const response = await api.delete(`/building-permits/${id}`)
        return response.data
    },

    // Workflow operations
    submit: async (id) => {
        const response = await api.post(`/building-permits/${id}/submit`)
        return response.data
    },

    approve: async (id, notes = '') => {
        const response = await api.post(`/building-permits/${id}/approve`, { notes })
        return response.data
    },

    reject: async (id, reason) => {
        const response = await api.post(`/building-permits/${id}/reject`, { reason })
        return response.data
    },

    // Search and filtering
    search: async (query, params = {}) => {
        const response = await api.get('/building-permits/search', {
            params: { q: query, ...params }
        })
        return response.data
    },

    getStatistics: async (params = {}) => {
        const response = await api.get('/building-permits/statistics', { params })
        return response.data
    },

    // Building-specific operations

    // Get permits by building type
    getByBuildingType: async (buildingType, params = {}) => {
        const response = await api.get(`/building-permits/building-type/${buildingType}`, { params })
        return response.data
    },

    // Get permits by permit type (NEW_CONSTRUCTION, RENOVATION, etc.)
    getByPermitType: async (permitType, params = {}) => {
        const response = await api.get(`/building-permits/permit-type/${permitType}`, { params })
        return response.data
    },

    // Get permits requiring architect
    getRequiringArchitect: async (params = {}) => {
        const response = await api.get('/building-permits/with-architect', { params })
        return response.data
    },

    // Get permits requiring engineer
    getRequiringEngineer: async (params = {}) => {
        const response = await api.get('/building-permits/with-engineer', { params })
        return response.data
    },

    // Get permits by project cost range
    getByProjectCostRange: async (minCost, maxCost, params = {}) => {
        const response = await api.get('/building-permits/cost-range', {
            params: { minCost, maxCost, ...params }
        })
        return response.data
    },

    // Get major projects (over $50,000)
    getMajorProjects: async (params = {}) => {
        const response = await api.get('/building-permits/major-projects', { params })
        return response.data
    },

    // Get permits with contractor
    getWithContractor: async (params = {}) => {
        const response = await api.get('/building-permits/with-contractor', { params })
        return response.data
    },

    // Get owner-performed work permits
    getOwnerPerformed: async (params = {}) => {
        const response = await api.get('/building-permits/owner-performed', { params })
        return response.data
    },

    // Get permits by contractor license number
    getByContractorLicense: async (licenseNumber, params = {}) => {
        const response = await api.get(`/building-permits/contractor/${licenseNumber}`, { params })
        return response.data
    },

    // Get permits requiring debris disposal
    getRequiringDebrisDisposal: async (params = {}) => {
        const response = await api.get('/building-permits/with-debris-disposal', { params })
        return response.data
    },

    // Get commercial building permits
    getCommercial: async (params = {}) => {
        const response = await api.get('/building-permits/commercial', { params })
        return response.data
    },

    // Get residential building permits
    getResidential: async (params = {}) => {
        const response = await api.get('/building-permits/residential', { params })
        return response.data
    },

    // Building permit validation with specific rules
    validateBuilding: async (permitData) => {
        const response = await api.post('/building-permits/validate', permitData)
        return response.data
    },

    // Get building permit statistics
    getBuildingStatistics: async () => {
        const response = await api.get('/building-permits/building-statistics')
        return response.data
    },

    // Check contractor license validity
    validateContractorLicense: async (licenseNumber) => {
        const response = await api.get(`/building-permits/validate-contractor/${licenseNumber}`)
        return response.data
    },

    // Get permit fee calculation
    calculateFees: async (permitData) => {
        const response = await api.post('/building-permits/calculate-fees', permitData)
        return response.data
    },

    // Schedule inspections
    scheduleInspections: async (permitId, inspectionTypes) => {
        const response = await api.post(`/building-permits/${permitId}/schedule-inspections`, {
            inspectionTypes
        })
        return response.data
    },

    // Get required inspections for permit
    getRequiredInspections: async (permitId) => {
        const response = await api.get(`/building-permits/${permitId}/required-inspections`)
        return response.data
    },

    // Get permits by occupancy type
    getByOccupancyType: async (occupancyType, params = {}) => {
        const response = await api.get(`/building-permits/occupancy/${occupancyType}`, { params })
        return response.data
    },

    // Submit building plan documents
    uploadBuildingPlans: async (permitId, files, onProgress) => {
        const formData = new FormData()
        files.forEach((file, index) => {
            formData.append(`plans[${index}]`, file)
        })

        const response = await api.upload(
            `/building-permits/${permitId}/upload-plans`,
            formData,
            onProgress
        )
        return response.data
    },

    // Download building permit certificate
    downloadCertificate: async (permitId) => {
        return api.download(
            `/building-permits/${permitId}/certificate`,
            `building-permit-${permitId}.pdf`
        )
    },

    // Get permits by date range
    getByDateRange: async (startDate, endDate, params = {}) => {
        const response = await api.get('/building-permits/date-range', {
            params: { startDate, endDate, ...params }
        })
        return response.data
    }
}

export default buildingPermitService