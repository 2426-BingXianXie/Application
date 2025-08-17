import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { permitService } from '../services/permitService'
import { buildingPermitService } from '../services/buildingPermitService'
import { gasPermitService } from '../services/gasPermitService'
import toast from 'react-hot-toast'

/**
 * Custom hook for permit operations
 * Provides CRUD operations for permits with caching and optimistic updates
 */
export const usePermits = (permitType = '', options = {}) => {
    const queryClient = useQueryClient()

    // Get the appropriate service based on permit type
    const getService = () => {
        switch (permitType) {
            case 'building':
                return buildingPermitService
            case 'gas':
                return gasPermitService
            default:
                return permitService
        }
    }

    const service = getService()

    // Query keys
    const queryKeys = {
        all: ['permits', permitType],
        lists: () => [...queryKeys.all, 'list'],
        list: (filters) => [...queryKeys.lists(), filters],
        details: () => [...queryKeys.all, 'detail'],
        detail: (id) => [...queryKeys.details(), id],
        statistics: () => [...queryKeys.all, 'statistics'],
    }

    // Get all permits
    const usePermitsList = (params = {}) => {
        return useQuery({
                            queryKey: queryKeys.list(params),
                            queryFn: () => service.getAll(params),
                            staleTime: 5 * 60 * 1000, // 5 minutes
                            ...options
                        })
    }

    // Get permit by ID
    const usePermit = (id) => {
        return useQuery({
                            queryKey: queryKeys.detail(id),
                            queryFn: () => service.getById(id),
                            enabled: !!id,
                            staleTime: 5 * 60 * 1000,
                            ...options
                        })
    }

    // Get permit by number
    const usePermitByNumber = (permitNumber) => {
        return useQuery({
                            queryKey: ['permits', permitType, 'number', permitNumber],
                            queryFn: () => service.getByNumber(permitNumber),
                            enabled: !!permitNumber,
                            staleTime: 5 * 60 * 1000,
                            ...options
                        })
    }

    // Get permits by status
    const usePermitsByStatus = (status, params = {}) => {
        return useQuery({
                            queryKey: ['permits', permitType, 'status', status, params],
                            queryFn: () => service.getByStatus(status, params),
                            enabled: !!status,
                            staleTime: 2 * 60 * 1000, // 2 minutes for status-based queries
                            ...options
                        })
    }

    // Get permits by email
    const usePermitsByEmail = (email) => {
        return useQuery({
                            queryKey: ['permits', permitType, 'email', email],
                            queryFn: () => service.getByEmail(email),
                            enabled: !!email,
                            staleTime: 5 * 60 * 1000,
                            ...options
                        })
    }

    // Search permits
    const useSearchPermits = (searchTerm, params = {}) => {
        return useQuery({
                            queryKey: ['permits', permitType, 'search', searchTerm, params],
                            queryFn: () => service.search(searchTerm, params),
                            enabled: !!searchTerm && searchTerm.length > 2,
                            staleTime: 1 * 60 * 1000, // 1 minute for search results
                            ...options
                        })
    }

    // Get permit statistics
    const usePermitStatistics = () => {
        return useQuery({
                            queryKey: queryKeys.statistics(),
                            queryFn: () => service.getStatistics(),
                            staleTime: 10 * 60 * 1000, // 10 minutes
                            ...options
                        })
    }

    // Get expiring permits
    const useExpiringPermits = (days = 30) => {
        return useQuery({
                            queryKey: ['permits', permitType, 'expiring', days],
                            queryFn: () => service.getExpiring(days),
                            staleTime: 5 * 60 * 1000,
                            ...options
                        })
    }

    // Create permit mutation
    const useCreatePermit = () => {
        return useMutation({
                               mutationFn: (permitData) => service.create(permitData),
                               onSuccess: (data) => {
                                   // Invalidate and refetch permit lists
                                   queryClient.invalidateQueries({ queryKey: queryKeys.lists() })
                                   queryClient.invalidateQueries({ queryKey: queryKeys.statistics() })

                                   toast.success(`Permit ${data.permitNumber} created successfully!`)
                               },
                               onError: (error) => {
                                   toast.error(error.response?.data?.message || 'Failed to create permit')
                               }
                           })
    }

    // Update permit mutation
    const useUpdatePermit = () => {
        return useMutation({
                               mutationFn: ({ id, ...permitData }) => service.update(id, permitData),
                               onSuccess: (data, variables) => {
                                   // Update the specific permit in cache
                                   queryClient.setQueryData(queryKeys.detail(variables.id), data)

                                   // Invalidate related queries
                                   queryClient.invalidateQueries({ queryKey: queryKeys.lists() })

                                   toast.success(`Permit ${data.permitNumber} updated successfully!`)
                               },
                               onError: (error) => {
                                   toast.error(error.response?.data?.message || 'Failed to update permit')
                               }
                           })
    }

    // Submit permit mutation
    const useSubmitPermit = () => {
        return useMutation({
                               mutationFn: (id) => service.submit(id),
                               onSuccess: (data) => {
                                   // Update the specific permit in cache
                                   queryClient.setQueryData(queryKeys.detail(data.permitId), data)

                                   // Invalidate related queries
                                   queryClient.invalidateQueries({ queryKey: queryKeys.lists() })
                                   queryClient.invalidateQueries({ queryKey: queryKeys.statistics() })

                                   toast.success(`Permit ${data.permitNumber} submitted for review!`)
                               },
                               onError: (error) => {
                                   toast.error(error.response?.data?.message || 'Failed to submit permit')
                               }
                           })
    }

    // Approve permit mutation
    const useApprovePermit = () => {
        return useMutation({
                               mutationFn: ({ id, notes }) => service.approve(id, notes),
                               onSuccess: (data) => {
                                   // Update the specific permit in cache
                                   queryClient.setQueryData(queryKeys.detail(data.permitId), data)

                                   // Invalidate related queries
                                   queryClient.invalidateQueries({ queryKey: queryKeys.lists() })
                                   queryClient.invalidateQueries({ queryKey: queryKeys.statistics() })

                                   toast.success(`Permit ${data.permitNumber} approved!`)
                               },
                               onError: (error) => {
                                   toast.error(error.response?.data?.message || 'Failed to approve permit')
                               }
                           })
    }

    // Reject permit mutation
    const useRejectPermit = () => {
        return useMutation({
                               mutationFn: ({ id, reason }) => service.reject(id, reason),
                               onSuccess: (data) => {
                                   // Update the specific permit in cache
                                   queryClient.setQueryData(queryKeys.detail(data.permitId), data)

                                   // Invalidate related queries
                                   queryClient.invalidateQueries({ queryKey: queryKeys.lists() })
                                   queryClient.invalidateQueries({ queryKey: queryKeys.statistics() })

                                   toast.success(`Permit ${data.permitNumber} rejected`)
                               },
                               onError: (error) => {
                                   toast.error(error.response?.data?.message || 'Failed to reject permit')
                               }
                           })
    }

    // Delete permit mutation
    const useDeletePermit = () => {
        return useMutation({
                               mutationFn: (id) => service.delete(id),
                               onSuccess: (_, deletedId) => {
                                   // Remove from cache
                                   queryClient.removeQueries({ queryKey: queryKeys.detail(deletedId) })

                                   // Invalidate lists
                                   queryClient.invalidateQueries({ queryKey: queryKeys.lists() })
                                   queryClient.invalidateQueries({ queryKey: queryKeys.statistics() })

                                   toast.success('Permit deleted successfully')
                               },
                               onError: (error) => {
                                   toast.error(error.response?.data?.message || 'Failed to delete permit')
                               }
                           })
    }

    // Validate permit mutation
    const useValidatePermit = () => {
        return useMutation({
                               mutationFn: (permitData) => service.validate(permitData),
                               onError: (error) => {
                                   toast.error(error.response?.data?.message || 'Validation failed')
                               }
                           })
    }

    return {
        // Queries
        usePermitsList,
        usePermit,
        usePermitByNumber,
        usePermitsByStatus,
        usePermitsByEmail,
        useSearchPermits,
        usePermitStatistics,
        useExpiringPermits,

        // Mutations
        useCreatePermit,
        useUpdatePermit,
        useSubmitPermit,
        useApprovePermit,
        useRejectPermit,
        useDeletePermit,
        useValidatePermit,

        // Utilities
        queryKeys,
        service,

        // Cache utilities
        invalidatePermits: () => queryClient.invalidateQueries({ queryKey: queryKeys.all }),
        invalidatePermitLists: () => queryClient.invalidateQueries({ queryKey: queryKeys.lists() }),
        invalidatePermit: (id) => queryClient.invalidateQueries({ queryKey: queryKeys.detail(id) }),
    }
}

// Convenience hooks for specific permit types
export const useBuildingPermits = (options) => usePermits('building', options)
export const useGasPermits = (options) => usePermits('gas', options)

export default usePermits