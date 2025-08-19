import React, { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Save, Send } from 'lucide-react'
import StepIndicator from './StepIndicator'
import ContactInfoForm from './ContactInfoForm'
import LocationInfoForm from './LocationInfoForm'
import BuildingPermitForm from './BuildingPermitForm'
import GasPermitForm from './GasPermitForm'
import ContractorLicenseForm from './ContractorLicenseForm'
import DebrisDisposalForm from './DebrisDisposalForm'
import FormValidation from './FormValidation'

const PermitFormWizard = ({
                              permitType = 'building',
                              initialData = {},
                              onSave,
                              onSubmit,
                              onCancel,
                              readOnly = false
                          }) => {
    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState({
                                                 permitType,
                                                 contactInfo: {},
                                                 locationInfo: {},
                                                 permitInfo: {},
                                                 contractorLicense: {},
                                                 debrisDisposal: {},
                                                 hasArchitect: false,
                                                 hasEngineer: false,
                                                 applicantType: 'OWNER',
                                                 ...initialData
                                             })
    const [validationErrors, setValidationErrors] = useState({})
    const [isValidating, setIsValidating] = useState(false)

    // Define steps based on permit type
    const getSteps = useCallback(() => {
        const baseSteps = [
            { id: 'contact', title: 'Contact Information', component: 'contact' },
            { id: 'location', title: 'Property Location', component: 'location' },
        ]

        if (permitType === 'building') {
            return [
                ...baseSteps,
                { id: 'building', title: 'Building Details', component: 'building' },
                { id: 'contractor', title: 'Contractor Information', component: 'contractor' },
                { id: 'debris', title: 'Debris Disposal', component: 'debris' },
                { id: 'review', title: 'Review & Submit', component: 'review' },
            ]
        } else if (permitType === 'gas') {
            return [
                ...baseSteps,
                { id: 'gas', title: 'Gas Installation', component: 'gas' },
                { id: 'contractor', title: 'Gas Contractor', component: 'gas-contractor' },
                { id: 'review', title: 'Review & Submit', component: 'review' },
            ]
        }

        return baseSteps
    }, [permitType])

    const steps = getSteps()

    const updateFormData = useCallback((stepData) => {
        setFormData(prev => ({
            ...prev,
            ...stepData
        }))
    }, [])

    const validateCurrentStep = async () => {
        setIsValidating(true)
        const currentStepData = getCurrentStepData()

        // Perform validation (this would integrate with your validation service)
        const errors = {} // await validateStep(steps[currentStep].id, currentStepData)

        setValidationErrors(errors)
        setIsValidating(false)

        return Object.keys(errors).length === 0
    }

    const getCurrentStepData = () => {
        const step = steps[currentStep]
        switch (step.component) {
            case 'contact':
                return formData.contactInfo
            case 'location':
                return formData.locationInfo
            case 'building':
            case 'gas':
                return formData.permitInfo
            case 'contractor':
            case 'gas-contractor':
                return formData.contractorLicense
            case 'debris':
                return formData.debrisDisposal
            default:
                return {}
        }
    }

    const nextStep = async () => {
        if (await validateCurrentStep()) {
            if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1)
            }
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSave = async () => {
        if (await validateCurrentStep()) {
            onSave && onSave(formData)
        }
    }

    const handleSubmit = async () => {
        if (await validateCurrentStep()) {
            onSubmit && onSubmit(formData)
        }
    }

    const renderStepContent = () => {
        const step = steps[currentStep]

        switch (step.component) {
            case 'contact':
                return (
                    <ContactInfoForm
                        data={formData.contactInfo}
                        onChange={(data) => updateFormData({ contactInfo: data })}
                        readOnly={readOnly}
                        errors={validationErrors.contactInfo}
                    />
                )

            case 'location':
                return (
                    <LocationInfoForm
                        data={formData.locationInfo}
                        onChange={(data) => updateFormData({ locationInfo: data })}
                        readOnly={readOnly}
                        errors={validationErrors.locationInfo}
                    />
                )

            case 'building':
                return (
                    <BuildingPermitForm
                        data={formData.permitInfo}
                        onChange={(data) => updateFormData({ permitInfo: data })}
                        readOnly={readOnly}
                        errors={validationErrors.permitInfo}
                    />
                )

            case 'gas':
                return (
                    <GasPermitForm
                        data={formData.permitInfo}
                        onChange={(data) => updateFormData({ permitInfo: data })}
                        readOnly={readOnly}
                        errors={validationErrors.permitInfo}
                    />
                )

            case 'contractor':
            case 'gas-contractor':
                return (
                    <ContractorLicenseForm
                        data={formData.contractorLicense}
                        onChange={(data) => updateFormData({ contractorLicense: data })}
                        permitType={permitType}
                        readOnly={readOnly}
                        errors={validationErrors.contractorLicense}
                    />
                )

            case 'debris':
                return (
                    <DebrisDisposalForm
                        data={formData.debrisDisposal}
                        onChange={(data) => updateFormData({ debrisDisposal: data })}
                        readOnly={readOnly}
                        errors={validationErrors.debrisDisposal}
                    />
                )

            case 'review':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Review Your Application
                        </h3>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                                Application Summary
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <strong>Permit Type:</strong> {permitType === 'building' ? 'Building Permit' : 'Gas Permit'}
                                </div>
                                <div>
                                    <strong>Applicant:</strong> {formData.contactInfo.firstName} {formData.contactInfo.lastName}
                                </div>
                                <div>
                                    <strong>Email:</strong> {formData.contactInfo.email}
                                </div>
                                <div>
                                    <strong>Phone:</strong> {formData.contactInfo.phone}
                                </div>
                                {formData.permitInfo.projectCost && (
                                    <div>
                                        <strong>Project Cost:</strong> ${parseFloat(formData.permitInfo.projectCost).toLocaleString()}
                                    </div>
                                )}
                            </div>

                            {/* Form Validation Summary */}
                            <FormValidation
                                formData={formData}
                                permitType={permitType}
                                className="mt-4"
                            />
                        </div>
                    </div>
                )

            default:
                return <div>Step not implemented</div>
        }
    }

    const isLastStep = currentStep === steps.length - 1
    const isFirstStep = currentStep === 0

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Indicator */}
            <StepIndicator
                steps={steps}
                currentStep={currentStep}
                className="mb-8"
            />

            {/* Form Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-8">
                    {renderStepContent()}
                </div>

                {/* Navigation */}
                {!readOnly && (
                    <div className="px-8 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-3">
                                {!isFirstStep && (
                                    <button
                                        onClick={prevStep}
                                        className="btn btn-outline"
                                        disabled={isValidating}
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        Back
                                    </button>
                                )}

                                <button
                                    onClick={onCancel}
                                    className="btn btn-ghost"
                                >
                                    Cancel
                                </button>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={handleSave}
                                    className="btn btn-outline"
                                    disabled={isValidating}
                                >
                                    <Save className="w-4 h-4 mr-1" />
                                    Save Draft
                                </button>

                                {isLastStep ? (
                                    <button
                                        onClick={handleSubmit}
                                        className="btn btn-success"
                                        disabled={isValidating}
                                    >
                                        <Send className="w-4 h-4 mr-1" />
                                        {isValidating ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                ) : (
                                     <button
                                         onClick={nextStep}
                                         className="btn btn-primary"
                                         disabled={isValidating}
                                     >
                                         {isValidating ? 'Validating...' : 'Next'}
                                         <ChevronRight className="w-4 h-4 ml-1" />
                                     </button>
                                 )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PermitFormWizard