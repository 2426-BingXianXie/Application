import React, { useState } from 'react'
import {
    Edit,
    Send,
    CheckCircle,
    XCircle,
    Download,
    Copy,
    Trash2,
    Eye,
    Clock,
    FileText
} from 'lucide-react'
import Button from '../ui/Button'
import Modal, { ConfirmModal } from '../ui/Modal'
import { Textarea } from '../ui/Input'
import { useAuth } from '../../context/AuthContext'

const PermitActions = ({
                           permit,
                           onSubmit,
                           onApprove,
                           onReject,
                           onDelete,
                           onEdit,
                           onView,
                           loading = {},
                           compact = false
                       }) => {
    const { hasPermission } = useAuth()
    const [showApproveModal, setShowApproveModal] = useState(false)
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [approvalNotes, setApprovalNotes] = useState('')
    const [rejectionReason, setRejectionReason] = useState('')

    // Get available actions based on permit status and user permissions
    const getAvailableActions = () => {
        const actions = []

        // Always available: View action
        actions.push({
                         key: 'view',
                         label: compact ? '' : 'View',
                         icon: Eye,
                         variant: 'ghost',
                         onClick: () => onView?.(permit.id),
                         tooltip: 'View permit details'
                     })

        switch (permit.status) {
            case 'DRAFT':
                // Edit and Submit actions for draft permits
                if (hasPermission('update:permits')) {
                    actions.push({
                                     key: 'edit',
                                     label: compact ? '' : 'Edit',
                                     icon: Edit,
                                     variant: 'outline',
                                     onClick: () => onEdit?.(permit.id),
                                     tooltip: 'Edit permit application'
                                 })
                }

                if (hasPermission('submit:permits')) {
                    actions.push({
                                     key: 'submit',
                                     label: compact ? '' : 'Submit',
                                     icon: Send,
                                     variant: 'primary',
                                     onClick: () => onSubmit?.(permit.id),
                                     loading: loading.submitting,
                                     tooltip: 'Submit for review'
                                 })
                }

                if (hasPermission('delete:permits')) {
                    actions.push({
                                     key: 'delete',
                                     label: compact ? '' : 'Delete',
                                     icon: Trash2,
                                     variant: 'ghost',
                                     onClick: () => setShowDeleteModal(true),
                                     loading: loading.deleting,
                                     tooltip: 'Delete draft',
                                     destructive: true
                                 })
                }
                break

            case 'SUBMITTED':
            case 'UNDER_REVIEW':
                // Review actions for submitted permits
                if (hasPermission('approve:permits')) {
                    actions.push({
                                     key: 'approve',
                                     label: compact ? '' : 'Approve',
                                     icon: CheckCircle,
                                     variant: 'success',
                                     onClick: () => setShowApproveModal(true),
                                     loading: loading.approving,
                                     tooltip: 'Approve permit'
                                 })
                }

                if (hasPermission('reject:permits')) {
                    actions.push({
                                     key: 'reject',
                                     label: compact ? '' : 'Reject',
                                     icon: XCircle,
                                     variant: 'danger',
                                     onClick: () => setShowRejectModal(true),
                                     loading: loading.rejecting,
                                     tooltip: 'Reject permit'
                                 })
                }
                break

            case 'APPROVED':
                // Download certificate for approved permits
                actions.push({
                                 key: 'download',
                                 label: compact ? '' : 'Certificate',
                                 icon: Download,
                                 variant: 'outline',
                                 onClick: () => handleDownloadCertificate(),
                                 tooltip: 'Download permit certificate'
                             })
                break

            case 'REJECTED':
                // Allow resubmission of rejected permits (if owner)
                if (hasPermission('update:permits') && permit.ownedByCurrentUser) {
                    actions.push({
                                     key: 'edit',
                                     label: compact ? '' : 'Revise',
                                     icon: Edit,
                                     variant: 'outline',
                                     onClick: () => onEdit?.(permit.id),
                                     tooltip: 'Revise and resubmit'
                                 })
                }
                break
        }

        // Copy permit number (always available)
        actions.push({
                         key: 'copy',
                         label: compact ? '' : 'Copy #',
                         icon: Copy,
                         variant: 'ghost',
                         onClick: () => handleCopyPermitNumber(),
                         tooltip: 'Copy permit number'
                     })

        return actions
    }

    const handleApprove = async () => {
        try {
            await onApprove?.(permit.id, { notes: approvalNotes })
            setShowApproveModal(false)
            setApprovalNotes('')
        } catch (error) {
            console.error('Failed to approve permit:', error)
        }
    }

    const handleReject = async () => {
        try {
            await onReject?.(permit.id, { reason: rejectionReason })
            setShowRejectModal(false)
            setRejectionReason('')
        } catch (error) {
            console.error('Failed to reject permit:', error)
        }
    }

    const handleDelete = async () => {
        try {
            await onDelete?.(permit.id)
            setShowDeleteModal(false)
        } catch (error) {
            console.error('Failed to delete permit:', error)
        }
    }

    const handleDownloadCertificate = () => {
        const link = document.createElement('a')
        link.href = `/api/v1/permits/${permit.id}/certificate`
        link.download = `permit-${permit.permitNumber}-certificate.pdf`
        link.click()
    }

    const handleCopyPermitNumber = async () => {
        try {
            await navigator.clipboard.writeText(permit.permitNumber)
            // Show toast notification if available
        } catch (error) {
            console.error('Failed to copy permit number:', error)
        }
    }

    const actions = getAvailableActions()

    if (compact && actions.length <= 3) {
        return (
            <div className="flex items-center space-x-1">
                {actions.map((action) => (
                    <Button
                        key={action.key}
                        variant={action.variant}
                        size="sm"
                        onClick={action.onClick}
                        loading={action.loading}
                        title={action.tooltip}
                        className={action.destructive ? 'hover:text-red-600' : ''}
                    >
                        <action.icon className="h-4 w-4" />
                        {action.label && <span className="sr-only">{action.label}</span>}
                    </Button>
                ))}

                {/* Modals */}
                {renderModals()}
            </div>
        )
    }

    // Full view - show labeled buttons
    return (
        <div className="flex flex-wrap gap-2">
            {actions.map((action) => (
                <Button
                    key={action.key}
                    variant={action.variant}
                    size="sm"
                    onClick={action.onClick}
                    loading={action.loading}
                    startIcon={<action.icon className="h-4 w-4" />}
                    className={action.destructive ? 'hover:text-red-600' : ''}
                >
                    {action.label}
                </Button>
            ))}

            {/* Modals */}
            {renderModals()}
        </div>
    )

    function renderModals() {
        return (
            <>
                {/* Approve Modal */}
                <Modal
                    isOpen={showApproveModal}
                    onClose={() => setShowApproveModal(false)}
                    title="Approve Permit"
                    footer={
                        <>
                            <Button
                                variant="outline"
                                onClick={() => setShowApproveModal(false)}
                                disabled={loading.approving}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="success"
                                onClick={handleApprove}
                                loading={loading.approving}
                                startIcon={<CheckCircle className="h-4 w-4" />}
                            >
                                Approve Permit
                            </Button>
                        </>
                    }
                >
                    <div className="space-y-4">
                        <p className="text-gray-600 dark:text-gray-400">
                            Are you sure you want to approve permit <strong>{permit.permitNumber}</strong>?
                            This will notify the applicant and activate the permit.
                        </p>

                        <Textarea
                            label="Approval Notes (Optional)"
                            value={approvalNotes}
                            onChange={(e) => setApprovalNotes(e.target.value)}
                            placeholder="Add any notes or conditions..."
                            rows={3}
                        />
                    </div>
                </Modal>

                {/* Reject Modal */}
                <Modal
                    isOpen={showRejectModal}
                    onClose={() => setShowRejectModal(false)}
                    title="Reject Permit"
                    footer={
                        <>
                            <Button
                                variant="outline"
                                onClick={() => setShowRejectModal(false)}
                                disabled={loading.rejecting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleReject}
                                loading={loading.rejecting}
                                startIcon={<XCircle className="h-4 w-4" />}
                            >
                                Reject Permit
                            </Button>
                        </>
                    }
                >
                    <div className="space-y-4">
                        <p className="text-gray-600 dark:text-gray-400">
                            Please provide a reason for rejecting permit <strong>{permit.permitNumber}</strong>.
                            The applicant will be notified with your feedback.
                        </p>

                        <Textarea
                            label="Rejection Reason"
                            required
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Explain why this permit is being rejected..."
                            rows={4}
                        />
                    </div>
                </Modal>

                {/* Delete Modal */}
                <ConfirmModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDelete}
                    title="Delete Permit"
                    message={`Are you sure you want to delete permit ${permit.permitNumber}? This action cannot be undone.`}
                    confirmText="Delete Permit"
                    variant="danger"
                    loading={loading.deleting}
                />
            </>
        )
    }
}

export default PermitActions