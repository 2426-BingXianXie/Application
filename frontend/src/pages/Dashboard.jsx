import React from 'react'
import { Link } from 'react-router-dom'
import {
    Plus,
    FileText,
    Clock,
    CheckCircle,
    AlertTriangle,
    Building,
    Zap,
    BarChart3,
    TrendingUp,
    Calendar,
    Users
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'

const Dashboard = () => {
    const { user } = useAuth()
    const { getRecentNotifications } = useNotifications()

    // Mock data - in real app, this would come from API
    const stats = {
        total: 156,
        pending: 23,
        approved: 98,
        rejected: 12,
        expiring: 5
    }

    const recentPermits = [
        {
            id: 'BP001234',
            type: 'Building',
            address: '123 Main Street',
            status: 'APPROVED',
            submittedDate: '2024-01-15',
            applicant: 'John Doe'
        },
        {
            id: 'GP001235',
            type: 'Gas',
            address: '456 Oak Avenue',
            status: 'UNDER_REVIEW',
            submittedDate: '2024-01-14',
            applicant: 'Jane Smith'
        },
        {
            id: 'BP001236',
            type: 'Building',
            address: '789 Pine Road',
            status: 'SUBMITTED',
            submittedDate: '2024-01-13',
            applicant: 'Bob Johnson'
        }
    ]

    const quickActions = [
        {
            name: 'Apply for Building Permit',
            description: 'Start a new building permit application',
            href: '/apply?type=building',
            icon: Building,
            color: 'bg-blue-500 hover:bg-blue-600',
        },
        {
            name: 'Apply for Gas Permit',
            description: 'Start a new gas permit application',
            href: '/apply?type=gas',
            icon: Zap,
            color: 'bg-yellow-500 hover:bg-yellow-600',
        },
        {
            name: 'View All Permits',
            description: 'See all your permit applications',
            href: '/permits',
            icon: FileText,
            color: 'bg-green-500 hover:bg-green-600',
        },
        {
            name: 'Generate Reports',
            description: 'Create custom permit reports',
            href: '/reports',
            icon: BarChart3,
            color: 'bg-purple-500 hover:bg-purple-600',
        }
    ]

    const getStatusIcon = (status) => {
        switch (status) {
            case 'APPROVED':
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case 'UNDER_REVIEW':
                return <Clock className="w-4 h-4 text-yellow-500" />
            case 'REJECTED':
                return <AlertTriangle className="w-4 h-4 text-red-500" />
            default:
                return <FileText className="w-4 h-4 text-gray-500" />
        }
    }

    const getStatusBadge = (status) => {
        const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"

        switch (status) {
            case 'APPROVED':
                return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`
            case 'UNDER_REVIEW':
                return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`
            case 'REJECTED':
                return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`
            case 'SUBMITTED':
                return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`
            default:
                return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`
        }
    }

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Welcome back, {user?.name || 'User'}!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Here's an overview of your permit applications
                        </p>
                    </div>

                    <Link
                        to="/apply"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Application
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <FileText className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Permits</p>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Clock className="w-8 h-8 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.pending}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Approved</p>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.approved}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rejected</p>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.rejected}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Calendar className="w-8 h-8 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Expiring Soon</p>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.expiring}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {quickActions.map((action) => (
                            <Link
                                key={action.name}
                                to={action.href}
                                className={`
                  p-4 rounded-lg text-white transition-colors
                  ${action.color}
                `}
                            >
                                <div className="flex items-center">
                                    <action.icon className="w-6 h-6 mr-3" />
                                    <div>
                                        <p className="font-medium">{action.name}</p>
                                        <p className="text-sm opacity-90">{action.description}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                            Recent Permits
                        </h2>
                        <Link
                            to="/permits"
                            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                        >
                            View all
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {recentPermits.map((permit) => (
                            <div key={permit.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <div className="flex items-center space-x-3">
                                    {getStatusIcon(permit.status)}
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {permit.id}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {permit.address}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                  <span className={getStatusBadge(permit.status)}>
                    {permit.status.replace('_', ' ')}
                  </span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {new Date(permit.submittedDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    System Performance
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-3">
                            <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">5.2 days</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Average Processing Time</p>
                    </div>

                    <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full mx-auto mb-3">
                            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">94%</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Approval Rate</p>
                    </div>

                    <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full mx-auto mb-3">
                            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">1,247</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Applications This Month</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard