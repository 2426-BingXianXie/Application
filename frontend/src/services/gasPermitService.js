import { api } from './api'
import permitService from './permitService'

/**
 * Gas permit specific service
 * Extends generic permit service with gas-specific operations
 */
export const gasPermitService = {
    // Inherit all generic operations
    ...Object.fromEntries(
        Object.entries(permitService).map(([key, fn]) => [
            key,
            (...args) => fn(...args, 'gas')
        ])
    ),

    // Gas-specific operations

    // Get permits by gas work type
    getByWorkType: async (workType, params = {}) => {
        const response = await api.get(`/gas-permits/work-type/${workType}`, { params })
        return response.data
    },

    // Get permits by installation type
    getByInstallationType: async (installationType, params = {}) => {
        const response = await api.get(`/gas-permits/installation-type/${installationType}`, { params })
        return response.data
    },

    // Get high-pressure permits (over 400,000 BTU)
    getHighPressure: async (params = {}) => {
        const response = await api.get('/gas-permits/high-pressure', { params })
        return response.data
    },

    // Get permits requiring utility coordination
    getRequiringUtilityCoordination: async (params = {}) => {
        const response = await api.get('/gas-permits/utility-coordination', { params })
        return response.data
    },

    // Get commercial gas permits
    getCommercial: async (params = {}) => {
        const response = await api.get('/gas-permits/commercial', { params })
        return response.data
    },

    // Get permits by BTU range
    getByBtuRange: async (minBtu, maxBtu, params = {}) => {
        const response = await api.get('/gas-permits/btu-range', {
            params: { minBtu, maxBtu, ...params }
        })
        return response.data
    },

    // Get permits by gas type
    getByGasType: async (gasType, params = {}) => {
        const response = await api.get(`/gas-permits/gas-type/${gasType}`, { params })
        return response.data
    },

    // Get permits requiring pressure test
    getRequiringPressureTest: async (params = {}) => {
        const response = await api.get('/gas-permits/pressure-test-required', { params })
        return response.data
    },

    // Get permits requiring emergency shutoff
    getRequiringEmergencyShutoff: async (params = {}) => {
        const response = await api.get('/gas-permits/emergency-shutoff-required', { params })
        return response.data
    },

    // Get permits by gas contractor license
    getByGasContractorLicense: async (licenseNumber, params = {}) => {
        const response = await api.get(`/gas-permits/gas-contractor/${licenseNumber}`, { params })
        return response.data
    },

    // Get new service line permits
    getNewServiceLines: async (params = {}) => {
        const response = await api.get('/gas-permits/new-service-lines', { params })
        return response.data
    },

    // Get appliance installation permits
    getApplianceInstallations: async (params = {}) => {
        const response = await api.get('/gas-permits/appliance-installations', { params })
        return response.data
    },

    // Gas permit validation with specific rules
    validateGas: async (permitData) => {
        const response = await api.post('/gas-permits/validate', permitData)
        return response.data
    },

    // Get gas safety statistics
    getGasSafetyStatistics: async () => {
        const response = await api.get('/gas-permits/safety-statistics')
        return response.data
    },

    // Validate gas contractor license
    validateGasContractorLicense: async (licenseNumber) => {
        const response = await api.get(`/gas-permits/validate-gas-contractor/${licenseNumber}`)
        return response.data
    },

    // Calculate gas line sizing requirements
    calculateGasLineSizing: async (btuLoad, distance, gasType) => {
        const response = await api.post('/gas-permits/calculate-line-sizing', {
            btuLoad,
            distance,
            gasType
        })
        return response.data
    },

    // Check utility company requirements
    checkUtilityRequirements: async (permitData) => {
        const response = await api.post('/gas-permits/check-utility-requirements', permitData)
        return response.data
    },

    // Schedule gas inspections
    scheduleGasInspections: async (permitId, inspectionTypes) => {
        const response = await api.post(`/gas-permits/${permitId}/schedule-inspections`, {
            inspectionTypes
        })
        return response.data
    },

    // Get required gas inspections
    getRequiredGasInspections: async (permitId) => {
        const response = await api.get(`/gas-permits/${permitId}/required-inspections`)
        return response.data
    },

    // Submit gas appliance specifications
    uploadApplianceSpecs: async (permitId, files, onProgress) => {
        const formData = new FormData()
        files.forEach((file, index) => {
            formData.append(`specs[${index}]`, file)
        })

        const response = await api.upload(
            `/gas-permits/${permitId}/upload-specs`,
            formData,
            onProgress
        )
        return response.data
    },

    // Generate gas load calculation report
    generateLoadCalculation: async (permitId) => {
        const response = await api.get(`/gas-permits/${permitId}/load-calculation`)
        return response.data
    },

    // Notify utility company
    notifyUtilityCompany: async (permitId, utilityInfo) => {
        const response = await api.post(`/gas-permits/${permitId}/notify-utility`, utilityInfo)
        return response.data
    },

    // Get BTU capacity recommendations
    getBtuRecommendations: async (applianceTypes, installationType) => {
        const response = await api.post('/gas-permits/btu-recommendations', {
            applianceTypes,
            installationType
        })
        return response.data
    },

    // Check gas code compliance
    checkGasCodeCompliance: async (permitData) => {
        const response = await api.post('/gas-permits/check-compliance', permitData)
        return response.data
    },

    // Download gas permit certificate
    downloadGasCertificate: async (permitId) => {
        return api.download(
            `/gas-permits/${permitId}/certificate`,
            `gas-permit-${permitId}.pdf`
        )
    },

    // Get major gas installations (over 1M BTU)
    getMajorInstallations: async (params = {}) => {
        const response = await api.get('/gas-permits/major-installations', { params })
        return response.data
    },
}

export default gasPermitService