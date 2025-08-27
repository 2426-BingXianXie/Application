import api from './api'

const notificationService = {
    // Get user notifications
    getNotifications: async (params = {}) => {
        const response = await api.get('/notifications', { params })
        return response.data
    },

    // Mark notification as read
    markAsRead: async (notificationId) => {
        const response = await api.patch(`/notifications/${notificationId}/read`)
        return response.data
    },

    // Mark all notifications as read
    markAllAsRead: async () => {
        const response = await api.patch('/notifications/read-all')
        return response.data
    },

    // Delete notification
    deleteNotification: async (notificationId) => {
        const response = await api.delete(`/notifications/${notificationId}`)
        return response.data
    },

    // Get notification preferences
    getPreferences: async () => {
        const response = await api.get('/notifications/preferences')
        return response.data
    },

    // Update notification preferences
    updatePreferences: async (preferences) => {
        const response = await api.put('/notifications/preferences', preferences)
        return response.data
    },

    // Send test notification
    sendTestNotification: async (type) => {
        const response = await api.post('/notifications/test', { type })
        return response.data
    },

    // Create notification
    createNotification: async (notificationData) => {
        const response = await api.post('/notifications', notificationData)
        return response.data
    },

    // Get unread count
    getUnreadCount: async () => {
        const response = await api.get('/notifications/unread-count')
        return response.data
    }
}

export default notificationService