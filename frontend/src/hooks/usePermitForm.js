import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { storageUtils } from '../utils/storageUtils'
import { validators } from '../utils/validators'
import { useNotifications } from '../context/NotificationContext'
import { usePermitValidation } from './usePermits'

// Initial form data structure
const getInitialFormData = (permitType = 'building') => ({
    // Contact Information
    contactInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipCode: ''
    },

    // Location Information
    locationInfo: {
        searchQuery: '',
        parcelId: '',
        propertyAddress: '',
        propertyCity: '',
        propertyState: '',
        propertyZipCode: '',
        propertyOwnerName: '',
        latitude: null,
        longitude: null,
        lotSizeSqft: null,
        zoningClassification: ''
    },

    // Base Permit Information
    permitInfo: {
        applicantType: '',
        hasArchitect: false,
        hasEngineer: false
    },

    // Building-specific information
    buildingPermitInfo: permitType === 'building' ? {
        permitFor: '',
        projectCost: '',
        workDescription: '',
        tenantOwnerName: '',
        tenantOwnerPhone: '',
        tenantOwnerAddress: '',
        developmentTitle: '',
        buildingType: '',
        occupancyType: '',
        ownerDoingWork: false
    } : null,

    // Gas-specific information
    gasPermitInfo: permitType === 'gas' ? {
        workType: '',
        gasType: '',
        installationType: '',
        totalBtuInput: '',
        gasLineLengthFeet: '',
        numberOfAppliances: '',
        gasLineSizeInches: '',
        projectCost: '',
        workDescription: '',
        applianceDetails: '',
        requiresMeterUpgrade: false,
        requiresRegulator: false
    } : null,

    // Contractor License
    contractorLicense: {
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phoneNumber: '',
        email: '',
        dba: '',
        licenseType: '',
        licenseNumber: '',
        licenseExpiration: ''
    },

    // Home Improvement Registration
    homeImprovementRegistration: {
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phoneNumber: '',
        email: '',
        dba: '',
        registrationNumber: '',
        registrationExpiration: ''
    },

    // Debris Disposal
    debrisDisposal: {
        dumpsterLocation: '',
        companyName: '',
        disposalMethod: '',
        debrisType: '',
        estimatedVolumeCubicYards: '',
        isHazardousMaterial: false
    }
})

