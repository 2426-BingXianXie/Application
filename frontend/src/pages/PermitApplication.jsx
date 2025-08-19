import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, CheckCircle, Building, Zap } from 'lucide-react'
import ContactInfoForm from '../components/forms/ContactInfoForm'
import LocationInfoForm from '../components/forms/LocationInfoForm'
import BuildingPermitForm from '../components/forms/BuildingPermitForm'
import GasPermitForm from '../components/forms/GasPermitForm'
import StepIndicator from '../components/forms/StepIndicator'
import { usePermits } from '../hooks/usePermits'
import { useNotifications } from '../hooks/useNotifications'

const PermitApplication = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const permitType = searchParams.get('type') || 'building'
    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState({
                                                 permitType,
                                                 contactInfo: {},
                                                 locationInfo: {},
                                                 permitInfo: {},
                                                 contractorLicense: {},
                                                 debrisDisposal: {},
                                             })

    const { useCreatePermit } = usePermits(permitType)
    const { notifyPermitStatusChange } = useNotifications()
    const createPermitMutation = useCreatePermit()

    // Define steps based on permit type
    const getSteps = () => {
        const baseSteps = [
            { id: 'permit-type', title: 'Permit Type', icon: Building },
            { id: 'contact', title: 'Contact Information', icon: 'User' },
            { id: 'location', title: 'Property Location', icon: 'MapPin' },
        ]

        if (permitType === 'building') {
            return [
                ...baseSteps,
                { id: 'building-details', title: 'Building Details', icon: Building },
                { id: 'contractor', title: 'Contractor Info', icon: 'Shield' },
                { id: 'debris', title: 'Debris Disposal', icon: 'Trash2' },
                { id: 'review', title: 'Review & Submit', icon: CheckCircle },
            ]
        } else if (permitType === 'gas') {
            return [
                ...baseSteps,
                { id: 'gas-details', title: 'Gas Installation', icon: Zap },
                { id: 'gas-contractor', title: 'Gas Contractor', icon: 'Shield' },
                { id: 'review', title: 'Review & Submit', icon: CheckCircle },
            ]
        }

        return baseSteps
    }

    const steps = getSteps()

    const updateFormData = (stepData) => {
        setFormData(prev => ({
            ...prev,
            ...stepData
        }))
    }

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = async () => {
        try {
            const result = await createPermitMutation.mutateAsync(formData)
            notifyPermitStatusChange(result.permitNumber, 'SUBMITTED')
            navigate(`/permit/${result.permitId}`)
        } catch (error) {
            console.error('Failed to submit permit:', error)
        }
    }

    const renderPermitTypeSelection = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Select Permit Type
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Choose the type of permit you need to apply for
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div
                    className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                        permitType === 'building'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => {
                        setFormData(prev => ({ ...prev, permitType: 'building' }))
                        navigate('/apply?type=building')
                    }}
                >
                    <div className="text-center">
                        <Building className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Building Permit
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            For construction, renovation, additions, and structural work
                        </p>
                    </div>
                </div>

                <div
                    className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                        permitType === 'gas'
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => {
                        setFormData(prev => ({ ...prev, permitType: 'gas' }))
                        navigate('/apply?type=gas')
                    }}
                >
                    <div className="text-center">
                        <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Gas Permit
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            For gas line installation, appliances, and gas-related work
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )

    const renderStepContent = () => {
        const step = steps[currentStep]

        switch (step?.id) {
            case 'permit-type':
                return renderPermitTypeSelection()
            case 'contact':
                return (
                    <ContactInfoForm
                        data={formData.contactInfo}
                        onChange={(data) => updateFormData({ contactInfo: data })}
                    />
                )
            case 'location':
                return (
                    <LocationInfoForm
                        data={formData.locationInfo}
                        onChange={(data) => updateFormData({ locationInfo: data })}
                    />
                )
            case 'building-details':
                return (
                    <BuildingPermitForm
                        data={formData.permitInfo}
                        onChange={(data) => updateFormData({ permitInfo: data })}
                    />
                )
            case 'gas-details':
                return (
                    <GasPermitForm
                        data={formData.permitInfo}
                        onChange={(data) => updateFormData({ permitInfo: data })}
                    />
                )
            case 'review':
                return renderReviewStep()
            default:
                return <div>Step not implemented yet</div>
        }
    }

    const renderReviewStep = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Review Your Application
            </h2>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Application Summary</h3>
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
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={createPermitMutation.isPending}
                    className="mt-6 w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                    {createPermitMutation.isPending ? 'Submitting...' : 'Submit Application'}
                </button>
            </div>
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Indicator */}
            <StepIndicator
                steps={steps}
                currentStep={currentStep}
                className="mb-8"
            />

            {/* Form Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                {renderStepContent()}

                {/* Navigation Buttons */}
                {steps[currentStep]?.id !== 'permit-type' && (
                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className="flex items-center px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Back
                        </button>

                        {currentStep < steps.length - 1 && (
                            <button
                                onClick={nextStep}
                                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Next
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default PermitApplication