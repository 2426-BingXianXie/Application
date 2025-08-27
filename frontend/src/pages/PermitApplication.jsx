import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Building, Flame, ArrowLeft, Save, Send, AlertCircle } from 'lucide-react'
import usePermitForm from '../hooks/usePermitForm'
import Button from '../components/ui/Button'
import PermitFormWizard from '../components/forms/PermitFormWizard'
import { useNotifications } from '../context/NotificationContext'

const PermitApplication = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { showSuccess, showError } = useNotifications()

    // Get permit type from URL params or default to building
    const initialPermitType = searchParams.get('type') || 'building'
    const [permitType, setPermitType] = useState(initialPermitType)

    // Use form hook
    const {
        formData,
        currentStep,
        errors,
        isDirty,
        isSubmitting,
        autoSaveEnabled,
        updateField,
        getFieldValue,
        nextStep,
        prevStep,
        goToStep,
        submitForm,
        saveAsDraft,
        resetForm,
        validateCurrentStep,
        isStepAccessible,
        getProgress,
        isReadyForSubmission,
        getValidationSummary,
        toggleAutoSave
    } = usePermitForm(permitType)

    // Permit type options
    const permitTypeOptions = [
        {
            value: 'building',
            label: 'Building Permit',
            description: 'For construction, renovation, and building modifications',
            icon: Building,
            color: 'blue'
        },
        {
            value: 'gas',
            label: 'Gas Permit',
            description: 'For gas line installation and appliance connections',
            icon: Flame,
            color: 'orange'
        }
    ]

    // Handle permit type change
    const handlePermitTypeChange = (newType) => {
        if (isDirty) {
            const confirmed = window.confirm(
                'Changing permit type will reset your current form. Are you sure?'
            )
            if (!confirmed) return
        }

        setPermitType(newType)
        resetForm()

        // Update URL
        const newParams = new URLSearchParams(searchParams)
        newParams.set('type', newType)
        navigate(`/apply?${newParams.toString()}`, { replace: true })
    }

    // Handle form submission
    const handleSubmit = async () => {
        try {
            const result = await submitForm(false)
            if (result.success) {
                // Navigation will be handled by the hook
            }
        } catch (error) {
            showError('Submission Error', 'An unexpected error occurred during submission')
        }
    }

    // Handle save as draft
    const handleSaveAsDraft = async () => {
        try {
            const result = await saveAsDraft()
            if (result.success) {
                showSuccess('Draft Saved', 'Your permit application has been saved as a draft')
            }
        } catch (error) {
            showError('Save Error', 'Failed to save draft')
        }
    }

    // Handle back to dashboard
    const handleBackToDashboard = () => {
        if (isDirty) {
            const confirmed = window.confirm(
                'You have unsaved changes. Are you sure you want to leave?'
            )
            if (!confirmed) return
        }

        navigate('/dashboard')
    }

    // Get validation summary for current state
    const validationSummary = getValidationSummary()

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Button
                                variant="ghost"
                                onClick={handleBackToDashboard}
                                startIcon={<ArrowLeft className="h-4 w-4" />}
                                className="mr-4"
                            >
                                Back to Dashboard
                            </Button>

                            <div>
                                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {permitTypeOptions.find(opt => opt.value === permitType)?.label} Application
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Step {currentStep + 1} of {permitType === 'building' ? 7 : 6}
                                    {getProgress() > 0 && ` • ${getProgress()}% complete`}
                                </p>
                            </div>
                        </div>

                        {/* Header Actions */}
                        <div className="flex items-center space-x-3">
                            {/* Auto-save indicator */}
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <div className={`w-2 h-2 rounded-full mr-2 ${
                                    autoSaveEnabled ? 'bg-green-400' : 'bg-gray-400'
                                }`} />
                                {autoSaveEnabled ? 'Auto-save enabled' : 'Auto-save disabled'}
                            </div>

                            {/* Save Draft Button */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSaveAsDraft}
                                disabled={isSubmitting}
                                startIcon={<Save className="h-4 w-4" />}
                            >
                                Save Draft
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Permit Type Selector */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Permit Type:
            </span>

                        <div className="flex items-center space-x-2">
                            {permitTypeOptions.map((option) => {
                                const Icon = option.icon
                                const isSelected = option.value === permitType

                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => handlePermitTypeChange(option.value)}
                                        className={`
                      flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-colors
                      ${isSelected
                        ? `border-${option.color}-300 bg-${option.color}-50 text-${option.color}-700 dark:bg-${option.color}-900 dark:text-${option.color}-200`
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                        }
                    `}
                                    >
                                        <Icon className="h-4 w-4 mr-2" />
                                        {option.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Type Description */}
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {permitTypeOptions.find(opt => opt.value === permitType)?.description}
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                            style={{ width: `${getProgress()}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Validation Summary */}
            {validationSummary.hasErrors && (
                <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                            <span className="text-sm text-red-700 dark:text-red-300">
                {validationSummary.errorCount} validation error{validationSummary.errorCount !== 1 ? 's' : ''} found
              </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Form Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <PermitFormWizard
                        permitType={permitType}
                        formData={formData}
                        currentStep={currentStep}
                        completedSteps={completedSteps}
                        errors={errors}
                        updateField={updateField}
                        getFieldValue={getFieldValue}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        goToStep={goToStep}
                        isStepAccessible={isStepAccessible}
                    />

                    {/* Form Footer */}
                    <div className="border-t border-gray-200 dark:border-gray-700 px-8 py-6">
                        <div className="flex items-center justify-between">
                            {/* Progress Info */}
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Step {currentStep + 1} of {permitType === 'building' ? 7 : 6}
                                {isDirty && (
                                    <span className="ml-2 text-amber-600 dark:text-amber-400">
                    • Unsaved changes
                  </span>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-3">
                                {/* Previous Button */}
                                <Button
                                    variant="secondary"
                                    onClick={prevStep}
                                    disabled={currentStep === 0}
                                >
                                    Previous
                                </Button>

                                {/* Next/Submit Button */}
                                {currentStep < (permitType === 'building' ? 6 : 5) ? (
                                    <Button
                                        variant="primary"
                                        onClick={nextStep}
                                    >
                                        Next
                                    </Button>
                                ) : (
                                     <div className="flex items-center space-x-2">
                                         <Button
                                             variant="secondary"
                                             onClick={handleSaveAsDraft}
                                             disabled={isSubmitting}
                                             startIcon={<Save className="h-4 w-4" />}
                                         >
                                             Save Draft
                                         </Button>

                                         <Button
                                             variant="success"
                                             onClick={handleSubmit}
                                             loading={isSubmitting}
                                             disabled={!isReadyForSubmission() || validationSummary.hasErrors}
                                             startIcon={<Send className="h-4 w-4" />}
                                         >
                                             Submit Application
                                         </Button>
                                     </div>
                                 )}
                            </div>
                        </div>

                        {/* Additional Info */}
                        {!isReadyForSubmission() && currentStep >= (permitType === 'building' ? 6 : 5) && (
                            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800">
                                <div className="flex items-start">
                                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                            Complete Required Steps
                                        </h4>
                                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                            Please complete all required steps before submitting your application.
                                            You can save your progress as a draft and return later.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Need help? Contact us at{' '}
                        <a href="mailto:permits@municipality.gov" className="text-blue-600 hover:text-blue-500">
                            permits@municipality.gov
                        </a>{' '}
                        or call{' '}
                        <a href="tel:555-123-4567" className="text-blue-600 hover:text-blue-500">
                            (555) 123-4567
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default PermitApplication