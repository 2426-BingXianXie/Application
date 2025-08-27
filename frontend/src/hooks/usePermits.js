import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import permitService from '../services/permitService'
import buildingPermitService from '../services/buildingPermitService'
import gasPermitService from '../services/gasPermitService'
import { useToast } from '../components/ui/Toast'

export const usePermits = (permitType = 'building') => {
    const queryClient = useQueryClient()
    const { success, error } = useToast()

    const service = permitType === 'building' ? buildingPermitService : gasPermitService
    const queryKeyPrefix = permitType === 'building' ? 'building-permits' : 'gas-permits'

    // Get permits list with filtering and pagination
    const usePermitsList = (params = {}) => {
        return useQuery({
                            queryKey: [queryKeyPrefix, 'list', params],
                            queryFn: () => service.getAll(params),
                            staleTime: 5 * 60 * 1000, // 5 minutes
                            retry: 1
                        })
    }

    // Get single permit by ID
    const usePermit = (id) => {
        return useQuery({
                            queryKey: [queryKeyPrefix, 'detail', id],
                            queryFn: () => service.getById(id),
                            enabled: !!id,
                            staleTime: 2 * 60 * 1000, // 2 minutes
                            retry: 1
                        })
    }

    // Get permit by number
    const usePermitByNumber = (permitNumber) => {
        return useQuery({
                            queryKey: [queryKeyPrefix, 'by-number', permitNumber],
                            queryFn: () => service.getByPermitNumber(permitNumber),
                            enabled: !!permitNumber,
                            staleTime: 2 * 60 * 1000
                        })
    }

    // Create permit mutation
    const useCreatePermit = () => {
        return useMutation({
                               mutationFn: (permitData) => service.create(permitData),
                               onSuccess: (data) => {
                                   queryClient.invalidateQueries({ queryKey: [queryKeyPrefix] })
                                   success('Permit application created successfully!')
                                   return data
                               },
                               onError: (err) => {
                                   error(err.message || 'Failed to create permit application')
                               }
                           })
    }

    // Update permit mutation
    const useUpdatePermit = () => {
        return useMutation({
                               mutationFn: ({ id, data }) => service.update(id, data),
                               onSuccess: (data, variables) => {
                                   queryClient.invalidateQueries({ queryKey: [queryKeyPrefix] })
                                   queryClient.setQueryData([queryKeyPrefix, 'detail', variables.id], data)
                                   success('Permit updated successfully!')
                                   return data
                               },
                               onError: (err) => {
                                   error(err.message || 'Failed to update permit')
                               }
                           })
    }

    // Submit permit mutation
    const useSubmitPermit = () => {
        return useMutation({
                               mutationFn: (id) => service.submit(id),
                               onSuccess: (data, id) => {
                                   queryClient.invalidateQueries({ queryKey: [queryKeyPrefix] })
                                   queryClient.setQueryData([queryKeyPrefix, 'detail', id], data)
                                   success('Permit submitted for review successfully!')
                                   return data
                               },
                               onError: (err) => {
                                   error(err.message || 'Failed to submit permit')
                               }
                           })
    }

    // Approve permit mutation (admin only)
    const useApprovePermit = () => {
        return useMutation({
                               mutationFn: ({ id, notes }) => service.approve(id, notes),
                               onSuccess: (data, variables) => {
                                   queryClient.invalidateQueries({ queryKey: [queryKeyPrefix] })
                                   queryClient.setQueryData([queryKeyPrefix, 'detail', variables.id], data)
                                   success('Permit approved successfully!')
                                   return data
                               },
                               onError: (err) => {
                                   error(err.message || 'Failed to approve permit')
                               }
                           })
    }

    // Reject permit mutation (admin only)
    const useRejectPermit = () => {
        return useMutation({
                               mutationFn: ({ id, reason }) => service.reject(id, reason),
                               onSuccess: (data, variables) => {
                                   queryClient.invalidateQueries({ queryKey: [queryKeyPrefix] })
                                   queryClient.setQueryData([queryKeyPrefix, 'detail', variables.id], data)
                                   success('Permit rejected.')
                                   return data
                               },
                               onError: (err) => {
                                   error(err.message || 'Failed to reject permit')
                               }
                           })
    }

    // Delete permit mutation
    const useDeletePermit = () => {
        return useMutation({
                               mutationFn: (id) => service.delete(id),
                               onSuccess: (_, id) => {
                                   queryClient.invalidateQueries({ queryKey: [queryKeyPrefix] })
                                   queryClient.removeQueries({ queryKey: [queryKeyPrefix, 'detail', id] })
                                   success('Permit deleted successfully!')
                               },
                               onError: (err) => {
                                   error(err.message || 'Failed to delete permit')
                               }
                           })
    }

    // Get permit statistics
    const usePermitStatistics = (params = {}) => {
        return useQuery({
                            queryKey: [queryKeyPrefix, 'statistics', params],
                            queryFn: () => service.getStatistics(params),
                            staleTime: 10 * 60 * 1000, // 10 minutes
                            retry: 1
                        })
    }

    return {
        usePermitsList,
        usePermit,
        usePermitByNumber,
        useCreatePermit,
        useUpdatePermit,
        useSubmitPermit,
        useApprovePermit,
        useRejectPermit,
        useDeletePermit,
        usePermitStatistics
    }
}