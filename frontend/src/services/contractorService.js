import api from './api'

const contractorService = {
    // Search contractors
    searchContractors: async (query, licenseType = null) => {
        const response = await api.get('/contractors/search', {
            params: { q: query, licenseType }
        })
        return response.data
    },

    // Validate contractor license
    validateLicense: async (licenseNumber, licenseType) => {
        const response = await api.post('/contractors/validate-license', {
            licenseNumber,
            licenseType
        })
        return response.data
    },

    // Get contractor by license number
    getContractorByLicense: async (licenseNumber) => {
        const response = await api.get(`/contractors/license/${licenseNumber}`)
        return response.data
    },

    // Verify insurance coverage
    verifyInsurance: async (licenseNumber) => {
        const response = await api.get(`/contractors/insurance/${licenseNumber}`)
        return response.data
    },

    // Get license expiration info
    getLicenseExpiration: async (licenseNumber) => {
        const response = await api.get(`/contractors/expiration/${licenseNumber}`)
        return response.data
    },

    // Get all contractors
    getAllContractors: async (params = {}) => {
        const response = await api.get('/contractors', { params })
        return response.data
    },

    // Create contractor record
    createContractor: async (contractorData) => {
        const response = await api.post('/contractors', contractorData)
        return response.data
    },

    // Update contractor information
    updateContractor: async (id, contractorData) => {
        const response = await api.put(`/contractors/${id}`, contractorData)
        return response.data
    },

    // Delete contractor record
    deleteContractor: async (id) => {
        const response = await api.delete(`/contractors/${id}`)
        return response.data
    },

    // Get contractors by type
    getByLicenseType: async (licenseType, params = {}) => {
        const response = await api.get(`/contractors/type/${licenseType}`, { params })
        return response.data
    },

    // Check license renewal requirements
    checkRenewalRequirements: async (licenseNumber) => {
        const response = await api.get(`/contractors/renewal-requirements/${licenseNumber}`)
        return response.data
    }
}

export default contractorService