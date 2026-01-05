import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

const DashboardStats = ({ stats = {}, loading = false, timeRange = 'month' }) => {

    // Loading skeleton
    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg animate-pulse">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-2"></div>
                                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    // Stats configuration
    const statItems = [
        {
            name: 'Total Permits',
            stat: stats.totalPermits || 0,
            previousStat: stats.previousTotalPermits || 0,
            change: stats.totalPermitsChange || 0,
            changeType: stats.totalPermitsChange >= 0 ? 'increase' : 'decrease',
            href: '/permits',
            icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
            color: 'blue'
        },
        {
            name: 'Pending Review',
            stat: stats.pendingReview || 0,
            previousStat: stats.previousPendingReview || 0,
            change: stats.pendingReviewChange || 0,
            changeType: stats.pendingReviewChange <= 0 ? 'increase' : 'decrease',
            href: '/permits?status=submitted',
            icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'amber'
        },
        {
            name: 'Approved',
            stat: stats.approved || 0,
            previousStat: stats.previousApproved || 0,
            change: stats.approvedChange || 0,
            changeType: stats.approvedChange >= 0 ? 'increase' : 'decrease',
            href: '/permits?status=approved',
            icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'green'
        },
        {
            name: 'This Month Revenue',
            stat: `$${(stats.revenue || 0).toLocaleString()}`,
            previousStat: stats.previousRevenue || 0,
            change: stats.revenueChange || 0,
            changeType: stats.revenueChange >= 0 ? 'increase' : 'decrease',
            href: '/reports',
            icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
            color: 'emerald'
        }
    ]

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {statItems.map((item) => (
                <StatCard
                    key={item.name}
                    item={item}
                    timeRange={timeRange}
                />
            ))}
        </div>
    )
}

// Individual stat card component
const StatCard = ({ item, timeRange }) => {
    const isIncrease = item.changeType === 'increase'

    return (
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className={clsx(
                            'w-8 h-8 rounded-md flex items-center justify-center',
                            item.color === 'blue' && 'bg-blue-500',
                            item.color === 'amber' && 'bg-amber-500',
                            item.color === 'green' && 'bg-green-500',
                            item.color === 'emerald' && 'bg-emerald-500'
                        )}>
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                            </svg>
                        </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                {item.name}
                            </dt>
                            <dd>
                                <div className="flex items-baseline">
                                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        {item.stat}
                                    </div>
                                    {item.change !== 0 && (
                                        <div className={clsx(
                                            'ml-2 flex items-baseline text-sm font-semibold',
                                            isIncrease ? 'text-green-600' : 'text-red-600'
                                        )}>
                                            {isIncrease ? (
                                                <TrendingUp className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                                            ) : (
                                                 <TrendingDown className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                                             )}
                                            <span className="sr-only">
                        {isIncrease ? 'Increased' : 'Decreased'} by
                      </span>
                                            {Math.abs(item.change)}%
                                        </div>
                                    )}
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>

            {/* Link to detailed view */}
            {item.href && (
                <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
                    <div className="text-sm">
                        <Link
                            to={item.href}
                            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            View all
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DashboardStats