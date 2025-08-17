import { api } from './api'
import permitService from './permitService'

/**
 * Building permit specific service
 * Extends generic permit service with building-specific operations
 */
export const buildingPermitService = {
    // Inherit all generic operations
    ...Object.fromEntries(
        Object.entries(permitService).map(([key, fn]) => [
            key,
            (...args) => fn(...args, 'building')
        ])
    ),

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
}

export default buildingPermitService