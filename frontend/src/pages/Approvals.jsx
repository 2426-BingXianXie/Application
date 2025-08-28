import React, { useState, useEffect } from 'react'
import {
    CheckCircle2, Clock, AlertTriangle, Eye, MessageCircle,
    CheckCircle, XCircle, FileText, Calendar, User, MapPin,
    Building, Flame, DollarSign, Filter, RefreshCw, Download
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import {
    PERMIT_STATUS_LABELS,
    PERMIT_TYPE_LABELS
} from '../utils/constants'
import { formatDate, formatCurrency } from '../utils/formatters'

const Approvals = () => {
    const { user, hasPermission } = useAuth()
    const { showSuccess, showError } = useNotifications()

    const [permits, setPermits] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedPermit, setSelectedPermit] = useState(null)
    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false)
    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false)
    const [approvalNotes, setApprovalNotes] = useState('')
    const [rejectionReason, setRejectionReason] = useState('')
    const [filterType, setFilterType] = useState('')
    const [filterPriority, setFilterPriority] = useState('')
    const [sortBy, setSortBy] = useState('submissionDate')

    // Mock permits pending approval
    const mockPendingPermits = [
        {
            id: 1,
            permitNumber: 'BP-2024-001',
            permitType: 'BUILDING',
            status: 'SUBMITTED',
            priority: 'HIGH',
            submissionDate: '2024-01-15T10:00:00Z',
            daysWaiting: 5,
            applicant: {
                name: 'John Smith',
                email: 'john.smith@email.com',
                phone: '(555) 123-4567'
            },
            buildingPermitInfo: {
                permitFor: 'NEW_CONSTRUCTION',
                projectCost: 250000,
                workDescription: 'Single family home construction with attached garage',
                buildingType: 'RESIDENTIAL'
            },
            locationInfo: {
                propertyAddress: '123 Main Street, Springfield, MA 01103'
            },
            completeness: 95,
            documentsCount: 8,
            issuesCount: 0
        },
        {
            id: 2,
            permitNumber: 'GP-2024-007',
            permitType: 'GAS',
            status: 'UNDER_REVIEW',
            priority: 'MEDIUM',
            submissionDate: '2024-01-18T14:30:00Z',
            daysWaiting: 2,
            applicant: {
                name: 'ABC Construction LLC',
                email: 'permits@abcconstruction.com',
                phone: '(555) 234-5678'
            },
            gasPermitInfo: {
                workType: 'NEW_INSTALLATION',
                projectCost: 3500,
                workDescription: 'Natural gas line installation for commercial kitchen',
                totalBtuInput: 400000
            },
            locationInfo: {
                propertyAddress: '456 Commercial Drive, Springfield, MA 01104'
            },
            completeness: 88,
            documentsCount: 5,
            issuesCount: 1
        },
        {
            id: 3,
            permitNumber: 'BP-2024-012',
            permitType: 'BUILDING',
            status: 'SUBMITTED',
            priority: 'LOW',
            submissionDate: '2024-01-20T11:15:00Z',
            daysWaiting: 1,
            applicant: {
                name: 'Jane Homeowner',
                email: 'jane.homeowner@email.com',
                phone: '(555) 345-6789'
            },
            buildingPermitInfo: {
                permitFor: 'RENOVATION',
                projectCost: 15000,
                workDescription: 'Kitchen renovation and electrical updates',
                buildingType: 'RESIDENTIAL'
            },
            locationInfo: {
                propertyAddress: '789 Oak Street, Springfield, MA 01105'
            },
            completeness: 100,
            documentsCount: 12,
            issuesCount: 0
        }
    ]

    // Load pending permits
    useEffect(() => {
        loadPendingPermits()
    }, [filterType, filterPriority, sortBy])

    const loadPendingPermits = async () => {
        if (!hasPermission('approve:permits') && !hasPermission('APPROVE_PERMITS')) {
            showError('Access Denied', 'You do not have permission to view pending approvals.')
            return
        }

        setIsLoading(true)
        try {
            // Mock API delay
            await new Promise(resolve => setTimeout(resolve, 800))

            let filteredPermits = [...mockPendingPermits]

            // Apply filters
            if (filterType) {
                filteredPermits = filteredPermits.filter(permit => permit.permitType === filterType)
            }

            if (filterPriority) {
                filteredPermits = filteredPermits.filter(permit => permit.priority === filterPriority)
            }

            // Apply sorting
            filteredPermits.sort((a, b) => {
                switch (sortBy) {
                    case 'submissionDate':
                        return new Date(b.submissionDate) - new Date(a.submissionDate)
                    case 'daysWaiting':
                        return b.daysWaiting - a.daysWaiting
                    case 'priority':
                        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 }
                        return priorityOrder[b.priority] - priorityOrder[a.priority]
                    case 'completeness':
                        return b.completeness - a.completeness
                    default:
                        return 0
                }
            })

            setPermits(filteredPermits)
        } catch (error) {
            showError('Load Failed', 'Unable to load pending permits.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleApprove = async (permit) => {
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            showSuccess('Permit Approved', `Permit ${permit.permitNumber} has been approved.`)
            setIsApprovalModalOpen(false)
            setSelectedPermit(null)
            setApprovalNotes('')
            loadPendingPermits()
        } catch (error) {
            showError('Approval Failed', 'Unable to approve permit.')
        }
    }

    const handleReject = async (permit) => {
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            showSuccess('Permit Rejected', `Permit ${permit.permitNumber} has been rejected.`)
            setIsRejectionModalOpen(false)
            setSelectedPermit(null)
            setRejectionReason('')
            loadPendingPermits()
        } catch (error) {
            showError('Rejection Failed', 'Unable to reject permit.')
        }
    }

    const openApprovalModal = (permit) => {
        setSelectedPermit(permit)
        setIsApprovalModalOpen(true)
    }

    const openRejectionModal = (permit) => {
        setSelectedPermit(permit)
        setIsRejectionModalOpen(true)
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH': return 'text-red-600 bg-red-100 border-red-200'
            case 'MEDIUM': return 'text-amber-600 bg-amber-100 border-amber-200'
            case 'LOW': return 'text-green-600 bg-green-100 border-green-200'
            default: return 'text-gray-600 bg-gray-100 border-gray-200'
        }
    }

    const getCompletenessColor = (percentage) => {
        if (percentage >= 90) return 'text-green-600'
        if (percentage >= 70) return 'text-amber-600'
        return 'text-red-600'
    }

    const renderPermitCard = (permit) => (
        <Card key={permit.id} className="hover:shadow-md transition-shadow duration-200">
            <Card.Header>
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        {permit.permitType === 'BUILDING' ? (
                            <Building className="h-6 w-6 text-blue-600" />
                        ) : (
                             <Flame className="h-6 w-6 text-orange-600" />
                         )}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {permit.permitNumber}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(permit.priority)}`}>
                                    {permit.priority} PRIORITY
                                </span>
                                <span className="text-xs text-gray-500">
                                    {permit.daysWaiting} day{permit.daysWaiting !== 1 ? 's' : ''} waiting
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-1">
                        <button
                            onClick={() => window.location.href = `/permit/${permit.id}`}
                            className="p-1 text-gray-400 hover:text-blue-600"
                            title="View Details"
                        >
                            <Eye className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </Card.Header>

            <Card.Body>
                <div className="space-y-3">
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {permit.buildingPermitInfo?.workDescription || permit.gasPermitInfo?.workDescription}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="truncate">{permit.locationInfo.propertyAddress}</span>
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {formatCurrency(permit.buildingPermitInfo?.projectCost || permit.gasPermitInfo?.projectCost)}
                        </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <User className="h-4 w-4 mr-1" />
                        {permit.applicant.name} • {permit.applicant.email}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm">
                            <span className="text-gray-600 dark:text-gray-400 mr-2">Completeness:</span>
                            <span className={`font-medium ${getCompletenessColor(permit.completeness)}`}>
                                {permit.completeness}%
                            </span>
                        </div>

                        <div className="flex items-center space-x-3 text-xs">
                            <span className="text-gray-500">
                                {permit.documentsCount} docs
                            </span>
                            {permit.issuesCount > 0 && (
                                <span className="text-red-600 flex items-center">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    {permit.issuesCount} issue{permit.issuesCount !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Card.Body>

            <Card.Footer>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        Submitted {formatDate(permit.submissionDate)}
                    </span>

                    <div className="flex space-x-2">
                        <Button
                            size="sm"
                            variant="success"
                            onClick={() => openApprovalModal(permit)}
                        >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                        </Button>

                        <Button
                            size="sm"
                            variant="danger"
                            onClick={() => openRejectionModal(permit)}
                        >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                        </Button>
                    </div>
                </div>
            </Card.Footer>
        </Card>
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        <CheckCircle2 className="w-6 h-6 mr-3" />
                        Pending Approvals
                    </h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Review and approve/reject permits waiting for your decision
                    </p>
                </div>

                <div className="flex space-x-2">
                    <Button
                        variant="secondary"
                        onClick={loadPendingPermits}
                        loading={isLoading}
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>

                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <Card.Body>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Clock className="h-6 w-6 text-amber-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        Awaiting Review
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                        {permits.filter(p => p.status === 'SUBMITTED').length}
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
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        High Priority
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                        {permits.filter(p => p.priority === 'HIGH').length}
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
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        Total Pending
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                        {permits.length}
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
                                <Calendar className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        Avg. Wait Time
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                        {permits.length > 0 ?
                                         Math.round(permits.reduce((sum, p) => sum + p.daysWaiting, 0) / permits.length) : 0
                                        } days
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            {/* Filters and Sorting */}
            <Card>
                <Card.Body>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Select
                            label="Filter by Type"
                            options={[
                                { value: '', label: 'All Types' },
                                { value: 'BUILDING', label: 'Building Permits' },
                                { value: 'GAS', label: 'Gas Permits' }
                            ]}
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        />

                        <Select
                            label="Filter by Priority"
                            options={[
                                { value: '', label: 'All Priorities' },
                                { value: 'HIGH', label: 'High Priority' },
                                { value: 'MEDIUM', label: 'Medium Priority' },
                                { value: 'LOW', label: 'Low Priority' }
                            ]}
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                        />

                        <Select
                            label="Sort By"
                            options={[
                                { value: 'submissionDate', label: 'Submission Date' },
                                { value: 'daysWaiting', label: 'Days Waiting' },
                                { value: 'priority', label: 'Priority' },
                                { value: 'completeness', label: 'Completeness' }
                            ]}
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        />

                        <div className="flex items-end">
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setFilterType('')
                                    setFilterPriority('')
                                    setSortBy('submissionDate')
                                }}
                                className="w-full"
                            >
                                Clear Filters
                            </Button>
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
            ) : permits.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {permits.map(renderPermitCard)}
                </div>
            ) : (
                    <Card>
                        <Card.Body>
                            <div className="text-center py-12">
                                <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No permits pending approval
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {filterType || filterPriority ?
                                     'No permits match your current filters.' :
                                     'All permits have been reviewed.'
                                    }
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                )}

            {/* Approval Modal */}
            <Modal
                isOpen={isApprovalModalOpen}
                onClose={() => setIsApprovalModalOpen(false)}
                title="Approve Permit"
                size="lg"
            >
                {selectedPermit && (
                    <div className="space-y-4">
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                            <h4 className="text-lg font-medium text-green-900 dark:text-green-200 mb-2">
                                Approve Permit: {selectedPermit.permitNumber}
                            </h4>
                            <p className="text-sm text-green-800 dark:text-green-300">
                                This action will approve the permit and notify the applicant.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Approval Notes (Optional)
                            </label>
                            <textarea
                                value={approvalNotes}
                                onChange={(e) => setApprovalNotes(e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Add any conditions or notes for the approval..."
                            />
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <Button
                                variant="success"
                                onClick={() => handleApprove(selectedPermit)}
                                className="flex-1"
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve Permit
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => setIsApprovalModalOpen(false)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Rejection Modal */}
            <Modal
                isOpen={isRejectionModalOpen}
                onClose={() => setIsRejectionModalOpen(false)}
                title="Reject Permit"
                size="lg"
            >
                {selectedPermit && (
                    <div className="space-y-4">
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                            <h4 className="text-lg font-medium text-red-900 dark:text-red-200 mb-2">
                                Reject Permit: {selectedPermit.permitNumber}
                            </h4>
                            <p className="text-sm text-red-800 dark:text-red-300">
                                This action will reject the permit and notify the applicant with the reason provided.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Rejection Reason *
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Provide a clear reason for rejecting this permit..."
                                required
                            />
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <Button
                                variant="danger"
                                onClick={() => handleReject(selectedPermit)}
                                disabled={!rejectionReason.trim()}
                                className="flex-1"
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject Permit
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => setIsRejectionModalOpen(false)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default Approvals