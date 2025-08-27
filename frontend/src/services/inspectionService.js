const inspectionService = {
    // Schedule inspection
    scheduleInspection: async (permitId, inspectionType, preferredDate) => {
        const response = await api.post('/inspections/schedule', {
            permitId,
            inspectionType,
            preferredDate
        })
        return response.data
    },

    // Get scheduled inspections
    getScheduledInspections: async (permitId) => {
        const response = await api.get(`/inspections/permit/${permitId}`)
        return response.data
    },

    // Reschedule inspection
    rescheduleInspection: async (inspectionId, newDate) => {
        const response = await api.patch(`/inspections/${inspectionId}/reschedule`, {
            newDate
        })
        return response.data
    },

    // Cancel inspection
    cancelInspection: async (inspectionId, reason) => {
        const response = await api.patch(`/inspections/${inspectionId}/cancel`, {
            reason
        })
        return response.data
    },

    // Get inspection results
    getInspectionResults: async (inspectionId) => {
        const response = await api.get(`/inspections/${inspectionId}/results`)
        return response.data
    }
}