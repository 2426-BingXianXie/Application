import React from 'react'
import { Check } from 'lucide-react'
import { clsx } from 'clsx'

const StepIndicator = ({
                           steps = [],
                           currentStep = 0,
                           completedSteps = [],
                           onStepClick,
                           isStepAccessible
                       }) => {
    const getStepStatus = (stepIndex) => {
        if (completedSteps.includes(stepIndex)) return 'completed'
        if (stepIndex === currentStep) return 'current'
        if (isStepAccessible && isStepAccessible(stepIndex)) return 'accessible'
        return 'upcoming'
    }

    const getStepClasses = (status) => {
        const baseClasses = 'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200'

        switch (status) {
            case 'completed':
                return clsx(baseClasses, 'bg-green-600 border-green-600 text-white')
            case 'current':
                return clsx(baseClasses, 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900')
            case 'accessible':
                return clsx(baseClasses, 'border-gray-300 bg-white text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:border-gray-400 hover:text-gray-600 cursor-pointer')
            case 'upcoming':
            default:
                return clsx(baseClasses, 'border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500')
        }
    }

    const getConnectorClasses = (stepIndex) => {
        const isCompleted = completedSteps.includes(stepIndex) || completedSteps.includes(stepIndex + 1) || stepIndex < currentStep
        return clsx(
            'flex-1 h-0.5 mx-4',
            isCompleted ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
        )
    }

    const handleStepClick = (stepIndex) => {
        const status = getStepStatus(stepIndex)
        if ((status === 'accessible' || status === 'completed') && onStepClick) {
            onStepClick(stepIndex)
        }
    }

    return (
        <div className="w-full">
            {/* Desktop Step Indicator */}
            <div className="hidden sm:flex items-center justify-between">
                {steps.map((step, index) => {
                    const Icon = step.icon
                    const status = getStepStatus(index)
                    const isClickable = status === 'accessible' || status === 'completed'

                    return (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center">
                                {/* Step Circle */}
                                <div
                                    className={getStepClasses(status)}
                                    onClick={() => handleStepClick(index)}
                                    role={isClickable ? 'button' : undefined}
                                    tabIndex={isClickable ? 0 : undefined}
                                    onKeyDown={(e) => {
                                        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                                            e.preventDefault()
                                            handleStepClick(index)
                                        }
                                    }}
                                >
                                    {status === 'completed' ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                         <Icon className="h-5 w-5" />
                                     )}
                                </div>

                                {/* Step Label */}
                                <div className="mt-3 text-center max-w-24">
                                    <p className={clsx(
                                        'text-sm font-medium',
                                        status === 'current' ? 'text-blue-600 dark:text-blue-400' :
                                        status === 'completed' ? 'text-green-600 dark:text-green-400' :
                                        'text-gray-500 dark:text-gray-400'
                                    )}>
                                        {step.title}
                                    </p>
                                    {step.optional && (
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                            (Optional)
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className={getConnectorClasses(index)} />
                            )}
                        </React.Fragment>
                    )
                })}
            </div>

            {/* Mobile Step Indicator */}
            <div className="sm:hidden">
                {/* Current Step Info */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Step {currentStep + 1} of {steps.length}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {steps[currentStep]?.title}
                        </p>
                    </div>
                    <div className="flex items-center space-x-1">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={clsx(
                                    'w-2 h-2 rounded-full',
                                    getStepStatus(index) === 'completed' ? 'bg-green-600' :
                                    index === currentStep ? 'bg-blue-600' :
                                    'bg-gray-300 dark:bg-gray-600'
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                        style={{
                            width: `${((currentStep + 1) / steps.length) * 100}%`
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default StepIndicator