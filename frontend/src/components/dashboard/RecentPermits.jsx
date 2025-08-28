import React from 'react'
import { Link } from 'react-router-dom'
import { Building, Flame, Eye, ArrowRight, Calendar, DollarSign } from 'lucide-react'
import Button from '../ui/Button'
import PermitStatusBadge from '../permits/PermitStatusBadge'
import { formatDate, formatCurrency, getRelativeTime } from '../../utils/formatters'

const RecentPermits = ({
                           permits = [],
                           loading = false,
                           onViewAll,
                           maxItems = 5
                       }) => {

    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                            </div>
                            <div className="w-16 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (permits.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    No recent permits
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    You haven't submitted any permit applications yet.
                </p>
                <Button
                    as={Link}
                    to="/apply"
                    variant="primary"
                    size="sm"
                >
                    Create Your First Permit
                </Button>
            </div>
        )
    }

    const displayedPermits = permits.slice(0, maxItems)

    return (
        <div className="space-y-3">
            {displayedPermits.map((permit) => (
                <PermitItem key={permit.id} permit={permit} />
            ))}

            {permits.length > maxItems && (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onViewAll}
                        endIcon={<ArrowRight className="h-4 w-4" />}
                        className="w-full"
                    >
                        View all {permits.length} permits
                    </Button>
                </div>
            )}
        </div>
    )
}

// Individual permit item component
const PermitItem = ({ permit }) => {
    const getPermitIcon = () => {
        switch (permit.permitType?.toLowerCase()) {
            case 'building':
                return Building
            case 'gas':
                return Flame
            default:
                return FileText
        }
    }

    const getPermitTypeColor = () => {
        switch (permit.permitType?.toLowerCase()) {
            case 'building':
                return 'text-green-600 dark:text-green-400'
            case 'gas':
                return 'text-orange-600 dark:text-orange-400'
            default:
                return 'text-blue-600 dark:text-blue-400'
        }
    }

    const getProjectCost = () => {
        return permit.buildingPermitInfo?.projectCost ||
               permit.gasPermitInfo?.projectCost ||
               0
    }

    const getWorkDescription = () => {
        return permit.buildingPermitInfo?.workDescription ||
               permit.gasPermitInfo?.workDescription ||
               'No description provided'
    }

    const Icon = getPermitIcon()

    return (
        <Link
            to={`/permit/${permit.id}`}
            className="block hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg"
        >
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                        {/* Permit Type Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                            <Icon className={clsx('h-5 w-5', getPermitTypeColor())} />
                        </div>

                        {/* Permit Information */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {permit.permitNumber}
                                </h4>
                                <PermitStatusBadge status={permit.status} size="xs" />
                            </div>

                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                {getWorkDescription()}
                            </p>

                            {/* Permit Details */}
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex items-center space-x-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{getRelativeTime(permit.submissionDate)}</span>
                                </div>

                                {getProjectCost() > 0 && (
                                    <div className="flex items-center space-x-1">
                                        <DollarSign className="h-3 w-3" />
                                        <span>{formatCurrency(getProjectCost())}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0 ml-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Progress Indicator for In-Progress Permits */}
                {(permit.status === 'SUBMITTED' || permit.status === 'UNDER_REVIEW') && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>Review Progress</span>
                            <span>
                {permit.status === 'SUBMITTED' ? '25%' : '75%'} complete
              </span>
                        </div>
                        <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                            <div
                                className={clsx(
                                    'h-1 rounded-full transition-all duration-300',
                                    permit.status === 'SUBMITTED' ? 'bg-blue-500 w-1/4' : 'bg-amber-500 w-3/4'
                                )}
                            />
                        </div>
                    </div>
                )}

                {/* Expiration Warning */}
                {permit.status === 'APPROVED' && permit.expirationDate && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">
                Expires: {formatDate(permit.expirationDate)}
              </span>
                            {new Date(permit.expirationDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  Expires Soon
                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Link>
    )
}

export default RecentPermits