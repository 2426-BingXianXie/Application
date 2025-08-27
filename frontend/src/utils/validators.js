// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Phone number regex (US format)
const PHONE_REGEX = /^(\+1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})(\s?(ext|x|extension)[-.\s]?(\d+))?$/

// ZIP code regex (US format)
const ZIP_REGEX = /^\d{5}(-\d{4})?$/

// License number regex (alphanumeric with possible hyphens)
const LICENSE_REGEX = /^[A-Za-z0-9-]+$/

// Basic validation functions
export const validators = {
    // Required field validator
    required: (value) => {
        if (value === null || value === undefined || value === '') {
            return 'This field is required'
        }
        if (typeof value === 'string' && value.trim() === '') {
            return 'This field is required'
        }
        return null
    },

    // Email validator
    email: (value) => {
        if (!value) return null // Only validate if value exists
        if (!EMAIL_REGEX.test(value.trim())) {
            return 'Please enter a valid email address'
        }
        return null
    },

    // Phone number validator
    phone: (value) => {
        if (!value) return null
        const cleanPhone = value.replace(/\D/g, '')
        if (cleanPhone.length < 10) {
            return 'Phone number must be at least 10 digits'
        }
        if (!PHONE_REGEX.test(value)) {
            return 'Please enter a valid phone number'
        }
        return null
    },

    // ZIP code validator
    zipCode: (value) => {
        if (!value) return null
        if (!ZIP_REGEX.test(value)) {
            return 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)'
        }
        return null
    },

    // Number validator
    number: (value) => {
        if (!value) return null
        const num = parseFloat(value)
        if (isNaN(num)) {
            return 'Please enter a valid number'
        }
        return null
    },

    // Positive number validator
    positiveNumber: (value) => {
        if (!value) return null
        const num = parseFloat(value)
        if (isNaN(num) || num <= 0) {
            return 'Please enter a positive number'
        }
        return null
    },

    // Integer validator
    integer: (value) => {
        if (!value) return null
        const num = parseInt(value)
        if (isNaN(num) || !Number.isInteger(num)) {
            return 'Please enter a whole number'
        }
        return null
    },

    // Minimum length validator
    minLength: (min) => (value) => {
        if (!value) return null
        if (value.length < min) {
            return `Must be at least ${min} characters long`
        }
        return null
    },

    // Maximum length validator
    maxLength: (max) => (value) => {
        if (!value) return null
        if (value.length > max) {
            return `Must be no more than ${max} characters long`
        }
        return null
    },

    // Minimum value validator
    min: (min) => (value) => {
        if (!value) return null
        const num = parseFloat(value)
        if (isNaN(num) || num < min) {
            return `Must be at least ${min}`
        }
        return null
    },

    // Maximum value validator
    max: (max) => (value) => {
        if (!value) return null
        const num = parseFloat(value)
        if (isNaN(num) || num > max) {
            return `Must be no more than ${max}`
        }
        return null
    },

    // Date validator
    date: (value) => {
        if (!value) return null
        const date = new Date(value)
        if (isNaN(date.getTime())) {
            return 'Please enter a valid date'
        }
        return null
    },

    // Future date validator
    futureDate: (value) => {
        if (!value) return null
        const date = new Date(value)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (isNaN(date.getTime())) {
            return 'Please enter a valid date'
        }
        if (date <= today) {
            return 'Date must be in the future'
        }
        return null
    },

    // Past date validator
    pastDate: (value) => {
        if (!value) return null
        const date = new Date(value)
        const today = new Date()

        if (isNaN(date.getTime())) {
            return 'Please enter a valid date'
        }
        if (date >= today) {
            return 'Date must be in the past'
        }
        return null
    },

    // License number validator
    licenseNumber: (value) => {
        if (!value) return null
        if (!LICENSE_REGEX.test(value)) {
            return 'License number can only contain letters, numbers, and hyphens'
        }
        if (value.length < 3) {
            return 'License number must be at least 3 characters'
        }
        return null
    },

    // Currency validator
    currency: (value) => {
        if (!value) return null
        const cleanValue = value.toString().replace(/[$,]/g, '')
        const num = parseFloat(cleanValue)
        if (isNaN(num) || num < 0) {
            return 'Please enter a valid dollar amount'
        }
        return null
    },

    // Percentage validator
    percentage: (value) => {
        if (!value) return null
        const num = parseFloat(value)
        if (isNaN(num) || num < 0 || num > 100) {
            return 'Please enter a percentage between 0 and 100'
        }
        return null
    },

    // URL validator
    url: (value) => {
        if (!value) return null
        try {
            new URL(value)
            return null
        } catch {
            return 'Please enter a valid URL'
        }
    }
}

