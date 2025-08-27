import React, { createContext, useContext, useReducer, useCallback } from 'react'
import toast from 'react-hot-toast'

// Notification Context
const NotificationContext = createContext()

// Export the context for direct use
export { NotificationContext }

// Notification Types
export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
    LOADING: 'loading'
}

// Notification Categories
export const NOTIFICATION_CATEGORIES = {
    PERMIT: 'permit',
    AUTH: 'auth',
    VALIDATION: 'validation',
    SYSTEM: 'system',
    DOCUMENT: 'document'
}

// Action Types
const NOTIFICATION_ACTIONS = {
    ADD_NOTIFICATION: 'ADD_NOTIFICATION',
    REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
    CLEAR_ALL: 'CLEAR_ALL',
    MARK_AS_READ: 'MARK_AS_READ',
    UPDATE_PREFERENCES: 'UPDATE_PREFERENCES'
}

// Initial State
const initialState = {
    notifications: [],
    preferences: {
        [NOTIFICATION_CATEGORIES.PERMIT]: true,
        [NOTIFICATION_CATEGORIES.AUTH]: true,
        [NOTIFICATION_CATEGORIES.VALIDATION]: true,
        [NOTIFICATION_CATEGORIES.SYSTEM]: true,
        [NOTIFICATION_CATEGORIES.DOCUMENT]: true,
        showToasts: true,
        soundEnabled: false
    }
}

// Notification Reducer
const notificationReducer = (state, action) => {
    switch (action.type) {
        case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
            return {
                ...state,
                notifications: [action.payload, ...state.notifications.slice(0, 49)] // Keep last 50
            }

        case NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION:
            return {
                ...state,
                notifications: state.notifications.filter(n => n.id !== action.payload)
            }

        case NOTIFICATION_ACTIONS.CLEAR_ALL:
            return {
                ...state,
                notifications: []
            }

        case NOTIFICATION_ACTIONS.MARK_AS_READ:
            return {
                ...state,
                notifications: state.notifications.map(n =>
                                                           n.id === action.payload ? { ...n, read: true } : n
                )
            }

        case NOTIFICATION_ACTIONS.UPDATE_PREFERENCES:
            return {
                ...state,
                preferences: { ...state.preferences, ...action.payload }
            }

        default:
            return state
    }
}

