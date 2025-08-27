import React from 'react'
import { Check } from 'lucide-react'
import clsx from 'clsx'

const StepIndicator = ({
                           steps,
                           currentStep,
                           completedSteps,
                           onStepClick,
                           isStepAccessible,
                           orientation = 'horizontal'
                       }) => {

    // Get step status
    const getStepStatus = (stepIndex) => {
        if (completedSteps.has(stepIndex)) {
            return 'completed'
        } else if (stepIndex === currentStep) {
            return 'current'
        } else if (isStepAccessible(stepIndex)) {
            return 'accessible'
        } else {
            return 'upcoming'
        }
    }

    // Handle step click
    const handleStepClick = (stepIndex) => {
        if (isStepAccessible(stepIndex) && onStepClick) {
            onStepClick(stepIndex)
        }
    }

    // Render horizontal indicator (default)
    const renderHorizontalIndicator = () => (
        <nav aria-label="Progress">
            <ol className="flex items-center justify-between space-x-2 md:space-x-8">
                {steps.map((step, stepIndex) => {
                    const status = getStepStatus(stepIndex)
                    const Icon = step.icon
                    const isClickable = isStepAccessible(stepIndex)

                    return (
                        <li key={step.id} className="flex items-center">
                            {/* Step Button */}
                            <button
                                type="button"
                                onClick={() => handleStepClick(stepIndex)}
                                disabled={!isClickable}
                                className={clsx(
                                    'relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200',
                                    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                                    status === 'completed' && [
                                            'bg-green-600 border-green-600 text-white',
                                            isClickable && 'hover:bg-green-700'
                                        ],
                                    status === 'current' && [
                                            'bg-blue-600 border-blue-600 text-white',
                                            'ring-4 ring-blue-100 dark:ring-blue-900'
                                        ],
                                    status === 'accessible' && [
                                            'border-gray-300 bg-white text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300',
                                            'hover:border-gray-400 hover:text-gray-600 dark:hover:border-gray-500 dark:hover:text-gray-200'
                                        ],
                                    status === 'upcoming' && [
                                            'border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500',
                                            'cursor-not-allowed'
                                        ]
                                )}
                                aria-current={status === 'current' ? 'step' : undefined}
                            >
                                {status === 'completed' ? (
                                    <Check className="h-5 w-5" />
                                ) : (
                                     <Icon className="h-5 w-5" />
                                 )}

                                {/* Step number overlay for upcoming steps */}
                                {status === 'upcoming' && (
                                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-medium">
                    {stepIndex + 1}
                  </span>
                                )}
                            </button>

                            {/* Step Info (Hidden on mobile) */}
                            <div className="ml-3 hidden md:block">
                                <p className={clsx(
                                    'text-sm font-medium',
                                    status === 'completed' && 'text-green-600 dark:text-green-400',
                                    status === 'current' && 'text-blue-600 dark:text-blue-400',
                                    status === 'accessible' && 'text-gray-500 dark:text-gray-300',
                                    status === 'upcoming' && 'text-gray-400 dark:text-gray-500'
                                )}>
                                    {step.title}
                                    {step.optional && (
                                        <span className="ml-1 text-xs text-gray-400">(Optional)</span>
                                    )}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                    {step.description}
                                </p>
                            </div>

                            {/* Connector line */}
                            {stepIndex < steps.length - 1 && (
                                <div className={clsx(
                                    'hidden md:block w-8 h-0.5 ml-8',
                                    completedSteps.has(stepIndex) || stepIndex < currentStep
                                    ? 'bg-green-600'
                                    : 'bg-gray-300 dark:bg-gray-600'
                                )} />
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )

    // Render vertical indicator
    const renderVerticalIndicator = () => (
        <nav aria-label="Progress" className="flex flex-col space-y-4">
            {steps.map((step, stepIndex) => {
                const status = getStepStatus(stepIndex)
                const Icon = step.icon
                const isClickable = isStepAccessible(stepIndex)

                return (
                    <div key={step.id} className="relative flex items-start">
                        {/* Connector line */}
                        {stepIndex < steps.length - 1 && (
                            <div className={clsx(
                                'absolute left-5 top-10 w-0.5 h-8',
                                completedSteps.has(stepIndex) || stepIndex < currentStep
                                ? 'bg-green-600'
                                : 'bg-gray-300 dark:bg-gray-600'
                            )} />
                        )}

                        {/* Step Button */}
                        <button
                            type="button"
                            onClick={() => handleStepClick(stepIndex)}
                            disabled={!isClickable}
                            className={clsx(
                                'relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 flex-shrink-0',
                                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                                status === 'completed' && [
                                        'bg-green-600 border-green-600 text-white',
                                        isClickable && 'hover:bg-green-700'
                                    ],
                                status === 'current' && [
                                        'bg-blue-600 border-blue-600 text-white',
                                        'ring-4 ring-blue-100 dark:ring-blue-900'
                                    ],
                                status === 'accessible' && [
                                        'border-gray-300 bg-white text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300',
                                        'hover:border-gray-400 hover:text-gray-600 dark:hover:border-gray-500'
                                    ],
                                status === 'upcoming' && [
                                        'border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500',
                                        'cursor-not-allowed'
                                    ]
                            )}
                        >
                            {status === 'completed' ? (
                                <Check className="h-5 w-5" />
                            ) : (
                                 <Icon className="h-5 w-5" />
                             )}
                        </button>

                        {/* Step Info */}
                        <div className="ml-4 flex-1">
                            <p className={clsx(
                                'text-sm font-medium',
                                status === 'completed' && 'text-green-600 dark:text-green-400',
                                status === 'current' && 'text-blue-600 dark:text-blue-400',
                                status === 'accessible' && 'text-gray-700 dark:text-gray-300',
                                status === 'upcoming' && 'text-gray-400 dark:text-gray-500'
                            )}>
                                {step.title}
                                {step.optional && (
                                    <span className="ml-1 text-xs text-gray-400">(Optional)</span>
                                )}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {step.description}
                            </p>
                        </div>
                    </div>
                )
            })}
        </nav>
    )

    return orientation === 'horizontal' ? renderHorizontalIndicator() : renderVerticalIndicator()
}

export default StepIndicator