// Individual validator exports for easier importing
export const validateRequired = validators.required
export const validateEmail = validators.email
export const validatePhone = validators.phone
export const validateZipCode = validators.zipCode
export const validateNumber = validators.number
export const validatePositiveNumber = validators.positiveNumber
export const validateInteger = validators.integer
export const validateDate = validators.date
export const validateFutureDate = validators.futureDate
export const validatePastDate = validators.pastDate
export const validateLicenseNumber = validators.licenseNumber
export const validateCurrency = validators.currency
export const validatePercentage = validators.percentage
export const validateUrl = validators.url

// Phone number formatter
export const formatPhoneNumber = (value) => {
    if (!value) return ''

    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '')

    // Format based on length
    if (cleaned.length <= 3) {
        return cleaned
    } else if (cleaned.length <= 6) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
    } else if (cleaned.length <= 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    } else {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)} ext. ${cleaned.slice(10)}`
    }
}

// Composite validators for common field types
export const compositeValidators = {
    requiredEmail: [validators.required, validators.email],
    requiredPhone: [validators.required, validators.phone],
    requiredZipCode: [validators.required, validators.zipCode],
    requiredPositiveNumber: [validators.required, validators.positiveNumber],
    requiredCurrency: [validators.required, validators.currency],
    requiredFutureDate: [validators.required, validators.futureDate],
    requiredLicenseNumber: [validators.required, validators.licenseNumber]
}

// Business rule validators
export const businessValidators = {
    // Project cost validation based on permit type
    projectCost: (value, formData) => {
        const cost = parseFloat(value)
        if (isNaN(cost)) return 'Please enter a valid project cost'

        // Different thresholds for different permit types
        const permitType = formData.buildingPermitInfo?.permitFor || formData.gasPermitInfo?.workType

        if (permitType === 'NEW_CONSTRUCTION' && cost < 1000) {
            return 'New construction projects must be at least $1,000'
        }

        if (cost > 10000000) {
            return 'Project cost exceeds maximum limit of $10,000,000'
        }

        return null
    },

    // Contractor license expiration
    licenseExpiration: (value) => {
        if (!value) return null

        const expirationDate = new Date(value)
        const today = new Date()
        const thirtyDaysFromNow = new Date()
        thirtyDaysFromNow.setDate(today.getDate() + 30)

        if (expirationDate < today) {
            return 'License has expired'
        }

        if (expirationDate < thirtyDaysFromNow) {
            return 'License expires within 30 days - renewal may be required'
        }

        return null
    },

    // Gas line sizing validation
    gasLineSize: (value, formData) => {
        const size = parseFloat(value)
        const btuInput = parseInt(formData.gasPermitInfo?.totalBtuInput)

        if (isNaN(size) || isNaN(btuInput)) return null

        // Simple BTU to line size validation
        const minimumSize = btuInput > 200000 ? 1.25 :
                            btuInput > 100000 ? 1.0 :
                            btuInput > 50000 ? 0.75 : 0.5

        if (size < minimumSize) {
            return `Gas line size too small for ${btuInput} BTU. Minimum size: ${minimumSize}"`
        }

        return null
    },

    // Building height validation
    buildingHeight: (value, formData) => {
        const height = parseFloat(value)
        const buildingType = formData.buildingPermitInfo?.buildingType
        const zoningClassification = formData.locationInfo?.zoningClassification

        if (isNaN(height)) return null

        // Basic height restrictions
        const maxHeights = {
            RESIDENTIAL: 35, // feet
            COMMERCIAL: 60,
            INDUSTRIAL: 100
        }

        const maxHeight = maxHeights[buildingType] || 35

        if (height > maxHeight) {
            return `Building height exceeds ${maxHeight}ft limit for ${buildingType.toLowerCase()} buildings`
        }

        return null
    },

    // Work description validation
    workDescription: (value, formData) => {
        if (!value || value.trim().length < 10) {
            return 'Work description must be at least 10 characters'
        }

        if (value.length > 1000) {
            return 'Work description must be less than 1000 characters'
        }

        // Check for required keywords for certain permit types
        const permitType = formData.buildingPermitInfo?.permitFor
        const description = value.toLowerCase()

        if (permitType === 'DEMOLITION' && !description.includes('demolition')) {
            return 'Demolition permits must include "demolition" in the description'
        }

        return null
    },

    // Address validation
    propertyAddress: (value, formData) => {
        if (!value || value.trim().length < 5) {
            return 'Please enter a complete property address'
        }

        // Basic address format check
        const addressPattern = /\d+.*\w/
        if (!addressPattern.test(value.trim())) {
            return 'Address should include a street number'
        }

        return null
    }
}

