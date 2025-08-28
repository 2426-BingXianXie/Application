import React from 'react'
import { Link } from 'react-router-dom'
import {
    Plus,
    Search,
    FileText,
    Building,
    Flame,
    Download,
    Calendar,
    BarChart3
} from 'lucide-react'
import Button from '../ui/Button'
import { useAuth } from '../../context/AuthContext'

const QuickActions = ({
                          onActionClick,
                          showStats = false,
                          recentStats = {}
                      }) => {
    const { hasPermission } = useAuth()

    const primaryActions = [
        {
            id: 'new-building',
            label: 'New Building Permit',
            description: 'Start building permit application',
            icon: Building,
            href: '/apply?type=building',
            color: 'green',
            permission: 'create:permits'
        },
        {
            id: 'new-gas',
            label: 'New Gas Permit',
            description: 'Start gas permit application',
            icon: Flame,
            href: '/apply?type=gas',
            color: 'orange',
            permission: 'create:permits'
        }
    ]

    const secondaryActions = [
        {
            id: 'search',
            label: 'Search Permits',
            description: 'Find existing permits',
            icon: Search,
            href: '/search',
            color: 'blue'
        },
        {
            id: 'reports',
            label: 'View Reports',
            description: 'Analytics and insights',
            icon: BarChart3,
            href: '/reports',
            color: 'purple',
            permission: 'read:reports'
        },
        {
            id: 'export',
            label: 'Export Data',
            description: 'Download permit data',
            icon: Download,
            onClick: () => onActionClick?.('export'),
            color: 'gray'
        },
        {
            id: 'schedule',
            label: 'Schedule Inspection',
            description: 'Book inspection appointment',
            icon: Calendar,
            href: '/inspections/schedule',
            color: 'indigo',
            permission: 'schedule:inspections'
        }
    ]

    const getColorClasses = (color) => {
        const colorMap = {
            blue: {
                bg: 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30',
                border: 'border-blue-200 dark:border-blue-800',
                icon: 'text-blue-600 dark:text-blue-400',
                text: 'text-blue-900 dark:text-blue-200'
            },
            green: {
                bg: 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30',
                border: 'border-green-200 dark:border-green-800',
                icon: 'text-green-600 dark:text-green-400',
                text: 'text-green-900 dark:text-green-200'
            },
            orange: {
                bg: 'bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30',
                border: 'border-orange-200 dark:border-orange-800',
                icon: 'text-orange-600 dark:text-orange-400',
                text: 'text-orange-900 dark:text-orange-200'
            },
            purple: {
                bg: 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30',
                border: 'border-purple-200 dark:border-purple-800',
                icon: 'text-purple-600 dark:text-purple-400',
                text: 'text-purple-900 dark:text-purple-200'
            },
            indigo: {
                bg: 'bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30',
                border: 'border-indigo-200 dark:border-indigo-800',
                icon: 'text-indigo-600 dark:text-indigo-400',
                text: 'text-indigo-900 dark:text-indigo-200'
            },
            gray: {
                bg: 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700',
                border: 'border-gray-200 dark:border-gray-700',
                icon: 'text-gray-600 dark:text-gray-400',
                text: 'text-gray-900 dark:text-gray-200'
            }
        }

        return colorMap[color] || colorMap.blue
    }

    const ActionCard = ({ action }) => {
        const colors = getColorClasses(action.color)
        const Icon = action.icon

        // Check permissions
        if (action.permission && !hasPermission(action.permission)) {
            return null
        }

        const cardContent = (
            <div className={`p-6 border-2 rounded-lg transition-all duration-200 cursor-pointer ${colors.bg} ${colors.border}`}>
                <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${colors.bg}`}>
                        <Icon className={`h-6 w-6 ${colors.icon}`} />
                    </div>

                    <div className="flex-1">
                        <h3 className={`text-lg font-semibold ${colors.text}`}>
                            {action.label}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {action.description}
                        </p>
                    </div>
                </div>
            </div>
        )

        if (action.href) {
            return (
                <Link key={action.id} to={action.href}>
                    {cardContent}
                </Link>
            )
        }

        return (
            <button key={action.id} onClick={action.onClick} className="w-full text-left">
                {cardContent}
            </button>
        )
    }

    return (
        <div className="space-y-6">
            {/* Primary Actions */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Create New Permit
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {primaryActions.map((action) => (
                        <ActionCard key={action.id} action={action} />
                    ))}
                </div>
            </div>

            {/* Secondary Actions */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Tools
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {secondaryActions.map((action) => (
                        <ActionCard key={action.id} action={action} />
                    ))}
                </div>
            </div>

            {/* Stats Summary (if enabled) */}
            {showStats && recentStats && Object.keys(recentStats).length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Recent Activity
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-600 dark:text-blue-400">This Week</p>
                                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                                        {recentStats.thisWeek || 0}
                                    </p>
                                </div>
                                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-600 dark:text-green-400">Approved</p>
                                    <p className="text-2xl font-bold text-green-900 dark:text-green-200">
                                        {recentStats.approved || 0}
                                    </p>
                                </div>
                                <Building className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                        </div>

                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-amber-600 dark:text-amber-400">Pending</p>
                                    <p className="text-2xl font-bold text-amber-900 dark:text-amber-200">
                                        {recentStats.pending || 0}
                                    </p>
                                </div>
                                <Clock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default QuickActions