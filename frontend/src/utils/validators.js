/**
 * Validation utility functions
 * Centralized validation logic for forms and data
 */

// Email validation
export const validateEmail = (email) => {
    const emailRegex = /^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\.[A-Za-z]{2,})$/
    return emailRegex.test(email)
}

// Phone number validation
export const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/[^\d]/g, '')
    const phoneRegex = /^[1-9]\d{9}$/ // US phone number format
    return phoneRegex.test(cleanPhone)
}

// ZIP code validation
export const validateZipCode = (zipCode) => {
    const zipRegex = /^[0-9]{5}(-[0-9]{4})?$/
    return zipRegex.test(zipCode)
}

// SSN validation
export const validateSSN = (ssn) => {
    const ssnRegex = /^\d{3}-\d{2}-\d{4}$/
    return ssnRegex.test(ssn)
}

// Password strength validation
export const validatePasswordStrength = (password) => {
    const requirements = {
        minLength: password.length >= 8,
        hasLowercase: /[a-z]/.test(password),
        hasUppercase: /[A-Z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecialChar: /[^a-zA-Z\d]/.test(password),
    }

    const score = Object.values(requirements).filter(Boolean).length
    const isStrong = score >= 4

    return {
        isValid: isStrong,
        score,
        requirements,
        feedback: generatePasswordFeedback(requirements)
    }
}

const generatePasswordFeedback = (requirements) => {
    const feedback = []

    if (!requirements.minLength) feedback.push('At least 8 characters')
    if (!requirements.hasLowercase) feedback.push('Include lowercase letters')
    if (!requirements.hasUppercase) feedback.push('Include uppercase letters')
    if (!requirements.hasNumber) feedback.push('Include numbers')
    if (!requirements.hasSpecialChar) feedback.push('Include special characters')

    return feedback
}

// URL validation
export const validateUrl = (url) => {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

// Date validation
export const validateDate = (date, minDate = null, maxDate = null) => {
    const dateObj = new Date(date)

    if (isNaN(dateObj.getTime())) {
        return { isValid: false, message: 'Invalid date format' }
    }

    if (minDate && dateObj < new Date(minDate)) {
        return { isValid: false, message: `Date must be after ${minDate}` }
    }

    if (maxDate && dateObj > new Date(maxDate)) {
        return { isValid: false, message: `Date must be before ${maxDate}` }
    }

    return { isValid: true, message: '' }
}

// Future date validation
export const validateFutureDate = (date) => {
    const dateObj = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return dateObj > today
}

// Past date validation
export const validatePastDate = (date) => {
    const dateObj = new Date(date)
    const today = new Date()

    return dateObj < today
}

// Numeric validation
export const validateNumber = (value, min = null, max = null) => {
    const num = parseFloat(value)

    if (isNaN(num)) {
        return { isValid: false, message: 'Must be a valid number' }
    }

    if (min !== null && num < min) {
        return { isValid: false, message: `Must be at least ${min}` }
    }

    if (max !== null && num > max) {
        return { isValid: false, message: `Must be no more than ${max}` }
    }

    return { isValid: true, message: '' }
}

// Positive number validation
export const validatePositiveNumber = (value) => {
    const num = parseFloat(value)
    return !isNaN(num) && num > 0
}

// Integer validation
export const validateInteger = (value) => {
    const num = parseInt(value)
    return !isNaN(num) && Number.isInteger(num)
}

// File validation
export const validateFile = (file, allowedTypes = [], maxSize = 10485760) => {
    const errors = []

    if (!file) {
        errors.push('File is required')
        return { isValid: false, errors }
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        errors.push(`File type ${file.type} is not allowed`)
    }

    // Check file size
    if (file.size > maxSize) {
        const maxSizeMB = (maxSize / 1024 / 1024).toFixed(1)
        errors.push(`File size must be less than ${maxSizeMB}MB`)
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

// License number validation
export const validateLicenseNumber = (licenseNumber, permitType = 'building') => {
    if (!licenseNumber || licenseNumber.length < 6) {
        return { isValid: false, message: 'License number must be at least 6 characters' }
    }

    // Basic format validation (you can make this more specific)
    const basicRegex = /^[A-Z0-9]{6,20}$/i
    if (!basicRegex.test(licenseNumber)) {
        return { isValid: false, message: 'Invalid license number format' }
    }

    return { isValid: true, message: '' }
}

// Permit number validation
export const validatePermitNumber = (permitNumber) => {
    if (!permitNumber) {
        return { isValid: false, message: 'Permit number is required' }
    }

    // Format: BP123456789 or GP123456789
    const permitRegex = /^(BP|GP|EP|PP)\d{9,}$/
    if (!permitRegex.test(permitNumber)) {
        return { isValid: false, message: 'Invalid permit number format' }
    }

    return { isValid: true, message: '' }
}

// Address validation
export const validateAddress = (address) => {
    if (!address || address.trim().length < 5) {
        return { isValid: false, message: 'Address must be at least 5 characters' }
    }

    // Basic address pattern (number + street)
    const addressRegex = /^\d+\s+.+/
    if (!addressRegex.test(address.trim())) {
        return { isValid: false, message: 'Address must include a street number' }
    }

    return { isValid: true, message: '' }
}

// Text length validation
export const validateTextLength = (text, minLength = 0, maxLength = Infinity) => {
    const length = text ? text.trim().length : 0

    if (length < minLength) {
        return { isValid: false, message: `Must be at least ${minLength} characters` }
    }

    if (length > maxLength) {
        return { isValid: false, message: `Must be no more than ${maxLength} characters` }
    }

    return { isValid: true, message: '' }
}

// Required field validation
export const validateRequired = (value, fieldName = 'This field') => {
    if (value === null || value === undefined || String(value).trim() === '') {
        return { isValid: false, message: `${fieldName} is required` }
    }
    return { isValid: true, message: '' }
}

// Multiple validation runner
export const runValidations = (value, validations = []) => {
    for (const validation of validations) {
        const result = validation(value)
        if (!result.isValid) {
            return result
        }
    }
    return { isValid: true, message: '' }
}

// Form validation helper
export const validateForm = (formData, validationRules) => {
    const errors = {}

    for (const [field, rules] of Object.entries(validationRules)) {
        const value = formData[field]
        const result = runValidations(value, rules)

        if (!result.isValid) {
            errors[field] = result.message
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}

// Async validation helper
export const validateAsync = async (value, asyncValidator) => {
    try {
        const result = await asyncValidator(value)
        return { isValid: true, message: '', data: result }
    } catch (error) {
        return { isValid: false, message: error.message || 'Validation failed' }
    }
}

export default {
    validateEmail,
    validatePhone,
    validateZipCode,
    validateSSN,
    validatePasswordStrength,
    validateUrl,
    validateDate,
    validateFutureDate,
    validatePastDate,
    validateNumber,
    validatePositiveNumber,
    validateInteger,
    validateFile,
    validateLicenseNumber,
    validatePermitNumber,
    validateAddress,
    validateTextLength,
    validateRequired,
    runValidations,
    validateForm,
    validateAsync,
}