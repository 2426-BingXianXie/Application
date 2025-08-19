import React, { useState, useEffect } from 'react'
import { CheckCircle, AlertTriangle, Info, X, AlertCircle } from 'lucide-react'

const Toast = ({
                   id,
                   type = 'info',
                   title,
                   message,
                   duration = 5000,
                   onClose,
                   actions = [],
               }) => {
    const [isVisible, setIsVisible] = useState(true)
    const [isExiting, setIsExiting] = useState(false)

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                handleClose()
            }, duration)

            return () => clearTimeout(timer)
        }
    }, [duration])

    const handleClose = () => {
        setIsExiting(true)
        setTimeout(() => {
            setIsVisible(false)
            onClose && onClose(id)
        }, 300) // Match animation duration
    }

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-500" />
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />
            default:
                return <Info className="w-5 h-5 text-blue-500" />
        }
    }

    const getBackgroundClass = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            case 'error':
                return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            case 'warning':
                return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
            default:
                return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
        }
    }

    if (!isVisible) return null

    return (
        <div className={`
      transform transition-all duration-300 ease-in-out
      ${isExiting
        ? 'translate-x-full opacity-0'
        : 'translate-x-0 opacity-100'
        }
    `}>
            <div className={`
        max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 border
        ${getBackgroundClass()}
      `}>
                <div className="p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            {getIcon()}
                        </div>

                        <div className="ml-3 w-0 flex-1">
                            {title && (
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {title}
                                </p>
                            )}
                            {message && (
                                <p className={`text-sm text-gray-600 dark:text-gray-300 ${title ? 'mt-1' : ''}`}>
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
                                            className={`text-sm font-medium ${
                                                action.primary
                                                ? 'text-blue-600 hover:text-blue-500'
                                                : 'text-gray-600 hover:text-gray-500'
                                            }`}
                                        >
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="ml-4 flex-shrink-0 flex">
                            <button
                                onClick={handleClose}
                                className="inline-flex text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Toast Container Component
export const ToastContainer = ({ toasts, onRemove }) => {
    return (
        <div className="fixed top-0 right-0 z-50 p-6 space-y-4 pointer-events-none">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    {...toast}
                    onClose={onRemove}
                />
            ))}
        </div>
    )
}

export default Toast