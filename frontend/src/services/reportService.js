import api from './api'

const reportService = {
    // Get permit statistics
    getPermitStatistics: async (params = {}) => {
        const response = await api.get('/reports/permit-statistics', { params })
        return response.data
    },

    // Get monthly trends
    getMonthlyTrends: async (months = 12, permitType = null) => {
        const response = await api.get('/reports/monthly-trends', {
            params: { months, permitType }
        })
        return response.data
    },

    // Get processing time analytics
    getProcessingTimeAnalytics: async (params = {}) => {
        const response = await api.get('/reports/processing-times', { params })
        return response.data
    },

    // Get revenue analytics
    getRevenueAnalytics: async (params = {}) => {
        const response = await api.get('/reports/revenue', { params })
        return response.data
    },

    // Export permit data
    exportPermitData: async (format, params = {}) => {
        const response = await api.get(`/reports/export/${format}`, {
            params,
            responseType: 'blob'
        })

        // Handle file download
        const blob = new Blob([response.data])
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `permit-report-${new Date().toISOString().split('T')[0]}.${format}`
        link.click()
        window.URL.revokeObjectURL(url)

        return response.data
    },

    // Get dashboard summary
    getDashboardSummary: async (userId = null) => {
        const response = await api.get('/reports/dashboard-summary', {
            params: userId ? { userId } : {}
        })
        return response.data
    },

    // Generate custom report
    generateCustomReport: async (reportConfig) => {
        const response = await api.post('/reports/custom', reportConfig)
        return response.data
    },

    // Get permit analytics by type
    getPermitAnalyticsByType: async (permitType, timeRange = '30') => {
        const response = await api.get(`/reports/analytics/${permitType}`, {
            params: { timeRange }
        })
        return response.data
    },

    // Get contractor performance metrics
    getContractorMetrics: async (contractorId = null, params = {}) => {
        const endpoint = contractorId
                         ? `/reports/contractor/${contractorId}/metrics`
                         : '/reports/contractor-metrics'

        const response = await api.get(endpoint, { params })
        return response.data
    }
}

export default reportService