import React, { createContext, useContext, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { clsx } from 'clsx'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

// Toast Context
const ToastContext = createContext()

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

// Individual Toast Component
const Toast = ({
                   id,
                   type = 'info',
                   title,
                   message,
                   duration = 5000,
                   dismissible = true,
                   onDismiss,
                   actions
               }) => {
    const [isVisible, setIsVisible] = useState(true)
    const [isRemoving, setIsRemoving] = useState(false)

    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        warning: AlertTriangle,
        info: Info
    }

    const styles = {
        success: {
            container: 'bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-700',
            icon: 'text-green-400',
            title: 'text-green-800 dark:text-green-200',
            message: 'text-green-700 dark:text-green-300'
        },
        error: {
            container: 'bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-700',
            icon: 'text-red-400',
            title: 'text-red-800 dark:text-red-200',
            message: 'text-red-700 dark:text-red-300'
        },
        warning: {
            container: 'bg-yellow-50 dark:bg-yellow-900/50 border-yellow-200 dark:border-yellow-700',
            icon: 'text-yellow-400',
            title: 'text-yellow-800 dark:text-yellow-200',
            message: 'text-yellow-700 dark:text-yellow-300'
        },
        info: {
            container: 'bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-700',
            icon: 'text-blue-400',
            title: 'text-blue-800 dark:text-blue-200',
            message: 'text-blue-700 dark:text-blue-300'
        }
    }

    const IconComponent = icons[type]
    const style = styles[type]

    // Auto-dismiss
    React.useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                handleDismiss()
            }, duration)

            return () => clearTimeout(timer)
        }
    }, [duration])

    const handleDismiss = () => {
        setIsRemoving(true)
        setTimeout(() => {
            setIsVisible(false)
            onDismiss?.(id)
        }, 200)
    }

    if (!isVisible) return null

    return (
        <div
            className={clsx(
                'max-w-sm w-full border rounded-lg shadow-lg pointer-events-auto',
                'transform transition-all duration-300 ease-out',
                isRemoving ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100',
                style.container
            )}
        >
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <IconComponent className={clsx('h-5 w-5', style.icon)} />
                    </div>

                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        {title && (
                            <p className={clsx('text-sm font-medium', style.title)}>
                                {title}
                            </p>
                        )}
                        {message && (
                            <p className={clsx('text-sm', title && 'mt-1', style.message)}>
                                {message}
                            </p>
                        )}

                        {actions && (
                            <div className="mt-3 flex space-x-3">
                                {actions}
                            </div>
                        )}
                    </div>

                    {dismissible && (
                        <div className="ml-4 flex-shrink-0 flex">
                            <button
                                onClick={handleDismiss}
                                className={clsx(
                                    'rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2',
                                    style.icon
                                )}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Toast Container
const ToastContainer = ({ toasts, onDismiss }) => {
    const container = (
        <div
            aria-live="assertive"
            className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50"
        >
            <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        {...toast}
                        onDismiss={onDismiss}
                    />
                ))}
            </div>
        </div>
    )

    return createPortal(container, document.body)
}

// Toast Provider
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback((toast) => {
        const id = Date.now() + Math.random()
        const newToast = { id, ...toast }

        setToasts(prev => [...prev, newToast])

        return id
    }, [])

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    const clearAllToasts = useCallback(() => {
        setToasts([])
    }, [])

    // Convenience methods
    const success = useCallback((message, options = {}) => {
        return addToast({ type: 'success', message, ...options })
    }, [addToast])

    const error = useCallback((message, options = {}) => {
        return addToast({ type: 'error', message, duration: 0, ...options })
    }, [addToast])

    const warning = useCallback((message, options = {}) => {
        return addToast({ type: 'warning', message, ...options })
    }, [addToast])

    const info = useCallback((message, options = {}) => {
        return addToast({ type: 'info', message, ...options })
    }, [addToast])

    const value = {
        toasts,
        addToast,
        removeToast,
        clearAllToasts,
        success,
        error,
        warning,
        info
    }

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={removeToast} />
        </ToastContext.Provider>
    )
}

export default Toast