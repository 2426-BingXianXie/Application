import api from './api'

const gasPermitService = {
    // Inherit all generic permit operations by copying them
    // Generic CRUD operations
    getAll: async (params = {}) => {
        const response = await api.get('/gas-permits', { params })
        return response.data
    },

    getById: async (id) => {
        const response = await api.get(`/gas-permits/${id}`)
        return response.data
    },

    getByPermitNumber: async (permitNumber) => {
        const response = await api.get(`/gas-permits/number/${permitNumber}`)
        return response.data
    },

    create: async (permitData) => {
        const response = await api.post('/gas-permits', permitData)
        return response.data
    },

    update: async (id, permitData) => {
        const response = await api.put(`/gas-permits/${id}`, permitData)
        return response.data
    },

    delete: async (id) => {
        const response = await api.delete(`/gas-permits/${id}`)
        return response.data
    },

    // Workflow operations
    submit: async (id) => {
        const response = await api.post(`/gas-permits/${id}/submit`)
        return response.data
    },

    approve: async (id, notes = '') => {
        const response = await api.post(`/gas-permits/${id}/approve`, { notes })
        return response.data
    },

    reject: async (id, reason) => {
        const response = await api.post(`/gas-permits/${id}/reject`, { reason })
        return response.data
    },

    // Search and filtering
    search: async (query, params = {}) => {
        const response = await api.get('/gas-permits/search', {
            params: { q: query, ...params }
        })
        return response.data
    },

    getStatistics: async (params = {}) => {
        const response = await api.get('/gas-permits/statistics', { params })
        return response.data
    },

    // Gas-specific operations
    getByWorkType: async (workType, params = {}) => {
        const response = await api.get(`/gas-permits/work-type/${workType}`, { params })
        return response.data
    },

    getByInstallationType: async (installationType, params = {}) => {
        const response = await api.get(`/gas-permits/installation-type/${installationType}`, { params })
        return response.data
    },

    getHighPressure: async (minBtu = 100000, params = {}) => {
        const response = await api.get('/gas-permits/high-pressure', {
            params: { minBtu, ...params }
        })
        return response.data
    },

    getRequiringUtilityCoordination: async (params = {}) => {
        const response = await api.get('/gas-permits/requiring-utility', { params })
        return response.data
    },

    // Gas calculations and safety
    calculateGasLineSizing: async (btuLoad, distance, gasType) => {
        const response = await api.post('/gas-permits/calculate-line-sizing', {
            btuLoad,
            distance,
            gasType
        })
        return response.data
    },

    checkUtilityRequirements: async (permitData) => {
        const response = await api.post('/gas-permits/check-utility-requirements', permitData)
        return response.data
    },

    validateGasSafety: async (permitData) => {
        const response = await api.post('/gas-permits/validate-safety', permitData)
        return response.data
    },

    // Gas inspections
    scheduleGasInspections: async (permitId, inspectionTypes) => {
        const response = await api.post(`/gas-permits/${permitId}/schedule-inspections`, {
            inspectionTypes
        })
        return response.data
    },

    getRequiredGasInspections: async (permitId) => {
        const response = await api.get(`/gas-permits/${permitId}/required-inspections`)
        return response.data
    },

    // Gas contractor validation
    validateGasContractorLicense: async (licenseNumber) => {
        const response = await api.get(`/gas-permits/validate-gas-contractor/${licenseNumber}`)
        return response.data
    },

    // Gas safety statistics
    getGasSafetyStatistics: async () => {
        const response = await api.get('/gas-permits/safety-statistics')
        return response.data
    },

    // Upload gas appliance specifications
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

    // Download gas permit certificate
    downloadCertificate: async (permitId) => {
        return api.download(
            `/gas-permits/${permitId}/certificate`,
            `gas-permit-${permitId}.pdf`
        )
    }
}

export default gasPermitService