const validationService = {
    // Validate permit application
    validatePermitApplication: async (permitData, permitType) => {
        const response = await api.post('/validation/permit', {
            permitData,
            permitType
        })
        return response.data
    },

    // Validate contractor license
    validateContractorLicense: async (licenseData) => {
        const response = await api.post('/validation/contractor-license', licenseData)
        return response.data
    },

    // Validate business rules
    validateBusinessRules: async (permitData, permitType) => {
        const response = await api.post('/validation/business-rules', {
            permitData,
            permitType
        })
        return response.data
    },

    // Check permit requirements
    checkPermitRequirements: async (permitType, projectDetails) => {
        const response = await api.post('/validation/requirements', {
            permitType,
            projectDetails
        })
        return response.data
    },

    // Validate address
    validateAddress: async (address) => {
        const response = await api.post('/validation/address', address)
        return response.data
    }
}