// Main form hook
export const usePermitForm = (permitType = 'building', permitId = null) => {
    const navigate = useNavigate()
    const { showSuccess, showError, showValidationError } = useNotifications()
    const { validatePermit, validationErrors, clearValidation } = usePermitValidation()

    // Form state
    const [formData, setFormData] = useState(() => getInitialFormData(permitType))
    const [currentStep, setCurrentStep] = useState(0)
    const [completedSteps, setCompletedSteps] = useState(new Set())
    const [errors, setErrors] = useState({})
    const [isDirty, setIsDirty] = useState(false)
    const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Auto-save form data
    useEffect(() => {
        if (autoSaveEnabled && isDirty && !permitId) {
            const formId = `permit_${permitType}_draft`
            storageUtils.setFormDraft(formId, {
                formData,
                currentStep,
                completedSteps: Array.from(completedSteps),
                permitType
            })
        }
    }, [formData, currentStep, completedSteps, isDirty, permitType, permitId, autoSaveEnabled])

    // Load saved draft on mount
    useEffect(() => {
        if (!permitId) {
            const formId = `permit_${permitType}_draft`
            const savedDraft = storageUtils.getFormDraft(formId)

            if (savedDraft) {
                setFormData(savedDraft.data.formData)
                setCurrentStep(savedDraft.data.currentStep)
                setCompletedSteps(new Set(savedDraft.data.completedSteps))
                setIsDirty(false)
            }
        }
    }, [permitType, permitId])

    // Update form field
    const updateField = useCallback((path, value) => {
        setFormData(prev => {
            const newData = { ...prev }
            const keys = path.split('.')
            let current = newData

            // Navigate to the correct nested object
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    current[keys[i]] = {}
                }
                current = current[keys[i]]
            }

            // Set the value
            current[keys[keys.length - 1]] = value

            return newData
        })

        setIsDirty(true)

        // Clear field-specific errors
        if (errors[path]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[path]
                return newErrors
            })
        }
    }, [errors])

    // Get field value
    const getFieldValue = useCallback((path) => {
        const keys = path.split('.')
        let current = formData

        for (const key of keys) {
            if (current && current[key] !== undefined) {
                current = current[key]
            } else {
                return ''
            }
        }

        return current
    }, [formData])

    // Validate current step
    const validateCurrentStep = useCallback(() => {
        const stepErrors = {}
        let isValid = true

        // Define validation rules per step based on permit type
        const stepValidationRules = {
            0: { // Contact Info
                'contactInfo.firstName': validators.required,
                'contactInfo.lastName': validators.required,
                'contactInfo.email': [validators.required, validators.email],
                'contactInfo.phone': validators.required,
                'contactInfo.address1': validators.required,
                'contactInfo.city': validators.required,
                'contactInfo.state': validators.required,
                'contactInfo.zipCode': validators.required
            },
            1: { // Location Info
                'locationInfo.propertyAddress': validators.required,
                'permitInfo.applicantType': validators.required
            },
            2: { // Permit Info
                ...(permitType === 'building' ? {
                    'buildingPermitInfo.permitFor': validators.required,
                    'buildingPermitInfo.projectCost': [validators.required, validators.number],
                    'buildingPermitInfo.workDescription': validators.required,
                    'buildingPermitInfo.buildingType': validators.required,
                    'buildingPermitInfo.occupancyType': validators.required
                } : {
                    'gasPermitInfo.workType': validators.required,
                    'gasPermitInfo.gasType': validators.required,
                    'gasPermitInfo.installationType': validators.required,
                    'gasPermitInfo.workDescription': validators.required
                })
            },
            3: { // Contractor License (if applicable)
                ...(getFieldValue('permitInfo.applicantType') === 'contractor' ? {
                    'contractorLicense.name': validators.required,
                    'contractorLicense.address': validators.required,
                    'contractorLicense.licenseNumber': validators.required,
                    'contractorLicense.licenseType': validators.required,
                    'contractorLicense.licenseExpiration': validators.required
                } : {})
            }
        }

        const currentStepRules = stepValidationRules[currentStep] || {}

        // Validate each field in current step
        Object.entries(currentStepRules).forEach(([path, validationRules]) => {
            const value = getFieldValue(path)
            const rules = Array.isArray(validationRules) ? validationRules : [validationRules]

            for (const rule of rules) {
                const error = rule(value, formData)
                if (error) {
                    stepErrors[path] = error
                    isValid = false
                    break
                }
            }
        })

        setErrors(stepErrors)
        return { isValid, errors: stepErrors }
    }, [currentStep, getFieldValue, formData, permitType])

    // Navigate to next step
    const nextStep = useCallback(() => {
        const validation = validateCurrentStep()

        if (validation.isValid) {
            setCompletedSteps(prev => new Set([...prev, currentStep]))
            setCurrentStep(prev => prev + 1)
            clearValidation()
        } else {
            showValidationError('Form Validation', 'Please fix the errors before continuing')
        }
    }, [validateCurrentStep, currentStep, clearValidation, showValidationError])

    // Navigate to previous step
    const prevStep = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
            clearValidation()
        }
    }, [currentStep, clearValidation])

    // Go to specific step
    const goToStep = useCallback((stepIndex) => {
        if (stepIndex >= 0 && stepIndex !== currentStep) {
            setCurrentStep(stepIndex)
            clearValidation()
        }
    }, [currentStep, clearValidation])

    // Check if step is accessible
    const isStepAccessible = useCallback((stepIndex) => {
        if (stepIndex === 0) return true
        return completedSteps.has(stepIndex - 1)
    }, [completedSteps])

    // Submit form
    const submitForm = useCallback(async (submitAsDraft = false) => {
        try {
            setIsSubmitting(true)

            // Final validation if not saving as draft
            if (!submitAsDraft) {
                const validation = await validatePermit(formData)
                if (!validation.isValid) {
                    setErrors(validation.errors)
                    showValidationError('Validation Failed', 'Please fix all errors before submitting')
                    return { success: false, errors: validation.errors }
                }
            }

            // Transform form data to API format
            const permitData = {
                permitType,
                status: submitAsDraft ? 'DRAFT' : 'SUBMITTED',
                ...formData
            }

            // Submit to API (this would be imported from permit service)
            const response = await (permitId
                                    ? permitService.updatePermit(permitId, permitData)
                                    : permitService.createPermit(permitData)
            )

            // Clear draft if successful submission
            if (!submitAsDraft) {
                const formId = `permit_${permitType}_draft`
                storageUtils.removeFormDraft(formId)

                showSuccess(
                    'Permit Submitted',
                    `Your ${permitType} permit has been submitted successfully.`
                )

                // Navigate to permit details
                navigate(`/permit/${response.id}`)
            } else {
                showSuccess('Draft Saved', 'Your permit draft has been saved.')
            }

            return { success: true, data: response }

        } catch (error) {
            console.error('Form submission error:', error)
            showError('Submission Failed', error.message || 'Failed to submit permit')
            return { success: false, error: error.message }
        } finally {
            setIsSubmitting(false)
        }
    }, [formData, permitType, permitId, validatePermit, showSuccess, showError, showValidationError, navigate])

    // Save as draft
    const saveAsDraft = useCallback(() => {
        return submitForm(true)
    }, [submitForm])

    // Reset form
    const resetForm = useCallback(() => {
        setFormData(getInitialFormData(permitType))
        setCurrentStep(0)
        setCompletedSteps(new Set())
        setErrors({})
        setIsDirty(false)
        clearValidation()

        // Clear saved draft
        const formId = `permit_${permitType}_draft`
        storageUtils.removeFormDraft(formId)
    }, [permitType, clearValidation])

    // Get form progress percentage
    const getProgress = useCallback(() => {
        const totalSteps = permitType === 'building' ? 7 : 6 // Different step counts
        return Math.round(((completedSteps.size + 1) / totalSteps) * 100)
    }, [completedSteps, permitType])

    // Check if form is ready for submission
    const isReadyForSubmission = useCallback(() => {
        const requiredSteps = permitType === 'building' ? [0, 1, 2] : [0, 1, 2] // Core required steps
        return requiredSteps.every(step => completedSteps.has(step))
    }, [completedSteps, permitType])

    // Get validation summary
    const getValidationSummary = useCallback(() => {
        const errorCount = Object.keys(errors).length + Object.keys(validationErrors).length
        const warningCount = 0 // Could be implemented for warnings

        return {
            hasErrors: errorCount > 0,
            errorCount,
            warningCount,
            isValid: errorCount === 0
        }
    }, [errors, validationErrors])

    // Auto-save toggle
    const toggleAutoSave = useCallback(() => {
        setAutoSaveEnabled(prev => !prev)
    }, [])

    return {
        // Form state
        formData,
        currentStep,
        completedSteps,
        errors: { ...errors, ...validationErrors },
        isDirty,
        isSubmitting,
        autoSaveEnabled,

        // Form actions
        updateField,
        getFieldValue,
        nextStep,
        prevStep,
        goToStep,
        submitForm,
        saveAsDraft,
        resetForm,

        // Validation
        validateCurrentStep,
        isStepAccessible,

        // Utilities
        getProgress,
        isReadyForSubmission,
        getValidationSummary,
        toggleAutoSave
    }
}

export default usePermitForm