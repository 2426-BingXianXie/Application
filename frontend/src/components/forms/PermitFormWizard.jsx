import React from 'react'
import { User, MapPin, FileText, Shield, Trash2, CheckCircle, Flame, Settings } from 'lucide-react'
import ContactInfoForm from './ContactInfoForm'
import LocationInfoForm from './LocationInfoForm'
import BuildingPermitForm from './BuildingPermitForm'
import GasPermitForm from './GasPermitForm'
import ContractorLicenseForm from './ContractorLicenseForm'
import HomeImprovementForm from './HomeImprovementForm'
import DebrisDisposalForm from './DebrisDisposalForm'
import ReviewSubmitForm from './ReviewSubmitForm'
import StepIndicator from './StepIndicator'

const PermitFormWizard = ({
                              permitType,
                              formData,
                              currentStep,
                              completedSteps,
                              errors,
                              updateField,
                              getFieldValue,
                              nextStep,
                              prevStep,
                              goToStep,
                              isStepAccessible
                          }) => {

    // Define steps based on permit type
    const getSteps = () => {
        const baseSteps = [
            {
                id: 'contact',
                title: 'Contact Information',
                description: 'Your contact details',
                icon: User,
                component: ContactInfoForm
            },
            {
                id: 'location',
                title: 'Location & Applicant',
                description: 'Property location and applicant type',
                icon: MapPin,
                component: LocationInfoForm
            }
        ]

        if (permitType === 'building') {
            return [
                ...baseSteps,
                {
                    id: 'building-permit',
                    title: 'Building Permit Info',
                    description: 'Building project details',
                    icon: FileText,
                    component: BuildingPermitForm
                },
                {
                    id: 'contractor',
                    title: 'Contractor License',
                    description: 'Contractor information',
                    icon: Shield,
                    component: ContractorLicenseForm,
                    conditional: true // Only show if applicant is contractor
                },
                {
                    id: 'home-improvement',
                    title: 'Home Improvement',
                    description: 'HIC registration if applicable',
                    icon: Settings,
                    component: HomeImprovementForm,
                    optional: true
                },
                {
                    id: 'debris',
                    title: 'Debris Disposal',
                    description: 'Waste disposal information',
                    icon: Trash2,
                    component: DebrisDisposalForm
                },
                {
                    id: 'review',
                    title: 'Review & Submit',
                    description: 'Review and submit application',
                    icon: CheckCircle,
                    component: ReviewSubmitForm
                }
            ]
        } else {
            return [
                ...baseSteps,
                {
                    id: 'gas-permit',
                    title: 'Gas Permit Info',
                    description: 'Gas installation details',
                    icon: Flame,
                    component: GasPermitForm
                },
                {
                    id: 'gas-contractor',
                    title: 'Gas Contractor License',
                    description: 'Gas contractor certification',
                    icon: Shield,
                    component: ContractorLicenseForm,
                    conditional: true
                },
                {
                    id: 'review',
                    title: 'Review & Submit',
                    description: 'Review and submit application',
                    icon: CheckCircle,
                    component: ReviewSubmitForm
                }
            ]
        }
    }

    const steps = getSteps()
    const currentStepData = steps[currentStep]
    const CurrentStepComponent = currentStepData?.component

    // Check if step should be displayed (handle conditional steps)
    const shouldShowStep = (step, stepIndex) => {
        if (!step.conditional && !step.optional) return true

        // Contractor step - only show if applicant is contractor
        if (step.id === 'contractor' || step.id === 'gas-contractor') {
            return getFieldValue('permitInfo.applicantType') === 'contractor'
        }

        // Optional steps are always shown but marked as optional
        if (step.optional) return true

        return true
    }

    // Get filtered steps (removing conditional steps that shouldn't show)
    const visibleSteps = steps.filter(shouldShowStep)
    const visibleCurrentStep = visibleSteps.findIndex(step => step === currentStepData)

    return (
        <div className="min-h-96">
            {/* Step Indicator */}
            <div className="border-b border-gray-200 dark:border-gray-700 px-8 py-6">
                <StepIndicator
                    steps={visibleSteps}
                    currentStep={visibleCurrentStep}
                    completedSteps={completedSteps}
                    onStepClick={goToStep}
                    isStepAccessible={isStepAccessible}
                />
            </div>

            {/* Step Content */}
            <div className="px-8 py-8">
                {CurrentStepComponent ? (
                    <div className="animate-fade-in">
                        <CurrentStepComponent
                            formData={formData}
                            errors={errors}
                            updateField={updateField}
                            getFieldValue={getFieldValue}
                            permitType={permitType}
                            onNext={nextStep}
                            onPrevious={prevStep}
                        />
                    </div>
                ) : (
                     <div className="text-center py-12">
                         <div className="text-gray-400 dark:text-gray-500">
                             <FileText className="h-12 w-12 mx-auto mb-4" />
                             <p>Step content not available</p>
                         </div>
                     </div>
                 )}
            </div>
        </div>
    )
}

export default PermitFormWizard