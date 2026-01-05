import React, { useState, useMemo } from 'react'
import {
    BarChart3,
    PieChart,
    TrendingUp,
    Download,
    Calendar,
    Filter,
    RefreshCw,
    Building,
    Zap,
    Clock,
    CheckCircle,
    DollarSign,
    Users
} from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart as RechartsPieChart,
    Cell,
    LineChart,
    Line,
    Area,
    AreaChart,
    ResponsiveContainer
} from 'recharts'
import Card, { StatsCard } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import { usePermits } from '../hooks/usePermits'
import { PageLoader } from '../components/common/LoadingSpinner'
import { PERMIT_STATUS_LABELS, PERMIT_STATUS_COLORS } from '../utils/constants'
import { formatCurrency, formatDate } from '../utils/formatters'

const Reports = () => {
    const [dateRange, setDateRange] = useState('30') // days
    const [permitTypeFilter, setPermitTypeFilter] = useState('all')
    const [refreshing, setRefreshing] = useState(false)

    const { usePermitsList: useBuildingPermits } = usePermits('building')
    const { usePermitsList: useGasPermits } = usePermits('gas')

    const { data: buildingData, isLoading: buildingLoading } = useBuildingPermits({
                                                                                      page: 0,
                                                                                      size: 1000, // Get all for analytics
                                                                                      dateRange
                                                                                  })

    const { data: gasData, isLoading: gasLoading } = useGasPermits({
                                                                       page: 0,
                                                                       size: 1000,
                                                                       dateRange
                                                                   })

    const isLoading = buildingLoading || gasLoading

    // Process data for charts
    const chartData = useMemo(() => {
        const building = buildingData?.content || []
        const gas = gasData?.content || []
        const allPermits = [...building, ...gas]

        // Filter by permit type if specified
        const filteredPermits = permitTypeFilter === 'all'
                                ? allPermits
                                : allPermits.filter(p => p.permitType.toLowerCase() === permitTypeFilter)

        // Status distribution
        const statusDistribution = Object.entries(
            filteredPermits.reduce((acc, permit) => {
                acc[permit.status] = (acc[permit.status] || 0) + 1
                return acc
            }, {})
        ).map(([status, count]) => ({
            name: PERMIT_STATUS_LABELS[status] || status,
            value: count,
            color: `#${PERMIT_STATUS_COLORS[status] || '6B7280'}`
        }))

        // Monthly trends (last 12 months)
        const monthlyData = []
        for (let i = 11; i >= 0; i--) {
            const date = new Date()
            date.setMonth(date.getMonth() - i)
            const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })

            const monthPermits = filteredPermits.filter(permit => {
                const permitDate = new Date(permit.submissionDate)
                return permitDate.getMonth() === date.getMonth() &&
                       permitDate.getFullYear() === date.getFullYear()
            })

            monthlyData.push({
                                 month: monthName,
                                 building: monthPermits.filter(p => p.permitType === 'BUILDING').length,
                                 gas: monthPermits.filter(p => p.permitType === 'GAS').length,
                                 total: monthPermits.length,
                                 value: monthPermits.reduce((sum, p) => {
                                     const cost = p.buildingPermitInfo?.projectCost || p.gasPermitInfo?.projectCost || 0
                                     return sum + (typeof cost === 'string' ? parseCurrency(cost) : cost)
                                 }, 0)
                             })
        }

        // Permit type breakdown
        const typeBreakdown = [
            {
                name: 'Building Permits',
                value: building.length,
                color: '#3B82F6'
            },
            {
                name: 'Gas Permits',
                value: gas.length,
                color: '#F59E0B'
            }
        ]

        // Processing time analysis
        const processingTimes = filteredPermits
            .filter(p => p.status === 'APPROVED' && p.approvalDate)
            .map(permit => {
                const submitted = new Date(permit.submissionDate)
                const approved = new Date(permit.approvalDate)
                const days = Math.ceil((approved - submitted) / (1000 * 60 * 60 * 24))
                return { permitType: permit.permitType, days }
            })

        const avgProcessingTime = processingTimes.length > 0
                                  ? processingTimes.reduce((sum, p) => sum + p.days, 0) / processingTimes.length
                                  : 0

        return {
            statusDistribution,
            monthlyData,
            typeBreakdown,
            avgProcessingTime: Math.round(avgProcessingTime),
            totalPermits: filteredPermits.length,
            totalValue: filteredPermits.reduce((sum, permit) => {
                const cost = permit.buildingPermitInfo?.projectCost || permit.gasPermitInfo?.projectCost || 0
                return sum + (typeof cost === 'string' ? parseCurrency(cost) : cost)
            }, 0)
        }
    }, [buildingData, gasData, permitTypeFilter, dateRange])

    const handleRefresh = async () => {
        setRefreshing(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setRefreshing(false)
    }

    const handleExportReport = () => {
        console.log('Exporting report...')
    }

    if (isLoading) {
        return <PageLoader text="Loading reports..." />
    }

    const CHART_COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#F97316']

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Reports & Analytics
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Insights and analytics for your permit applications
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    <Select
                        value={dateRange}
                        onChange={setDateRange}
                        options={[
                            { value: '7', label: 'Last 7 days' },
                            { value: '30', label: 'Last 30 days' },
                            { value: '90', label: 'Last 90 days' },
                            { value: '365', label: 'Last year' }
                        ]}
                        className="w-40"
                    />

                    <Select
                        value={permitTypeFilter}
                        onChange={setPermitTypeFilter}
                        options={[
                            { value: 'all', label: 'All Permits' },
                            { value: 'building', label: 'Building Only' },
                            { value: 'gas', label: 'Gas Only' }
                        ]}
                        className="w-40"
                    />

                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        loading={refreshing}
                        startIcon={<RefreshCw className="w-4 h-4" />}
                    >
                        Refresh
                    </Button>

                    <Button
                        variant="primary"
                        onClick={handleExportReport}
                        startIcon={<Download className="w-4 h-4" />}
                    >
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Permits"
                    value={chartData.totalPermits}
                    icon={<BarChart3 />}
                    change={`Last ${dateRange} days`}
                    changeType="neutral"
                />

                <StatsCard
                    title="Total Project Value"
                    value={formatCurrency(chartData.totalValue)}
                    icon={<DollarSign />}
                    change="Combined value"
                    changeType="positive"
                />

                <StatsCard
                    title="Avg Processing Time"
                    value={`${chartData.avgProcessingTime} days`}
                    icon={<Clock />}
                    change="For approved permits"
                    changeType="neutral"
                />

                <StatsCard
                    title="Approval Rate"
                    value={`${Math.round((chartData.statusDistribution.find(s => s.name.includes('Approved'))?.value || 0) / chartData.totalPermits * 100)}%`}
                    icon={<CheckCircle />}
                    change="Success rate"
                    changeType="positive"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Trends */}
                <Card title="Monthly Permit Trends">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData.monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis
                                dataKey="month"
                                className="text-xs"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                className="text-xs"
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--bg-primary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px'
                                }}
                            />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="building"
                                stackId="1"
                                stroke="#3B82F6"
                                fill="#3B82F6"
                                fillOpacity={0.6}
                                name="Building Permits"
                            />
                            <Area
                                type="monotone"
                                dataKey="gas"
                                stackId="1"
                                stroke="#F59E0B"
                                fill="#F59E0B"
                                fillOpacity={0.6}
                                name="Gas Permits"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>

                {/* Status Distribution */}
                <Card title="Permit Status Distribution">
                    <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                            <Pie
                                data={chartData.statusDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={120}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.statusDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </RechartsPieChart>
                    </ResponsiveContainer>
                </Card>

                {/* Project Value Trends */}
                <Card title="Project Value Trends">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData.monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis
                                dataKey="month"
                                className="text-xs"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                className="text-xs"
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                            />
                            <Tooltip
                                formatter={(value) => [formatCurrency(value), 'Project Value']}
                                contentStyle={{
                                    backgroundColor: 'var(--bg-primary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#10B981"
                                strokeWidth={3}
                                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                {/* Permit Type Comparison */}
                <Card title="Permit Type Comparison">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData.monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis
                                dataKey="month"
                                className="text-xs"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                className="text-xs"
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--bg-primary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="building" fill="#3B82F6" name="Building Permits" />
                            <Bar dataKey="gas" fill="#F59E0B" name="Gas Permits" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Quick Stats" className="lg:col-span-1">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Building className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium">Building Permits</span>
                            </div>
                            <span className="text-sm font-semibold">
                                {buildingData?.content?.length || 0}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Zap className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm font-medium">Gas Permits</span>
                            </div>
                            <span className="text-sm font-semibold">
                                {gasData?.content?.length || 0}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-orange-600" />
                                <span className="text-sm font-medium">Pending Review</span>
                            </div>
                            <span className="text-sm font-semibold">
                                {[...(buildingData?.content || []), ...(gasData?.content || [])]
                                    .filter(p => p.status === 'PENDING_REVIEW').length}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium">Approved</span>
                            </div>
                            <span className="text-sm font-semibold">
                                {[...(buildingData?.content || []), ...(gasData?.content || [])]
                                    .filter(p => p.status === 'APPROVED').length}
                            </span>
                        </div>

                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    Total Project Value
                                </span>
                                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                    {formatCurrency(chartData.totalValue)}
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="Performance Insights" className="lg:col-span-2">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                                    Most Common Permit Type
                                </h4>
                                <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                                    {(buildingData?.content?.length || 0) > (gasData?.content?.length || 0)
                                     ? 'Building Permits'
                                     : 'Gas Permits'
                                    }
                                </p>
                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                    {Math.max(buildingData?.content?.length || 0, gasData?.content?.length || 0)} applications
                                </p>
                            </div>

                            <div className="bg-green-50 dark:bg-green-900/50 p-4 rounded-lg">
                                <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                                    Average Processing Time
                                </h4>
                                <p className="text-lg font-semibold text-green-900 dark:text-green-100">
                                    {chartData.avgProcessingTime} days
                                </p>
                                <p className="text-xs text-green-700 dark:text-green-300">
                                    For approved permits
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Monthly Summary
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                In the last {dateRange} days, you've submitted {chartData.totalPermits} permit{chartData.totalPermits !== 1 ? 's' : ''}
                                with a combined project value of {formatCurrency(chartData.totalValue)}.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Export Options */}
            <Card title="Export Options">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                        variant="outline"
                        startIcon={<Download className="w-4 h-4" />}
                        onClick={() => handleExportReport('pdf')}
                    >
                        Export as PDF
                    </Button>

                    <Button
                        variant="outline"
                        startIcon={<Download className="w-4 h-4" />}
                        onClick={() => handleExportReport('excel')}
                    >
                        Export as Excel
                    </Button>

                    <Button
                        variant="outline"
                        startIcon={<Download className="w-4 h-4" />}
                        onClick={() => handleExportReport('csv')}
                    >
                        Export as CSV
                    </Button>
                </div>
            </Card>
        </div>
    )
}

// Helper function for parsing currency
function parseCurrency(value) {
    if (typeof value === 'number') return value
    if (typeof value === 'string') {
        return parseFloat(value.replace(/[$,]/g, '')) || 0
    }
    return 0
}

export default Reports