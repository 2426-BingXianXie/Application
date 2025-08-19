import React, { useState } from 'react'
import { Grid3X3, List, Filter, SortAsc, SortDesc } from 'lucide-react'
import PermitCard from './PermitCard'
import PermitFilters from './PermitFilters'
import LoadingSpinner from '../common/LoadingSpinner'

const PermitList = ({
                        permits = [],
                        permitType = '',
                        isLoading = false,
                        error = null,
                        onRefresh,
                        showFilters = true,
                        layout = 'grid' // 'grid' or 'list'
                    }) => {
    const [viewMode, setViewMode] = useState(layout)
    const [showFilterPanel, setShowFilterPanel] = useState(false)
    const [sortBy, setSortBy] = useState('submissionDate')
    const [sortOrder, setSortOrder] = useState('desc')

    // Sort permits
    const sortedPermits = React.useMemo(() => {
        if (!permits || permits.length === 0) return []

        return [...permits].sort((a, b) => {
            let aValue = a[sortBy]
            let bValue = b[sortBy]

            // Handle nested properties
            if (sortBy.includes('.')) {
                const keys = sortBy.split('.')
                aValue = keys.reduce((obj, key) => obj?.[key], a)
                bValue = keys.reduce((obj, key) => obj?.[key], b)
            }

            // Handle different data types
            if (aValue instanceof Date && bValue instanceof Date) {
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                const comparison = aValue.localeCompare(bValue)
                return sortOrder === 'asc' ? comparison : -comparison
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
            }

            // Default string comparison
            const aStr = String(aValue || '')
            const bStr = String(bValue || '')
            const comparison = aStr.localeCompare(bStr)
            return sortOrder === 'asc' ? comparison : -comparison
        })
    }, [permits, sortBy, sortOrder])

    const handleSortChange = (newSortBy) => {
        if (sortBy === newSortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(newSortBy)
            setSortOrder('desc')
        }
    }

    const getSortIcon = (field) => {
        if (sortBy !== field) return null
        return sortOrder === 'asc' ? (
            <SortAsc className="w-4 h-4" />
        ) : (
                   <SortDesc className="w-4 h-4" />
               )
    }

    const sortOptions = [
        { value: 'submissionDate', label: 'Submission Date' },
        { value: 'permitNumber', label: 'Permit Number' },
        { value: 'status', label: 'Status' },
        { value: 'contactInfo.lastName', label: 'Applicant Name' },
        { value: 'permitInfo.projectCost', label: 'Project Cost' },
    ]

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-600 dark:text-red-400 mb-4">
                    Error loading permits: {error.message}
                </div>
                {onRefresh && (
                    <button onClick={onRefresh} className="btn btn-primary">
                        Try Again
                    </button>
                )}
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" text="Loading permits..." />
            </div>
        )
    }

    if (!permits || permits.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 mb-4">
                    No permits found
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                {/* View Mode & Filters */}
                <div className="flex items-center space-x-4">
                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-colors ${
                                viewMode === 'grid'
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            <Grid3X3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-colors ${
                                viewMode === 'list'
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Filter Toggle */}
                    {showFilters && (
                        <button
                            onClick={() => setShowFilterPanel(!showFilterPanel)}
                            className={`btn btn-outline ${showFilterPanel ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                        </button>
                    )}
                </div>

                {/* Sort Controls */}
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="form-select text-sm py-1 px-2"
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        {getSortIcon(sortBy)}
                    </button>
                </div>
            </div>

            {/* Filter Panel */}
            {showFilterPanel && showFilters && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <PermitFilters
                        permitType={permitType}
                        onFilterChange={(filters) => {
                            // Handle filter changes
                            console.log('Filters changed:', filters)
                        }}
                    />
                </div>
            )}

            {/* Permits Display */}
            <div className={`
        ${viewMode === 'grid'
          ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
          : 'space-y-4'
            }
      `}>
                {sortedPermits.map((permit, index) => (
                    <div
                        key={permit.permitId || permit.id || index}
                        className={`
              ${viewMode === 'list' ? 'border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-4 last:pb-0' : ''}
              ${index === 0 ? 'animate-fade-in' : ''}
            `}
                        style={{
                            animationDelay: viewMode === 'grid' ? `${index * 50}ms` : '0ms'
                        }}
                    >
                        <PermitCard
                            permit={permit}
                            permitType={permitType}
                            layout={viewMode}
                        />
                    </div>
                ))}
            </div>

            {/* Load More / Pagination would go here */}
            {permits.length > 0 && (
                <div className="text-center pt-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Showing {permits.length} permits
                    </p>
                </div>
            )}
        </div>
    )
}

export default PermitList