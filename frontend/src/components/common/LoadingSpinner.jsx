import React from 'react'
import { clsx } from 'clsx'

const LoadingSpinner = ({
                            size = 'md',
                            color = 'blue',
                            text,
                            className = '',
                            ...props
                        }) => {
    const sizes = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12'
    }

    const colors = {
        blue: 'text-blue-600',
        gray: 'text-gray-600',
        white: 'text-white',
        green: 'text-green-600',
        red: 'text-red-600',
        yellow: 'text-yellow-600'
    }

    const textSizes = {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-sm',
        lg: 'text-base',
        xl: 'text-lg'
    }

    return (
        <div className={clsx('flex flex-col items-center justify-center', className)} {...props}>
            <svg
                className={clsx(
                    'animate-spin',
                    sizes[size],
                    colors[color]
                )}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>

            {text && (
                <p className={clsx(
                    'mt-2 font-medium text-center',
                    textSizes[size],
                    colors[color]
                )}>
                    {text}
                </p>
            )}
        </div>
    )
}

// Specialized loading components
export const PageLoader = ({ text = 'Loading...' }) => (
    <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner size="lg" text={text} />
    </div>
)

export const ButtonLoader = ({ size = 'sm' }) => (
    <LoadingSpinner size={size} color="white" />
)

export const InlineLoader = ({ text, size = 'sm' }) => (
    <div className="flex items-center space-x-2">
        <LoadingSpinner size={size} />
        {text && <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>}
    </div>
)

export const OverlayLoader = ({ text = 'Loading...', show = true }) => {
    if (!show) return null

    return (
        <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-10">
            <LoadingSpinner size="lg" text={text} />
        </div>
    )
}

export default LoadingSpinner