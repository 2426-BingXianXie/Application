import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import permitService from '../services/permitService'
import { useNotifications } from '../context/NotificationContext'

// Query keys for React Query
export const PERMIT_QUERY_KEYS = {
    permits: ['permits'],
    permit: (id) => ['permits', id],
    permitsByStatus: (status) => ['permits', 'status', status],
    permitsByApplicant: (applicantId) => ['permits', 'applicant', applicantId],
    permitSearch: (searchTerm) => ['permits', 'search', searchTerm],
    permitStatistics: ['permits', 'statistics'],
    recentPermits: ['permits', 'recent'],
    expiringPermits: ['permits', 'expiring']
}

// Main permit management hook
export const usePermits = (params = {}) => {
    const queryClient = useQueryClient()
    const { showSuccess, showError, showPermitSubmitted, showPermitApproved } = useNotifications()

    // Fetch permits with pagination
    const {
        data: permitsData,
        isLoading,
        error,
        refetch
    } = useQuery({
                     queryKey: [PERMIT_QUERY_KEYS.permits, params],
                     queryFn: () => permitService.getAllPermits(params),
                     staleTime: 5 * 60 * 1000, // 5 minutes
                     keepPreviousData: true
                 })

    const permits = permitsData?.data || []
    const pagination = permitsData?.pagination || {}

    // Create permit mutation
    const createPermitMutation = useMutation({
                                                 mutationFn: (permitData) => permitService.createPermit(permitData),
                                                 onSuccess: (data) => {
                                                     queryClient.invalidateQueries({ queryKey: PERMIT_QUERY_KEYS.permits })
                                                     queryClient.invalidateQueries({ queryKey: PERMIT_QUERY_KEYS.permitStatistics })
                                                     showSuccess('Permit Created', `Permit ${data.permitNumber} has been created successfully.`)
                                                 },
                                                 onError: (error) => {
                                                     showError('Creation Failed', error.message || 'Failed to create permit')
                                                 }
                                             })

    // Update permit mutation
    const updatePermitMutation = useMutation({
                                                 mutationFn: ({ id, data }) => permitService.updatePermit(id, data),
                                                 onSuccess: (data) => {
                                                     queryClient.invalidateQueries({ queryKey: PERMIT_QUERY_KEYS.permits })
                                                     queryClient.setQueryData(PERMIT_QUERY_KEYS.permit(data.id), data)
                                                     showSuccess('Permit Updated', 'Permit has been updated successfully.')
                                                 },
                                                 onError: (error) => {
                                                     showError('Update Failed', error.message || 'Failed to update permit')
                                                 }
                                             })

    // Submit permit mutation
    const submitPermitMutation = useMutation({
                                                 mutationFn: (id) => permitService.submitPermit(id),
                                                 onSuccess: (data) => {
                                                     queryClient.invalidateQueries({ queryKey: PERMIT_QUERY_KEYS.permits })
                                                     queryClient.setQueryData(PERMIT_QUERY_KEYS.permit(data.id), data)
                                                     showPermitSubmitted(data.permitNumber)
                                                 },
                                                 onError: (error) => {
                                                     showError('Submission Failed', error.message || 'Failed to submit permit')
                                                 }
                                             })

    // Approve permit mutation
    const approvePermitMutation = useMutation({
                                                  mutationFn: ({ id, approvalData }) => permitService.approvePermit(id, approvalData),
                                                  onSuccess: (data) => {
                                                      queryClient.invalidateQueries({ queryKey: PERMIT_QUERY_KEYS.permits })
                                                      queryClient.setQueryData(PERMIT_QUERY_KEYS.permit(data.id), data)
                                                      showPermitApproved(data.permitNumber)
                                                  },
                                                  onError: (error) => {
                                                      showError('Approval Failed', error.message || 'Failed to approve permit')
                                                  }
                                              })

    // Reject permit mutation
    const rejectPermitMutation = useMutation({
                                                 mutationFn: ({ id, rejectionData }) => permitService.rejectPermit(id, rejectionData),
                                                 onSuccess: (data) => {
                                                     queryClient.invalidateQueries({ queryKey: PERMIT_QUERY_KEYS.permits })
                                                     queryClient.setQueryData(PERMIT_QUERY_KEYS.permit(data.id), data)
                                                     showError('Permit Rejected', `Permit ${data.permitNumber} has been rejected.`)
                                                 },
                                                 onError: (error) => {
                                                     showError('Rejection Failed', error.message || 'Failed to reject permit')
                                                 }
                                             })

    // Delete permit mutation
    const deletePermitMutation = useMutation({
                                                 mutationFn: (id) => permitService.deletePermit(id),
                                                 onSuccess: () => {
                                                     queryClient.invalidateQueries({ queryKey: PERMIT_QUERY_KEYS.permits })
                                                     queryClient.invalidateQueries({ queryKey: PERMIT_QUERY_KEYS.permitStatistics })
                                                     showSuccess('Permit Deleted', 'Permit has been deleted successfully.')
                                                 },
                                                 onError: (error) => {
                                                     showError('Deletion Failed', error.message || 'Failed to delete permit')
                                                 }
                                             })

    // Bulk operations
    const bulkUpdateStatusMutation = useMutation({
                                                     mutationFn: ({ permitIds, status, notes }) =>
                                                         permitService.bulkUpdateStatus(permitIds, status, notes),
                                                     onSuccess: (data) => {
                                                         queryClient.invalidateQueries({ queryKey: PERMIT_QUERY_KEYS.permits })
                                                         queryClient.invalidateQueries({ queryKey: PERMIT_QUERY_KEYS.permitStatistics })
                                                         showSuccess('Bulk Update Complete', `${data.updatedCount} permits updated successfully.`)
                                                     },
                                                     onError: (error) => {
                                                         showError('Bulk Update Failed', error.message || 'Failed to update permits')
                                                     }
                                                 })

    return {
        // Data
        permits,
        pagination,
        isLoading,
        error,

        // Actions
        createPermit: createPermitMutation.mutate,
        updatePermit: updatePermitMutation.mutate,
        submitPermit: submitPermitMutation.mutate,
        approvePermit: approvePermitMutation.mutate,
        rejectPermit: rejectPermitMutation.mutate,
        deletePermit: deletePermitMutation.mutate,
        bulkUpdateStatus: bulkUpdateStatusMutation.mutate,
        refetch,

        // Loading states
        isCreating: createPermitMutation.isPending,
        isUpdating: updatePermitMutation.isPending,
        isSubmitting: submitPermitMutation.isPending,
        isApproving: approvePermitMutation.isPending,
        isRejecting: rejectPermitMutation.isPending,
        isDeleting: deletePermitMutation.isPending,
        isBulkUpdating: bulkUpdateStatusMutation.isPending
    }
}

