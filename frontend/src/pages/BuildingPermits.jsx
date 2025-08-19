import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, Download, Eye } from 'lucide-react'
import { useBuildingPermits } from '../hooks/usePermits'
import PermitCard from '../components/permits/PermitCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { PERMIT_STATUS, BUILDING_PERMIT_TYPE, BUILDING_TYPE } from '../utils/constants'

const BuildingPermits = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [typeFilter, setTypeFilter] = useState('')
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(20)

    const { usePermitsList } = useBuildingPermits()

    const {
        data: permitsData,
        isLoading,
        error,
        refetch
    } = usePermitsList({
                           page,
                           size: pageSize,
                           status: statusFilter,
                           type: typeFilter,
                           search: searchTerm,
                       })

    const permits = permitsData?.content || []
    const totalElements = permitsData?.totalElements || 0
    const totalPages = permitsData?.totalPages || 0

    const handleSearch = (e) => {
        e.preventDefault()
        setPage(0) // Reset to first page when searching
        refetch()
    }

    const handleFilterChange = (filterType, value) => {
        setPage(0) // Reset to first page when filtering

        if (filterType === 'status') {
            setStatusFilter(value)
        } else if (filterType === 'type') {
            setTypeFilter(value)
        }
    }

    const clearFilters = () => {
        setSearchTerm('')
        setStatusFilter('')
        setTypeFilter('')
        setPage(0)
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-600 dark:text-red-400 mb-4">
                    Error loading building permits: {error.message}
                </div>
                <button
                    onClick={() => refetch()}
                    className="btn btn-primary"
                >
                    Try Again
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Building Permits
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your building permit applications
                    </p>
                </div>

                <div className="flex space-x-3">
                    <button className="btn btn-outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </button>
                    <Link to="/apply?type=building" className="btn btn-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        New Building Permit
                    </Link>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search permits..."
                                className="form-input pl-10"
                            />
                        </div>
                    </form>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="form-select"
                    >
                        <option value="">All Statuses</option>
                        {Object.entries(PERMIT_STATUS).map(([key, value]) => (
                            <option key={key} value={value}>
                                {key.replace('_', ' ')}
                            </option>
                        ))}
                    </select>

                    {/* Type Filter */}
                    <select
                        value={typeFilter}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        className="form-select"
                    >
                        <option value="">All Types</option>
                        {Object.entries(BUILDING_PERMIT_TYPE).map(([key, value]) => (
                            <option key={key} value={value}>
                                {key.replace('_', ' ')}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Active Filters */}
                {(searchTerm || statusFilter || typeFilter) && (
                    <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
                        {searchTerm && (
                            <span className="badge badge-primary">
                Search: {searchTerm}
              </span>
                        )}
                        {statusFilter && (
                            <span className="badge badge-secondary">
                Status: {statusFilter.replace('_', ' ')}
              </span>
                        )}
                        {typeFilter && (
                            <span className="badge badge-info">
                Type: {typeFilter.replace('_', ' ')}
              </span>
                        )}
                        <button
                            onClick={clearFilters}
                            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* Results Summary */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {permits.length} of {totalElements} building permits
                </p>

                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Show:</span>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(parseInt(e.target.value))
                            setPage(0)
                        }}
                        className="form-select text-sm py-1 px-2"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>

            {/* Permits List */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : permits.length === 0 ? (
                <div className="text-center py-12">
                    <Building className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No building permits found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {searchTerm || statusFilter || typeFilter
                         ? 'No permits match your current filters.'
                         : 'You haven\'t submitted any building permit applications yet.'
                        }
                    </p>
                    {!searchTerm && !statusFilter && !typeFilter && (
                        <Link to="/apply?type=building" className="btn btn-primary">
                            <Plus className="w-4 h-4 mr-2" />
                            Apply for Building Permit
                        </Link>
                    )}
                </div>
            ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {permits.map((permit) => (
                            <PermitCard
                                key={permit.permitId}
                                permit={permit}
                                permitType="building"
                            />
                        ))}
                    </div>
                )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-8">
                    <button
                        onClick={() => setPage(Math.max(0, page - 1))}
                        disabled={page === 0}
                        className="btn btn-outline btn-sm disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <div className="flex items-center space-x-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = page < 3 ? i : page - 2 + i
                            if (pageNum >= totalPages) return null

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`px-3 py-1 rounded-md text-sm ${
                                        pageNum === page
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {pageNum + 1}
                                </button>
                            )
                        })}
                    </div>

                    <button
                        onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                        disabled={page === totalPages - 1}
                        className="btn btn-outline btn-sm disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}

export default BuildingPermits