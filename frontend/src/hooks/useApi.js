import { useState, useCallback } from 'react'
import { useToast } from '../components/ui/Toast'

export const useApi = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const { error: showError } = useToast()

    const execute = useCallback(async (apiCall, options = {}) => {
        const { showErrorToast = true, showLoadingState = true } = options

        try {
            if (showLoadingState) setLoading(true)
            setError(null)

            const result = await apiCall()
            return result
        } catch (err) {
            const errorMessage = err.message || 'An unexpected error occurred'
            setError(errorMessage)

            if (showErrorToast) {
                showError(errorMessage)
            }

            throw err
        } finally {
            if (showLoadingState) setLoading(false)
        }
    }, [showError])

    return {
        loading,
        error,
        execute,
        setError,
        clearError: () => setError(null)
    }
}