// Hook for single permit
export const usePermit = (id) => {
    const queryClient = useQueryClient()
    const { showSuccess, showError } = useNotifications()

    const {
        data: permit,
        isLoading,
        error,
        refetch
    } = useQuery({
                     queryKey: PERMIT_QUERY_KEYS.permit(id),
                     queryFn: () => permitService.getPermitById(id),
                     enabled: !!id,
                     staleTime: 2 * 60 * 1000 // 2 minutes
                 })

    // Update permit
    const updateMutation = useMutation({
                                           mutationFn: (data) => permitService.updatePermit(id, data),
                                           onSuccess: (updatedPermit) => {
                                               queryClient.setQueryData(PERMIT_QUERY_KEYS.permit(id), updatedPermit)
                                               queryClient.invalidateQueries({ queryKey: PERMIT_QUERY_KEYS.permits })
                                               showSuccess('Permit Updated', 'Changes have been saved successfully.')
                                           },
                                           onError: (error) => {
                                               showError('Update Failed', error.message || 'Failed to update permit')
                                           }
                                       })

    return {
        permit,
        isLoading,
        error,
        updatePermit: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
        refetch
    }
}

// Hook for permit statistics
export const usePermitStatistics = (timeRange = 'month') => {
    return useQuery({
                        queryKey: [PERMIT_QUERY_KEYS.permitStatistics, timeRange],
                        queryFn: () => permitService.getPermitStatistics({ timeRange }),
                        staleTime: 10 * 60 * 1000 // 10 minutes
                    })
}

