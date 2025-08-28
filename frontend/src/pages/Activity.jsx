import React, { useState, useEffect } from 'react'
import {
    Clock, Filter, RefreshCw, Calendar, User, FileText,
    CheckCircle, XCircle, AlertTriangle, Eye, Edit, Upload,
    Building, Flame, Download, Send
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import Card from '../components/ui/Card'
import { formatDate } from '../utils/formatters'
import { USER_ROLE_LABELS, PERMIT_TYPE_LABELS } from '../utils/constants'

const Activity = () => {
    const { user, hasPermission } = useAuth()
    const { showError } = useNotifications()

    const [activities, setActivities] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [timeFilter, setTimeFilter] = useState('today')
    const [typeFilter, setTypeFilter] = useState('')
    const [userFilter, setUserFilter] = useState('')

    // Time filter options
    const timeFilterOptions = [
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'quarter', label: 'This Quarter' },
        { value: 'all', label: 'All Time' }
    ]

    // Activity type filter options
    const typeFilterOptions = [
        { value: '', label: 'All Activities' },
        { value: 'permit_created', label: 'Permit Created' },
        { value: 'permit_submitted', label: 'Permit Submitted' },
        { value: 'permit_approved', label: 'Permit Approved' },
        { value: 'permit_rejected', label: 'Permit Rejected' },
        { value: 'document_uploaded', label: 'Document Uploaded' },
        { value: 'user_created', label: 'User Created' },
        { value: 'user_updated', label: 'User Updated' }
    ]

    // Mock activity data
    const mockActivities = [
        {
            id: 1,
            type: 'permit_submitted',
            description: 'Building permit submitted for review',
            timestamp: new Date().toISOString(),
            user: { firstName: 'John', lastName: 'Smith', role: 'APPLICANT' },
            permit: { id: 123, permitNumber: 'BP-2024-001', permitType: 'BUILDING' },
            details: 'Single family home construction permit'
        },
        {
            id: 2,
            type: 'permit_approved',
            description: 'Gas permit approved',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            user: { firstName: 'Jane', lastName: 'Reviewer', role: 'REVIEWER' },
            permit: { id: 124, permitNumber: 'GP-2024-002', permitType: 'GAS' },
            details: 'Gas line installation approved with conditions'
        },
        {
            id: 3,
            type: 'document_uploaded',
            description: 'Building plans uploaded',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            user: { firstName: 'Bob', lastName: 'Contractor', role: 'CONTRACTOR' },
            permit: { id: 125, permitNumber: 'BP-2024-003', permitType: 'BUILDING' },
            details: 'Architectural drawings and site plan uploaded'
        },
        {
            id: 4,
            type: 'permit_rejected',
            description: 'Building permit rejected',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            user: { firstName: 'System', lastName: 'Administrator', role: 'ADMIN' },
            permit: { id: 126, permitNumber: 'BP-2024-004', permitType: 'BUILDING' },
            details: 'Insufficient documentation provided'
        },
        {
            id: 5,
            type: 'user_created',
            description: 'New user account created',
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            user: { firstName: 'System', lastName: 'Administrator', role: 'ADMIN' },
            details: 'New contractor account: ABC Construction LLC'
        }
    ]

    // Load activities
    useEffect(() => {
        loadActivities()
    }, [timeFilter, typeFilter, userFilter])

    const loadActivities = async () => {
        if (!hasPermission('read:activity')) {
            showError('Access Denied', 'You do not have permission to view system activity.')
            return
        }

        setIsLoading(true)
        try {
            // Mock API delay
            await new Promise(resolve => setTimeout(resolve, 800))

            // Filter activities based on selected filters
            let filteredActivities = [...mockActivities]

            // Filter by type
            if (typeFilter) {
                filteredActivities = filteredActivities.filter(activity => activity.type === typeFilter)
            }

            // Filter by time
            const now = new Date()
            const timeFilters = {
                today: () => {
                    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                    return new Date(activity.timestamp) >= startOfDay
                },
                week: () => {
                    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                    return new Date(activity.timestamp) >= startOfWeek
                },
                month: () => {
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
                    return new Date(activity.timestamp) >= startOfMonth
                },
                quarter: () => {
                    const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
                    return new Date(activity.timestamp) >= startOfQuarter
                },
                all: () => true
            }

            if (timeFilters[timeFilter]) {
                filteredActivities = filteredActivities.filter(timeFilters[timeFilter])
            }

            setActivities(filteredActivities)
        } catch (error) {
            showError('Load Failed', 'Unable to load activity data.')
        } finally {
            setIsLoading(false)
        }
    }

    const getActivityIcon = (type) => {
        switch (type) {
            case 'permit_created':
            case 'permit_submitted':
                return <Send className="h-5 w-5 text-blue-600" />
            case 'permit_approved':
                return <CheckCircle className="h-5 w-5 text-green-600" />
            case 'permit_rejected':
                return <XCircle className="h-5 w-5 text-red-600" />
            case 'document_uploaded':
                return <Upload className="h-5 w-5 text-purple-600" />
            case 'user_created':
            case 'user_updated':
                return <User className="h-5 w-5 text-amber-600" />
            default:
                return <FileText className="h-5 w-5 text-gray-600" />
        }
    }

    const getPermitTypeIcon = (permitType) => {
        switch (permitType) {
            case 'BUILDING':
                return <Building className="h-4 w-4 text-blue-600" />
            case 'GAS':
                return <Flame className="h-4 w-4 text-orange-600" />
            default:
                return <FileText className="h-4 w-4 text-gray-600" />
        }
    }

    const renderActivityItem = (activity) => (
        <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
            {/* Activity Icon */}
            <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
            </div>

            {/* Activity Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.description}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(activity.timestamp)}
                    </span>
                </div>

                <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {activity.user.firstName} {activity.user.lastName} ({USER_ROLE_LABELS[activity.user.role]})
                    </span>

                    {activity.permit && (
                        <span className="flex items-center">
                            {getPermitTypeIcon(activity.permit.permitType)}
                            <span className="ml-1">{activity.permit.permitNumber}</span>
                        </span>
                    )}
                </div>

                {activity.details && (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                        {activity.details}
                    </p>
                )}
            </div>

            {/* Action Button */}
            {activity.permit && (
                <div className="flex-shrink-0">
                    <button
                        onClick={() => window.location.href = `/permit/${activity.permit.id}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        title="View Permit"
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        <Clock className="w-6 h-6 mr-3" />
                        Recent Activity
                    </h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Track recent permit activities and system events
                    </p>
                </div>

                <Button
                    variant="secondary"
                    onClick={loadActivities}
                    loading={isLoading}
                    className="flex items-center"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <Card.Body>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select
                            label="Time Period"
                            options={timeFilterOptions}
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value)}
                        />

                        <Select
                            label="Activity Type"
                            options={typeFilterOptions}
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        />

                        <div className="flex items-end">
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setTimeFilter('today')
                                    setTypeFilter('')
                                    setUserFilter('')
                                }}
                                className="w-full"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* Activity Feed */}
            <Card>
                <Card.Header>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Activity Feed
                        </h2>
                        {activities.length > 0 && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {activities.length} activities
                            </span>
                        )}
                    </div>
                </Card.Header>

                <Card.Body>
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="animate-pulse flex items-start space-x-4 p-4">
                                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : activities.length > 0 ? (
                        <div className="space-y-1">
                            {activities.map(renderActivityItem)}
                        </div>
                    ) : (
                            <div className="text-center py-12">
                                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No recent activity
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {timeFilter !== 'all' || typeFilter ?
                                     'No activities match your current filters.' :
                                     'No recent activity to display.'
                                    }
                                </p>
                            </div>
                        )}
                </Card.Body>
            </Card>

            {/* Activity Statistics */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <Card.Body>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Send className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        Permits Submitted Today
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                        {activities.filter(a => a.type === 'permit_submitted').length}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Body>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        Permits Approved
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                        {activities.filter(a => a.type === 'permit_approved').length}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Body>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Upload className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        Documents Uploaded
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                        {activities.filter(a => a.type === 'document_uploaded').length}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Body>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <User className="h-6 w-6 text-amber-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        User Actions
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                        {activities.filter(a => a.type.startsWith('user_')).length}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            {/* Activity Types Legend */}
            <Card>
                <Card.Body>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Activity Types</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                            <Send className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Permit Submitted</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Permit Approved</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Permit Rejected</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Upload className="h-4 w-4 text-purple-600" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Document Uploaded</span>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Activity