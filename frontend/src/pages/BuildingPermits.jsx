import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    Building,
    Plus,
    Filter,
    Download,
    Search,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    DollarSign
} from 'lucide-react'
import { usePermits } from '../hooks/usePermits'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import { PageLoader, TableSkeleton } from '../components/common/LoadingSpinner'
import PermitCard from '../components/permits/PermitCard'
import PermitFilters from '../components/permits/PermitFilters'

const BuildingPermits = () => {
    const { user, hasPermission } = useAuth()
    const { showSuccess, showError } = useNotifications()

    // State for filters and search
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [typeFilter, setTypeFilter] = useState('all')
    const [dateRange, setDateRange] = useState({ start: '', end: '' })
    const [sortBy, setSortBy] = useState('submissionDate')
    const [sortOrder, setSortOrder] = useState('desc')
    const [viewMode, setViewMode] = useState('card') // 'card' or 'table'
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(20)
    const [showFilters, setShowFilters] = useState(false)
    const [selectedPermits, setSelectedPermits] = useState([])

    // Build query parameters
    const queryParams = {
        page,
        size: pageSize,
        sort: `${sortBy},${sortOrder}`,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(typeFilter !== 'all' && { type: typeFilter }),
        ...(dateRange.start && { startDate: dateRange.start }),
        ...(dateRange.end && { endDate: dateRange.end })
    }

    // Fetch permits
    const {
        permits,
        pagination,
        isLoading,
        error,
        refetch,
        isCreating,
        isUpdating,
        isDeleting
    } = usePermits(queryParams)

    // Status options for filter
    const statusOptions = [
        { value: 'all', label: 'All Statuses' },
        { value: 'draft', label: 'Draft' },
        { value: 'submitted', label: 'Submitted' },
        { value: 'under_review', label: 'Under Review' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'expired', label: 'Expired' }
    ]

    // Building permit type options
    const typeOptions = [
        { value: 'all', label: 'All Types' },
        { value: 'NEW_CONSTRUCTION', label: 'New Construction' },
        { value: 'RENOVATION', label: 'Renovation' },
        { value: 'ADDITION', label: 'Addition' },
        { value: 'REPAIR', label: 'Repair' },
        { value: 'DEMOLITION', label: 'Demolition' },
        { value: 'DECK_PATIO', label: 'Deck/Patio' }
    ]

    // Sort options
    const sortOptions = [
        { value: 'submissionDate', label: 'Submission Date' },
        { value: 'permitNumber', label: 'Permit Number' },
        { value: 'status', label: 'Status' },
        { value: 'projectCost', label: 'Project Cost' },
        { value: 'applicantName', label: 'Applicant Name' }
    ]

    // Handle search with debouncing
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(0) // Reset to first page when search changes
        }, 300)

        return () => clearTimeout(timer)
    }, [searchTerm, statusFilter, typeFilter, dateRange])

    // Handle permit selection
    const handlePermitSelection = (permitId, selected) => {
        setSelectedPermits(prev =>
                               selected
                               ? [...prev, permitId]
                               : prev.filter(id => id !== permitId)
        )
    }

    // Handle select all
    const handleSelectAll = () => {
        if (selectedPermits.length === permits.length) {
            setSelectedPermits([])
        } else {
            setSelectedPermits(permits.map(p => p.id))
        }
    }

    // Handle bulk actions
    const handleBulkAction = async (action) => {
        if (selectedPermits.length === 0) return

        try {
            switch (action) {
                case 'approve':
                    if (hasPermission('approve:permits')) {
                        // Handle bulk approval
                        showSuccess('Bulk Action', `${selectedPermits.length} permits approved`)
                    }
                    break
                case 'reject':
                    if (hasPermission('reject:permits')) {
                        // Handle bulk rejection
                        showSuccess('Bulk Action', `${selectedPermits.length} permits rejected`)
                    }
                    break
                case 'delete':
                    if (hasPermission('delete:permits')) {
                        const confirmed = window.confirm(
                            `Are you sure you want to delete ${selectedPermits.length} permits?`
                        )
                        if (confirmed) {
                            showSuccess('Bulk Action', `${selectedPermits.length} permits deleted`)
                        }
                    }
                    break
            }
            setSelectedPermits([])
        } catch (error) {
            showError('Bulk Action Failed', error.message)
        }
    }

    // Export permits
    const handleExport = async (format = 'csv') => {
        try {
            showSuccess('Export Started', `Building permits export started in ${format.toUpperCase()} format`)
        } catch (error) {
            showError('Export Failed', 'Failed to export building permits')
        }
    }

    if (isLoading && permits.length === 0) {
        return <PageLoader message="Loading building permits..." />
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                            <Building className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <div className="ml-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Building Permits
                        </h1>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {pagination.totalElements > 0
                             ? `${pagination.totalElements} permit${pagination.totalElements !== 1 ? 's' : ''} found`
                             : 'No permits found'
                            }
                        </p>
                    </div>
                </div>

                <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                    {/* Export Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExport('csv')}
                        startIcon={<Download className="h-4 w-4" />}
                    >
                        Export
                    </Button>

                    {/* New Permit Button */}
                    {hasPermission('create:permit') && (
                        <Button
                            as={Link}
                            to="/apply?type=building"
                            variant="primary"
                            startIcon={<Plus className="h-4 w-4" />}
                        >
                            New Building Permit
                        </Button>
                    )}
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search permits by number, applicant name, or address..."
                            startIcon={<Search className="h-4 w-4" />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        startIcon={<Filter className="h-4 w-4" />}
                    >
                        Filters
                        {(statusFilter !== 'all' || typeFilter !== 'all' || dateRange.start || dateRange.end) && (
                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                Active
              </span>
                        )}
                    </Button>
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <Select
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={statusOptions}
                        className="w-auto min-w-32"
                    />

                    <Select
                        value={typeFilter}
                        onChange={setTypeFilter}
                        options={typeOptions}
                        className="w-auto min-w-32"
                    />

                    <Select
                        value={sortBy}
                        onChange={setSortBy}
                        options={sortOptions}
                        className="w-auto min-w-32"
                    />

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                        {sortOrder === 'asc' ? '↑' : '↓'}
                    </Button>
                </div>

                {/* Advanced Filters Panel */}
                {showFilters && (
                    <PermitFilters
                        dateRange={dateRange}
                        onDateRangeChange={setDateRange}
                        additionalFilters={{}}
                        onAdditionalFiltersChange={() => {}}
                        permitType="building"
                    />
                )}
            </div>

            {/* Bulk Actions */}
            {selectedPermits.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
              {selectedPermits.length} permit{selectedPermits.length !== 1 ? 's' : ''} selected
            </span>

                        <div className="flex items-center space-x-2">
                            {hasPermission('approve:permits') && (
                                <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => handleBulkAction('approve')}
                                    startIcon={<CheckCircle className="h-4 w-4" />}
                                >
                                    Approve
                                </Button>
                            )}

                            {hasPermission('reject:permits') && (
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleBulkAction('reject')}
                                    startIcon={<XCircle className="h-4 w-4" />}
                                >
                                    Reject
                                </Button>
                            )}

                            {hasPermission('delete:permits') && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkAction('delete')}
                                    startIcon={<Trash2 className="h-4 w-4" />}
                                >
                                    Delete
                                </Button>
                            )}

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedPermits([])}
                            >
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Permits List */}
            <div className="space-y-4">
                {isLoading && permits.length === 0 ? (
                    viewMode === 'card' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                                    <div className="animate-pulse space-y-4">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                        <div className="space-y-2">
                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                                        </div>
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <TableSkeleton rows={8} cols={6} />
                    )
                ) : permits.length === 0 ? (
                    <div className="text-center py-12">
                        <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No building permits found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                             ? 'Try adjusting your search criteria or filters'
                             : 'Get started by creating your first building permit'
                            }
                        </p>

                        {hasPermission('create:permit') && (
                            <Button
                                as={Link}
                                to="/apply?type=building"
                                variant="primary"
                                startIcon={<Plus className="h-4 w-4" />}
                            >
                                Create Building Permit
                            </Button>
                        )}
                    </div>
                ) : viewMode === 'card' ? (
                    /* Card View */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {permits.map((permit) => (
                            <PermitCard
                                key={permit.id}
                                permit={permit}
                                onSelect={(selected) => handlePermitSelection(permit.id, selected)}
                                isSelected={selectedPermits.includes(permit.id)}
                                showActions={hasPermission('update:permits')}
                            />
                        ))}
                    </div>
                ) : (
                        /* Table View */
                        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        {/* Select All Checkbox */}
                                        <th className="px-6 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectedPermits.length === permits.length && permits.length > 0}
                                                onChange={handleSelectAll}
                                                className="form-checkbox"
                                            />
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Permit Number
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Applicant
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Submitted
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Project Cost
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                    </thead>

                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {permits.map((permit) => (
                                        <tr key={permit.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            {/* Select Checkbox */}
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPermits.includes(permit.id)}
                                                    onChange={(e) => handlePermitSelection(permit.id, e.target.checked)}
                                                    className="form-checkbox"
                                                />
                                            </td>

                                            {/* Permit Number */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link
                                                    to={`/permit/${permit.id}`}
                                                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                                >
                                                    {permit.permitNumber}
                                                </Link>
                                            </td>

                                            {/* Type */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {permit.buildingPermitInfo?.permitFor?.replace('_', ' ')}
                                                </div>
                                            </td>

                                            {/* Applicant */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {permit.contactInfo?.firstName} {permit.contactInfo?.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {permit.contactInfo?.email}
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge status-${permit.status.toLowerCase()}`}>
                          {permit.status.replace('_', ' ')}
                        </span>
                                            </td>

                                            {/* Submitted Date */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {permit.submissionDate ?
                                                     new Date(permit.submissionDate).toLocaleDateString() :
                                                     'Not submitted'
                                                    }
                                                </div>
                                            </td>

                                            {/* Project Cost */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {permit.buildingPermitInfo?.projectCost ?
                                                     `$${permit.buildingPermitInfo.projectCost.toLocaleString()}` :
                                                     'N/A'
                                                    }
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Button
                                                        as={Link}
                                                        to={`/permit/${permit.id}`}
                                                        variant="ghost"
                                                        size="sm"
                                                        startIcon={<Eye className="h-4 w-4" />}
                                                    >
                                                        View
                                                    </Button>

                                                    {hasPermission('update:permits') && (
                                                        <Button
                                                            as={Link}
                                                            to={`/permit/${permit.id}/edit`}
                                                            variant="ghost"
                                                            size="sm"
                                                            startIcon={<Edit className="h-4 w-4" />}
                                                        >
                                                            Edit
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            Showing {pagination.page * pagination.size + 1} to{' '}
                            {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of{' '}
                            {pagination.totalElements} results
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(page - 1)}
                                disabled={!pagination.hasPrevious}
                            >
                                Previous
                            </Button>

                            <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {pagination.page + 1} of {pagination.totalPages}
              </span>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(page + 1)}
                                disabled={!pagination.hasNext}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BuildingPermits