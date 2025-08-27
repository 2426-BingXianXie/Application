import React, { createContext, useContext, useState, useEffect } from 'react'

const NotificationContext = createContext()

export const useNotifications = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider')
    }
    return context
}

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)

    // Load notifications from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('notifications')
        if (saved) {
            try {
                const parsedNotifications = JSON.parse(saved)
                setNotifications(parsedNotifications)
                setUnreadCount(parsedNotifications.filter(n => !n.read).length)
            } catch (err) {
                console.error('Error loading notifications:', err)
            }
        }
    }, [])

    // Save notifications to localStorage when they change
    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications))
        setUnreadCount(notifications.filter(n => !n.read).length)
    }, [notifications])

    const addNotification = (notification) => {
        const newNotification = {
            id: Date.now() + Math.random(),
            timestamp: new Date().toISOString(),
            read: false,
            ...notification
        }

        setNotifications(prev => [newNotification, ...prev])
        return newNotification.id
    }

    const markAsRead = (id) => {
        setNotifications(prev =>
                             prev.map(notification =>
                                          notification.id === id
                                          ? { ...notification, read: true }
                                          : notification
                             )
        )
    }

    const markAllAsRead = () => {
        setNotifications(prev =>
                             prev.map(notification => ({ ...notification, read: true }))
        )
    }

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }

    const clearAllNotifications = () => {
        setNotifications([])
    }

    // Permit-specific notification helpers
    const notifyPermitStatusChange = (permitNumber, oldStatus, newStatus) => {
        const statusMessages = {
            SUBMITTED: `Permit ${permitNumber} has been submitted for review`,
            PENDING_REVIEW: `Permit ${permitNumber} is now under review`,
            APPROVED: `Permit ${permitNumber} has been approved! 🎉`,
            REJECTED: `Permit ${permitNumber} has been rejected`,
            EXPIRED: `Permit ${permitNumber} has expired`
        }

        const types = {
            APPROVED: 'success',
            REJECTED: 'error',
            EXPIRED: 'warning'
        }

        addNotification({
                            type: types[newStatus] || 'info',
                            title: 'Permit Status Update',
                            message: statusMessages[newStatus] || `Permit ${permitNumber} status changed to ${newStatus}`,
                            permitId: permitNumber,
                            category: 'permit_status'
                        })
    }

    const notifyDeadlineApproaching = (permitNumber, deadline, daysRemaining) => {
        addNotification({
                            type: 'warning',
                            title: 'Permit Deadline Approaching',
                            message: `Permit ${permitNumber} expires in ${daysRemaining} days (${deadline})`,
                            permitId: permitNumber,
                            category: 'deadline'
                        })
    }

    const notifyDocumentRequired = (permitNumber, documentType) => {
        addNotification({
                            type: 'info',
                            title: 'Document Required',
                            message: `Additional document required for permit ${permitNumber}: ${documentType}`,
                            permitId: permitNumber,
                            category: 'document'
                        })
    }

    const getNotificationsByCategory = (category) => {
        return notifications.filter(n => n.category === category)
    }

    const getUnreadNotifications = () => {
        return notifications.filter(n => !n.read)
    }

    const value = {
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
        notifyPermitStatusChange,
        notifyDeadlineApproaching,
        notifyDocumentRequired,
        getNotificationsByCategory,
        getUnreadNotifications
    }

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    )
}

export default {
    AuthProvider,
    ThemeProvider,
    NotificationProvider,
    useAuth,
    useTheme,
    useNotifications
}