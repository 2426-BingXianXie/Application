import { useState, useEffect, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

export const usePermitForm = (permitType, initialData = {}) => {
    const [formData, setFormData] = useState(initialData)
    const [validationErrors, setValidationErrors] = useState({})
    const [touched, setTouched] = useState({})
    const [isDirty, setIsDirty] = useState(false)

    // Auto-save to localStorage
    const [savedData, setSavedData] = useLocalStorage(`permit-form-${permitType}`, {})

    // Load saved data on mount
    useEffect(() => {
        if (Object.keys(savedData).length > 0 && Object.keys(initialData).length === 0) {
            setFormData(savedData)
        }
    }, [savedData, initialData])

    // Auto-save when form data changes
    useEffect(() => {
        if (isDirty) {
            const timeoutId = setTimeout(() => {
                setSavedData(formData)
            }, 1000) // Save after 1 second of inactivity

            return () => clearTimeout(timeoutId)
        }
    }, [formData, isDirty, setSavedData])

    const updateField = useCallback((field, value) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value }
            setIsDirty(true)
            return newData
        })

        // Clear validation error for this field
        if (validationErrors[field]) {
            setValidationErrors(prev => ({ ...prev, [field]: '' }))
        }
    }, [validationErrors])

    const updateNestedField = useCallback((path, value) => {
        setFormData(prev => {
            const newData = { ...prev }
            const keys = path.split('.')
            let current = newData

            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    current[keys[i]] = {}
                }
                current = current[keys[i]]
            }

            current[keys[keys.length - 1]] = value
            setIsDirty(true)
            return newData
        })
    }, [])

    const setFieldTouched = useCallback((field, isTouched = true) => {
        setTouched(prev => ({ ...prev, [field]: isTouched }))
    }, [])

    const setFieldError = useCallback((field, error) => {
        setValidationErrors(prev => ({ ...prev, [field]: error }))
    }, [])

    const clearFieldError = useCallback((field) => {
        setValidationErrors(prev => ({ ...prev, [field]: '' }))
    }, [])

    const resetForm = useCallback(() => {
        setFormData(initialData)
        setValidationErrors({})
        setTouched({})
        setIsDirty(false)
        setSavedData({}) // Clear saved data
    }, [initialData, setSavedData])

    const clearSavedData = useCallback(() => {
        setSavedData({})
    }, [setSavedData])

    const isValid = Object.keys(validationErrors).every(key => !validationErrors[key])
    const hasErrors = Object.keys(validationErrors).some(key => validationErrors[key])

    return {
        formData,
        setFormData,
        updateField,
        updateNestedField,
        validationErrors,
        setValidationErrors,
        touched,
        setFieldTouched,
        setFieldError,
        clearFieldError,
        isDirty,
        isValid,
        hasErrors,
        resetForm,
        clearSavedData,
        hasSavedData: Object.keys(savedData).length > 0
    }
}
