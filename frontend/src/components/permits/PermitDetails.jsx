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
    Flame,
    Clock,
    AlertTriangle,
    CheckCircle,
    DollarSign
} from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Modal, { ConfirmModal } from '../ui/Modal'
import { PageLoader } from '../common/LoadingSpinner'
import PermitStatusBadge from './PermitStatusBadge'
import PermitTimeline from './PermitTimeline'
import PermitActions from './PermitActions'
import { usePermit } from '../../hooks/usePermits'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'
import {
    PERMIT_STATUS_LABELS,
    APPLICANT_TYPE_LABELS,
    BUILDING_PERMIT_TYPE_LABELS,
    GAS_WORK_TYPE_LABELS
} from '../../utils/constants'
import { formatDate, formatCurrency } from '../../utils/formatters'

const PermitDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user, hasPermission } = useAuth()
    const { showSuccess, showError } = useNotifications()

    // Fetch permit data
    const {
        permit,
        isLoading,
        error,
        updatePermit,
        isUpdating,
        refetch
    } = usePermit(id)

    const [activeTab, setActiveTab] = useState('details')

    // Handle permit actions
    const handleSubmitPermit = async (permitId) => {
        try {
            await updatePermit({ status: 'SUBMITTED' })
            showSuccess('Permit Submitted', 'Your permit has been submitted for review')
        } catch (error) {
            showError('Submission Failed', 'Failed to submit permit')
        }
    }

    const handleApprovePermit = async (permitId, data) => {
        try {
            await updatePermit({
                                   status: 'APPROVED',
                                   approvalDate: new Date().toISOString(),
                                   approvalNotes: data.notes
                               })
            showSuccess('Permit Approved', 'Permit has been approved successfully')
        } catch (error) {
            showError('Approval Failed', 'Failed to approve permit')
        }
    }

    const handleRejectPermit = async (permitId, data) => {
        try {
            await updatePermit({
                                   status: 'REJECTED',
                                   rejectionDate: new Date().toISOString(),
                                   rejectionReason: data.reason
                               })
            showSuccess('Permit Rejected', 'Permit has been rejected')
        } catch (error) {
            showError('Rejection Failed', 'Failed to reject permit')
        }
    }

    const handleEditPermit = (permitId) => {
        navigate(`/apply?type=${permit.permitType.toLowerCase()}&edit=${permitId}`)
    }

    const handleViewPermit = (permitId) => {
        window.scrollTo(0, 0)
    }

    if (isLoading) {
        return <PageLoader message="Loading permit details..." />
    }

    if (error || !permit) {
        return (
            <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Permit Not Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {error?.message || "The permit you're looking for doesn't exist or you don't have permission to view it."}
                </p>
                <Button
                    variant="primary"
                    onClick={() => navigate('/dashboard')}
                    startIcon={<ArrowLeft className="w-4 h-4" />}
                >
                    Back to Dashboard
                </Button>
            </div>
        )
    }

    const tabs = [
        { id: 'details', label: 'Details', icon: FileText },
        { id: 'timeline', label: 'Timeline', icon: Clock },
        { id: 'documents', label: 'Documents', icon: FileText }
    ]

    const getPermitIcon = () => {
        return permit.permitType === 'building' ? Building : Flame
    }

    const getPermitTypeDisplay = () => {
        if (permit.permitType === 'building') {
            return BUILDING_PERMIT_TYPE_LABELS[permit.buildingPermitInfo?.permitFor] || 'Building Permit'
        } else {
            return GAS_WORK_TYPE_LABELS[permit.gasPermitInfo?.workType] || 'Gas Permit'
        }
    }

    const getProjectCost = () => {
        return permit.buildingPermitInfo?.projectCost || permit.gasPermitInfo?.projectCost || 0
    }

    const PermitIcon = getPermitIcon()

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

                    <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            permit.permitType === 'building'
                            ? 'bg-green-100 dark:bg-green-900'
                            : 'bg-orange-100 dark:bg-orange-900'
                        }`}>
                            <PermitIcon className={`h-6 w-6 ${
                                permit.permitType === 'building'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-orange-600 dark:text-orange-400'
                            }`} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {permit.permitNumber || `${permit.permitType?.toUpperCase()}-${String(permit.id).padStart(6, '0')}`}
                            </h1>
                            <div className="flex items-center space-x-3 mt-1">
                                <PermitStatusBadge status={permit.status} />
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {getPermitTypeDisplay()}
                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <PermitActions
                    permit={permit}
                    onSubmit={handleSubmitPermit}
                    onApprove={handleApprovePermit}
                    onReject={handleRejectPermit}
                    onEdit={handleEditPermit}
                    onView={handleViewPermit}
                    loading={{
                        submitting: isUpdating,
                        approving: isUpdating,
                        rejecting: isUpdating
                    }}
                />
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    isActive
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        )
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'details' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Contact Information */}
                            <Card title="Contact Information">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                                            <User className="w-4 h-4 mr-2" />
                                            Applicant Details
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Name:</span>
                                                <span className="font-medium">{permit.contactInfo?.firstName} {permit.contactInfo?.lastName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                                                <span className="font-medium">{permit.contactInfo?.email}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                                                <span className="font-medium">{permit.contactInfo?.phone}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Type:</span>
                                                <span className="font-medium">{APPLICANT_TYPE_LABELS[permit.applicantType] || permit.applicantType}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            Mailing Address
                                        </h4>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                            <p>{permit.contactInfo?.address1}</p>
                                            {permit.contactInfo?.address2 && <p>{permit.contactInfo?.address2}</p>}
                                            <p>{permit.contactInfo?.city}, {permit.contactInfo?.state} {permit.contactInfo?.zipCode}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Property Information */}
                            <Card title="Property Information">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                            Property Details
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Address:</span>
                                                <span className="font-medium">{permit.locationInfo?.propertyAddress}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">City:</span>
                                                <span className="font-medium">{permit.locationInfo?.propertyCity}, {permit.locationInfo?.propertyState} {permit.locationInfo?.propertyZipCode}</span>
                                            </div>
                                            {permit.locationInfo?.parcelId && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600 dark:text-gray-400">Parcel ID:</span>
                                                    <span className="font-medium">{permit.locationInfo.parcelId}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Owner:</span>
                                                <span className="font-medium">{permit.locationInfo?.propertyOwnerName || 'Not specified'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                            Property Specifications
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            {permit.locationInfo?.zoningClassification && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600 dark:text-gray-400">Zoning:</span>
                                                    <span className="font-medium">{permit.locationInfo.zoningClassification}</span>
                                                </div>
                                            )}
                                            {permit.locationInfo?.lotSizeSqft && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600 dark:text-gray-400">Lot Size:</span>
                                                    <span className="font-medium">{parseInt(permit.locationInfo.lotSizeSqft).toLocaleString()} sq ft</span>
                                                </div>
                                            )}
                                            {permit.locationInfo?.latitude && permit.locationInfo?.longitude && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600 dark:text-gray-400">Coordinates:</span>
                                                    <span className="font-medium">{permit.locationInfo.latitude}, {permit.locationInfo.longitude}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Permit-Specific Information */}
                            {permit.permitType === 'building' && permit.buildingPermitInfo && (
                                <Card title="Building Permit Details">
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                                    Project Information
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-gray-400">Permit For:</span>
                                                        <span className="font-medium">{BUILDING_PERMIT_TYPE_LABELS[permit.buildingPermitInfo.permitFor] || permit.buildingPermitInfo.permitFor}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-gray-400">Building Type:</span>
                                                        <span className="font-medium">{permit.buildingPermitInfo.buildingType}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-gray-400">Occupancy:</span>
                                                        <span className="font-medium">{permit.buildingPermitInfo.occupancyType}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-gray-400">Project Cost:</span>
                                                        <span className="font-medium">{formatCurrency(permit.buildingPermitInfo.projectCost)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                                    Professional Services
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-gray-400">Owner Doing Work:</span>
                                                        <span className="font-medium">{permit.buildingPermitInfo.ownerDoingWork ? 'Yes' : 'No'}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-gray-400">Has Architect:</span>
                                                        <span className="font-medium">{permit.hasArchitect ? 'Yes' : 'No'}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-gray-400">Has Engineer:</span>
                                                        <span className="font-medium">{permit.hasEngineer ? 'Yes' : 'No'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                                Work Description
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                                                {permit.buildingPermitInfo.workDescription || 'No description provided'}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {permit.permitType === 'gas' && permit.gasPermitInfo && (
                                <Card title="Gas Permit Details">
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                                    Installation Details
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-gray-400">Work Type:</span>
                                                        <span className="font-medium">{GAS_WORK_TYPE_LABELS[permit.gasPermitInfo.workType] || permit.gasPermitInfo.workType}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-gray-400">Gas Type:</span>
                                                        <span className="font-medium">{permit.gasPermitInfo.gasType}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-gray-400">Installation Type:</span>
                                                        <span className="font-medium">{permit.gasPermitInfo.installationType}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-gray-400">Project Cost:</span>
                                                        <span className="font-medium">{formatCurrency(permit.gasPermitInfo.projectCost)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                                    Technical Specifications
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-gray-400">Total BTU:</span>
                                                        <span className="font-medium">{permit.gasPermitInfo.totalBtuInput?.toLocaleString()} BTU/hr</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-gray-400">Line Length:</span>
                                                        <span className="font-medium">{permit.gasPermitInfo.gasLineLengthFeet} feet</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600 dark:text-gray-400">Appliances:</span>
                                                        <span className="font-medium">{permit.gasPermitInfo.numberOfAppliances}</span>
                                                    </div>
                                                    {permit.gasPermitInfo.gasLineSizeInches && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600 dark:text-gray-400">Line Size:</span>
                                                            <span className="font-medium">{permit.gasPermitInfo.gasLineSizeInches}" diameter</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                                Work Description
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                                                {permit.gasPermitInfo.workDescription || 'No description provided'}
                                            </p>
                                        </div>

                                        {permit.gasPermitInfo.applianceDetails && (
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                                    Appliance Details
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                                                    {permit.gasPermitInfo.applianceDetails}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Application Summary */}
                            <Card title="Application Summary">
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Application Type:</span>
                                        <span className="font-medium">{permit.permitType === 'building' ? 'Building Permit' : 'Gas Permit'}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Submitted:</span>
                                        <span className="font-medium">{formatDate(permit.submissionDate)}</span>
                                    </div>

                                    {permit.approvalDate && (
                                        <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {permit.status === 'APPROVED' ? 'Approved:' : 'Rejected:'}
                      </span>
                                            <span className="font-medium">{formatDate(permit.approvalDate)}</span>
                                        </div>
                                    )}

                                    {permit.expirationDate && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Expires:</span>
                                            <span className="font-medium">{formatDate(permit.expirationDate)}</span>
                                        </div>
                                    )}

                                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Project Value:</span>
                                            <span className="font-semibold text-lg">{formatCurrency(getProjectCost())}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Documents */}
                            <Card
                                title="Documents"
                                actions={
                 hasPermission('upload:documents') && (
                     <Button variant="outline" size="sm" startIcon={<FileText className="w-4 h-4" />}>
                         Upload
                     </Button>
                 )
                                }
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                                        <div className="flex items-center space-x-2">
                                            <FileText className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm">Application Form</span>
                                        </div>
                                        <Button variant="ghost" size="sm" startIcon={<Download className="w-3 h-3" />}>
                                            Download
                                        </Button>
                                    </div>

                                    {permit.status === 'APPROVED' && (
                                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
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
                )}

                {activeTab === 'timeline' && (
                    <Card title="Permit Timeline">
                        <PermitTimeline
                            permitId={permit.id}
                            timeline={permit.timeline || []}
                            loading={false}
                        />
                    </Card>
                )}

                {activeTab === 'documents' && (
                    <Card title="Document Management">
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <FileText className="w-12 h-12 mx-auto mb-4" />
                            <p>Document management coming soon</p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default PermitDetails