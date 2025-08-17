import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'

// Notification Context
const NotificationContext = createContext()

// Notification actions
const NOTIFICATION_ACTIONS = {
    ADD_NOTIFICATION: 'ADD_NOTIFICATION',
    REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
    MARK_AS_READ: 'MARK_AS_READ',
    MARK_ALL_AS_READ: 'MARK_ALL_AS_READ',
    CLEAR_ALL: 'CLEAR_ALL',
    SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
}

// Initial state
const initialState = {
    notifications: [],
    unreadCount: 0,
}

// Notification reducer
const notificationReducer = (state, action) => {
    switch (action.type) {
        case NOTIFICATION_ACTIONS.ADD_NOTIFICATION: {
            const newNotification = {
                id: Date.now() + Math.random(),
                timestamp: new Date(),
                read: false,
                ...action.payload,
            }

            const notifications = [newNotification, ...state.notifications]

            return {
                ...state,
                notifications,
                unreadCount: notifications.filter(n => !n.read).length,
            }
        }

        case NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION: {
            const notifications = state.notifications.filter(
                n => n.id !== action.payload.id
            )

            return {
                ...state,
                notifications,
                unreadCount: notifications.filter(n => !n.read).length,
            }
        }

        case NOTIFICATION_ACTIONS.MARK_AS_READ: {
            const notifications = state.notifications.map(n =>
                                                              n.id === action.payload.id ? { ...n, read: true } : n
            )

            return {
                ...state,
                notifications,
                unreadCount: notifications.filter(n => !n.read).length,
            }
        }

        case NOTIFICATION_ACTIONS.MARK_ALL_AS_READ: {
            const notifications = state.notifications.map(n => ({ ...n, read: true }))

            return {
                ...state,
                notifications,
                unreadCount: 0,
            }
        }

        case NOTIFICATION_ACTIONS.CLEAR_ALL: {
            return {
                ...state,
                notifications: [],
                unreadCount: 0,
            }
        }

        case NOTIFICATION_ACTIONS.SET_NOTIFICATIONS: {
            const notifications = action.payload.notifications

            return {
                ...state,
                notifications,
                unreadCount: notifications.filter(n => !n.read).length,
            }
        }

        default:
            return state
    }
}

// Notification Provider Component
export const NotificationProvider = ({ children }) => {
    const [state, dispatch] = useReducer(notificationReducer, initialState)

    // Load notifications from localStorage on mount
    useEffect(() => {
        const savedNotifications = localStorage.getItem('notifications')
        if (savedNotifications) {
            try {
                const notifications = JSON.parse(savedNotifications).map(n => ({
                    ...n,
                    timestamp: new Date(n.timestamp),
                }))

                dispatch({
                             type: NOTIFICATION_ACTIONS.SET_NOTIFICATIONS,
                             payload: { notifications }
                         })
            } catch (error) {
                console.error('Error loading notifications:', error)
            }
        }
    }, [])

    // Save notifications to localStorage when they change
    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(state.notifications))
    }, [state.notifications])

    // Add notification
    const addNotification = (notification) => {
        dispatch({
                     type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
                     payload: notification
                 })
    }

    // Remove notification
    const removeNotification = (id) => {
        dispatch({
                     type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION,
                     payload: { id }
                 })
    }

    // Mark notification as read
    const markAsRead = (id) => {
        if (id) {
            dispatch({
                         type: NOTIFICATION_ACTIONS.MARK_AS_READ,
                         payload: { id }
                     })
        } else {
            // Mark all as read if no ID provided
            dispatch({
                         type: NOTIFICATION_ACTIONS.MARK_ALL_AS_READ
                     })
        }
    }

    // Clear all notifications
    const clearAll = () => {
        dispatch({
                     type: NOTIFICATION_ACTIONS.CLEAR_ALL
                 })
    }

    // Notification type helpers
    const notifySuccess = (title, message, options = {}) => {
        addNotification({
                            type: 'success',
                            title,
                            message,
                            icon: '✅',
                            ...options
                        })
    }

    const notifyError = (title, message, options = {}) => {
        addNotification({
                            type: 'error',
                            title,
                            message,
                            icon: '❌',
                            ...options
                        })
    }

    const notifyWarning = (title, message, options = {}) => {
        addNotification({
                            type: 'warning',
                            title,
                            message,
                            icon: '⚠️',
                            ...options
                        })
    }

    const notifyInfo = (title, message, options = {}) => {
        addNotification({
                            type: 'info',
                            title,
                            message,
                            icon: 'ℹ️',
                            ...options
                        })
    }

    // Permit-specific notifications
    const notifyPermitStatusChange = (permitNumber, status) => {
        const statusMessages = {
            SUBMITTED: 'Your permit application has been submitted for review',
            UNDER_REVIEW: 'Your permit application is now under review',
            APPROVED: 'Congratulations! Your permit has been approved',
            REJECTED: 'Your permit application has been rejected',
            EXPIRED: 'Your permit has expired',
        }

        const statusIcons = {
            SUBMITTED: '📋',
            UNDER_REVIEW: '👀',
            APPROVED: '✅',
            REJECTED: '❌',
            EXPIRED: '⏰',
        }

        addNotification({
                            type: status === 'APPROVED' ? 'success' : status === 'REJECTED' ? 'error' : 'info',
                            title: `Permit ${permitNumber}`,
                            message: statusMessages[status] || 'Status updated',
                            icon: statusIcons[status] || '📋',
                            category: 'permit',
                            permitNumber,
                        })
    }

    const notifyInspectionScheduled = (permitNumber, inspectionType, date) => {
        addNotification({
                            type: 'info',
                            title: `Inspection Scheduled`,
                            message: `${inspectionType} inspection for permit ${permitNumber} scheduled for ${date}`,
                            icon: '🔍',
                            category: 'inspection',
                            permitNumber,
                        })
    }

    const notifyExpirationWarning = (permitNumber, daysUntilExpiration) => {
        addNotification({
                            type: 'warning',
                            title: `Permit Expiring Soon`,
                            message: `Permit ${permitNumber} expires in ${daysUntilExpiration} days`,
                            icon: '⏰',
                            category: 'expiration',
                            permitNumber,
                        })
    }

    // Format notifications with relative time
    const formatNotifications = (notifications) => {
        return notifications.map(notification => ({
            ...notification,
            time: formatDistanceToNow(notification.timestamp, { addSuffix: true })
        }))
    }

    // Get notifications by category
    const getNotificationsByCategory = (category) => {
        return state.notifications.filter(n => n.category === category)
    }

    // Get recent notifications (last 24 hours)
    const getRecentNotifications = () => {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
        return state.notifications.filter(n => n.timestamp > oneDayAgo)
    }

    const value = {
        // State
        notifications: formatNotifications(state.notifications),
        unreadCount: state.unreadCount,

        // Actions
        addNotification,
        removeNotification,
        markAsRead,
        clearAll,

        // Type-specific helpers
        notifySuccess,
        notifyError,
        notifyWarning,
        notifyInfo,

        // Permit-specific helpers
        notifyPermitStatusChange,
        notifyInspectionScheduled,
        notifyExpirationWarning,

        // Utility functions
        getNotificationsByCategory,
        getRecentNotifications,
    }

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    )
}

// Hook to use notification context
export const useNotifications = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider')
    }
    return context
}