// Hook for recent permits
export const useRecentPermits = (limit = 10) => {
    return useQuery({
                        queryKey: [PERMIT_QUERY_KEYS.recentPermits, limit],
                        queryFn: () => permitService.getRecentPermits(limit),
                        staleTime: 5 * 60 * 1000 // 5 minutes
                    })
}

// Hook for expiring permits
export const useExpiringPermits = (days = 30) => {
    return useQuery({
                        queryKey: [PERMIT_QUERY_KEYS.expiringPermits, days],
                        queryFn: () => permitService.getExpiringPermits(days),
                        staleTime: 15 * 60 * 1000 // 15 minutes
                    })
}

// Hook for permit search
export const usePermitSearch = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState({})
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchTerm])

    const {
        data: searchResults,
        isLoading: isSearching,
        error: searchError
    } = useQuery({
                     queryKey: [PERMIT_QUERY_KEYS.permitSearch, debouncedSearchTerm, filters],
                     queryFn: () => permitService.searchPermits(debouncedSearchTerm, filters),
                     enabled: debouncedSearchTerm.length > 0,
                     staleTime: 2 * 60 * 1000 // 2 minutes
                 })

    return {
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        results: searchResults?.data || [],
        pagination: searchResults?.pagination || {},
        isSearching,
        searchError
    }
}

// Hook for permit validation
export const usePermitValidation = () => {
    const [validationErrors, setValidationErrors] = useState({})
    const [isValidating, setIsValidating] = useState(false)

    const validatePermit = useCallback(async (permitData) => {
        try {
            setIsValidating(true)
            const result = await permitService.validatePermit(permitData)

            if (result.isValid) {
                setValidationErrors({})
                return { isValid: true, errors: {} }
            } else {
                setValidationErrors(result.errors || {})
                return { isValid: false, errors: result.errors || {} }
            }
        } catch (error) {
            console.error('Validation error:', error)
            return { isValid: false, errors: { general: 'Validation failed' } }
        } finally {
            setIsValidating(false)
        }
    }, [])

    const clearValidation = useCallback(() => {
        setValidationErrors({})
    }, [])

    const hasErrors = Object.keys(validationErrors).length > 0

    return {
        validationErrors,
        isValidating,
        hasErrors,
        validatePermit,
        clearValidation
    }
}

// Hook for permit workflow
export const usePermitWorkflow = (permitId) => {
    const queryClient = useQueryClient()
    const { showSuccess, showError } = useNotifications()

    // Get workflow status
    const {
        data: workflowStatus,
        isLoading: isLoadingWorkflow
    } = useQuery({
                     queryKey: ['permits', permitId, 'workflow'],
                     queryFn: () => permitService.getWorkflowStatus(permitId),
                     enabled: !!permitId
                 })

    // Advance workflow mutation
    const advanceWorkflowMutation = useMutation({
                                                    mutationFn: ({ action, data }) => permitService.advanceWorkflow(permitId, action, data),
                                                    onSuccess: (data) => {
                                                        queryClient.invalidateQueries({ queryKey: ['permits', permitId] })
                                                        queryClient.invalidateQueries({ queryKey: ['permits', permitId, 'workflow'] })
                                                        showSuccess('Workflow Updated', `Permit has been moved to ${data.currentStage}.`)
                                                    },
                                                    onError: (error) => {
                                                        showError('Workflow Error', error.message || 'Failed to advance workflow')
                                                    }
                                                })

    return {
        workflowStatus,
        isLoadingWorkflow,
        advanceWorkflow: advanceWorkflowMutation.mutate,
        isAdvancing: advanceWorkflowMutation.isPending
    }
}

// Hook for permit history
export const usePermitHistory = (permitId) => {
    return useQuery({
                        queryKey: ['permits', permitId, 'history'],
                        queryFn: () => permitService.getPermitHistory(permitId),
                        enabled: !!permitId,
                        staleTime: 5 * 60 * 1000 // 5 minutes
                    })
}