// Validate entire form
export const validateForm = (formData, permitType = 'building') => {
    const errors = {}

    // Contact Info validation
    const contactValidation = {
        'contactInfo.firstName': validators.required,
        'contactInfo.lastName': validators.required,
        'contactInfo.email': compositeValidators.requiredEmail,
        'contactInfo.phone': compositeValidators.requiredPhone,
        'contactInfo.address1': validators.required,
        'contactInfo.city': validators.required,
        'contactInfo.state': validators.required,
        'contactInfo.zipCode': compositeValidators.requiredZipCode
    }

    // Location validation
    const locationValidation = {
        'locationInfo.propertyAddress': [validators.required, businessValidators.propertyAddress],
        'permitInfo.applicantType': validators.required
    }

    // Permit-specific validation
    const permitValidation = permitType === 'building' ? {
        'buildingPermitInfo.permitFor': validators.required,
        'buildingPermitInfo.projectCost': [validators.required, businessValidators.projectCost],
        'buildingPermitInfo.workDescription': [validators.required, businessValidators.workDescription],
        'buildingPermitInfo.buildingType': validators.required,
        'buildingPermitInfo.occupancyType': validators.required
    } : {
        'gasPermitInfo.workType': validators.required,
        'gasPermitInfo.gasType': validators.required,
        'gasPermitInfo.installationType': validators.required,
        'gasPermitInfo.totalBtuInput': compositeValidators.requiredPositiveNumber,
        'gasPermitInfo.workDescription': [validators.required, businessValidators.workDescription]
    }

    // Combine all validations
    const allValidations = {
        ...contactValidation,
        ...locationValidation,
        ...permitValidation
    }

    // Apply validations
    Object.entries(allValidations).forEach(([path, validationRules]) => {
        const value = getValueByPath(formData, path)
        const rules = Array.isArray(validationRules) ? validationRules : [validationRules]

        for (const rule of rules) {
            const error = rule(value, formData)
            if (error) {
                errors[path] = error
                break
            }
        }
    })

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}

// Helper function to get nested object values
const getValueByPath = (obj, path) => {
    const keys = path.split('.')
    let current = obj

    for (const key of keys) {
        if (current && current[key] !== undefined) {
            current = current[key]
        } else {
            return ''
        }
    }

    return current
}

// Async validators (for API validation)
export const asyncValidators = {
    // Check if email already exists
    emailExists: async (email) => {
        if (!email || !EMAIL_REGEX.test(email)) return null

        try {
            // This would call your API to check email
            // const response = await authService.checkEmailExists(email)
            // return response.exists ? 'Email already registered' : null
            return null // Placeholder
        } catch (error) {
            console.error('Email validation error:', error)
            return null
        }
    },

    // Validate contractor license
    contractorLicense: async (licenseNumber, licenseType) => {
        if (!licenseNumber || !licenseType) return null

        try {
            // This would call your API to validate license
            // const response = await contractorService.validateLicense(licenseNumber, licenseType)
            // return response.isValid ? null : response.message
            return null // Placeholder
        } catch (error) {
            console.error('License validation error:', error)
            return 'Unable to validate license at this time'
        }
    },

    // Validate parcel ID
    parcelId: async (parcelId) => {
        if (!parcelId) return null

        try {
            // This would call your API to validate parcel
            // const response = await locationService.validateParcel(parcelId)
            // return response.isValid ? null : 'Invalid parcel ID'
            return null // Placeholder
        } catch (error) {
            console.error('Parcel validation error:', error)
            return 'Unable to validate parcel ID at this time'
        }
    }
}

