import React, { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import clsx from 'clsx'

const Toast = ({
                   id,
                   type = 'info',
                   title,
                   message,
                   duration = 4000,
                   onClose,
                   actions = [],
                   persistent = false,
                   position = 'top-right'
               }) => {
    const [isVisible, setIsVisible] = useState(false)
    const [isExiting, setIsExiting] = useState(false)

    // Show toast on mount
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 10)
        return () => clearTimeout(timer)
    }, [])

    // Auto-dismiss timer
    useEffect(() => {
        if (!persistent && duration > 0) {
            const timer = setTimeout(() => {
                handleClose()
            }, duration)
            return () => clearTimeout(timer)
        }
    }, [duration, persistent])

    // Handle close animation
    const handleClose = () => {
        setIsExiting(true)
        setTimeout(() => {
            onClose?.(id)
        }, 300) // Match animation duration
    }

    // Toast type configurations
    const typeConfig = {
        success: {
            icon: CheckCircle,
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            borderColor: 'border-green-200 dark:border-green-800',
            iconColor: 'text-green-500 dark:text-green-400',
            titleColor: 'text-green-900 dark:text-green-200',
            messageColor: 'text-green-800 dark:text-green-300',
            progressColor: 'bg-green-500'
        },
        error: {
            icon: AlertCircle,
            bgColor: 'bg-red-50 dark:bg-red-900/20',
            borderColor: 'border-red-200 dark:border-red-800',
            iconColor: 'text-red-500 dark:text-red-400',
            titleColor: 'text-red-900 dark:text-red-200',
            messageColor: 'text-red-800 dark:text-red-300',
            progressColor: 'bg-red-500'
        },
        warning: {
            icon: AlertTriangle,
            bgColor: 'bg-amber-50 dark:bg-amber-900/20',
            borderColor: 'border-amber-200 dark:border-amber-800',
            iconColor: 'text-amber-500 dark:text-amber-400',
            titleColor: 'text-amber-900 dark:text-amber-200',
            messageColor: 'text-amber-800 dark:text-amber-300',
            progressColor: 'bg-amber-500'
        },
        info: {
            icon: Info,
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            borderColor: 'border-blue-200 dark:border-blue-800',
            iconColor: 'text-blue-500 dark:text-blue-400',
            titleColor: 'text-blue-900 dark:text-blue-200',
            messageColor: 'text-blue-800 dark:text-blue-300',
            progressColor: 'bg-blue-500'
        }
    }

    const config = typeConfig[type] || typeConfig.info
    const Icon = config.icon

    // Position classes
    const positionClasses = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    }

    return (
        <div
            className={clsx(
                'fixed z-50 max-w-sm w-full transition-all duration-300 ease-in-out',
                positionClasses[position],
                {
                    'opacity-0 translate-y-2': !isVisible || isExiting,
                    'opacity-100 translate-y-0': isVisible && !isExiting
                }
            )}
        >
            <div
                className={clsx(
                    'relative rounded-lg border shadow-lg p-4',
                    config.bgColor,
                    config.borderColor
                )}
                role="alert"
                aria-live="polite"
            >
                {/* Progress bar for auto-dismiss */}
                {!persistent && duration > 0 && (
                    <div className="absolute bottom-0 left-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
                        <div
                            className={clsx('h-full transition-all ease-linear', config.progressColor)}
                            style={{
                                width: '100%',
                                animation: `toast-progress ${duration}ms linear`
                            }}
                        />
                    </div>
                )}

                <div className="flex items-start">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                        <Icon className={clsx('h-5 w-5', config.iconColor)} />
                    </div>

                    {/* Content */}
                    <div className="ml-3 flex-1">
                        {title && (
                            <h4 className={clsx('text-sm font-medium', config.titleColor)}>
                                {title}
                            </h4>
                        )}
                        {message && (
                            <p className={clsx('text-sm mt-1', config.messageColor)}>
                                {message}
                            </p>
                        )}

                        {/* Actions */}
                        {actions.length > 0 && (
                            <div className="mt-3 flex space-x-2">
                                {actions.map((action, index) => (
                                    <button
                                        key={index}
                                        onClick={action.onClick}
                                        className={clsx(
                                            'inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                                            action.variant === 'primary'
                                            ? clsx(config.progressColor, 'text-white hover:opacity-90')
                                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        )}
                                    >
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Close button */}
                    <div className="flex-shrink-0 ml-3">
                        <button
                            onClick={handleClose}
                            className={clsx(
                                'inline-flex rounded-md p-1.5 transition-colors',
                                'hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10',
                                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                                config.iconColor.replace('text-', 'focus:ring-')
                            )}
                            aria-label="Close notification"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Toast Container Component
export const ToastContainer = ({ toasts = [], position = 'top-right', onRemove }) => {
    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            <div className={clsx(
                'absolute space-y-3',
                {
                    'top-4 right-4': position === 'top-right',
                    'top-4 left-4': position === 'top-left',
                    'top-4 left-1/2 transform -translate-x-1/2': position === 'top-center',
                    'bottom-4 right-4': position === 'bottom-right',
                    'bottom-4 left-4': position === 'bottom-left',
                    'bottom-4 left-1/2 transform -translate-x-1/2': position === 'bottom-center'
                }
            )}>
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast
                            {...toast}
                            onClose={onRemove}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

// Hook for using toasts
export const useToast = () => {
    const [toasts, setToasts] = useState([])

    const addToast = (toast) => {
        const id = Date.now().toString()
        const newToast = { id, ...toast }
        setToasts(prev => [...prev, newToast])
        return id
    }

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }

    const clearAllToasts = () => {
        setToasts([])
    }

    // Convenience methods
    const showSuccess = (title, message, options = {}) => {
        return addToast({ type: 'success', title, message, ...options })
    }

    const showError = (title, message, options = {}) => {
        return addToast({ type: 'error', title, message, ...options })
    }

    const showWarning = (title, message, options = {}) => {
        return addToast({ type: 'warning', title, message, ...options })
    }

    const showInfo = (title, message, options = {}) => {
        return addToast({ type: 'info', title, message, ...options })
    }

    return {
        toasts,
        addToast,
        removeToast,
        clearAllToasts,
        showSuccess,
        showError,
        showWarning,
        showInfo
    }
}

// CSS for progress bar animation (add to your global CSS)
const toastStyles = `
@keyframes toast-progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
`

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style')
    styleSheet.textContent = toastStyles
    document.head.appendChild(styleSheet)
}

export default Toast