import React from 'react'
import {
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Edit,
    Archive
} from 'lucide-react'
import clsx from 'clsx'

const PermitStatusBadge = ({
                               status,
                               size = 'md',
                               showIcon = true,
                               className = '',
                               animated = false
                           }) => {

    // Status configuration
    const statusConfig = {
        DRAFT: {
            label: 'Draft',
            icon: Edit,
            color: 'gray',
            bgColor: 'bg-gray-100 dark:bg-gray-800',
            textColor: 'text-gray-700 dark:text-gray-300',
            borderColor: 'border-gray-300 dark:border-gray-600'
        },
        SUBMITTED: {
            label: 'Submitted',
            icon: Clock,
            color: 'blue',
            bgColor: 'bg-blue-100 dark:bg-blue-900',
            textColor: 'text-blue-700 dark:text-blue-300',
            borderColor: 'border-blue-300 dark:border-blue-600'
        },
        UNDER_REVIEW: {
            label: 'Under Review',
            icon: Clock,
            color: 'amber',
            bgColor: 'bg-amber-100 dark:bg-amber-900',
            textColor: 'text-amber-700 dark:text-amber-300',
            borderColor: 'border-amber-300 dark:border-amber-600'
        },
        APPROVED: {
            label: 'Approved',
            icon: CheckCircle,
            color: 'green',
            bgColor: 'bg-green-100 dark:bg-green-900',
            textColor: 'text-green-700 dark:text-green-300',
            borderColor: 'border-green-300 dark:border-green-600'
        },
        REJECTED: {
            label: 'Rejected',
            icon: XCircle,
            color: 'red',
            bgColor: 'bg-red-100 dark:bg-red-900',
            textColor: 'text-red-700 dark:text-red-300',
            borderColor: 'border-red-300 dark:border-red-600'
        },
        EXPIRED: {
            label: 'Expired',
            icon: AlertTriangle,
            color: 'gray',
            bgColor: 'bg-gray-100 dark:bg-gray-800',
            textColor: 'text-gray-600 dark:text-gray-400',
            borderColor: 'border-gray-300 dark:border-gray-600'
        },
        CANCELLED: {
            label: 'Cancelled',
            icon: Archive,
            color: 'gray',
            bgColor: 'bg-gray-100 dark:bg-gray-800',
            textColor: 'text-gray-600 dark:text-gray-400',
            borderColor: 'border-gray-300 dark:border-gray-600'
        }
    }

    const config = statusConfig[status] || statusConfig.DRAFT
    const Icon = config.icon

    // Size variants
    const sizeClasses = {
        xs: 'text-xs px-2 py-0.5',
        sm: 'text-xs px-2.5 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-sm px-4 py-2'
    }

    const iconSizes = {
        xs: 'h-3 w-3',
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-4 w-4'
    }

    return (
        <span className={clsx(
            'inline-flex items-center font-medium rounded-full border',
            sizeClasses[size],
            config.bgColor,
            config.textColor,
            config.borderColor,
            animated && status === 'UNDER_REVIEW' && 'animate-pulse',
            className
        )}>
      {showIcon && (
          <Icon className={clsx(
              iconSizes[size],
              config.label ? 'mr-1.5' : ''
          )} />
      )}
            {config.label}
    </span>
    )
}

// Status badge with additional info
export const DetailedStatusBadge = ({
                                        permit,
                                        showDate = false,
                                        showProgress = false
                                    }) => {
    const getStatusDate = () => {
        switch (permit.status) {
            case 'SUBMITTED':
                return permit.submissionDate
            case 'APPROVED':
            case 'REJECTED':
                return permit.approvalDate
            default:
                return permit.updatedAt || permit.submissionDate
        }
    }

    const getProgressPercentage = () => {
        const statusProgress = {
            DRAFT: 10,
            SUBMITTED: 30,
            UNDER_REVIEW: 60,
            APPROVED: 100,
            REJECTED: 100,
            EXPIRED: 100,
            CANCELLED: 100
        }
        return statusProgress[permit.status] || 0
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <PermitStatusBadge status={permit.status} animated />
                {showDate && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
            {getStatusDate() && new Date(getStatusDate()).toLocaleDateString()}
          </span>
                )}
            </div>

            {showProgress && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                        className={clsx(
                            'h-1.5 rounded-full transition-all duration-300',
                            permit.status === 'APPROVED' ? 'bg-green-500' :
                            permit.status === 'REJECTED' ? 'bg-red-500' :
                            permit.status === 'UNDER_REVIEW' ? 'bg-amber-500' :
                            'bg-blue-500'
                        )}
                        style={{ width: `${getProgressPercentage()}%` }}
                    />
                </div>
            )}
        </div>
    )
}

export default PermitStatusBadge