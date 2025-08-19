import React from 'react'
import { CheckCircle } from 'lucide-react'

const StepIndicator = ({ steps, currentStep, className = '' }) => {
    return (
        <div className={`${className}`}>
            <nav aria-label="Progress">
                <ol className="flex items-center justify-center space-x-4 sm:space-x-8">
                    {steps.map((step, index) => {
                        const isCompleted = index < currentStep
                        const isCurrent = index === currentStep
                        const isUpcoming = index > currentStep

                        return (
                            <li key={step.id} className="flex items-center">
                                <div className="flex flex-col items-center">
                                    {/* Step Circle */}
                                    <div className={`
                    relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
                    ${isCompleted
                      ? 'bg-green-600 border-green-600 text-white'
                      : isCurrent
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                                    }
                  `}>
                                        {isCompleted ? (
                                            <CheckCircle className="w-5 h-5" />
                                        ) : (
                                             <span className="text-sm font-semibold">{index + 1}</span>
                                         )}
                                    </div>

                                    {/* Step Label */}
                                    <div className="mt-2 text-center">
                                        <p className={`
                      text-xs font-medium
                      ${isCurrent
                        ? 'text-blue-600 dark:text-blue-400'
                        : isCompleted
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-500 dark:text-gray-400'
                                        }
                    `}>
                                            {step.title}
                                        </p>
                                    </div>
                                </div>

                                {/* Connector Line */}
                                {index < steps.length - 1 && (
                                    <div className={`
                    hidden sm:block w-12 h-0.5 ml-4 transition-all duration-200
                    ${isCompleted ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}
                  `} />
                                )}
                            </li>
                        )
                    })}
                </ol>
            </nav>

            {/* Current Step Description */}
            <div className="text-center mt-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {steps[currentStep]?.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Step {currentStep + 1} of {steps.length}
                </p>
            </div>
        </div>
    )
}

export default StepIndicator