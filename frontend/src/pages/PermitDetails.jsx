import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    ArrowLeft,
    Download,
    Edit,
    Send,
    Check,
    X,
    FileText,
    Calendar,
    MapPin,
    User,
    Building,
    Zap,
    Clock,
    AlertTriangle,
    CheckCircle
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal, { ConfirmModal } from '../components/ui/Modal'
import LoadingSpinner, { PageLoader } from '../components/common/LoadingSpinner'
import { usePermits } from '../hooks/usePermits'
import { useToast } from '../components/ui/Toast'
import {
    PERMIT_STATUS_LABELS,
    PERMIT_STATUS_COLORS,
    APPLICANT_TYPE_LABELS,
    BUILDING_PERMIT_TYPE_LABELS,
    GAS_WORK_TYPE_LABELS
} from '../utils/constants'
import { formatDate, formatCurrency } from '../utils/formatters'

const PermitDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { success, error } = useToast()

    const [showApproveModal, setShowApproveModal] = useState(false)
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [showSubmitModal, setShowSubmitModal] = useState(false)
    const [approvalNotes, setApprovalNotes] = useState('')
    const [rejectionReason, setRejectionReason] = useState('')

    // Determine permit type and use appropriate hook
    const { usePermit, useSubmitPermit, useApprovePermit, useRejectPermit } = usePermits('building')

    const { data: permit, isLoading, refetch } = usePermit(id)
    const submitMutation = useSubmitPermit()
    const approveMutation = useApprovePermit()
    const rejectMutation = useRejectPermit()

    // Actions based on permit status and user permissions
    const getAvailableActions = () => {
        if (!permit) return []

        const actions = []

        switch (permit.status) {
            case 'DRAFT':
                actions.push({
                                 key: 'edit',
                                 label: 'Edit Application',
                                 icon: Edit,
                                 variant: 'outline',
                                 onClick: () => navigate(`/apply?type=${permit.permitType.toLowerCase()}&edit=${id}`)
                             })
                actions.push({
                                 key: 'submit',
                                 label: 'Submit for Review',
                                 icon: Send,
                                 variant: 'primary',
                                 onClick: () => setShowSubmitModal(true)
                             })
                break

            case 'PENDING_REVIEW':
                actions.push({
                                 key: 'approve',
                                 label: 'Approve',
                                 icon: Check,
                                 variant: 'success',
                                 onClick: () => setShowApproveModal(true),
                                 requiresPermission: 'review'
                             })
                actions.push({
                                 key: 'reject',
                                 label: 'Reject',
                                 icon: X,
                                 variant: 'danger',
                                 onClick: () => setShowRejectModal(true),
                                 requiresPermission: 'review'
                             })
                break

            case 'APPROVED':
                actions.push({
                                 key: 'download',
                                 label: 'Download Certificate',
                                 icon: Download,
                                 variant: 'outline',
                                 onClick: () => handleDownloadCertificate()
                             })
                break
        }

        return actions
    }

    const handleSubmit = async () => {
        try {
            await submitMutation.mutateAsync(id)
            success('Permit submitted for review successfully!')
            setShowSubmitModal(false)
            refetch()
        } catch (err) {
            error('Failed to submit permit. Please try again.')
        }
    }

    const handleApprove = async () => {
        try {
            await approveMutation.mutateAsync({ id, notes: approvalNotes })
            success('Permit approved successfully!')
            setShowApproveModal(false)
            setApprovalNotes('')
            refetch()
        } catch (err) {
            error('Failed to approve permit. Please try again.')
        }
    }

    const handleReject = async () => {
        try {
            await rejectMutation.mutateAsync({ id, reason: rejectionReason })
            success('Permit rejected successfully!')
            setShowRejectModal(false)
            setRejectionReason('')
            refetch()
        } catch (err) {
            error('Failed to reject permit. Please try again.')
        }
    }

    const handleDownloadCertificate = () => {
        success('Certificate download started!')
    }

    if (isLoading) {
        return <PageLoader text="Loading permit details..." />
    }

    if (!permit) {
        return (
            <div className="text-center py-12">
                <div className="text-red-600 dark:text-red-400 mb-4">
                    <FileText className="w-12 h-12 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold">Permit Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        The permit you're looking for doesn't exist or you don't have permission to view it.
                    </p>
                    <Button
                        variant="primary"
                        className="mt-4"
                        onClick={() => navigate('/dashboard')}
                        startIcon={<ArrowLeft className="w-4 h-4" />}
                    >
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        )
    }

    const statusColor = PERMIT_STATUS_COLORS[permit.status] || 'gray'
    const actions = getAvailableActions()

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        startIcon={<ArrowLeft className="w-4 h-4" />}
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Button>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {permit.permitNumber || `${permit.permitType}${String(permit.id).padStart(6, '0')}`}
                        </h1>
                        <div className="flex items-center space-x-4 mt-1">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${statusColor}-100 text-${statusColor}-800 dark:bg-${statusColor}-900 dark:text-${statusColor}-200`}>
                                {PERMIT_STATUS_LABELS[permit.status] || permit.status}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {permit.permitType === 'BUILDING' ? 'Building Permit' : 'Gas Permit'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    {actions.map((action) => (
                        <Button
                            key={action.key}
                            variant={action.variant}
                            startIcon={<action.icon className="w-4 h-4" />}
                            onClick={action.onClick}
                            disabled={submitMutation.isPending || approveMutation.isPending || rejectMutation.isPending}
                        >
                            {action.label}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Contact Information */}
                    <Card title="Contact Information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                                    <User className="w-4 h-4 mr-2" />
                                    Applicant Details
                                </h4>
                                <div className="space-y-1 text-sm">
                                    <p><span className="font-medium">Name:</span> {permit.contactInfo?.firstName} {permit.contactInfo?.lastName}</p>
                                    <p><span className="font-medium">Email:</span> {permit.contactInfo?.email}</p>
                                    <p><span className="font-medium">Phone:</span> {permit.contactInfo?.phone}</p>
                                    <p><span className="font-medium">Type:</span> {APPLICANT_TYPE_LABELS[permit.applicantType] || permit.applicantType}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Mailing Address
                                </h4>
                                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                    <p>{permit.contactInfo?.address1}</p>
                                    {permit.contactInfo?.address2 && <p>{permit.contactInfo?.address2}</p>}
                                    <p>{permit.contactInfo?.city}, {permit.contactInfo?.state} {permit.contactInfo?.zipCode}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Property Information */}
                    <Card title="Property Information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Property Details
                                </h4>
                                <div className="space-y-1 text-sm">
                                    <p><span className="font-medium">Address:</span> {permit.locationInfo?.propertyAddress}</p>
                                    <p><span className="font-medium">City:</span> {permit.locationInfo?.city}, {permit.locationInfo?.state} {permit.locationInfo?.zipCode}</p>
                                    <p><span className="font-medium">Parcel ID:</span> {permit.locationInfo?.parcelId}</p>
                                    <p><span className="font-medium">Owner:</span> {permit.locationInfo?.propertyOwnerName}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Property Specifications
                                </h4>
                                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                    <p><span className="font-medium">Zoning:</span> {permit.locationInfo?.zoningClassification}</p>
                                    {permit.locationInfo?.lotSizeSqft && (
                                        <p><span className="font-medium">Lot Size:</span> {parseInt(permit.locationInfo.lotSizeSqft).toLocaleString()} sq ft</p>
                                    )}
                                    {permit.locationInfo?.latitude && permit.locationInfo?.longitude && (
                                        <p><span className="font-medium">Coordinates:</span> {permit.locationInfo.latitude}, {permit.locationInfo.longitude}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Permit-Specific Information */}
                    {permit.permitType === 'BUILDING' && permit.buildingPermitInfo && (
                        <Card title="Building Permit Details">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                            Project Information
                                        </h4>
                                        <div className="space-y-1 text-sm">
                                            <p><span className="font-medium">Permit For:</span> {BUILDING_PERMIT_TYPE_LABELS[permit.buildingPermitInfo.permitFor] || permit.buildingPermitInfo.permitFor}</p>
                                            <p><span className="font-medium">Building Type:</span> {permit.buildingPermitInfo.buildingType}</p>
                                            <p><span className="font-medium">Occupancy Type:</span> {permit.buildingPermitInfo.occupancyType}</p>
                                            <p><span className="font-medium">Project Cost:</span> {formatCurrency(permit.buildingPermitInfo.projectCost)}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                            Professional Services
                                        </h4>
                                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                            <p><span className="font-medium">Owner Doing Work:</span> {permit.hasArchitect ? 'Yes' : 'No'}</p>
                                            <p><span className="font-medium">Has Architect:</span> {permit.hasArchitect ? 'Yes' : 'No'}</p>
                                            <p><span className="font-medium">Has Engineer:</span> {permit.hasEngineer ? 'Yes' : 'No'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                        Work Description
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                                        {permit.buildingPermitInfo.workDescription}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {permit.permitType === 'GAS' && permit.gasPermitInfo && (
                        <Card title="Gas Permit Details">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                            Installation Details
                                        </h4>
                                        <div className="space-y-1 text-sm">
                                            <p><span className="font-medium">Work Type:</span> {GAS_WORK_TYPE_LABELS[permit.gasPermitInfo.workType] || permit.gasPermitInfo.workType}</p>
                                            <p><span className="font-medium">Gas Type:</span> {permit.gasPermitInfo.gasType}</p>
                                            <p><span className="font-medium">Installation Type:</span> {permit.gasPermitInfo.installationType}</p>
                                            <p><span className="font-medium">Project Cost:</span> {formatCurrency(permit.gasPermitInfo.projectCost)}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                            Technical Specifications
                                        </h4>
                                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                            <p><span className="font-medium">Total BTU:</span> {permit.gasPermitInfo.totalBtuInput?.toLocaleString()} BTU/hr</p>
                                            <p><span className="font-medium">Line Length:</span> {permit.gasPermitInfo.gasLineLengthFeet} feet</p>
                                            <p><span className="font-medium">Appliances:</span> {permit.gasPermitInfo.numberOfAppliances}</p>
                                            {permit.gasPermitInfo.gasLineSizeInches && (
                                                <p><span className="font-medium">Line Size:</span> {permit.gasPermitInfo.gasLineSizeInches}" diameter</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                        Work Description
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                                        {permit.gasPermitInfo.workDescription}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                        Appliance Details
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                                        {permit.gasPermitInfo.applianceDetails}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status Timeline */}
                    <Card title="Status Timeline">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Application Created</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatDate(permit.submissionDate)}
                                    </p>
                                </div>
                            </div>

                            {permit.status !== 'DRAFT' && (
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Submitted for Review</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatDate(permit.submissionDate)}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {permit.approvalDate && (
                                <div className="flex items-center space-x-3">
                                    <div className={`w-2 h-2 rounded-full ${permit.status === 'APPROVED' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {permit.status === 'APPROVED' ? 'Approved' : 'Rejected'}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatDate(permit.approvalDate)}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {permit.expirationDate && permit.status === 'APPROVED' && (
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Expires</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatDate(permit.expirationDate)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Application Summary */}
                    <Card title="Application Summary">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Application Type:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {permit.permitType === 'BUILDING' ? 'Building Permit' : 'Gas Permit'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Submitted:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {formatDate(permit.submissionDate)}
                                </span>
                            </div>

                            {permit.approvalDate && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {permit.status === 'APPROVED' ? 'Approved:' : 'Rejected:'}
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {formatDate(permit.approvalDate)}
                                    </span>
                                </div>
                            )}

                            {permit.expirationDate && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Expires:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {formatDate(permit.expirationDate)}
                                    </span>
                                </div>
                            )}

                            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Project Value:</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {formatCurrency(
                                            permit.buildingPermitInfo?.projectCost ||
                                            permit.gasPermitInfo?.projectCost ||
                                            0
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Documents */}
                    <Card
                        title="Documents"
                        actions={
                            <Button variant="outline" size="sm" startIcon={<FileText className="w-4 h-4" />}>
                                Upload
                            </Button>
                        }
                    >
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                <div className="flex items-center space-x-2">
                                    <FileText className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">Application Form</span>
                                </div>
                                <Button variant="ghost" size="sm" startIcon={<Download className="w-3 h-3" />}>
                                    Download
                                </Button>
                            </div>

                            {permit.status === 'APPROVED' && (
                                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span className="text-sm">Permit Certificate</span>
                                    </div>
                                    <Button variant="ghost" size="sm" startIcon={<Download className="w-3 h-3" />}>
                                        Download
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Action Modals */}
            <ConfirmModal
                isOpen={showSubmitModal}
                onClose={() => setShowSubmitModal(false)}
                onConfirm={handleSubmit}
                title="Submit Permit Application"
                message="Are you sure you want to submit this permit application for review? Once submitted, you won't be able to make changes until the review is complete."
                confirmText="Submit Application"
                variant="primary"
                loading={submitMutation.isPending}
            />

            <Modal
                isOpen={showApproveModal}
                onClose={() => setShowApproveModal(false)}
                title="Approve Permit Application"
                size="md"
                footer={
                    <>
                        <Button
                            variant="outline"
                            onClick={() => setShowApproveModal(false)}
                            disabled={approveMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="success"
                            onClick={handleApprove}
                            loading={approveMutation.isPending}
                            startIcon={<Check className="w-4 h-4" />}
                        >
                            Approve Permit
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                        Are you sure you want to approve this permit application? This action will notify the applicant and issue the permit.
                    </p>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Approval Notes (Optional)
                        </label>
                        <textarea
                            value={approvalNotes}
                            onChange={(e) => setApprovalNotes(e.target.value)}
                            className="form-textarea"
                            rows={3}
                            placeholder="Add any notes or conditions for the approval..."
                            maxLength={500}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {approvalNotes.length}/500 characters
                        </p>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                title="Reject Permit Application"
                size="md"
                footer={
                    <>
                        <Button
                            variant="outline"
                            onClick={() => setShowRejectModal(false)}
                            disabled={rejectMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleReject}
                            loading={rejectMutation.isPending}
                            startIcon={<X className="w-4 h-4" />}
                        >
                            Reject Permit
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                        Please provide a reason for rejecting this permit application. The applicant will be notified with your feedback.
                    </p>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Rejection Reason <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="form-textarea"
                            rows={4}
                            placeholder="Explain why this permit application is being rejected..."
                            required
                            maxLength={1000}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {rejectionReason.length}/1000 characters
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default PermitDetails