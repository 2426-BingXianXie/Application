import React from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts'

const PermitChart = ({
                         data = [],
                         type = 'bar',
                         title,
                         loading = false,
                         height = 300,
                         showLegend = true
                     }) => {

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
                <div className={`bg-gray-300 dark:bg-gray-600 rounded`} style={{ height }}>
                </div>
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <BarChart className="h-8 w-8" />
                </div>
                <p>No data available for chart</p>
            </div>
        )
    }

    const renderChart = () => {
        switch (type) {
            case 'bar':
                return (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis
                            dataKey="name"
                            className="text-xs fill-gray-600 dark:fill-gray-400"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            className="text-xs fill-gray-600 dark:fill-gray-400"
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--color-gray-800)',
                                border: '1px solid var(--color-gray-600)',
                                borderRadius: '6px',
                                color: 'white'
                            }}
                        />
                        {showLegend && <Legend />}
                        <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                )

            case 'line':
                return (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis
                            dataKey="name"
                            className="text-xs fill-gray-600 dark:fill-gray-400"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            className="text-xs fill-gray-600 dark:fill-gray-400"
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--color-gray-800)',
                                border: '1px solid var(--color-gray-600)',
                                borderRadius: '6px',
                                color: 'white'
                            }}
                        />
                        {showLegend && <Legend />}
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                )

            case 'area':
                return (
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis
                            dataKey="name"
                            className="text-xs fill-gray-600 dark:fill-gray-400"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            className="text-xs fill-gray-600 dark:fill-gray-400"
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--color-gray-800)',
                                border: '1px solid var(--color-gray-600)',
                                borderRadius: '6px',
                                color: 'white'
                            }}
                        />
                        {showLegend && <Legend />}
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#3B82F6"
                            fill="#3B82F6"
                            fillOpacity={0.3}
                        />
                    </AreaChart>
                )

            case 'pie':
                return (
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={120}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        {showLegend && <Legend />}
                    </PieChart>
                )

            case 'multibar':
                return (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis
                            dataKey="name"
                            className="text-xs fill-gray-600 dark:fill-gray-400"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            className="text-xs fill-gray-600 dark:fill-gray-400"
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--color-gray-800)',
                                border: '1px solid var(--color-gray-600)',
                                borderRadius: '6px',
                                color: 'white'
                            }}
                        />
                        {showLegend && <Legend />}
                        <Bar dataKey="building" fill="#3B82F6" name="Building Permits" />
                        <Bar dataKey="gas" fill="#F59E0B" name="Gas Permits" />
                    </BarChart>
                )

            default:
                return <div>Unsupported chart type</div>
        }
    }

    return (
        <div>
            {title && (
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {title}
                </h3>
            )}

            <ResponsiveContainer width="100%" height={height}>
                {renderChart()}
            </ResponsiveContainer>
        </div>
    )
}

export default PermitChart