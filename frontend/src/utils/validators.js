// validators.js - Enhanced validation utilities

// Email validation
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

// Phone validation (US format)
export const validatePhone = (phone) => {
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/
    const digitsOnly = phone.replace(/\D/g, '')
    return phoneRegex.test(phone) || digitsOnly.length === 10
}

// Format phone number
export const formatPhoneNumber = (phone) => {
    const digits = phone.replace(/\D/g, '')

    if (digits.length === 0) return ''
    if (digits.length <= 3) return `(${digits}`
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    if (digits.length <= 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`

    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
}

// ZIP code validation
export const validateZipCode = (zipCode) => {
    const zipRegex = /^\d{5}(-\d{4})?$/
    return zipRegex.test(zipCode)
}

// Required field validation
export const validateRequired = (value, fieldName = 'Field') => {
    if (value === null || value === undefined || value === '') {
        return `${fieldName} is required`
    }
    if (typeof value === 'string' && value.trim() === '') {
        return `${fieldName} is required`
    }
    return ''
}

// Minimum length validation
export const validateMinLength = (value, minLength, fieldName = 'Field') => {
    if (!value || value.length < minLength) {
        return `${fieldName} must be at least ${minLength} characters long`
    }
    return ''
}

// Maximum length validation
export const validateMaxLength = (value, maxLength, fieldName = 'Field') => {
    if (value && value.length > maxLength) {
        return `${fieldName} cannot exceed ${maxLength} characters`
    }
    return ''
}

// Numeric validation
export const validateNumeric = (value, fieldName = 'Field', options = {}) => {
    const { min, max, integer = false } = options

    if (value === '' || value === null || value === undefined) {
        return ''
    }

    const numValue = parseFloat(value)

    if (isNaN(numValue)) {
        return `${fieldName} must be a valid number`
    }

    if (integer && !Number.isInteger(numValue)) {
        return `${fieldName} must be a whole number`
    }

    if (min !== undefined && numValue < min) {
        return `${fieldName} must be at least ${min}`
    }

    if (max !== undefined && numValue > max) {
        return `${fieldName} cannot exceed ${max}`
    }

    return ''
}

// Currency validation
export const validateCurrency = (value, fieldName = 'Amount') => {
    if (!value) return `${fieldName} is required`

    const numericValue = value.toString().replace(/[$,]/g, '')
    const amount = parseFloat(numericValue)

    if (isNaN(amount)) {
        return `${fieldName} must be a valid monetary amount`
    }

    if (amount < 0) {
        return `${fieldName} cannot be negative`
    }

    if (amount > 10000000) {
        return `${fieldName} cannot exceed $10,000,000`
    }

    return ''
}

// Date validation
export const validateDate = (date, fieldName = 'Date', options = {}) => {
    const { minDate, maxDate, required = false } = options

    if (!date) {
        return required ? `${fieldName} is required` : ''
    }

    const dateObj = new Date(date)

    if (isNaN(dateObj.getTime())) {
        return `${fieldName} must be a valid date`
    }

    if (minDate && dateObj < new Date(minDate)) {
        return `${fieldName} cannot be earlier than ${formatDate(minDate)}`
    }

    if (maxDate && dateObj > new Date(maxDate)) {
        return `${fieldName} cannot be later than ${formatDate(maxDate)}`
    }

    return ''
}

// Parcel ID validation
export const validateParcelId = (parcelId) => {
    if (!parcelId) return 'Parcel ID is required'

    // Common parcel ID formats: PAR-001-001, 123-456-789, etc.
    const parcelRegex = /^[A-Z0-9-]{3,20}$/i

    if (!parcelRegex.test(parcelId)) {
        return 'Please enter a valid Parcel ID format'
    }

    return ''
}

// License number validation
export const validateLicenseNumber = (licenseNumber, licenseType = 'License') => {
    if (!licenseNumber) return `${licenseType} number is required`

    // Remove spaces and hyphens for validation
    const cleaned = licenseNumber.replace(/[\s-]/g, '')

    if (cleaned.length < 6) {
        return `${licenseType} number must be at least 6 characters`
    }

    if (cleaned.length > 20) {
        return `${licenseType} number cannot exceed 20 characters`
    }

    return ''
}

// BTU validation for gas permits
export const validateBTU = (btu, fieldName = 'BTU Input') => {
    const error = validateNumeric(btu, fieldName, { min: 1, max: 1000000, integer: true })
    if (error) return error

    const btuValue = parseInt(btu)

    if (btuValue > 200000) {
        // Warning for high BTU values
        return {
            type: 'warning',
            message: 'High BTU installations may require special permits and utility coordination'
        }
    }

    return ''
}

// Password strength validation
export const validatePasswordStrength = (password) => {
    if (!password) return 'Password is required'

    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    const errors = []

    if (password.length < minLength) {
        errors.push(`At least ${minLength} characters`)
    }
    if (!hasUpperCase) {
        errors.push('One uppercase letter')
    }
    if (!hasLowerCase) {
        errors.push('One lowercase letter')
    }
    if (!hasNumbers) {
        errors.push('One number')
    }
    if (!hasSpecialChar) {
        errors.push('One special character')
    }

    if (errors.length > 0) {
        return `Password must contain: ${errors.join(', ')}`
    }

    return ''
}

// Contractor license validation
export const validateContractorLicense = (licenseData) => {
    const errors = {}

    if (!licenseData.name?.trim()) {
        errors.name = 'Contractor name is required'
    }

    if (!licenseData.licenseNumber?.trim()) {
        errors.licenseNumber = 'License number is required'
    }

    if (!licenseData.licenseType) {
        errors.licenseType = 'License type is required'
    }

    if (!licenseData.expirationDate) {
        errors.expirationDate = 'Expiration date is required'
    } else {
        const expDate = new Date(licenseData.expirationDate)
        const today = new Date()

        if (expDate <= today) {
            errors.expirationDate = 'License has expired'
        } else if (expDate <= new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)) {
            errors.expirationDate = {
                type: 'warning',
                message: 'License expires within 30 days'
            }
        }
    }

    const phoneError = validatePhone(licenseData.phoneNumber || '')
    if (phoneError) {
        errors.phoneNumber = phoneError
    }

    const emailError = validateEmail(licenseData.email || '')
    if (licenseData.email && emailError) {
        errors.email = emailError
    }

    return errors
}

// Building permit validation
export const validateBuildingPermit = (permitData) => {
    const errors = {}

    // Basic required fields
    if (!permitData.permitFor) {
        errors.permitFor = 'Permit type is required'
    }

    const costError = validateCurrency(permitData.projectCost, 'Project cost')
    if (costError) {
        errors.projectCost = costError
    }

    if (!permitData.workDescription?.trim()) {
        errors.workDescription = 'Work description is required'
    } else if (permitData.workDescription.trim().length < 10) {
        errors.workDescription = 'Please provide a detailed description (at least 10 characters)'
    }

    if (!permitData.buildingType) {
        errors.buildingType = 'Building type is required'
    }

    if (!permitData.occupancyType) {
        errors.occupancyType = 'Occupancy type is required'
    }

    // Professional services validation
    const projectCost = parseFloat(permitData.projectCost?.replace(/[$,]/g, '') || 0)
    const isLargeProject = projectCost > 50000
    const isMajorWork = ['NEW_CONSTRUCTION', 'MAJOR_RENOVATION', 'STRUCTURAL_ADDITION'].includes(permitData.permitFor)

    if ((isLargeProject || isMajorWork) && !permitData.hasArchitect) {
        errors.hasArchitect = {
            type: 'warning',
            message: 'An architect may be required for this type of project'
        }
    }

    if ((isLargeProject || isMajorWork) && !permitData.hasEngineer) {
        errors.hasEngineer = {
            type: 'warning',
            message: 'An engineer may be required for this type of project'
        }
    }

    return errors
}

// Gas permit validation
export const validateGasPermit = (permitData) => {
    const errors = {}

    if (!permitData.workType) {
        errors.workType = 'Work type is required'
    }

    if (!permitData.gasType) {
        errors.gasType = 'Gas type is required'
    }

    if (!permitData.installationType) {
        errors.installationType = 'Installation type is required'
    }

    const btuError = validateBTU(permitData.totalBtuInput)
    if (btuError) {
        errors.totalBtuInput = btuError
    }

    const lengthError = validateNumeric(permitData.gasLineLengthFeet, 'Gas line length', { min: 1, max: 500, integer: true })
    if (lengthError) {
        errors.gasLineLengthFeet = lengthError
    }

    const applianceError = validateNumeric(permitData.numberOfAppliances, 'Number of appliances', { min: 1, max: 20, integer: true })
    if (applianceError) {
        errors.numberOfAppliances = applianceError
    }

    const costError = validateCurrency(permitData.projectCost, 'Project cost')
    if (costError) {
        errors.projectCost = costError
    }

    if (!permitData.workDescription?.trim()) {
        errors.workDescription = 'Work description is required'
    }

    if (!permitData.applianceDetails?.trim()) {
        errors.applianceDetails = 'Appliance details are required'
    }

    // Safety validation warnings
    const btuValue = parseInt(permitData.totalBtuInput || 0)
    const lineLength = parseInt(permitData.gasLineLengthFeet || 0)

    if (btuValue > 200000) {
        errors._warnings = errors._warnings || []
        errors._warnings.push('High BTU installation may require utility company coordination')
    }

    if (lineLength > 100) {
        errors._warnings = errors._warnings || []
        errors._warnings.push('Long gas line runs may require additional inspection points')
    }

    if (permitData.gasType === 'PROPANE' && btuValue > 100000) {
        errors._warnings = errors._warnings || []
        errors._warnings.push('High BTU propane installations require special safety considerations')
    }

    return errors
}

// Complete form validation
export const validatePermitForm = (formData, permitType) => {
    const allErrors = {}

    // Contact info validation
    if (formData.contactInfo) {
        const contactErrors = {}

        if (!formData.contactInfo.firstName?.trim()) {
            contactErrors.firstName = 'First name is required'
        }

        if (!formData.contactInfo.lastName?.trim()) {
            contactErrors.lastName = 'Last name is required'
        }

        const emailError = validateEmail(formData.contactInfo.email || '')
        if (!formData.contactInfo.email) {
            contactErrors.email = 'Email is required'
        } else if (emailError) {
            contactErrors.email = 'Please enter a valid email address'
        }

        const phoneError = validatePhone(formData.contactInfo.phone || '')
        if (!formData.contactInfo.phone) {
            contactErrors.phone = 'Phone number is required'
        } else if (phoneError) {
            contactErrors.phone = 'Please enter a valid phone number'
        }

        if (!formData.contactInfo.address1?.trim()) {
            contactErrors.address1 = 'Address is required'
        }

        if (!formData.contactInfo.city?.trim()) {
            contactErrors.city = 'City is required'
        }

        if (!formData.contactInfo.state) {
            contactErrors.state = 'State is required'
        }

        const zipError = validateZipCode(formData.contactInfo.zipCode || '')
        if (!formData.contactInfo.zipCode) {
            contactErrors.zipCode = 'ZIP code is required'
        } else if (zipError) {
            contactErrors.zipCode = 'Please enter a valid ZIP code'
        }

        if (Object.keys(contactErrors).length > 0) {
            allErrors.contactInfo = contactErrors
        }
    }

    // Location info validation
    if (formData.locationInfo) {
        const locationErrors = {}

        const parcelError = validateParcelId(formData.locationInfo.parcelId)
        if (parcelError) {
            locationErrors.parcelId = parcelError
        }

        if (!formData.locationInfo.propertyAddress?.trim()) {
            locationErrors.propertyAddress = 'Property address is required'
        }

        if (!formData.locationInfo.propertyOwnerName?.trim()) {
            locationErrors.propertyOwnerName = 'Property owner name is required'
        }

        if (!formData.locationInfo.zoningClassification) {
            locationErrors.zoningClassification = 'Zoning classification is required'
        }

        if (Object.keys(locationErrors).length > 0) {
            allErrors.locationInfo = locationErrors
        }
    }

    // Permit-specific validation
    if (permitType === 'building' && formData.permitInfo) {
        const permitErrors = validateBuildingPermit(formData.permitInfo)
        if (Object.keys(permitErrors).length > 0) {
            allErrors.permitInfo = permitErrors
        }
    }

    if (permitType === 'gas' && formData.permitInfo) {
        const permitErrors = validateGasPermit(formData.permitInfo)
        if (Object.keys(permitErrors).length > 0) {
            allErrors.permitInfo = permitErrors
        }
    }

    // Contractor license validation
    if (formData.contractorLicense && Object.keys(formData.contractorLicense).length > 0) {
        const contractorErrors = validateContractorLicense(formData.contractorLicense)
        if (Object.keys(contractorErrors).length > 0) {
            allErrors.contractorLicense = contractorErrors
        }
    }

    return allErrors
}

// Business rule validations
export const validateBusinessRules = (formData, permitType) => {
    const warnings = []
    const errors = []

    if (permitType === 'building') {
        const projectCost = parseFloat(formData.permitInfo?.projectCost?.replace(/[$,]/g, '') || 0)

        // Large project warnings
        if (projectCost > 100000) {
            warnings.push('Large projects may require additional review time')
        }

        // Professional services requirements
        if (projectCost > 50000 && !formData.permitInfo?.hasArchitect) {
            warnings.push('Projects over $50,000 typically require an architect')
        }

        // Contractor requirements
        if (formData.contactInfo?.applicantType === 'CONTRACTOR' && !formData.contractorLicense?.licenseNumber) {
            errors.push('Contractor license information is required for contractor applicants')
        }

        // Debris disposal requirements
        if (['NEW_CONSTRUCTION', 'DEMOLITION', 'MAJOR_RENOVATION'].includes(formData.permitInfo?.permitFor)) {
            if (!formData.debrisDisposal?.dumpsterLocation) {
                warnings.push('Debris disposal plan may be required for this type of work')
            }
        }
    }

    if (permitType === 'gas') {
        const btuInput = parseInt(formData.permitInfo?.totalBtuInput || 0)
        const lineLength = parseInt(formData.permitInfo?.gasLineLengthFeet || 0)

        // High BTU warnings
        if (btuInput > 200000) {
            warnings.push('High BTU installations require utility company coordination')
        }

        // Long line warnings
        if (lineLength > 100) {
            warnings.push('Long gas line runs may require additional inspection points')
        }

        // Pressure test requirements
        if (btuInput > 50000 || lineLength > 50) {
            if (!formData.permitInfo?.requiresPressureTest) {
                warnings.push('Pressure testing may be required for this installation')
            }
        }

        // Gas contractor license
        if (!formData.gasContractorLicense?.licenseNumber) {
            errors.push('Gas contractor license is required for all gas work')
        }
    }

    return { warnings, errors }
}

// File validation
export const validateFile = (file, options = {}) => {
    const {
        maxSize = 10 * 1024 * 1024, // 10MB default
        allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'],
        required = false
    } = options

    if (!file) {
        return required ? 'File is required' : ''
    }

    if (file.size > maxSize) {
        return `File size cannot exceed ${Math.round(maxSize / 1024 / 1024)}MB`
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        const types = allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')
        return `File must be one of: ${types}`
    }

    return ''
}

// Comprehensive form completion check
export const isFormComplete = (formData, permitType) => {
    const errors = validatePermitForm(formData, permitType)
    return Object.keys(errors).length === 0
}

// Get validation summary
export const getValidationSummary = (formData, permitType) => {
    const errors = validatePermitForm(formData, permitType)
    const { warnings } = validateBusinessRules(formData, permitType)

    const totalErrors = Object.values(errors).reduce((count, sectionErrors) => {
        return count + Object.keys(sectionErrors).length
    }, 0)

    const completedSections = []
    const incompleteSections = []

    if (!errors.contactInfo) completedSections.push('Contact Information')
    else incompleteSections.push('Contact Information')

    if (!errors.locationInfo) completedSections.push('Property Location')
    else incompleteSections.push('Property Location')

    if (!errors.permitInfo) completedSections.push(`${permitType.charAt(0).toUpperCase() + permitType.slice(1)} Details`)
    else incompleteSections.push(`${permitType.charAt(0).toUpperCase() + permitType.slice(1)} Details`)

    return {
        totalErrors,
        warnings: warnings.length,
        completedSections,
        incompleteSections,
        isComplete: totalErrors === 0,
        completionPercentage: Math.round((completedSections.length / (completedSections.length + incompleteSections.length)) * 100)
    }
}

export default {
    validateEmail,
    validatePhone,
    formatPhoneNumber,
    validateZipCode,
    validateRequired,
    validateMinLength,
    validateMaxLength,
    validateNumeric,
    validateCurrency,
    validateDate,
    validateParcelId,
    validateLicenseNumber,
    validateBTU,
    validatePasswordStrength,
    validateContractorLicense,
    validateBuildingPermit,
    validateGasPermit,
    validatePermitForm,
    validateBusinessRules,
    validateFile,
    isFormComplete,
    getValidationSummary
}