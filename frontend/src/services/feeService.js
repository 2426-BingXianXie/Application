const feeService = {
    // Calculate permit fees
    calculateFees: async (permitData, permitType) => {
        const response = await api.post('/fees/calculate', {
            permitData,
            permitType
        })
        return response.data
    },

    // Get fee schedule
    getFeeSchedule: async (permitType = null) => {
        const response = await api.get('/fees/schedule', {
            params: permitType ? { permitType } : {}
        })
        return response.data
    },

    // Calculate processing time estimate
    calculateProcessingTime: async (permitType, projectDetails) => {
        const response = await api.post('/fees/processing-time', {
            permitType,
            projectDetails
        })
        return response.data
    }
}
