import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import {
    FileText,
    Building,
    Flame,
    CheckCircle,
    Clock,
    AlertTriangle,
    TrendingUp,
    Users,
    Calendar,
    DollarSign,
    Plus,
    Eye,
    Download,
    Filter
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import permitService from '../services/permitService'
import { PageLoader, CardSkeleton } from '../components/common/LoadingSpinner'
import Button from '../components/ui/Button'

const Dashboard = () => {
    const { user, hasPermission } = useAuth()
    const { showSuccess, showError } = useNotifications()
    const [stats, setStats] = useState(null)
    const [recentPermits, setRecentPermits] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedTimeRange, setSelectedTimeRange] = useState('month')

    // Load dashboard data
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true)

                const [statsResponse, recentResponse] = await Promise.all([
                                                                              permitService.getPermitStatistics({ timeRange: selectedTimeRange }),
                                                                              permitService.getRecentPermits(10)
                                                                          ])

                setStats(statsResponse)
                setRecentPermits(recentResponse)
            } catch (error) {
                showError('Error Loading Dashboard', 'Failed to load dashboard data')
                console.error('Dashboard load error:', error)
            } finally {
                setLoading(false)
            }
        }

        loadDashboardData()
    }, [selectedTimeRange, showError])

    // Quick stats cards configuration
    const quickStats = stats ? [
        {
            title: 'Total Permits',
            value: stats.totalPermits || 0,
            change: stats.totalPermitsChange || 0,
            icon: FileText,
            color: 'blue',
            href: '/permits'
        },
        {
            title: 'Building Permits',
            value: stats.buildingPermits || 0,
            change: stats.buildingPermitsChange || 0,
            icon: Building,
            color: 'green',
            href: '/building-permits'
        },
        {
            title: 'Gas Permits',
            value: stats.gasPermits || 0,
            change: stats.gasPermitsChange || 0,
            icon: Flame,
            color: 'orange',
            href: '/gas-permits'
        },
        {
            title: 'Pending Review',
            value: stats.pendingReview || 0,
            change: stats.pendingReviewChange || 0,
            icon: Clock,
            color: 'amber',
            href: '/permits?status=submitted'
        },
        {
            title: 'Approved This Month',
            value: stats.approvedThisMonth || 0,
            change: stats.approvedChange || 0,
            icon: CheckCircle,
            color: 'emerald',
            href: '/permits?status=approved'
        },
        {
            title: 'Needs Attention',
            value: stats.needsAttention || 0,
            change: stats.needsAttentionChange || 0,
            icon: AlertTriangle,
            color: 'red',
            href: '/permits?status=needs-attention'
        }
    ] : []

    // Time range options
    const timeRanges = [
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'quarter', label: 'This Quarter' },
        { value: 'year', label: 'This Year' }
    ]

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
                <CardSkeleton className="h-96" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Welcome back, {user?.firstName}! Here's what's happening with your permits.
                    </p>
                </div>

                <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                    {/* Time Range Selector */}
                    <select
                        value={selectedTimeRange}
                        onChange={(e) => setSelectedTimeRange(e.target.value)}
                        className="form-select text-sm"
                    >
                        {timeRanges.map(range => (
                            <option key={range.value} value={range.value}>
                                {range.label}
                            </option>
                        ))}
                    </select>

                    {/* Quick Actions */}
                    {hasPermission('create:permit') && (
                        <Button
                            as={Link}
                            to="/apply"
                            variant="primary"
                            startIcon={<Plus className="h-4 w-4" />}
                        >
                            New Permit
                        </Button>
                    )}
                </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {quickStats.map((stat, index) => {
                    const Icon = stat.icon
                    const isPositiveChange = stat.change >= 0

                    return (
                        <Link
                            key={index}
                            to={stat.href}
                            className="card hover:shadow-md transition-shadow group"
                        >
                            <div className="card-body">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className={clsx(
                                            'flex items-center justify-center h-12 w-12 rounded-lg',
                                            stat.color === 'blue' && 'bg-blue-100 dark:bg-blue-900',
                                            stat.color === 'green' && 'bg-green-100 dark:bg-green-900',
                                            stat.color === 'orange' && 'bg-orange-100 dark:bg-orange-900',
                                            stat.color === 'amber' && 'bg-amber-100 dark:bg-amber-900',
                                            stat.color === 'emerald' && 'bg-emerald-100 dark:bg-emerald-900',
                                            stat.color === 'red' && 'bg-red-100 dark:bg-red-900'
                                        )}>
                                            <Icon className={clsx(
                                                'h-6 w-6',
                                                stat.color === 'blue' && 'text-blue-600 dark:text-blue-400',
                                                stat.color === 'green' && 'text-green-600 dark:text-green-400',
                                                stat.color === 'orange' && 'text-orange-600 dark:text-orange-400',
                                                stat.color === 'amber' && 'text-amber-600 dark:text-amber-400',
                                                stat.color === 'emerald' && 'text-emerald-600 dark:text-emerald-400',
                                                stat.color === 'red' && 'text-red-600 dark:text-red-400'
                                            )} />
                                        </div>
                                    </div>

                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                                {stat.title}
                                            </dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                                    {stat.value.toLocaleString()}
                                                </div>

                                                {stat.change !== 0 && (
                                                    <div className={clsx(
                                                        'ml-2 flex items-baseline text-sm font-semibold',
                                                        isPositiveChange ? 'text-green-600' : 'text-red-600'
                                                    )}>
                                                        <TrendingUp className={clsx(
                                                            'self-center flex-shrink-0 h-4 w-4',
                                                 !isPositiveChange && 'transform rotate-180'
                                                        )} />
                                                        <span className="sr-only">
                              {isPositiveChange ? 'Increased' : 'Decreased'} by
                            </span>
                                                        {Math.abs(stat.change)}%
                                                    </div>
                                                )}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Permits */}
                <div className="lg:col-span-2">
                    <div className="card">
                        <div className="card-header flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Recent Permits
                            </h2>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    startIcon={<Filter className="h-4 w-4" />}
                                >
                                    Filter
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    as={Link}
                                    to="/permits"
                                    startIcon={<Eye className="h-4 w-4" />}
                                >
                                    View All
                                </Button>
                            </div>
                        </div>

                        <div className="card-body p-0">
                            {recentPermits.length === 0 ? (
                                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <p>No recent permits found</p>
                                    <Button
                                        as={Link}
                                        to="/apply"
                                        variant="primary"
                                        size="sm"
                                        className="mt-4"
                                    >
                                        Create First Permit
                                    </Button>
                                </div>
                            ) : (
                                 <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                     {recentPermits.map((permit) => {
                                         const statusColors = {
                                             draft: 'gray',
                                             submitted: 'blue',
                                             under_review: 'amber',
                                             approved: 'green',
                                             rejected: 'red',
                                             expired: 'gray'
                                         }

                                         const statusColor = statusColors[permit.status] || 'gray'

                                         return (
                                             <Link
                                                 key={permit.id}
                                                 to={`/permit/${permit.id}`}
                                                 className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                             >
                                                 <div className="px-6 py-4">
                                                     <div className="flex items-center justify-between">
                                                         <div className="flex-1">
                                                             <div className="flex items-center">
                                                                 <div className="flex-shrink-0">
                                                                     {permit.type === 'building' ? (
                                                                         <Building className="h-5 w-5 text-gray-400" />
                                                                     ) : (
                                                                          <Flame className="h-5 w-5 text-gray-400" />
                                                                      )}
                                                                 </div>
                                                                 <div className="ml-3">
                                                                     <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                         {permit.permitNumber}
                                                                     </p>
                                                                     <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                         {permit.description || 'No description'}
                                                                     </p>
                                                                 </div>
                                                             </div>
                                                         </div>

                                                         <div className="flex items-center space-x-4">
                                                             <div className="text-right">
                                                                 <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                     {new Date(permit.submissionDate).toLocaleDateString()}
                                                                 </p>
                                                             </div>

                                                             <span className={`badge badge-${statusColor}`}>
                                {permit.status.replace('_', ' ')}
                              </span>
                                                         </div>
                                                     </div>
                                                 </div>
                                             </Link>
                                         )
                                     })}
                                 </div>
                             )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions & Info */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    {hasPermission('create:permit') && (
                        <div className="card">
                            <div className="card-header">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Quick Actions
                                </h3>
                            </div>
                            <div className="card-body space-y-3">
                                <Button
                                    as={Link}
                                    to="/apply?type=building"
                                    variant="outline"
                                    fullWidth
                                    startIcon={<Building className="h-4 w-4" />}
                                >
                                    New Building Permit
                                </Button>

                                <Button
                                    as={Link}
                                    to="/apply?type=gas"
                                    variant="outline"
                                    fullWidth
                                    startIcon={<Flame className="h-4 w-4" />}
                                >
                                    New Gas Permit
                                </Button>

                                <Button
                                    as={Link}
                                    to="/search"
                                    variant="ghost"
                                    fullWidth
                                    startIcon={<FileText className="h-4 w-4" />}
                                >
                                    Search Permits
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Status Summary */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Status Overview
                            </h3>
                        </div>
                        <div className="card-body">
                            {stats ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Approved</span>
                                        <div className="flex items-center">
                      <span className="text-sm font-medium text-green-600">
                        {stats.statusBreakdown?.approved || 0}
                      </span>
                                            <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Under Review</span>
                                        <div className="flex items-center">
                      <span className="text-sm font-medium text-amber-600">
                        {stats.statusBreakdown?.under_review || 0}
                      </span>
                                            <Clock className="h-4 w-4 text-amber-500 ml-2" />
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Rejected</span>
                                        <div className="flex items-center">
                      <span className="text-sm font-medium text-red-600">
                        {stats.statusBreakdown?.rejected || 0}
                      </span>
                                            <AlertTriangle className="h-4 w-4 text-red-500 ml-2" />
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Draft</span>
                                        <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-600">
                        {stats.statusBreakdown?.draft || 0}
                      </span>
                                            <FileText className="h-4 w-4 text-gray-500 ml-2" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                 <div className="space-y-3">
                                     {[...Array(4)].map((_, i) => (
                                         <div key={i} className="loading-skeleton h-6"></div>
                                     ))}
                                 </div>
                             )}
                        </div>

                        {stats && (
                            <div className="card-footer">
                                <Button
                                    as={Link}
                                    to="/reports"
                                    variant="ghost"
                                    size="sm"
                                    fullWidth
                                    startIcon={<TrendingUp className="h-4 w-4" />}
                                >
                                    View Detailed Reports
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Upcoming Deadlines */}
                    {hasPermission('read:deadlines') && (
                        <div className="card">
                            <div className="card-header">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Upcoming Deadlines
                                </h3>
                            </div>
                            <div className="card-body">
                                {stats?.upcomingDeadlines?.length > 0 ? (
                                    <div className="space-y-3">
                                        {stats.upcomingDeadlines.slice(0, 5).map((deadline, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {deadline.permitNumber}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {deadline.type}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={clsx(
                                                        'text-sm font-medium',
                                                        deadline.daysUntilDeadline <= 7 ? 'text-red-600' :
                                                        deadline.daysUntilDeadline <= 30 ? 'text-amber-600' :
                                                        'text-gray-600'
                                                    )}>
                                                        {deadline.daysUntilDeadline} days
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                     <div className="text-center text-gray-500 dark:text-gray-400">
                                         <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                         <p className="text-sm">No upcoming deadlines</p>
                                     </div>
                                 )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Additional Dashboard Widgets */}
            {hasPermission('read:analytics') && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Summary */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Revenue Summary
                            </h3>
                        </div>
                        <div className="card-body">
                            {stats?.revenue ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Total Revenue
                    </span>
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      ${stats.revenue.total.toLocaleString()}
                    </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Building Permits
                    </span>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      ${stats.revenue.building.toLocaleString()}
                    </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Gas Permits
                    </span>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      ${stats.revenue.gas.toLocaleString()}
                    </span>
                                    </div>
                                </div>
                            ) : (
                                 <div className="space-y-3">
                                     {[...Array(3)].map((_, i) => (
                                         <div key={i} className="loading-skeleton h-6"></div>
                                     ))}
                                 </div>
                             )}
                        </div>
                    </div>

                    {/* Processing Times */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Average Processing Times
                            </h3>
                        </div>
                        <div className="card-body">
                            {stats?.processingTimes ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Building Permits
                    </span>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {stats.processingTimes.building} days
                    </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Gas Permits
                    </span>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {stats.processingTimes.gas} days
                    </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Overall Average
                    </span>
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {stats.processingTimes.average} days
                    </span>
                                    </div>
                                </div>
                            ) : (
                                 <div className="space-y-3">
                                     {[...Array(3)].map((_, i) => (
                                         <div key={i} className="loading-skeleton h-6"></div>
                                     ))}
                                 </div>
                             )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard