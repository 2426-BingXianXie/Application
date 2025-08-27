import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
    Plus,
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Building,
    Zap,
    TrendingUp,
    Calendar,
    Users,
    DollarSign,
    Activity
} from 'lucide-react'
import Card, { StatsCard, EmptyCard } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import LoadingSpinner, { PageLoader } from '../components/common/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import { usePermits } from '../hooks/usePermits'
import { PERMIT_STATUS_LABELS, PERMIT_STATUS_COLORS, ROUTES } from '../utils/constants'
import { formatDate, formatCurrency } from '../utils/formatters'

const Dashboard = () => {
    const { user } = useAuth()
    const [timeRange, setTimeRange] = useState('30') // days

    // Fetch dashboard data
    const { usePermitsList: useBuildingPermits } = usePermits('building')
    const { usePermitsList: useGasPermits } = usePermits('gas')

    const {
        data: buildingPermitsData,
        isLoading: buildingLoading
    } = useBuildingPermits({
                               page: 0,
                               size: 5,
                               sortBy: 'submissionDate',
                               sortDirection: 'desc'
                           })

    const {
        data: gasPermitsData,
        isLoading: gasLoading
    } = useGasPermits({
                          page: 0,
                          size: 5,
                          sortBy: 'submissionDate',
                          sortDirection: 'desc'
                      })

    const buildingPermits = buildingPermitsData?.content || []
    const gasPermits = gasPermitsData?.content || []
    const allPermits = [...buildingPermits, ...gasPermits]

    // Calculate statistics
    const stats = useMemo(() => {
        const building = buildingPermitsData?.content || []
        const gas = gasPermitsData?.content || []
        const all = [...building, ...gas]

        const total = all.length
        const pending = all.filter(p => p.status === 'PENDING_REVIEW').length
        const approved = all.filter(p => p.status === 'APPROVED').length
        const draft = all.filter(p => p.status === 'DRAFT').length
        const rejected = all.filter(p => p.status === 'REJECTED').length

        const totalValue = all.reduce((sum, permit) => {
            const cost = permit.permitInfo?.projectCost || permit.buildingPermitInfo?.projectCost || permit.gasPermitInfo?.projectCost || 0
            return sum + (typeof cost === 'string' ? parseCurrency(cost) : cost)
        }, 0)

        // Recent activity (last 7 days)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        const recentActivity = all.filter(p => new Date(p.submissionDate) > weekAgo).length

        return {
            total,
            pending,
            approved,
            draft,
            rejected,
            totalValue,
            recentActivity,
            buildingCount: building.length,
            gasCount: gas.length
        }
    }, [buildingPermitsData, gasPermitsData])

    // Recent permits table columns
    const recentPermitsColumns = [
        {
            key: 'permitNumber',
            title: 'Permit #',
            sortable: true,
            render: (value, row) => (
                <Link
                    to={`/permit/${row.id}`}
                    className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    {value || `${row.permitType?.charAt(0).toUpperCase()}${String(row.id).padStart(6, '0')}`}
                </Link>
            )
        },
        {
            key: 'permitType',
            title: 'Type',
            render: (value) => (
                <div className="flex items-center space-x-2">
                    {value === 'BUILDING' ? (
                        <Building className="w-4 h-4 text-blue-600" />
                    ) : (
                         <Zap className="w-4 h-4 text-yellow-600" />
                     )}
                    <span className="capitalize">{value?.toLowerCase()}</span>
                </div>
            )
        },
        {
            key: 'status',
            title: 'Status',
            render: (value) => {
                const color = PERMIT_STATUS_COLORS[value] || 'gray'
                return (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800 dark:bg-${color}-900 dark:text-${color}-200`}>
                        {PERMIT_STATUS_LABELS[value] || value}
                    </span>
                )
            }
        },
        {
            key: 'submissionDate',
            title: 'Submitted',
            type: 'date',
            sortable: true,
            render: (value) => value ? formatDate(value) : '—'
        },
        {
            key: 'projectCost',
            title: 'Value',
            render: (value, row) => {
                const cost = row.permitInfo?.projectCost || row.buildingPermitInfo?.projectCost || row.gasPermitInfo?.projectCost
                return cost ? formatCurrency(cost) : '—'
            }
        }
    ]

    if (buildingLoading || gasLoading) {
        return <PageLoader text="Loading dashboard..." />
    }

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-8 sm:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Welcome back, {user?.firstName || 'User'}!
                            </h1>
                            <p className="text-blue-100 mt-1">
                                Here's an overview of your permit applications
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="lg"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            startIcon={<Plus className="w-5 h-5" />}
                            onClick={() => window.location.href = ROUTES.APPLY}
                        >
                            New Application
                        </Button>
                    </div>
                </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Permits"
                    value={stats.total}
                    icon={<FileText />}
                    change={stats.recentActivity > 0 ? `+${stats.recentActivity} this week` : 'No recent activity'}
                    changeType={stats.recentActivity > 0 ? 'positive' : 'neutral'}
                />

                <StatsCard
                    title="Pending Review"
                    value={stats.pending}
                    icon={<Clock />}
                    change={stats.pending > 0 ? 'Awaiting approval' : 'All caught up'}
                    changeType={stats.pending > 0 ? 'warning' : 'positive'}
                />

                <StatsCard
                    title="Approved"
                    value={stats.approved}
                    icon={<CheckCircle />}
                    change={stats.approved > 0 ? 'Ready to proceed' : 'None approved yet'}
                    changeType="positive"
                />

                <StatsCard
                    title="Total Project Value"
                    value={formatCurrency(stats.totalValue)}
                    icon={<DollarSign />}
                    change="Across all permits"
                    changeType="neutral"
                />
            </div>

            {/* Quick Actions */}
            <Card title="Quick Actions">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button
                        variant="outline"
                        className="h-20 flex-col"
                        onClick={() => window.location.href = `${ROUTES.APPLY}?type=building`}
                    >
                        <Building className="w-6 h-6 mb-2" />
                        <span>Building Permit</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-20 flex-col"
                        onClick={() => window.location.href = `${ROUTES.APPLY}?type=gas`}
                    >
                        <Zap className="w-6 h-6 mb-2" />
                        <span>Gas Permit</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-20 flex-col"
                        onClick={() => window.location.href = ROUTES.BUILDING_PERMITS}
                    >
                        <Activity className="w-6 h-6 mb-2" />
                        <span>View All Permits</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-20 flex-col"
                        onClick={() => window.location.href = ROUTES.REPORTS}
                    >
                        <TrendingUp className="w-6 h-6 mb-2" />
                        <span>Reports</span>
                    </Button>
                </div>
            </Card>

            {/* Permit Type Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card
                    title="Building Permits"
                    subtitle={`${stats.buildingCount} permits`}
                    actions={
                        <Link
                            to={ROUTES.BUILDING_PERMITS}
                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            View All →
                        </Link>
                    }
                >
                    {stats.buildingCount === 0 ? (
                        <EmptyCard
                            icon={<Building />}
                            title="No Building Permits"
                            message="You haven't submitted any building permit applications yet."
                            action={
                                <Button
                                    variant="primary"
                                    startIcon={<Plus className="w-4 h-4" />}
                                    onClick={() => window.location.href = `${ROUTES.APPLY}?type=building`}
                                >
                                    Apply for Building Permit
                                </Button>
                            }
                        />
                    ) : (
                         <div className="space-y-3">
                             {buildingPermits.slice(0, 3).map((permit) => (
                                 <div key={permit.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                                     <div>
                                         <p className="font-medium text-gray-900 dark:text-white">
                                             {permit.permitNumber || `BP${String(permit.id).padStart(6, '0')}`}
                                         </p>
                                         <p className="text-sm text-gray-600 dark:text-gray-400">
                                             {permit.buildingPermitInfo?.permitFor || 'Building Work'}
                                         </p>
                                     </div>
                                     <div className="text-right">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PERMIT_STATUS_COLORS[permit.status] ? `bg-${PERMIT_STATUS_COLORS[permit.status]}-100 text-${PERMIT_STATUS_COLORS[permit.status]}-800` : 'bg-gray-100 text-gray-800'}`}>
                                            {PERMIT_STATUS_LABELS[permit.status] || permit.status}
                                        </span>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     )}
                </Card>

                <Card
                    title="Gas Permits"
                    subtitle={`${stats.gasCount} permits`}
                    actions={
                        <Link
                            to={ROUTES.GAS_PERMITS}
                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            View All →
                        </Link>
                    }
                >
                    {stats.gasCount === 0 ? (
                        <EmptyCard
                            icon={<Zap />}
                            title="No Gas Permits"
                            message="You haven't submitted any gas permit applications yet."
                            action={
                                <Button
                                    variant="primary"
                                    startIcon={<Plus className="w-4 h-4" />}
                                    onClick={() => window.location.href = `${ROUTES.APPLY}?type=gas`}
                                >
                                    Apply for Gas Permit
                                </Button>
                            }
                        />
                    ) : (
                         <div className="space-y-3">
                             {gasPermits.slice(0, 3).map((permit) => (
                                 <div key={permit.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                                     <div>
                                         <p className="font-medium text-gray-900 dark:text-white">
                                             {permit.permitNumber || `GP${String(permit.id).padStart(6, '0')}`}
                                         </p>
                                         <p className="text-sm text-gray-600 dark:text-gray-400">
                                             {permit.gasPermitInfo?.workType || 'Gas Work'}
                                         </p>
                                     </div>
                                     <div className="text-right">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PERMIT_STATUS_COLORS[permit.status] ? `bg-${PERMIT_STATUS_COLORS[permit.status]}-100 text-${PERMIT_STATUS_COLORS[permit.status]}-800` : 'bg-gray-100 text-gray-800'}`}>
                                            {PERMIT_STATUS_LABELS[permit.status] || permit.status}
                                        </span>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     )}
                </Card>
            </div>

            {/* Recent Activity */}
            <Card
                title="Recent Permit Activity"
                subtitle="Your latest permit applications and updates"
                actions={
                    <div className="flex space-x-2">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1"
                        >
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                        </select>
                    </div>
                }
            >
                {allPermits.length === 0 ? (
                    <EmptyCard
                        icon={<FileText />}
                        title="No Recent Activity"
                        message="You haven't submitted any permit applications yet. Get started by applying for a permit."
                        action={
                            <Button
                                variant="primary"
                                startIcon={<Plus className="w-4 h-4" />}
                                onClick={() => window.location.href = ROUTES.APPLY}
                            >
                                Apply for Permit
                            </Button>
                        }
                    />
                ) : (
                     <Table
                         columns={recentPermitsColumns}
                         data={allPermits.slice(0, 10)}
                         loading={buildingLoading || gasLoading}
                         emptyMessage="No recent permit activity"
                         rowActions={(permit) => (
                             <Button
                                 variant="ghost"
                                 size="sm"
                                 startIcon={<Eye className="w-4 h-4" />}
                                 onClick={() => window.location.href = `/permit/${permit.id}`}
                             >
                                 View
                             </Button>
                         )}
                     />
                 )}
            </Card>

            {/* Status Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Permit Status Distribution">
                    <div className="space-y-4">
                        {[
                            { key: 'DRAFT', label: 'Draft', count: stats.draft, color: 'gray' },
                            { key: 'PENDING_REVIEW', label: 'Pending Review', count: stats.pending, color: 'yellow' },
                            { key: 'APPROVED', label: 'Approved', count: stats.approved, color: 'green' },
                            { key: 'REJECTED', label: 'Rejected', count: stats.rejected, color: 'red' }
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-3 h-3 rounded-full bg-${item.color}-500`}></div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {item.label}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {item.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Quick Links">
                    <div className="space-y-3">
                        <Link
                            to={ROUTES.BUILDING_PERMITS}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                <Building className="w-5 h-5 text-blue-600" />
                                <span className="font-medium text-gray-900 dark:text-white">Building Permits</span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {stats.buildingCount} permits
                            </span>
                        </Link>

                        <Link
                            to={ROUTES.GAS_PERMITS}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                <Zap className="w-5 h-5 text-yellow-600" />
                                <span className="font-medium text-gray-900 dark:text-white">Gas Permits</span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {stats.gasCount} permits
                            </span>
                        </Link>

                        <Link
                            to={ROUTES.REPORTS}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-gray-900 dark:text-white">Reports & Analytics</span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                View insights
                            </span>
                        </Link>

                        <Link
                            to={ROUTES.PROFILE}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                <Users className="w-5 h-5 text-purple-600" />
                                <span className="font-medium text-gray-900 dark:text-white">Profile Settings</span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Manage account
                            </span>
                        </Link>
                    </div>
                </Card>
            </div>

            {/* Important Notices */}
            {stats.pending > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-700 rounded-md p-4">
                    <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div className="ml-3">
                            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                Permits Awaiting Review
                            </h4>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                You have {stats.pending} permit{stats.pending > 1 ? 's' : ''} pending review.
                                Typical review time is 3-5 business days. You'll be notified when the status changes.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard