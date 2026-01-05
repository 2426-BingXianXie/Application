import React from 'react'
import { Loader2, FileText, Building, Flame } from 'lucide-react'
import clsx from 'clsx'

// Basic Loading Spinner
const LoadingSpinner = ({
                            size = 'md',
                            color = 'blue',
                            className = '',
                            ...props
                        }) => {
    const sizes = {
        xs: 'h-4 w-4',
        sm: 'h-5 w-5',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16'
    }

    const colors = {
        blue: 'text-blue-600',
        gray: 'text-gray-600',
        green: 'text-green-600',
        red: 'text-red-600',
        amber: 'text-amber-600'
    }

    return (
        <Loader2
            className={clsx(
                'animate-spin',
                sizes[size],
                colors[color],
                className
            )}
            {...props}
        />
    )
}

// Page Loading Component
export const PageLoader = ({
                               message = 'Loading...',
                               size = 'lg',
                               className = ''
                           }) => {
    return (
        <div className={clsx(
            'flex flex-col items-center justify-center p-8',
            className
        )}>
            <LoadingSpinner size={size} color="blue" />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 animate-pulse">
                {message}
            </p>
        </div>
    )
}

// Full Page Loading Overlay
export const PageLoadingOverlay = ({
                                       message = 'Loading...',
                                       transparent = false
                                   }) => {
    return (
        <div className={clsx(
            'fixed inset-0 z-50 flex items-center justify-center',
            transparent
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'
            : 'bg-white dark:bg-gray-900'
        )}>
            <div className="text-center">
                <LoadingSpinner size="xl" color="blue" />
                <p className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                    {message}
                </p>
            </div>
        </div>
    )
}

// Skeleton Loading Components
export const SkeletonLoader = ({
                                   lines = 3,
                                   className = '',
                                   animate = true
                               }) => {
    return (
        <div className={clsx('space-y-3', className)}>
            {Array.from({ length: lines }).map((_, index) => (
                <div
                    key={index}
                    className={clsx(
                        'h-4 bg-gray-200 dark:bg-gray-700 rounded',
                        animate && 'animate-pulse',
                        index === 0 && 'w-3/4',
                        index === 1 && 'w-full',
                        index === 2 && 'w-2/3',
                        index > 2 && 'w-5/6'
                    )}
                />
            ))}
        </div>
    )
}

// Card Skeleton
export const CardSkeleton = ({ className = '' }) => {
    return (
        <div className={clsx('bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700', className)}>
            <div className="animate-pulse">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                </div>

                {/* Footer */}
                <div className="flex justify-between mt-6">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
            </div>
        </div>
    )
}

// Table Skeleton
export const TableSkeleton = ({
                                  rows = 5,
                                  cols = 4,
                                  className = ''
                              }) => {
    return (
        <div className={clsx('overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg', className)}>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                {/* Header */}
                <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                    {Array.from({ length: cols }).map((_, colIndex) => (
                        <th key={colIndex} className="px-6 py-3 text-left">
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-20"></div>
                        </th>
                    ))}
                </tr>
                </thead>

                {/* Body */}
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                        {Array.from({ length: cols }).map((_, colIndex) => (
                            <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                                <div className={clsx(
                                    'h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse',
                                    colIndex === 0 ? 'w-32' :
                                    colIndex === 1 ? 'w-24' :
                                    colIndex === 2 ? 'w-16' : 'w-20'
                                )}></div>
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

// Spinner with Icon for specific actions
export const ActionLoader = ({
                                 action = 'loading',
                                 size = 'md',
                                 message,
                                 className = ''
                             }) => {
    const actionConfig = {
        loading: { icon: Loader2, color: 'blue' },
        saving: { icon: Loader2, color: 'green' },
        submitting: { icon: FileText, color: 'blue' },
        processing: { icon: Building, color: 'amber' },
        validating: { icon: CheckCircle2, color: 'green' },
        uploading: { icon: Loader2, color: 'blue' }
    }

    const config = actionConfig[action] || actionConfig.loading
    const Icon = config.icon

    return (
        <div className={clsx('flex flex-col items-center justify-center p-4', className)}>
            <Icon className={clsx(
                'animate-spin mb-2',
                size === 'sm' ? 'h-6 w-6' :
                size === 'md' ? 'h-8 w-8' :
                size === 'lg' ? 'h-12 w-12' : 'h-16 w-16',
                `text-${config.color}-600`
            )} />
            {message && (
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    {message}
                </p>
            )}
        </div>
    )
}

// Inline Spinner for buttons
export const InlineSpinner = ({
                                  size = 'sm',
                                  className = ''
                              }) => {
    return (
        <LoadingSpinner
            size={size}
            color="current"
            className={clsx('mr-2', className)}
        />
    )
}

// Progress Spinner with percentage
export const ProgressSpinner = ({
                                    progress = 0,
                                    size = 'md',
                                    showPercentage = true,
                                    className = ''
                                }) => {
    const circumference = 2 * Math.PI * 45 // radius of 45
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (progress / 100) * circumference

    const sizeClasses = {
        sm: 'h-12 w-12',
        md: 'h-16 w-16',
        lg: 'h-24 w-24',
        xl: 'h-32 w-32'
    }

    return (
        <div className={clsx('relative', sizeClasses[size], className)}>
            <svg className="transform -rotate-90 w-full h-full">
                {/* Background circle */}
                <circle
                    cx="50%"
                    cy="50%"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200 dark:text-gray-700"
                />

                {/* Progress circle */}
                <circle
                    cx="50%"
                    cy="50%"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-blue-600 transition-all duration-300 ease-in-out"
                    style={{
                        strokeDasharray,
                        strokeDashoffset,
                        strokeLinecap: 'round'
                    }}
                />
            </svg>

            {/* Percentage text */}
            {showPercentage && (
                <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(progress)}%
          </span>
                </div>
            )}
        </div>
    )
}

export default LoadingSpinner