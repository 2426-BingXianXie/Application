import React, { useEffect, useRef } from 'react'
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react'
import Button from './Button'
import clsx from 'clsx'

const Modal = ({
                   isOpen,
                   onClose,
                   title,
                   children,
                   footer,
                   size = 'md',
                   closeOnOverlay = true,
                   closeOnEscape = true,
                   className = ''
               }) => {
    const modalRef = useRef(null)

    // Handle escape key
    useEffect(() => {
        if (!isOpen || !closeOnEscape) return

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, closeOnEscape, onClose])

    // Handle click outside
    const handleOverlayClick = (e) => {
        if (closeOnOverlay && e.target === e.currentTarget) {
            onClose()
        }
    }

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    // Focus management
    useEffect(() => {
        if (isOpen && modalRef.current) {
            const focusableElements = modalRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
            const firstFocusable = focusableElements[0]
            if (firstFocusable) {
                firstFocusable.focus()
            }
        }
    }, [isOpen])

    if (!isOpen) return null

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-7xl'
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={handleOverlayClick}
            />

            {/* Modal Container */}
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div
                    ref={modalRef}
                    className={clsx(
                        'relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 w-full',
                        sizeClasses[size],
                        className
                    )}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    {/* Header */}
                    {title && (
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3
                                id="modal-title"
                                className="text-lg font-semibold text-gray-900 dark:text-white"
                            >
                                {title}
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
                                aria-label="Close modal"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    )}

                    {/* Body */}
                    <div className="px-6 py-4">
                        {children}
                    </div>

                    {/* Footer */}
                    {footer && (
                        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Confirm Modal Component
export const ConfirmModal = ({
                                 isOpen,
                                 onClose,
                                 onConfirm,
                                 title,
                                 message,
                                 confirmText = 'Confirm',
                                 cancelText = 'Cancel',
                                 variant = 'primary',
                                 loading = false,
                                 icon,
                                 className = ''
                             }) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'danger':
                return {
                    iconBg: 'bg-red-100 dark:bg-red-900',
                    iconColor: 'text-red-600 dark:text-red-400',
                    defaultIcon: AlertTriangle
                }
            case 'warning':
                return {
                    iconBg: 'bg-amber-100 dark:bg-amber-900',
                    iconColor: 'text-amber-600 dark:text-amber-400',
                    defaultIcon: AlertCircle
                }
            case 'success':
                return {
                    iconBg: 'bg-green-100 dark:bg-green-900',
                    iconColor: 'text-green-600 dark:text-green-400',
                    defaultIcon: CheckCircle
                }
            default:
                return {
                    iconBg: 'bg-blue-100 dark:bg-blue-900',
                    iconColor: 'text-blue-600 dark:text-blue-400',
                    defaultIcon: Info
                }
        }
    }

    const variantStyles = getVariantStyles()
    const IconComponent = icon || variantStyles.defaultIcon

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            className={className}
        >
            <div className="text-center">
                {/* Icon */}
                <div className={clsx(
                    'mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4',
                    variantStyles.iconBg
                )}>
                    <IconComponent className={clsx('h-6 w-6', variantStyles.iconColor)} />
                </div>

                {/* Title */}
                {title && (
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {title}
                    </h3>
                )}

                {/* Message */}
                {message && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        {message}
                    </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-center space-x-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={onConfirm}
                        loading={loading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default Modal