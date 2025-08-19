import React from 'react'
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react'

const ConfirmDialog = ({
                           isOpen,
                           onClose,
                           onConfirm,
                           title = 'Confirm Action',
                           message = 'Are you sure you want to proceed?',
                           confirmText = 'Confirm',
                           cancelText = 'Cancel',
                           type = 'warning', // 'warning', 'danger', 'info', 'success'
                           isLoading = false,
                       }) => {
    if (!isOpen) return null

    const getIcon = () => {
        switch (type) {
            case 'danger':
                return <AlertTriangle className="w-6 h-6 text-red-600" />
            case 'success':
                return <CheckCircle className="w-6 h-6 text-green-600" />
            case 'info':
                return <Info className="w-6 h-6 text-blue-600" />
            default:
                return <AlertTriangle className="w-6 h-6 text-yellow-600" />
        }
    }

    const getConfirmButtonClass = () => {
        switch (type) {
            case 'danger':
                return 'btn btn-danger'
            case 'success':
                return 'btn btn-success'
            case 'info':
                return 'btn btn-primary'
            default:
                return 'btn btn-warning'
        }
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

            {/* Dialog */}
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Content */}
                    <div className="px-6 pt-6 pb-4">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                {getIcon()}
                            </div>

                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    {title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {message}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex flex-col sm:flex-row-reverse space-y-2 sm:space-y-0 sm:space-x-3 sm:space-x-reverse">
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`${getConfirmButtonClass()} ${isLoading ? 'btn-disabled' : ''}`}
                        >
                            {isLoading ? 'Processing...' : confirmText}
                        </button>

                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="btn btn-outline"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDialog