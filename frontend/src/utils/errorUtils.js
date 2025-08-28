// Error handling utilities for consistent error management

// Error types
export const ERROR_TYPES = {
    NETWORK: 'NETWORK_ERROR',
    VALIDATION: 'VALIDATION_ERROR',
    AUTHORIZATION: 'AUTHORIZATION_ERROR',
    NOT_FOUND: 'NOT_FOUND_ERROR',
    SERVER: 'SERVER_ERROR',
    TIMEOUT: 'TIMEOUT_ERROR',
    UNKNOWN: 'UNKNOWN_ERROR'
}

// Error severity levels
export const ERROR_SEVERITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
}

// Transform API error to user-friendly message
export const transformApiError = (error) => {
    if (!error) return 'An unknown error occurred'

    // Handle different error response formats
    if (error.response) {
        const { status, data } = error.response

        switch (status) {
            case 400:
                return data?.message || 'Invalid request. Please check your input.'
            case 401:
                return 'You are not authorized. Please log in again.'
            case 403:
                return 'You do not have permission to perform this action.'
            case 404:
                return 'The requested resource was not found.'
            case 422:
                return data?.message || 'Validation failed. Please check your input.'
            case 429:
                return 'Too many requests. Please wait before trying again.'
            case 500:
                return 'Internal server error. Please try again later.'
            case 502:
                return 'Service temporarily unavailable. Please try again later.'
            case 503:
                return 'Service under maintenance. Please try again later.'
            default:
                return data?.message || `Request failed with status ${status}`
        }
    }

    // Handle network errors
    if (error.request) {
        return 'Network error. Please check your connection and try again.'
    }

    // Handle other errors
    return error.message || 'An unexpected error occurred'
}

// Get error type from error object
export const getErrorType = (error) => {
    if (!error) return ERROR_TYPES.UNKNOWN

    if (error.code === 'NETWORK_ERROR' || !error.response) {
        return ERROR_TYPES.NETWORK
    }

    if (error.response) {
        const { status } = error.response

        switch (status) {
            case 400:
            case 422:
                return ERROR_TYPES.VALIDATION
            case 401:
            case 403:
                return ERROR_TYPES.AUTHORIZATION
            case 404:
                return ERROR_TYPES.NOT_FOUND
            case 408:
                return ERROR_TYPES.TIMEOUT
            case 500:
            case 502:
            case 503:
                return ERROR_TYPES.SERVER
            default:
                return ERROR_TYPES.UNKNOWN
        }
    }

    return ERROR_TYPES.UNKNOWN
}

// Get error severity
export const getErrorSeverity = (error) => {
    const errorType = getErrorType(error)

    switch (errorType) {
        case ERROR_TYPES.NETWORK:
        case ERROR_TYPES.SERVER:
            return ERROR_SEVERITY.HIGH
        case ERROR_TYPES.AUTHORIZATION:
            return ERROR_SEVERITY.MEDIUM
        case ERROR_TYPES.VALIDATION:
        case ERROR_TYPES.NOT_FOUND:
            return ERROR_SEVERITY.LOW
        case ERROR_TYPES.TIMEOUT:
            return ERROR_SEVERITY.MEDIUM
        default:
            return ERROR_SEVERITY.MEDIUM
    }
}

// Create standardized error object
export const createError = (type, message, details = {}) => {
    return {
        type,
        message,
        severity: getErrorSeverity({ type }),
        timestamp: new Date().toISOString(),
        id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...details
    }
}

// Log error with context
export const logError = (error, context = {}) => {
    const errorInfo = {
        error: error.message || error,
        stack: error.stack,
        type: getErrorType(error),
        severity: getErrorSeverity(error),
        timestamp: new Date().toISOString(),
        context,
        userAgent: navigator.userAgent,
        url: window.location.href
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
        console.error('Error logged:', errorInfo)
    }

    // In production, you might send to error tracking service
    if (process.env.NODE_ENV === 'production') {
        // Send to error tracking service (Sentry, LogRocket, etc.)
        // errorTrackingService.log(errorInfo)
    }

    return errorInfo
}

// Retry function with exponential backoff
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
    let lastError

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn()
        } catch (error) {
            lastError = error

            if (attempt < maxRetries) {
                const delay = baseDelay * Math.pow(2, attempt)
                await new Promise(resolve => setTimeout(resolve, delay))
                console.log(`Retry attempt ${attempt + 1} after ${delay}ms delay`)
            }
        }
    }

    throw lastError
}

// Validate error response format
export const isApiError = (error) => {
    return error &&
           error.response &&
           typeof error.response.status === 'number'
}

// Extract validation errors from API response
export const extractValidationErrors = (error) => {
    if (!error?.response?.data) return {}

    const { data } = error.response

    // Handle different validation error formats
    if (data.errors && Array.isArray(data.errors)) {
        // Format: { errors: [{ field: 'email', message: 'Invalid email' }] }
        return data.errors.reduce((acc, err) => {
            acc[err.field] = err.message
            return acc
        }, {})
    }

    if (data.fieldErrors) {
        // Format: { fieldErrors: { email: 'Invalid email', phone: 'Required' } }
        return data.fieldErrors
    }

    if (data.validationErrors) {
        // Format: { validationErrors: { ... } }
        return data.validationErrors
    }

    return {}
}

// Handle async operation with error handling
export const handleAsyncOperation = async (operation, options = {}) => {
    const {
        onSuccess,
        onError,
        retries = 0,
        timeout = 30000
    } = options

    try {
        // Add timeout if specified
        const operationWithTimeout = timeout > 0
                                     ? Promise.race([
                                                        operation(),
                                                        new Promise((_, reject) =>
                                                                        setTimeout(() => reject(new Error('Operation timed out')), timeout)
                                                        )
                                                    ])
                                     : operation()

        // Execute with retries if specified
        const result = retries > 0
                       ? await retryWithBackoff(async () => operationWithTimeout, retries)
                       : await operationWithTimeout

        onSuccess?.(result)
        return { success: true, data: result }

    } catch (error) {
        const errorInfo = logError(error, { operation: operation.name })
        onError?.(error, errorInfo)
        return {
            success: false,
            error: transformApiError(error),
            errorInfo
        }
    }
}

// Error boundary helper
export const createErrorBoundary = (fallbackComponent) => {
    return class ErrorBoundary extends React.Component {
        constructor(props) {
            super(props)
            this.state = { hasError: false, error: null }
        }

        static getDerivedStateFromError(error) {
            return { hasError: true, error }
        }

        componentDidCatch(error, errorInfo) {
            logError(error, { componentStack: errorInfo.componentStack })
        }

        render() {
            if (this.state.hasError) {
                return fallbackComponent || <div>Something went wrong.</div>
            }

            return this.props.children
        }
    }
}

// Debounced error handler (prevents spam)
export const createDebouncedErrorHandler = (handler, delay = 1000) => {
    let timeoutId

    return (error) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => handler(error), delay)
    }
}

// Error recovery suggestions
export const getErrorRecoveryActions = (error) => {
    const errorType = getErrorType(error)

    switch (errorType) {
        case ERROR_TYPES.NETWORK:
            return [
                { label: 'Check internet connection', action: 'check_connection' },
                { label: 'Retry request', action: 'retry' },
                { label: 'Try again later', action: 'wait' }
            ]
        case ERROR_TYPES.AUTHORIZATION:
            return [
                { label: 'Log in again', action: 'login' },
                { label: 'Contact administrator', action: 'contact_admin' }
            ]
        case ERROR_TYPES.VALIDATION:
            return [
                { label: 'Check form inputs', action: 'validate_form' },
                { label: 'Review requirements', action: 'show_help' }
            ]
        case ERROR_TYPES.NOT_FOUND:
            return [
                { label: 'Go back', action: 'go_back' },
                { label: 'Search again', action: 'search' }
            ]
        case ERROR_TYPES.SERVER:
            return [
                { label: 'Try again later', action: 'wait' },
                { label: 'Contact support', action: 'contact_support' }
            ]
        default:
            return [
                { label: 'Refresh page', action: 'refresh' },
                { label: 'Contact support', action: 'contact_support' }
            ]
    }
}

export default {
    ERROR_TYPES,
    ERROR_SEVERITY,
    transformApiError,
    getErrorType,
    getErrorSeverity,
    createError,
    logError,
    retryWithBackoff,
    isApiError,
    extractValidationErrors,
    handleAsyncOperation,
    createErrorBoundary,
    createDebouncedErrorHandler,
    getErrorRecoveryActions
}