import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Plus, Search, Filter, FileText, Clock, CheckCircle, XCircle,
    AlertTriangle, Eye, Edit, Copy, Download, RefreshCw, Calendar,
    Building, Flame, MapPin, DollarSign, User, Trash2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Card from '../components/ui/Card'
import RoleGuard from '../components/ui/RoleGuard'
import {
    PERMIT_STATUS,
    PERMIT_STATUS_LABELS,
    PERMIT_TYPE_LABELS,
    STATUS_COLORS
} from '../utils/constants'
import { formatDate, formatCurrency } from '../utils/formatters'

const MyPermits = () => {
    const navigate = useNavigate()
    const { user, canEditPermit } = useAuth()
    const { showSuccess, showError, showWarning } = useNotifications()

    // State for filtering and searching
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [typeFilter, setTypeFilter] = useState('')
    const [sortBy, setSortBy] = useState('submissionDate')
    const [sortOrder, setSortOrder] = useState('desc')
    const [viewMode, setViewMode] = useState('cards') // 'cards' or 'table'
    const [isLoading, setIsLoading] = useState(false)

    // Mock data - replace with actual API call
    const [permits] = useState([
                                   {
                                       id: 1,
                                       permitNumber: 'BP-2024-001',
                                       permitType: 'BUILDING',
                                       status: 'APPROVED',
                                       submissionDate: '2024-01-15T10:00:00Z',
                                       approvalDate: '2024-01-25T14:30:00Z',
                                       expirationDate: '2025-01-25T23:59:59Z',
                                       buildingPermitInfo: {
                                           permitFor: 'NEW_CONSTRUCTION',
                                           projectCost: 150000,
                                           workDescription: 'Single family home construction',
                                           buildingType: 'RESIDENTIAL'
                                       },
                                       locationInfo: {
                                           propertyAddress: '123 Main Street, Springfield, MA 01103'
                                       },
                                       applicantId: user?.id
                                   },
                                   {
                                       id: 2,
                                       permitNumber: 'GP-2024-005',
                                       permitType: 'GAS',
                                       status: 'UNDER_REVIEW',
                                       submissionDate: '2024-02-01T09:15:00Z',
                                       gasPermitInfo: {
                                           workType: 'NEW_INSTALLATION',
                                           projectCost: 2500,
                                           workDescription: 'Gas line installation for new water heater'
                                       },
                                       locationInfo: {
                                           propertyAddress: '456 Oak Avenue, Springfield, MA 01104'
                                       },
                                       applicantId: user?.id
                                   },
                                   {
                                       id: 3,
                                       permitNumber: 'BP-2024-012',
                                       permitType: 'BUILDING',
                                       status: 'DRAFT',
                                       submissionDate: null,
                                       buildingPermitInfo: {
                                           permitFor: 'RENOVATION',
                                           projectCost: 25000,
                                           workDescription: 'Kitchen renovation',
                                           buildingType: 'RESIDENTIAL'
                                       },
                                       locationInfo: {
                                           propertyAddress: '789 Pine Street, Springfield, MA 01105'
                                       },
                                       applicantId: user?.id
                                   }
                               ])

    // Filter options
    const statusOptions = [
        { value: '', label: 'All Statuses' },
        ...Object.entries(PERMIT_STATUS_LABELS).map(([key, label]) => ({
            value: key,
            label
        }))
    ]

    const typeOptions = [
        { value: '', label: 'All Types' },
        ...Object.entries(PERMIT_TYPE_LABELS).map(([key, label]) => ({
            value: key,
            label
        }))
    ]

    const sortOptions = [
        { value: 'submissionDate', label: 'Submission Date' },
        { value: 'permitNumber', label: 'Permit Number' },
        { value: 'status', label: 'Status' },
        { value: 'permitType', label: 'Type' },
        { value: 'projectCost', label: 'Project Cost' }
    ]

    // Filter and sort permits
    const filteredAndSortedPermits = useMemo(() => {
        let filtered = permits.filter(permit => {
            const matchesSearch = !searchTerm ||
                                  permit.permitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  permit.buildingPermitInfo?.workDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  permit.gasPermitInfo?.workDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  permit.locationInfo?.propertyAddress?.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus = !statusFilter || permit.status === statusFilter
            const matchesType = !typeFilter || permit.permitType === typeFilter

            return matchesSearch && matchesStatus && matchesType
        })

        // Sort permits
        filtered.sort((a, b) => {
            let aValue, bValue

            switch (sortBy) {
                case 'submissionDate':
                    aValue = a.submissionDate ? new Date(a.submissionDate).getTime() : 0
                    bValue = b.submissionDate ? new Date(b.submissionDate).getTime() : 0
                    break
                case 'permitNumber':
                    aValue = a.permitNumber
                    bValue = b.permitNumber
                    break
                case 'status':
                    aValue = a.status
                    bValue = b.status
                    break
                case 'permitType':
                    aValue = a.permitType
                    bValue = b.permitType
                    break
                case 'projectCost':
                    aValue = a.buildingPermitInfo?.projectCost || a.gasPermitInfo?.projectCost || 0
                    bValue = b.buildingPermitInfo?.projectCost || b.gasPermitInfo?.projectCost || 0
                    break
                default:
                    return 0
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortOrder === 'desc'
                       ? bValue.localeCompare(aValue)
                       : aValue.localeCompare(bValue)
            }

            return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
        })

        return filtered
    }, [permits, searchTerm, statusFilter, typeFilter, sortBy, sortOrder])

    // Calculate statistics
    const permitStats = useMemo(() => {
        return permits.reduce((stats, permit) => {
            stats.total = (stats.total || 0) + 1
            stats[permit.status] = (stats[permit.status] || 0) + 1
            return stats
        }, {})
    }, [permits])

    // Action handlers
    const handleViewPermit = (permitId) => {
        navigate(`/permit/${permitId}`)
    }

    const handleEditPermit = (permit) => {
        if (canEditPermit(permit)) {
            navigate(`/apply?edit=${permit.id}`)
        } else {
            showWarning('Cannot Edit', 'This permit cannot be edited in its current status.')
        }
    }

    const handleDuplicatePermit = (permit) => {
        navigate(`/apply?duplicate=${permit.id}`)
        showSuccess('Permit Duplicated', 'A new draft has been created based on this permit.')
    }

    const handleDeletePermit = async (permit) => {
        if (permit.status !== 'DRAFT') {
            showError('Cannot Delete', 'Only draft permits can be deleted.')
            return
        }

        const confirmed = window.confirm(
            'Are you sure you want to delete this draft permit? This action cannot be undone.'
        )

        if (confirmed) {
            try {
                showSuccess('Permit Deleted', 'The draft permit has been deleted.')
            } catch (error) {
                showError('Delete Failed', 'Unable to delete the permit. Please try again.')
            }
        }
    }

    const handleDownloadCertificate = (permit) => {
        if (permit.status === 'APPROVED') {
            showSuccess('Download Started', 'Your permit certificate is being downloaded.')
        } else {
            showWarning('Not Available', 'Certificate is only available for approved permits.')
        }
    }

    const clearFilters = () => {
        setSearchTerm('')
        setStatusFilter('')
        setTypeFilter('')
        setSortBy('submissionDate')
        setSortOrder('desc')
    }

    const refreshData = async () => {
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)) // Mock delay
            showSuccess('Data Refreshed', 'Your permits have been updated.')
        } catch (error) {
            showError('Refresh Failed', 'Unable to refresh data. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const renderStatusBadge = (status) => {
        const colors = STATUS_COLORS[status] || STATUS_COLORS.DRAFT
        const label = PERMIT_STATUS_LABELS[status] || status

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                {status === 'APPROVED' && <CheckCircle className="w-3 h-3 mr-1" />}
                {status === 'REJECTED' && <XCircle className="w-3 h-3 mr-1" />}
                {status === 'UNDER_REVIEW' && <Clock className="w-3 h-3 mr-1" />}
                {status === 'DRAFT' && <Edit className="w-3 h-3 mr-1" />}
                {label}
            </span>
        )
    }

    const renderPermitCard = (permit) => (
        <Card key={permit.id} className="hover:shadow-md transition-shadow duration-200">
            <Card.Header>
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            {permit.permitType === 'BUILDING' ? (
                                <Building className="h-5 w-5 text-blue-600" />
                            ) : (
                                 <Flame className="h-5 w-5 text-orange-600" />
                             )}
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {permit.permitNumber}
                            </h3>
                        </div>
                        {renderStatusBadge(permit.status)}
                    </div>

                    <div className="flex space-x-1">
                        <button
                            onClick={() => handleViewPermit(permit.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="View Details"
                        >
                            <Eye className="h-4 w-4" />
                        </button>

                        {canEditPermit(permit) && (
                            <button
                                onClick={() => handleEditPermit(permit)}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Edit Permit"
                            >
                                <Edit className="h-4 w-4" />
                            </button>
                        )}

                        <button
                            onClick={() => handleDuplicatePermit(permit)}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="Duplicate Permit"
                        >
                            <Copy className="h-4 w-4" />
                        </button>

                        {permit.status === 'APPROVED' && (
                            <button
                                onClick={() => handleDownloadCertificate(permit)}
                                className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                                title="Download Certificate"
                            >
                                <Download className="h-4 w-4" />
                            </button>
                        )}

                        {permit.status === 'DRAFT' && (
                            <button
                                onClick={() => handleDeletePermit(permit)}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete Draft"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            </Card.Header>

            <Card.Body>
                <div className="space-y-3">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {permit.buildingPermitInfo?.workDescription || permit.gasPermitInfo?.workDescription}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-1" />
                        {permit.locationInfo?.propertyAddress}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {formatCurrency(permit.buildingPermitInfo?.projectCost || permit.gasPermitInfo?.projectCost)}
                        </div>

                        {permit.submissionDate && (
                            <div className="flex items-center text-gray-500 dark:text-gray-400">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatDate(permit.submissionDate)}
                            </div>
                        )}
                    </div>
                </div>
            </Card.Body>
        </Card>
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        My Permits
                    </h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Manage your permit applications and track their status
                    </p>
                </div>

                <div className="flex space-x-3">
                    <Button
                        variant="secondary"
                        onClick={refreshData}
                        loading={isLoading}
                        className="flex items-center"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>

                    <Link to="/apply">
                        <Button variant="primary" className="flex items-center">
                            <Plus className="w-4 h-4 mr-2" />
                            Apply for Permit
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <Card.Body>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FileText className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        Total Permits
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                        {permitStats.total || 0}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Body>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Clock className="h-6 w-6 text-amber-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        Under Review
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                        {permitStats.SUBMITTED + permitStats.UNDER_REVIEW || 0}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Body>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CheckCircle className="h-6 w-6 text-green-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        Approved
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                        {permitStats.APPROVED || 0}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Body>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <AlertTriangle className="h-6 w-6 text-red-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        Needs Action
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                        {(permitStats.REJECTED || 0) + (permitStats.DRAFT || 0)}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card>
                <Card.Body>
                    <div className="space-y-4">
                        {/* Search and Primary Filters */}
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                            <div className="lg:col-span-2">
                                <Input
                                    placeholder="Search permits by number, description, or address..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            <Select
                                options={statusOptions}
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                placeholder="Filter by status"
                            />

                            <Select
                                options={typeOptions}
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                placeholder="Filter by type"
                            />
                        </div>

                        {/* Sort and View Options */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Sort by:
                                    </label>
                                    <Select
                                        options={sortOptions}
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-40"
                                    />
                                    <button
                                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                        title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                                    >
                                        {sortOrder === 'desc' ? '↓' : '↑'}
                                    </button>
                                </div>

                                {(searchTerm || statusFilter || typeFilter) && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={clearFilters}
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {filteredAndSortedPermits.length} of {permits.length} permits
                                </span>
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* Permits List */}
            {isLoading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <Card.Body>
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                    <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            ) : filteredAndSortedPermits.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredAndSortedPermits.map(renderPermitCard)}
                </div>
            ) : (
                    <Card>
                        <Card.Body>
                            <div className="text-center py-12">
                                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    {searchTerm || statusFilter || typeFilter ? 'No permits found' : 'No permits yet'}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    {searchTerm || statusFilter || typeFilter
                                     ? "Try adjusting your search criteria or filters."
                                     : "You haven't submitted any permit applications yet."
                                    }
                                </p>
                                {!(searchTerm || statusFilter || typeFilter) && (
                                    <Link to="/apply">
                                        <Button variant="primary">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Apply for Your First Permit
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                )}

            {/* Help Section */}
            <Card>
                <Card.Body>
                    <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                Need Help?
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                If you have questions about your permits or need assistance with the application process,
                                we're here to help.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Button size="sm" variant="outline">
                                    Contact Support
                                </Button>
                                <Button size="sm" variant="outline">
                                    View FAQ
                                </Button>
                                <Button size="sm" variant="outline">
                                    Application Guide
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default MyPermits