// Generate unique ID
const generateId = () => `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// Notification Provider Component
export const NotificationProvider = ({ children }) => {
    const [state, dispatch] = useReducer(notificationReducer, initialState)

    // Add notification
    const addNotification = useCallback((notification) => {
        const id = generateId()
        const timestamp = new Date().toISOString()

        const fullNotification = {
            id,
            timestamp,
            read: false,
            ...notification
        }

        // Check if category is enabled
        const categoryEnabled = state.preferences[notification.category] !== false

        if (categoryEnabled) {
            // Add to state
            dispatch({
                         type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
                         payload: fullNotification
                     })

            // Show toast if enabled
            if (state.preferences.showToasts) {
                showToast(notification.type, notification.title, notification.message)
            }

            // Play sound if enabled
            if (state.preferences.soundEnabled) {
                playNotificationSound(notification.type)
            }
        }

        return id
    }, [state.preferences])

    // Show toast notification
    const showToast = (type, title, message) => {
        const toastMessage = title ? `${title}: ${message}` : message

        switch (type) {
            case NOTIFICATION_TYPES.SUCCESS:
                toast.success(toastMessage)
                break
            case NOTIFICATION_TYPES.ERROR:
                toast.error(toastMessage)
                break
            case NOTIFICATION_TYPES.WARNING:
                toast(toastMessage, { icon: '⚠️' })
                break
            case NOTIFICATION_TYPES.INFO:
                toast(toastMessage, { icon: 'ℹ️' })
                break
            case NOTIFICATION_TYPES.LOADING:
                toast.loading(toastMessage)
                break
            default:
                toast(toastMessage)
        }
    }

    // Play notification sound
    const playNotificationSound = (type) => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)()
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)

            // Different frequencies for different notification types
            const frequencies = {
                [NOTIFICATION_TYPES.SUCCESS]: 800,
                [NOTIFICATION_TYPES.ERROR]: 400,
                [NOTIFICATION_TYPES.WARNING]: 600,
                [NOTIFICATION_TYPES.INFO]: 500
            }

            oscillator.frequency.setValueAtTime(
                frequencies[type] || 500,
                audioContext.currentTime
            )

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 0.1)
        } catch (error) {
            console.warn('Could not play notification sound:', error)
        }
    }

    // Convenience methods for different notification types
    const showSuccess = useCallback((title, message, options = {}) => {
        return addNotification({
                                   type: NOTIFICATION_TYPES.SUCCESS,
                                   title,
                                   message,
                                   category: NOTIFICATION_CATEGORIES.SYSTEM,
                                   ...options
                               })
    }, [addNotification])

    const showError = useCallback((title, message, options = {}) => {
        return addNotification({
                                   type: NOTIFICATION_TYPES.ERROR,
                                   title,
                                   message,
                                   category: NOTIFICATION_CATEGORIES.SYSTEM,
                                   ...options
                               })
    }, [addNotification])

    const showWarning = useCallback((title, message, options = {}) => {
        return addNotification({
                                   type: NOTIFICATION_TYPES.WARNING,
                                   title,
                                   message,
                                   category: NOTIFICATION_CATEGORIES.SYSTEM,
                                   ...options
                               })
    }, [addNotification])

    const showInfo = useCallback((title, message, options = {}) => {
        return addNotification({
                                   type: NOTIFICATION_TYPES.INFO,
                                   title,
                                   message,
                                   category: NOTIFICATION_CATEGORIES.SYSTEM,
                                   ...options
                               })
    }, [addNotification])

    // Permit-specific notifications
    const showPermitSubmitted = useCallback((permitNumber) => {
        return addNotification({
                                   type: NOTIFICATION_TYPES.SUCCESS,
                                   title: 'Permit Submitted',
                                   message: `Permit ${permitNumber} has been successfully submitted for review.`,
                                   category: NOTIFICATION_CATEGORIES.PERMIT
                               })
    }, [addNotification])

    const showPermitApproved = useCallback((permitNumber) => {
        return addNotification({
                                   type: NOTIFICATION_TYPES.SUCCESS,
                                   title: 'Permit Approved',
                                   message: `Permit ${permitNumber} has been approved. You can now download your permit.`,
                                   category: NOTIFICATION_CATEGORIES.PERMIT
                               })
    }, [addNotification])

    const showPermitRejected = useCallback((permitNumber, reason) => {
        return addNotification({
                                   type: NOTIFICATION_TYPES.ERROR,
                                   title: 'Permit Rejected',
                                   message: `Permit ${permitNumber} has been rejected. ${reason}`,
                                   category: NOTIFICATION_CATEGORIES.PERMIT
                               })
    }, [addNotification])

    const showPermitExpiring = useCallback((permitNumber, daysUntilExpiry) => {
        return addNotification({
                                   type: NOTIFICATION_TYPES.WARNING,
                                   title: 'Permit Expiring Soon',
                                   message: `Permit ${permitNumber} will expire in ${daysUntilExpiry} days.`,
                                   category: NOTIFICATION_CATEGORIES.PERMIT
                               })
    }, [addNotification])

    // Document notifications
    const showDocumentUploaded = useCallback((filename) => {
        return addNotification({
                                   type: NOTIFICATION_TYPES.SUCCESS,
                                   title: 'Document Uploaded',
                                   message: `${filename} has been successfully uploaded.`,
                                   category: NOTIFICATION_CATEGORIES.DOCUMENT
                               })
    }, [addNotification])

    // Validation notifications
    const showValidationError = useCallback((field, message) => {
        return addNotification({
                                   type: NOTIFICATION_TYPES.ERROR,
                                   title: 'Validation Error',
                                   message: `${field}: ${message}`,
                                   category: NOTIFICATION_CATEGORIES.VALIDATION
                               })
    }, [addNotification])

    // Remove notification
    const removeNotification = useCallback((id) => {
        dispatch({
                     type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION,
                     payload: id
                 })
    }, [])

    // Clear all notifications
    const clearAllNotifications = useCallback(() => {
        dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ALL })
    }, [])

    // Mark notification as read
    const markAsRead = useCallback((id) => {
        dispatch({
                     type: NOTIFICATION_ACTIONS.MARK_AS_READ,
                     payload: id
                 })
    }, [])

    // Update notification preferences
    const updatePreferences = useCallback((preferences) => {
        dispatch({
                     type: NOTIFICATION_ACTIONS.UPDATE_PREFERENCES,
                     payload: preferences
                 })

        // Save to localStorage
        storageUtils.setNotificationPreferences(preferences)
    }, [])

    // Get unread count
    const getUnreadCount = useCallback(() => {
        return state.notifications.filter(n => !n.read).length
    }, [state.notifications])

    // Get notifications by category
    const getNotificationsByCategory = useCallback((category) => {
        return state.notifications.filter(n => n.category === category)
    }, [state.notifications])

    // Get recent notifications (last 24 hours)
    const getRecentNotifications = useCallback(() => {
        const oneDayAgo = new Date()
        oneDayAgo.setDate(oneDayAgo.getDate() - 1)

        return state.notifications.filter(n =>
                                              new Date(n.timestamp) > oneDayAgo
        )
    }, [state.notifications])

    // Context value
    const value = {
        // State
        notifications: state.notifications,
        preferences: state.preferences,

        // Basic actions
        addNotification,
        removeNotification,
        clearAllNotifications,
        markAsRead,
        updatePreferences,

        // Convenience methods
        showSuccess,
        showError,
        showWarning,
        showInfo,

        // Domain-specific methods
        showPermitSubmitted,
        showPermitApproved,
        showPermitRejected,
        showPermitExpiring,
        showDocumentUploaded,
        showValidationError,

        // Utilities
        getUnreadCount,
        getNotificationsByCategory,
        getRecentNotifications,

        // Constants
        types: NOTIFICATION_TYPES,
        categories: NOTIFICATION_CATEGORIES
    }

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    )
}

// Custom hook to use notification context
export const useNotifications = () => {
    const context = useContext(NotificationContext)

    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider')
    }

    return context
}

export default NotificationContext