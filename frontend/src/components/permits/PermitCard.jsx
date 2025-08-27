import React from 'react'
import { Link } from 'react-router-dom'
import {
    Building,
    Flame,
    Calendar,
    DollarSign,
    MapPin,
    User,
    Eye,
    Edit,
    Download,
    Clock,
    AlertTriangle,
    CheckCircle
} from 'lucide-react'
import Button from '../ui/Button'
import { useAuth } from '../../context/AuthContext'
import clsx from 'clsx'

const PermitCard = ({
                        permit,
                        onSelect,
                        isSelected = false,
                        showActions = true,
                        showCheckbox = false,
                        className = ''
                    }) => {
    const { hasPermission } = useAuth()

    // Get permit type icon
    const getPermitIcon = () => {
        switch (permit.permitType) {
            case 'building':
                return Building
            case 'gas':
                return Flame
            default:
                return Building
        }
    }

    // Get status configuration
    const getStatusConfig = (status) => {
        const configs = {
            draft: {
                color: 'gray',
                icon: Edit,
                label: 'Draft'
            },
            submitted: {
                color: 'blue',
                icon: Clock,
                label: 'Submitted'
            },
            under_review: {
                color: 'amber',
                icon: Clock,
                label: 'Under Review'
            },
            approved: {
                color: 'green',
                icon: CheckCircle,
                label: 'Approved'
            },
            rejected: {
                color: 'red',
                icon: AlertTriangle,
                label: 'Rejected'
            },
            expired: {
                color: 'gray',
                icon: AlertTriangle,
                label: 'Expired'
            }
        }

        return configs[status] || configs.draft
    }

    // Get project cost display
    const getProjectCost = () => {
        const cost = permit.buildingPermitInfo?.projectCost || permit.gasPermitInfo?.projectCost
        return cost ? `$${cost.toLocaleString()}` : 'N/A'
    }

    // Get permit type display
    const getPermitTypeDisplay = () => {
        if (permit.permitType === 'building') {
            return permit.buildingPermitInfo?.permitFor?.replace('_', ' ') || 'Building'
        } else {
            return permit.gasPermitInfo?.workType?.replace('_', ' ') || 'Gas'
        }
    }

    const PermitIcon = getPermitIcon()
    const statusConfig = getStatusConfig(permit.status)
    const StatusIcon = statusConfig.icon

    return (
        <div className={clsx(
            'bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 transition-all duration-200',
            isSelected
            ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
            'hover:shadow-md',
            className
        )}>

            {/* Card Header */}
            <div className="p-6 pb-4">
                <div className="flex items-start justify-between">
                    {/* Permit Info */}
                    <div className="flex items-start space-x-3">
                        {/* Checkbox */}
                        {showCheckbox && (
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => onSelect?.(e.target.checked)}
                                className="form-checkbox mt-1"
                            />
                        )}

                        {/* Icon */}
                        <div className={clsx(
                            'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                            permit.permitType === 'building' ? 'bg-green-100 dark:bg-green-900' : 'bg-orange-100 dark:bg-orange-900'
                        )}>
                            <PermitIcon className={clsx(
                                'h-5 w-5',
                                permit.permitType === 'building' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
                            )} />
                        </div>

                        {/* Permit Details */}
                        <div className="flex-1 min-w-0">
                            <Link
                                to={`/permit/${permit.id}`}
                                className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                    {permit.permitNumber}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {getPermitTypeDisplay()}
                                </p>
                            </Link>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex-shrink-0">
            <span className={`badge badge-${statusConfig.color} flex items-center`}>
              <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig.label}
            </span>
                    </div>
                </div>

                {/* Description */}
                {permit.workDescription && (
                    <div className="mt-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {permit.workDescription}
                        </p>
                    </div>
                )}
            </div>

            {/* Card Body */}
            <div className="px-6 pb-4 space-y-3">
                {/* Applicant Info */}
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <User className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">
            {permit.contactInfo?.firstName} {permit.contactInfo?.lastName}
          </span>
                </div>

                {/* Location */}
                {permit.locationInfo?.propertyAddress && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">
              {permit.locationInfo.propertyAddress}
            </span>
                    </div>
                )}

                {/* Project Cost */}
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>
            Project Cost: <span className="font-medium">{getProjectCost()}</span>
          </span>
                </div>

                {/* Submission Date */}
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>
            {permit.submissionDate
             ? `Submitted ${new Date(permit.submissionDate).toLocaleDateString()}`
             : 'Not yet submitted'
            }
          </span>
                </div>

                {/* Expiration Warning */}
                {permit.status === 'approved' && permit.expirationDate && (
                    <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800">
                        <div className="flex items-center text-sm">
                            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                            <span className="text-amber-800 dark:text-amber-200">
                Expires {new Date(permit.expirationDate).toLocaleDateString()}
              </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Card Footer */}
            {showActions && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            {/* View Button */}
                            <Button
                                as={Link}
                                to={`/permit/${permit.id}`}
                                variant="ghost"
                                size="sm"
                                startIcon={<Eye className="h-4 w-4" />}
                            >
                                View
                            </Button>

                            {/* Edit Button */}
                            {hasPermission('update:permits') && permit.status === 'draft' && (
                                <Button
                                    as={Link}
                                    to={`/permit/${permit.id}/edit`}
                                    variant="ghost"
                                    size="sm"
                                    startIcon={<Edit className="h-4 w-4" />}
                                >
                                    Edit
                                </Button>
                            )}

                            {/* Download Certificate */}
                            {permit.status === 'approved' && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    startIcon={<Download className="h-4 w-4" />}
                                    onClick={() => {
                                        // Handle certificate download
                                        console.log('Download certificate for permit:', permit.id)
                                    }}
                                >
                                    Certificate
                                </Button>
                            )}
                        </div>

                        {/* Last Updated */}
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            Updated {new Date(permit.updatedAt || permit.submissionDate).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PermitCard