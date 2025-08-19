import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Download, Zap, AlertTriangle } from 'lucide-react'
import { useGasPermits } from '../hooks/usePermits'
import PermitCard from '../components/permits/PermitCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { PERMIT_STATUS, GAS_WORK_TYPE, GAS_INSTALLATION_TYPE } from '../utils/constants'

const GasPermits = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [workTypeFilter, setWorkTypeFilter] = useState('')
    const [installationTypeFilter, setInstallationTypeFilter] = useState('')
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(20)

    const { usePermitsList } = useGasPermits()

    const {
        data: permitsData,
        isLoading,
        error,
        refetch
    } = usePermitsList({
                           page,
                           size: pageSize,
                           status: statusFilter,
                           workType: workTypeFilter,
                           installationType: installationTypeFilter,
                           search: searchTerm,
                       })

    const permits = permitsData?.content || []
    const totalElements = permitsData?.totalElements || 0
    const totalPages = permitsData?.totalPages || 0

    const handleSearch = (e) => {
        e.preventDefault()
        setPage(0)
        refetch()
    }

    const handleFilterChange = (filterType, value) => {
        setPage(0)

        switch (filterType) {
            case 'status':
                setStatusFilter(value)
                break
            case 'workType':
                setWorkTypeFilter(value)
                break
            case 'installationType':
                setInstallationTypeFilter(value)
                break
        }
    }

    const clearFilters = () => {
        setSearchTerm('')
        setStatusFilter('')
        setWorkTypeFilter('')
        setInstallationTypeFilter('')
        setPage(0)
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-600 dark:text-red-400 mb-4">
                    Error loading gas permits: {error.message}
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
                        Gas Permits
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your gas permit applications
                    </p>
                </div>

                <div className="flex space-x-3">
                    <button className="btn btn-outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </button>
                    <Link to="/apply?type=gas" className="btn btn-warning">
                        <Plus className="w-4 h-4 mr-2" />
                        New Gas Permit
                    </Link>
                </div>
            </div>

            {/* Safety Notice */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            Gas Safety Notice
                        </h3>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                            All gas work must be performed by licensed gas contractors.
                            Pressure testing and inspections are mandatory for safety compliance.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search gas permits..."
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

                    {/* Work Type Filter */}
                    <select
                        value={workTypeFilter}
                        onChange={(e) => handleFilterChange('workType', e.target.value)}
                        className="form-select"
                    >
                        <option value="">All Work Types</option>
                        {Object.entries(GAS_WORK_TYPE).map(([key, value]) => (
                            <option key={key} value={value}>
                                {key.replace('_', ' ')}
                            </option>
                        ))}
                    </select>

                    {/* Installation Type Filter */}
                    <select
                        value={installationTypeFilter}
                        onChange={(e) => handleFilterChange('installationType', e.target.value)}
                        className="form-select"
                    >
                        <option value="">All Installation Types</option>
                        {Object.entries(GAS_INSTALLATION_TYPE).map(([key, value]) => (
                            <option key={key} value={value}>
                                {key.replace('_', ' ')}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Active Filters */}
                {(searchTerm || statusFilter || workTypeFilter || installationTypeFilter) && (
                    <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
                        {searchTerm && (
                            <span className="badge badge-primary">Search: {searchTerm}</span>
                        )}
                        {statusFilter && (
                            <span className="badge badge-secondary">Status: {statusFilter.replace('_', ' ')}</span>
                        )}
                        {workTypeFilter && (
                            <span className="badge badge-warning">Work: {workTypeFilter.replace('_', ' ')}</span>
                        )}
                        {installationTypeFilter && (
                            <span className="badge badge-info">Type: {installationTypeFilter.replace('_', ' ')}</span>
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
                    Showing {permits.length} of {totalElements} gas permits
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
                    <Zap className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No gas permits found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {searchTerm || statusFilter || workTypeFilter || installationTypeFilter
                         ? 'No permits match your current filters.'
                         : 'You haven\'t submitted any gas permit applications yet.'
                        }
                    </p>
                    {!searchTerm && !statusFilter && !workTypeFilter && !installationTypeFilter && (
                        <Link to="/apply?type=gas" className="btn btn-warning">
                            <Plus className="w-4 h-4 mr-2" />
                            Apply for Gas Permit
                        </Link>
                    )}
                </div>
            ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {permits.map((permit) => (
                            <PermitCard
                                key={permit.permitId}
                                permit={permit}
                                permitType="gas"
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

export default GasPermits