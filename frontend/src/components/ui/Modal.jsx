import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { clsx } from 'clsx'
import { X } from 'lucide-react'

const Modal = ({
                   isOpen = false,
                   onClose,
                   title,
                   children,
                   footer,
                   size = 'md',
                   showCloseButton = true,
                   closeOnEscape = true,
                   closeOnOverlayClick = true,
                   preventScroll = true,
                   className = '',
                   overlayClassName = '',
                   contentClassName = '',
                   ...props
               }) => {
    const modalRef = useRef(null)
    const previouslyFocusedElement = useRef(null)

    const sizes = {
        xs: 'max-w-md',
        sm: 'max-w-lg',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
        full: 'max-w-full mx-4'
    }

    // Handle escape key
    useEffect(() => {
        if (!closeOnEscape) return

        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose?.()
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, closeOnEscape, onClose])

    // Handle body scroll
    useEffect(() => {
        if (!preventScroll) return

        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, preventScroll])

    // Handle focus management
    useEffect(() => {
        if (isOpen) {
            previouslyFocusedElement.current = document.activeElement
            modalRef.current?.focus()
        } else {
            previouslyFocusedElement.current?.focus()
        }
    }, [isOpen])

    // Focus trap
    useEffect(() => {
        if (!isOpen) return

        const handleTabKey = (e) => {
            if (e.key !== 'Tab') return

            const focusableElements = modalRef.current?.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )

            if (!focusableElements?.length) return

            const firstElement = focusableElements[0]
            const lastElement = focusableElements[focusableElements.length - 1]

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus()
                    e.preventDefault()
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus()
                    e.preventDefault()
                }
            }
        }

        document.addEventListener('keydown', handleTabKey)
        return () => document.removeEventListener('keydown', handleTabKey)
    }, [isOpen])

    const handleOverlayClick = (e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose?.()
        }
    }

    const handleClose = () => {
        onClose?.()
    }

    if (!isOpen) return null

    const modalContent = (
        <div
            className={clsx(
                'fixed inset-0 z-50 flex items-center justify-center p-4',
                'bg-black bg-opacity-50 backdrop-blur-sm',
                overlayClassName
            )}
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
        >
            <div
                ref={modalRef}
                className={clsx(
                    'relative w-full max-h-full overflow-hidden',
                    'bg-white dark:bg-gray-800 rounded-lg shadow-xl',
                    'transform transition-all duration-300 ease-out',
                    'focus:outline-none',
                    sizes[size],
                    contentClassName
                )}
                tabIndex={-1}
                {...props}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        {title && (
                            <h2
                                id="modal-title"
                                className="text-lg font-semibold text-gray-900 dark:text-white"
                            >
                                {title}
                            </h2>
                        )}

                        {showCloseButton && (
                            <button
                                type="button"
                                onClick={handleClose}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                                aria-label="Close modal"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className={clsx(
                    'overflow-y-auto',
                    !footer ? 'p-6' : 'p-6 pb-0',
                    className
                )}>
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    )

    return createPortal(modalContent, document.body)
}

// Predefined modal variants
export const ConfirmModal = ({
                                 isOpen,
                                 onClose,
                                 onConfirm,
                                 title = 'Confirm Action',
                                 message,
                                 confirmText = 'Confirm',
                                 cancelText = 'Cancel',
                                 variant = 'danger',
                                 loading = false,
                             }) => {
    const confirmVariants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
        success: 'bg-green-600 hover:bg-green-700 text-white'
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        disabled={loading}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={clsx(
                            'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            confirmVariants[variant]
                        )}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Processing...
                            </>
                        ) : (
                             confirmText
                         )}
                    </button>
                </>
            }
        >
            <p className="text-gray-600 dark:text-gray-400">
                {message}
            </p>
        </Modal>
    )
}

export default Modal