// Form step validation configurations
export const stepValidations = {
    building: {
        0: { // Contact Info
            'contactInfo.firstName': validators.required,
            'contactInfo.lastName': validators.required,
            'contactInfo.email': compositeValidators.requiredEmail,
            'contactInfo.phone': compositeValidators.requiredPhone,
            'contactInfo.address1': validators.required,
            'contactInfo.city': validators.required,
            'contactInfo.state': validators.required,
            'contactInfo.zipCode': compositeValidators.requiredZipCode
        },
        1: { // Location & Applicant
            'locationInfo.propertyAddress': [validators.required, businessValidators.propertyAddress],
            'permitInfo.applicantType': validators.required
        },
        2: { // Permit Information
            'buildingPermitInfo.permitFor': validators.required,
            'buildingPermitInfo.projectCost': [validators.required, businessValidators.projectCost],
            'buildingPermitInfo.workDescription': [validators.required, businessValidators.workDescription],
            'buildingPermitInfo.tenantOwnerName': validators.required,
            'buildingPermitInfo.tenantOwnerPhone': validators.phone,
            'buildingPermitInfo.tenantOwnerAddress': validators.required,
            'buildingPermitInfo.buildingType': validators.required,
            'buildingPermitInfo.occupancyType': validators.required
        },
        3: { // Contractor License (conditional)
            'contractorLicense.name': validators.required,
            'contractorLicense.address': validators.required,
            'contractorLicense.city': validators.required,
            'contractorLicense.state': validators.required,
            'contractorLicense.zipCode': validators.zipCode,
            'contractorLicense.phoneNumber': validators.phone,
            'contractorLicense.licenseType': validators.required,
            'contractorLicense.licenseNumber': compositeValidators.requiredLicenseNumber,
            'contractorLicense.licenseExpiration': [validators.required, businessValidators.licenseExpiration]
        },
        4: { // Home Improvement Registration (optional)
            // Only validated if HIC fields are filled
        },
        5: { // Debris Disposal
            'debrisDisposal.dumpsterLocation': validators.required,
            'debrisDisposal.companyName': validators.required
        }
    },
    gas: {
        0: { // Contact Info - same as building
            'contactInfo.firstName': validators.required,
            'contactInfo.lastName': validators.required,
            'contactInfo.email': compositeValidators.requiredEmail,
            'contactInfo.phone': compositeValidators.requiredPhone,
            'contactInfo.address1': validators.required,
            'contactInfo.city': validators.required,
            'contactInfo.state': validators.required,
            'contactInfo.zipCode': compositeValidators.requiredZipCode
        },
        1: { // Location & Applicant - same as building
            'locationInfo.propertyAddress': [validators.required, businessValidators.propertyAddress],
            'permitInfo.applicantType': validators.required
        },
        2: { // Gas Permit Information
            'gasPermitInfo.workType': validators.required,
            'gasPermitInfo.gasType': validators.required,
            'gasPermitInfo.installationType': validators.required,
            'gasPermitInfo.totalBtuInput': compositeValidators.requiredPositiveNumber,
            'gasPermitInfo.gasLineLengthFeet': validators.positiveNumber,
            'gasPermitInfo.numberOfAppliances': validators.integer,
            'gasPermitInfo.gasLineSizeInches': [validators.required, businessValidators.gasLineSize],
            'gasPermitInfo.workDescription': [validators.required, businessValidators.workDescription]
        },
        3: { // Gas Contractor License
            'contractorLicense.name': validators.required,
            'contractorLicense.licenseNumber': compositeValidators.requiredLicenseNumber,
            'contractorLicense.licenseType': validators.required,
            'contractorLicense.licenseExpiration': [validators.required, businessValidators.licenseExpiration]
        }
    }
}

// Validate specific step
export const validateStep = (stepIndex, formData, permitType = 'building') => {
    const stepRules = stepValidations[permitType]?.[stepIndex] || {}
    const errors = {}
    let isValid = true

    Object.entries(stepRules).forEach(([path, validationRules]) => {
        // Skip contractor validation if applicant is owner
        if (path.startsWith('contractorLicense.') &&
            getValueByPath(formData, 'permitInfo.applicantType') === 'owner') {
            return
        }

        const value = getValueByPath(formData, path)
        const rules = Array.isArray(validationRules) ? validationRules : [validationRules]

        for (const rule of rules) {
            const error = rule(value, formData)
            if (error) {
                errors[path] = error
                isValid = false
                break
            }
        }
    })

    return { isValid, errors }
}

// Custom validation rules for specific business logic
export const customValidationRules = {
    // Validate that architect is required for certain building types
    architectRequired: (formData) => {
        const buildingType = getValueByPath(formData, 'buildingPermitInfo.buildingType')
        const projectCost = parseFloat(getValueByPath(formData, 'buildingPermitInfo.projectCost'))
        const hasArchitect = getValueByPath(formData, 'permitInfo.hasArchitect')

        if ((buildingType === 'COMMERCIAL' || projectCost > 100000) && !hasArchitect) {
            return 'Architect is required for commercial buildings or projects over $100,000'
        }

        return null
    },

    // Validate gas contractor certification
    gasCertificationRequired: (formData) => {
        const workType = getValueByPath(formData, 'gasPermitInfo.workType')
        const btuInput = parseInt(getValueByPath(formData, 'gasPermitInfo.totalBtuInput'))

        if ((workType === 'COMMERCIAL' || btuInput > 400000)) {
            // Additional certification requirements would be checked here
            return null // Placeholder for actual certification validation
        }

        return null
    }
}

export default validators