// Hook for permit documents
export const usePermitDocuments = (permitId) => {
    const queryClient = useQueryClient()

    const {
        data: documents,
        isLoading,
        refetch
    } = useQuery({
                     queryKey: ['permits', permitId, 'documents'],
                     queryFn: () => permitService.getPermitDocuments(permitId),
                     enabled: !!permitId
                 })

    const invalidateDocuments = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['permits', permitId, 'documents'] })
    }, [queryClient, permitId])

    return {
        documents: documents || [],
        isLoading,
        refetch,
        invalidateDocuments
    }
}

// Hook for permit fees
export const usePermitFees = (permitId) => {
    return useQuery({
                        queryKey: ['permits', permitId, 'fees'],
                        queryFn: () => permitService.getPermitFees(permitId),
                        enabled: !!permitId,
                        staleTime: 10 * 60 * 1000 // 10 minutes
                    })
}

// Hook for fee calculation
export const useFeeCalculation = () => {
    const [isCalculating, setIsCalculating] = useState(false)
    const [fees, setFees] = useState(null)

    const calculateFees = useCallback(async (permitData) => {
        try {
            setIsCalculating(true)
            const result = await permitService.calculateFees(permitData)
            setFees(result)
            return result
        } catch (error) {
            console.error('Fee calculation error:', error)
            throw error
        } finally {
            setIsCalculating(false)
        }
    }, [])

    const clearFees = useCallback(() => {
        setFees(null)
    }, [])

    return {
        fees,
        isCalculating,
        calculateFees,
        clearFees
    }
}

// Hook for permit inspections
export const usePermitInspections = (permitId) => {
    const queryClient = useQueryClient()
    const { showSuccess, showError } = useNotifications()

    const {
        data: inspections,
        isLoading
    } = useQuery({
                     queryKey: ['permits', permitId, 'inspections'],
                     queryFn: () => permitService.getPermitInspections(permitId),
                     enabled: !!permitId
                 })

    // Schedule inspection mutation
    const scheduleInspectionMutation = useMutation({
                                                       mutationFn: (inspectionData) => permitService.scheduleInspection(permitId, inspectionData),
                                                       onSuccess: () => {
                                                           queryClient.invalidateQueries({ queryKey: ['permits', permitId, 'inspections'] })
                                                           showSuccess('Inspection Scheduled', 'Inspection has been scheduled successfully.')
                                                       },
                                                       onError: (error) => {
                                                           showError('Scheduling Failed', error.message || 'Failed to schedule inspection')
                                                       }
                                                   })

    return {
        inspections: inspections || [],
        isLoading,
        scheduleInspection: scheduleInspectionMutation.mutate,
        isScheduling: scheduleInspectionMutation.isPending
    }
}

// Hook for permit timeline
export const usePermitTimeline = (permitId) => {
    return useQuery({
                        queryKey: ['permits', permitId, 'timeline'],
                        queryFn: () => permitService.getPermitTimeline(permitId),
                        enabled: !!permitId,
                        staleTime: 5 * 60 * 1000 // 5 minutes
                    })
}

// Hook for permit comments
export const usePermitComments = (permitId) => {
    const queryClient = useQueryClient()
    const { showSuccess, showError } = useNotifications()

    const {
        data: comments,
        isLoading
    } = useQuery({
                     queryKey: ['permits', permitId, 'comments'],
                     queryFn: () => permitService.getPermitComments(permitId),
                     enabled: !!permitId
                 })

    // Add comment mutation
    const addCommentMutation = useMutation({
                                               mutationFn: (commentData) => permitService.addPermitComment(permitId, commentData),
                                               onSuccess: () => {
                                                   queryClient.invalidateQueries({ queryKey: ['permits', permitId, 'comments'] })
                                                   showSuccess('Comment Added', 'Your comment has been added successfully.')
                                               },
                                               onError: (error) => {
                                                   showError('Comment Failed', error.message || 'Failed to add comment')
                                               }
                                           })

    return {
        comments: comments || [],
        isLoading,
        addComment: addCommentMutation.mutate,
        isAddingComment: addCommentMutation.isPending
    }
}

export default usePermits