import React from 'react'
import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({
                            size = 'md',
                            color = 'blue',
                            text = '',
                            className = '',
                            fullScreen = false
                        }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12'
    }

    const colorClasses = {
        blue: 'text-blue-600',
        gray: 'text-gray-600',
        green: 'text-green-600',
        yellow: 'text-yellow-600',
        red: 'text-red-600',
        white: 'text-white'
    }

    const spinnerContent = (
        <div className={`flex flex-col items-center space-y-2 ${className}`}>
            <Loader2 className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} />
            {text && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
            )}
        </div>
    )

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
                {spinnerContent}
            </div>
        )
    }

    return spinnerContent
}

export default LoadingSpinner