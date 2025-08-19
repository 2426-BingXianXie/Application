import React from 'react'
import { Link } from 'react-router-dom'
import {
    Building,
    Zap,
    Calendar,
    DollarSign,
    User,
    MapPin,
    Eye,
    Edit,
    Send,
    MoreVertical
} from 'lucide-react'
import { PERMIT_STATUS_LABELS, PERMIT_STATUS_COLORS } from '../../utils/constants'
import { formatDistanceToNow } from 'date-fns'

const PermitCard = ({ permit, permitType }) => {
    const getStatusBadgeClass = (status) => {
        const color = PERMIT_STATUS_COLORS[status] || 'gray'
        const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"

        const colorClasses = {
            gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
            blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        }

        return `${baseClasses} ${colorClasses[color]}`
    }

    const getPermitIcon = () => {
        if (permitType === 'gas') {
            return <Zap className="w-5 h-5 text-yellow-600" />
        }
        return <Building className="w-5 h-5 text-blue-600" />
    }

    const formatCurrency = (amount) => {
        if (!amount) return 'Not specified'
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const canEdit = permit.status === 'DRAFT'
    const canSubmit = permit.status === 'DRAFT' && permit.isComplete

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            {/* Card Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        {getPermitIcon()}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {permit.permitNumber}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {permitType === 'gas' ? 'Gas Permit' : 'Building Permit'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
            <span className={getStatusBadgeClass(permit.status)}>
              {PERMIT_STATUS_LABELS[permit.status]}
            </span>

                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
                <div className="space-y-4">
                    {/* Property Address */}
                    {permit.locationInfo?.propertyAddress && (
                        <div className="flex items-start space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    Property Address
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {permit.locationInfo.propertyAddress}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Applicant */}
                    <div className="flex items-start space-x-2">
                        <User className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Applicant
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {permit.contactInfo.firstName} {permit.contactInfo.lastName}
                            </p>
                        </div>
                    </div>

                    {/* Project Cost */}
                    {permit.projectCost && (
                        <div className="flex items-start space-x-2">
                            <DollarSign className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    Project Cost
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {formatCurrency(permit.projectCost)}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Submission Date */}
                    <div className="flex items-start space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Submitted
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {permit.submissionDate
                                 ? formatDistanceToNow(new Date(permit.submissionDate), { addSuffix: true })
                                 : 'Not submitted'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Actions */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
                <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                        <Link
                            to={`/permit/${permit.permitId}`}
                            className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                        </Link>

                        {canEdit && (
                            <Link
                                to={`/apply?type=${permitType}&edit=${permit.permitId}`}
                                className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                            >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                            </Link>
                        )}

                        {canSubmit && (
                            <button className="inline-flex items-center px-3 py-1.5 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
                                <Send className="w-3 h-3 mr-1" />
                                Submit
                            </button>
                        )}
                    </div>

                    {/* Progress Indicator */}
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {permit.status === 'DRAFT' && '📝 Draft'}
                        {permit.status === 'SUBMITTED' && '📤 Submitted'}
                        {permit.status === 'UNDER_REVIEW' && '👁️ Under Review'}
                        {permit.status === 'APPROVED' && '✅ Approved'}
                        {permit.status === 'REJECTED' && '❌ Rejected'}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PermitCard