import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Building,
    Zap,
    Calendar,
    DollarSign,
    MapPin,
    User,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    MoreHorizontal,
    Edit,
    Eye,
    Download,
    Trash2,
    Send,
    Copy,
    Share2,
    FileText,
    Phone,
    Mail,
    ExternalLink,
    ChevronRight,
    AlertCircle,
    Info
} from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { ConfirmModal } from '../ui/Modal'
import {
    PERMIT_STATUS_LABELS,
    PERMIT_STATUS_COLORS,
    BUILDING_PERMIT_TYPE_LABELS,
    GAS_WORK_TYPE_LABELS,
    APPLICANT_TYPE_LABELS
} from '../../utils/constants'
import { formatDate, formatCurrency, formatRelativeTime, formatPermitNumber } from '../../utils/formatters'
import { usePermissions } from '../../hooks/usePermissions'
import { useToast } from '../ui/Toast'

const PermitCard = ({
                        permit,
                        onEdit,
                        onDelete,
                        onSubmit,
                        onView,
                        onApprove,
                        onReject,
                        showActions = true,
                        compact = false,
                        selectable = false,
                        selected = false,
                        onSelect,
                        showProgress = true,
                        showTimeline = true,
                        variant = 'default' // 'default', 'detailed', 'minimal'
                    }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showSubmitModal, setShowSubmitModal] = useState(false)
    const [showActionsMenu, setShowActionsMenu] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)

    const navigate = useNavigate()
    const actionsMenuRef = useRef(null)
    const { hasPermission, isReviewer, isAdmin } = usePermissions()
    const { success, error, info } = useToast()

    const statusColor = PERMIT_STATUS_COLORS[permit.status] || 'gray'
    const permitTypeIcon = permit.permitType === 'BUILDING' ? Building : Zap
    const permitTypeColor = permit.permitType === 'BUILDING' ? 'blue' : 'yellow'

    // Get permit-specific details with better error handling
    const permitDetails = permit.permitType === 'BUILDING'
                          ? permit.buildingPermitInfo || permit.permitInfo
                          : permit.gasPermitInfo || permit.permitInfo

    const permitTypeLabel = permit.permitType === 'BUILDING'
                            ? BUILDING_PERMIT_TYPE_LABELS[permitDetails?.permitFor] || permitDetails?.permitFor || 'Building Work'
                            : GAS_WORK_TYPE_LABELS[permitDetails?.workType] || permitDetails?.workType || 'Gas Work'

    // Calculate timeline information
    const timeline = {
        daysSinceSubmission: permit.submissionDate
                             ? Math.floor((new Date() - new Date(permit.submissionDate)) / (1000 * 60 * 60 * 24))
                             : 0,
        daysUntilExpiration: permit.expirationDate
                             ? Math.floor((new Date(permit.expirationDate) - new Date()) / (1000 * 60 * 60 * 24))
                             : null,
        processingProgress: permit.status === 'PENDING_REVIEW' ? Math.min((Math.floor((new Date() - new Date(permit.submissionDate)) / (1000 * 60 * 60 * 24)) / 7) * 100, 100) : 0
    }

    // Close actions menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target)) {
                setShowActionsMenu(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Enhanced actions based on status, permissions, and context
    const getAvailableActions = () => {
        const actions = []

        // Always available
        actions.push({
                         label: 'View Details',
                         icon: Eye,
                         onClick: () => handleView(),
                         variant: 'outline',
                         shortcut: '⌘K'
                     })

        // Edit actions
        if ((permit.status === 'DRAFT' || permit.status === 'REJECTED') && (hasPermission('update') || hasPermission('update_own'))) {
            actions.push({
                             label: 'Edit Application',
                             icon: Edit,
                             onClick: () => handleEdit(),
                             variant: 'outline'
                         })
        }

        // Submit actions
        if (permit.status === 'DRAFT' && hasPermission('submit')) {
            actions.push({
                             label: 'Submit for Review',
                             icon: Send,
                             onClick: () => setShowSubmitModal(true),
                             variant: 'primary',
                             highlight: true
                         })
        }

        // Reviewer actions
        if (permit.status === 'PENDING_REVIEW' && (isReviewer || isAdmin)) {
            actions.push({
                             label: 'Approve',
                             icon: CheckCircle,
                             onClick: () => handleApprove(),
                             variant: 'success'
                         })
            actions.push({
                             label: 'Reject',
                             icon: XCircle,
                             onClick: () => handleReject(),
                             variant: 'danger'
                         })
        }

        // Download actions
        if (permit.status === 'APPROVED') {
            actions.push({
                             label: 'Download Certificate',
                             icon: Download,
                             onClick: () => handleDownload(),
                             variant: 'success'
                         })
        }

        // Share actions
        actions.push({
                         label: 'Copy Link',
                         icon: Copy,
                         onClick: () => handleCopyLink(),
                         variant: 'ghost'
                     })

        actions.push({
                         label: 'Share',
                         icon: Share2,
                         onClick: () => handleShare(),
                         variant: 'ghost'
                     })

        // Delete action
        if ((permit.status === 'DRAFT' || permit.status === 'WITHDRAWN') && hasPermission('delete')) {
            actions.push({
                             label: 'Delete',
                             icon: Trash2,
                             onClick: () => setShowDeleteModal(true),
                             variant: 'danger',
                             destructive: true
                         })
        }

        return actions
    }

    // Action handlers
    const handleView = () => {
        if (onView) {
            onView(permit)
        } else {
            navigate(`/permit/${permit.id}`)
        }
    }

    const handleEdit = () => {
        if (onEdit) {
            onEdit(permit)
        } else {
            navigate(`/apply?type=${permit.permitType.toLowerCase()}&edit=${permit.id}`)
        }
    }

    const handleSubmit = async () => {
        try {
            await onSubmit?.(permit)
            success('Permit submitted for review successfully!')
            setShowSubmitModal(false)
        } catch (err) {
            error('Failed to submit permit. Please try again.')
        }
    }

    const handleApprove = () => {
        onApprove?.(permit)
    }

    const handleReject = () => {
        onReject?.(permit)
    }

    const handleDownload = async () => {
        try {
            // This would call the appropriate download service
            if (permit.permitType === 'BUILDING') {
                // await buildingPermitService.downloadCertificate(permit.id)
            } else {
                // await gasPermitService.downloadCertificate(permit.id)
            }
            success('Certificate download started!')
        } catch (err) {
            error('Failed to download certificate.')
        }
    }

    const handleDelete = async () => {
        try {
            await onDelete?.(permit)
            success('Permit deleted successfully!')
            setShowDeleteModal(false)
        } catch (err) {
            error('Failed to delete permit.')
        }
    }

    const handleCopyLink = () => {
        const link = `${window.location.origin}/permit/${permit.id}`
        navigator.clipboard.writeText(link)
        info('Permit link copied to clipboard!')
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                                title: `Permit ${permit.permitNumber || permit.id}`,
                                text: `${permitTypeLabel} - ${permit.status}`,
                                url: `${window.location.origin}/permit/${permit.id}`
                            })
        } else {
            handleCopyLink()
        }
    }

    // Status-specific styling and behavior
    const getStatusIndicator = (status) => {
        const indicators = {
            DRAFT: { icon: FileText, pulse: false, urgent: false },
            SUBMITTED: { icon: Send, pulse: false, urgent: false },
            PENDING_REVIEW: { icon: Clock, pulse: true, urgent: timeline.daysSinceSubmission > 10 },
            UNDER_REVIEW: { icon: Eye, pulse: true, urgent: false },
            APPROVED: { icon: CheckCircle, pulse: false, urgent: false },
            REJECTED: { icon: XCircle, pulse: false, urgent: true },
            EXPIRED: { icon: AlertTriangle, pulse: false, urgent: true },
            ON_HOLD: { icon: AlertCircle, pulse: true, urgent: false }
        }

        return indicators[status] || indicators.DRAFT
    }

    const statusIndicator = getStatusIndicator(permit.status)
    const StatusIconComponent = statusIndicator.icon

    // Compact variant for list views
    if (compact) {
        return (
            <Card
                hover
                className={`p-4 cursor-pointer transition-all duration-200 ${selected ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => selectable ? onSelect?.(permit) : handleView()}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {selectable && (
                            <input
                                type="checkbox"
                                checked={selected}
                                onChange={(e) => {
                                    e.stopPropagation()
                                    onSelect?.(permit)
                                }}
                                className="form-checkbox"
                            />
                        )}

                        <div className={`w-10 h-10 bg-${permitTypeColor}-100 dark:bg-${permitTypeColor}-900 rounded-lg flex items-center justify-center flex-shrink-0`}>
                            {React.createElement(permitTypeIcon, {
                                className: `w-5 h-5 text-${permitTypeColor}-600 dark:text-${permitTypeColor}-400`
                            })}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                    {formatPermitNumber(permit.permitType, permit.id)}
                                </h3>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800 dark:bg-${statusColor}-900 dark:text-${statusColor}-200`}>
                                    <StatusIconComponent className={`w-3 h-3 mr-1 ${statusIndicator.pulse ? 'animate-pulse' : ''}`} />
                                    {PERMIT_STATUS_LABELS[permit.status]}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                {permitTypeLabel}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatRelativeTime(permit.submissionDate)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                        {permitDetails?.projectCost && (
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {formatCurrency(permitDetails.projectCost)}
                                </p>
                            </div>
                        )}

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleView()
                            }}
                            startIcon={<ChevronRight className="w-4 h-4" />}
                        />
                    </div>
                </div>
            </Card>
        )
    }

    // Full detailed card
    return (
        <>
            <Card
                hover
                className={`overflow-hidden transition-all duration-200 ${selected ? 'ring-2 ring-blue-500' : ''} ${statusIndicator.urgent ? 'ring-1 ring-red-300 dark:ring-red-700' : ''}`}
            >
                {/* Header with enhanced status */}
                <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4 flex-1 min-w-0">
                            {selectable && (
                                <div className="pt-1">
                                    <input
                                        type="checkbox"
                                        checked={selected}
                                        onChange={() => onSelect?.(permit)}
                                        className="form-checkbox"
                                    />
                                </div>
                            )}

                            <div className={`w-12 h-12 bg-${permitTypeColor}-100 dark:bg-${permitTypeColor}-900 rounded-xl flex items-center justify-center flex-shrink-0 ${statusIndicator.pulse ? 'animate-pulse' : ''}`}>
                                {React.createElement(permitTypeIcon, {
                                    className: `w-6 h-6 text-${permitTypeColor}-600 dark:text-${permitTypeColor}-400`
                                })}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                        {formatPermitNumber(permit.permitType, permit.id)}
                                    </h3>

                                    {statusIndicator.urgent && (
                                        <div className="flex-shrink-0">
                                            <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2 mb-2">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${statusColor}-100 text-${statusColor}-800 dark:bg-${statusColor}-900 dark:text-${statusColor}-200`}>
                                        <StatusIconComponent className={`w-4 h-4 mr-2 ${statusIndicator.pulse ? 'animate-pulse' : ''}`} />
                                        {PERMIT_STATUS_LABELS[permit.status]}
                                    </span>

                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {permit.permitType === 'BUILDING' ? 'Building' : 'Gas'} Permit
                                    </span>
                                </div>

                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {permitTypeLabel}
                                </p>

                                {permitDetails?.workDescription && variant === 'detailed' && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                        {permitDetails.workDescription}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Actions Menu */}
                        {showActions && (
                            <div className="relative flex-shrink-0" ref={actionsMenuRef}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowActionsMenu(!showActionsMenu)}
                                    startIcon={<MoreHorizontal className="w-4 h-4" />}
                                />

                                {showActionsMenu && (
                                    <div className="absolute right-0 top-8 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 py-1">
                                        {getAvailableActions().map((action, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    action.onClick()
                                                    setShowActionsMenu(false)
                                                }}
                                                className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center space-x-3 ${
                                                    action.destructive
                                                    ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                } ${action.highlight ? 'bg-blue-50 dark:bg-blue-900/50 font-medium' : ''}`}
                                            >
                                                <action.icon className="w-4 h-4 flex-shrink-0" />
                                                <span className="flex-1">{action.label}</span>
                                                {action.shortcut && (
                                                    <span className="text-xs text-gray-400">{action.shortcut}</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Enhanced Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        {/* Property Address with enhanced display */}
                        <div className="md:col-span-2">
                            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 mb-1">
                                <MapPin className="w-3 h-3" />
                                <span className="text-xs uppercase tracking-wide font-medium">Property Location</span>
                            </div>
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                                {permit.locationInfo?.propertyAddress || 'Address not provided'}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-xs">
                                {permit.locationInfo?.city}, {permit.locationInfo?.state} {permit.locationInfo?.zipCode}
                            </p>
                            {permit.locationInfo?.parcelId && (
                                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                                    Parcel: {permit.locationInfo.parcelId}
                                </p>
                            )}
                        </div>

                        {/* Enhanced Applicant Info */}
                        <div>
                            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 mb-1">
                                <User className="w-3 h-3" />
                                <span className="text-xs uppercase tracking-wide font-medium">Applicant</span>
                            </div>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {permit.contactInfo?.firstName} {permit.contactInfo?.lastName}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-xs">
                                {APPLICANT_TYPE_LABELS[permit.applicantType] || permit.applicantType?.replace('_', ' ')}
                            </p>

                            {variant === 'detailed' && permit.contactInfo && (
                                <div className="mt-2 space-y-1">
                                    {permit.contactInfo.email && (
                                        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                                            <Mail className="w-3 h-3" />
                                            <a href={`mailto:${permit.contactInfo.email}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                                                {permit.contactInfo.email}
                                            </a>
                                        </div>
                                    )}
                                    {permit.contactInfo.phone && (
                                        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                                            <Phone className="w-3 h-3" />
                                            <a href={`tel:${permit.contactInfo.phone}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                                                {permit.contactInfo.phone}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Enhanced Project Cost */}
                        <div>
                            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 mb-1">
                                <DollarSign className="w-3 h-3" />
                                <span className="text-xs uppercase tracking-wide font-medium">Project Value</span>
                            </div>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {formatCurrency(permitDetails?.projectCost || 0)}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-xs">
                                Estimated cost
                            </p>
                        </div>
                    </div>

                    {/* Expandable Additional Details */}
                    {variant === 'detailed' && (
                        <div className="mt-4">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center space-x-1"
                            >
                                <span>{isExpanded ? 'Hide' : 'Show'} Details</span>
                                <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            </button>

                            {isExpanded && (
                                <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
                                    {permit.permitType === 'BUILDING' && permitDetails && (
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <span className="font-medium">Building Type:</span>
                                                <span className="ml-2 text-gray-600 dark:text-gray-400">{permitDetails.buildingType}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium">Occupancy:</span>
                                                <span className="ml-2 text-gray-600 dark:text-gray-400">{permitDetails.occupancyType}</span>
                                            </div>
                                            {permitDetails.hasArchitect && (
                                                <div className="flex items-center text-green-600 dark:text-green-400">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    <span className="text-xs">Architect involved</span>
                                                </div>
                                            )}
                                            {permitDetails.hasEngineer && (
                                                <div className="flex items-center text-green-600 dark:text-green-400">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    <span className="text-xs">Engineer involved</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {permit.permitType === 'GAS' && permitDetails && (
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <span className="font-medium">Gas Type:</span>
                                                <span className="ml-2 text-gray-600 dark:text-gray-400">{permitDetails.gasType}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium">BTU Input:</span>
                                                <span className="ml-2 text-gray-600 dark:text-gray-400">{permitDetails.totalBtuInput?.toLocaleString()}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium">Line Length:</span>
                                                <span className="ml-2 text-gray-600 dark:text-gray-400">{permitDetails.gasLineLengthFeet} ft</span>
                                            </div>
                                            <div>
                                                <span className="font-medium">Appliances:</span>
                                                <span className="ml-2 text-gray-600 dark:text-gray-400">{permitDetails.numberOfAppliances}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Enhanced Timeline */}
                {showTimeline && (
                    <div className="px-6 pb-4">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>Submitted {formatRelativeTime(permit.submissionDate)}</span>
                                </div>

                                {permit.approvalDate && (
                                    <div className="flex items-center space-x-1">
                                        <Clock className="w-3 h-3" />
                                        <span>
                                            {permit.status === 'APPROVED' ? 'Approved' : 'Processed'} {formatRelativeTime(permit.approvalDate)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {permit.expirationDate && permit.status === 'APPROVED' && (
                                <div className="flex items-center space-x-1">
                                    <AlertTriangle className={`w-3 h-3 ${timeline.daysUntilExpiration < 30 ? 'text-red-500' : 'text-yellow-500'}`} />
                                    <span className={timeline.daysUntilExpiration < 30 ? 'text-red-600 dark:text-red-400' : ''}>
                                        Expires {formatDate(permit.expirationDate)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Enhanced Progress Bar for Pending Permits */}
                {showProgress && permit.status === 'PENDING_REVIEW' && (
                    <div className="px-6 pb-4">
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                    timeline.processingProgress < 50 ? 'bg-blue-600' :
                                    timeline.processingProgress < 80 ? 'bg-yellow-600' : 'bg-red-600'
                                }`}
                                style={{ width: `${Math.max(timeline.processingProgress, 5)}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>Under Review</span>
                            <span>
                                {timeline.daysSinceSubmission} of ~7 days
                                {timeline.daysSinceSubmission > 10 && (
                                    <span className="text-red-600 dark:text-red-400 ml-2">(Delayed)</span>
                                )}
                            </span>
                        </div>
                    </div>
                )}

                {/* Enhanced Quick Actions */}
                {showActions && (
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-2">
                                {permit.status === 'DRAFT' && (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleEdit}
                                            startIcon={<Edit className="w-3 h-3" />}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => setShowSubmitModal(true)}
                                            startIcon={<Send className="w-3 h-3" />}
                                        >
                                            Submit
                                        </Button>
                                    </>
                                )}

                                {permit.status === 'APPROVED' && (
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={handleDownload}
                                        startIcon={<Download className="w-3 h-3" />}
                                    >
                                        Certificate
                                    </Button>
                                )}

                                {(isReviewer || isAdmin) && permit.status === 'PENDING_REVIEW' && (
                                    <>
                                        <Button
                                            variant="success"
                                            size="sm"
                                            onClick={handleApprove}
                                            startIcon={<CheckCircle className="w-3 h-3" />}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={handleReject}
                                            startIcon={<XCircle className="w-3 h-3" />}
                                        >
                                            Reject
                                        </Button>
                                    </>
                                )}
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleView}
                                endIcon={<ChevronRight className="w-3 h-3" />}
                                className="font-medium"
                            >
                                View Details
                            </Button>
                        </div>
                    </div>
                )}

                {/* Enhanced Status-specific alerts */}
                {permit.status === 'REJECTED' && (
                    <div className="px-6 py-3 bg-red-50 dark:bg-red-900/50 border-t border-red-200 dark:border-red-700">
                        <div className="flex items-start space-x-2">
                            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                    Application Rejected
                                </p>
                                <p className="text-sm text-red-700 dark:text-red-300">
                                    Review the rejection reason and resubmit with corrections.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {permit.status === 'APPROVED' && permit.expirationDate && (
                    <div className={`px-6 py-3 border-t ${
                        timeline.daysUntilExpiration < 30
                        ? 'bg-yellow-50 dark:bg-yellow-900/50 border-yellow-200 dark:border-yellow-700'
                        : 'bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-700'
                    }`}>
                        <div className="flex items-start space-x-2">
                            <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                                timeline.daysUntilExpiration < 30 ? 'text-yellow-500' : 'text-green-500'
                            }`} />
                            <div className="flex-1">
                                <p className={`text-sm font-medium ${
                                    timeline.daysUntilExpiration < 30
                                    ? 'text-yellow-800 dark:text-yellow-200'
                                    : 'text-green-800 dark:text-green-200'
                                }`}>
                                    {timeline.daysUntilExpiration < 30 ? 'Expires Soon' : 'Permit Active'}
                                </p>
                                <p className={`text-sm ${
                                    timeline.daysUntilExpiration < 30
                                    ? 'text-yellow-700 dark:text-yellow-300'
                                    : 'text-green-700 dark:text-green-300'
                                }`}>
                                    Valid until {formatDate(permit.expirationDate)}
                                    {timeline.daysUntilExpiration !== null && (
                                        <span className="ml-2">
                                            ({timeline.daysUntilExpiration} days remaining)
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {permit.status === 'PENDING_REVIEW' && timeline.daysSinceSubmission > 10 && (
                    <div className="px-6 py-3 bg-yellow-50 dark:bg-yellow-900/50 border-t border-yellow-200 dark:border-yellow-700">
                        <div className="flex items-start space-x-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                    Extended Review Time
                                </p>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                    This permit has been under review longer than usual. Contact support if you have concerns.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            {/* Enhanced Modals */}
            <ConfirmModal
                isOpen={showSubmitModal}
                onClose={() => setShowSubmitModal(false)}
                onConfirm={handleSubmit}
                title="Submit Permit Application"
                message={
                    <div className="space-y-2">
                        <p>Are you sure you want to submit this permit application for review?</p>
                        <div className="bg-blue-50 dark:bg-blue-900/50 p-3 rounded-md">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                <strong>What happens next:</strong>
                            </p>
                            <ul className="text-sm text-blue-700 dark:text-blue-300 mt-1 space-y-1">
                                <li>• Your application will be reviewed within 3-7 business days</li>
                                <li>• You'll receive email notifications about status changes</li>
                                <li>• No further changes can be made until review is complete</li>
                            </ul>
                        </div>
                    </div>
                }
                confirmText="Submit Application"
                variant="primary"
            />

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Permit Application"
                message={
                    <div className="space-y-2">
                        <p>Are you sure you want to permanently delete this permit application?</p>
                        <div className="bg-red-50 dark:bg-red-900/50 p-3 rounded-md">
                            <p className="text-sm text-red-800 dark:text-red-200">
                                <strong>This action cannot be undone:</strong>
                            </p>
                            <ul className="text-sm text-red-700 dark:text-red-300 mt-1 space-y-1">
                                <li>• All permit data will be permanently deleted</li>
                                <li>• Any uploaded documents will be removed</li>
                                <li>• You'll need to start a new application from scratch</li>
                            </ul>
                        </div>
                    </div>
                }
                confirmText="Delete Permanently"
                variant="danger"
            />
        </>
    )
}

export default PermitCard