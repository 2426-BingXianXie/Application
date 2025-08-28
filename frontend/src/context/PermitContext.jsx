import React, { createContext, useContext, useReducer, useCallback } from 'react'
import permitService from '../services/permitService'
import { useNotifications } from './NotificationContext'

// Permit Context
const PermitContext = createContext()

// Action Types
const PERMIT_ACTIONS = {
    SET_PERMITS: 'SET_PERMITS',
    ADD_PERMIT: 'ADD_PERMIT',
    UPDATE_PERMIT: 'UPDATE_PERMIT',
    REMOVE_PERMIT: 'REMOVE_PERMIT',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_FILTERS: 'SET_FILTERS',
    SET_SEARCH_TERM: 'SET_SEARCH_TERM',
    SET_PAGINATION: 'SET_PAGINATION',
    CLEAR_ERROR: 'CLEAR_ERROR'
}

// Initial State
const initialState = {
    permits: [],
    loading: false,
    error: null,
    filters: {
        status: 'all',
        type: 'all',
        dateRange: { start: null, end: null },
        applicantType: 'all'
    },
    searchTerm: '',
    pagination: {
        page: 0,
        size: 20,
        totalElements: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false
    },
    selectedPermits: [],
    sortBy: 'submissionDate',
    sortOrder: 'desc'
}

// Permit Reducer
const permitReducer = (state, action) => {
    switch (action.type) {
        case PERMIT_ACTIONS.SET_PERMITS:
            return {
                ...state,
                permits: action.payload.permits,
                pagination: action.payload.pagination,
                loading: false,
                error: null
            }

        case PERMIT_ACTIONS.ADD_PERMIT:
            return {
                ...state,
                permits: [action.payload, ...state.permits],
                pagination: {
                    ...state.pagination,
                    totalElements: state.pagination.totalElements + 1
                }
            }

        case PERMIT_ACTIONS.UPDATE_PERMIT:
            return {
                ...state,
                permits: state.permits.map(permit =>
                                               permit.id === action.payload.id ? action.payload : permit
                )
            }

        case PERMIT_ACTIONS.REMOVE_PERMIT:
            return {
                ...state,
                permits: state.permits.filter(permit => permit.id !== action.payload),
                pagination: {
                    ...state.pagination,
                    totalElements: Math.max(0, state.pagination.totalElements - 1)
                }
            }

        case PERMIT_ACTIONS.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            }

        case PERMIT_ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false
            }

        case PERMIT_ACTIONS.SET_FILTERS:
            return {
                ...state,
                filters: { ...state.filters, ...action.payload },
                pagination: { ...state.pagination, page: 0 } // Reset to first page
            }

        case PERMIT_ACTIONS.SET_SEARCH_TERM:
            return {
                ...state,
                searchTerm: action.payload,
                pagination: { ...state.pagination, page: 0 } // Reset to first page
            }

        case PERMIT_ACTIONS.SET_PAGINATION:
            return {
                ...state,
                pagination: { ...state.pagination, ...action.payload }
            }

        case PERMIT_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

// Permit Provider Component
export const PermitProvider = ({ children }) => {
    const [state, dispatch] = useReducer(permitReducer, initialState)
    const { showSuccess, showError } = useNotifications()

    // Load permits
    const loadPermits = useCallback(async (params = {}) => {
        try {
            dispatch({ type: PERMIT_ACTIONS.SET_LOADING, payload: true })

            const queryParams = {
                page: state.pagination.page,
                size: state.pagination.size,
                sort: `${state.sortBy},${state.sortOrder}`,
                ...params,
                ...(state.searchTerm && { search: state.searchTerm }),
                ...(state.filters.status !== 'all' && { status: state.filters.status }),
                ...(state.filters.type !== 'all' && { type: state.filters.type })
            }

            const response = await permitService.getAllPermits(queryParams)

            dispatch({
                         type: PERMIT_ACTIONS.SET_PERMITS,
                         payload: {
                             permits: response.data || [],
                             pagination: response.pagination || {}
                         }
                     })

        } catch (error) {
            dispatch({
                         type: PERMIT_ACTIONS.SET_ERROR,
                         payload: error.message || 'Failed to load permits'
                     })
            showError('Loading Failed', 'Could not load permits')
        }
    }, [state.pagination.page, state.pagination.size, state.sortBy, state.sortOrder, state.searchTerm, state.filters, showError])

    // Create permit
    const createPermit = useCallback(async (permitData) => {
        try {
            const newPermit = await permitService.createPermit(permitData)

            dispatch({
                         type: PERMIT_ACTIONS.ADD_PERMIT,
                         payload: newPermit
                     })

            showSuccess('Permit Created', 'New permit has been created successfully')
            return { success: true, data: newPermit }

        } catch (error) {
            showError('Creation Failed', error.message || 'Failed to create permit')
            return { success: false, error: error.message }
        }
    }, [showSuccess, showError])

    // Update permit
    const updatePermit = useCallback(async (id, permitData) => {
        try {
            const updatedPermit = await permitService.updatePermit(id, permitData)

            dispatch({
                         type: PERMIT_ACTIONS.UPDATE_PERMIT,
                         payload: updatedPermit
                     })

            showSuccess('Permit Updated', 'Permit has been updated successfully')
            return { success: true, data: updatedPermit }

        } catch (error) {
            showError('Update Failed', error.message || 'Failed to update permit')
            return { success: false, error: error.message }
        }
    }, [showSuccess, showError])

    // Delete permit
    const deletePermit = useCallback(async (id) => {
        try {
            await permitService.deletePermit(id)

            dispatch({
                         type: PERMIT_ACTIONS.REMOVE_PERMIT,
                         payload: id
                     })

            showSuccess('Permit Deleted', 'Permit has been deleted successfully')
            return { success: true }

        } catch (error) {
            showError('Deletion Failed', error.message || 'Failed to delete permit')
            return { success: false, error: error.message }
        }
    }, [showSuccess, showError])

    // Submit permit
    const submitPermit = useCallback(async (id) => {
        try {
            const submittedPermit = await permitService.submitPermit(id)

            dispatch({
                         type: PERMIT_ACTIONS.UPDATE_PERMIT,
                         payload: submittedPermit
                     })

            showSuccess('Permit Submitted', 'Permit has been submitted for review')
            return { success: true, data: submittedPermit }

        } catch (error) {
            showError('Submission Failed', error.message || 'Failed to submit permit')
            return { success: false, error: error.message }
        }
    }, [showSuccess, showError])

    // Update filters
    const updateFilters = useCallback((newFilters) => {
        dispatch({
                     type: PERMIT_ACTIONS.SET_FILTERS,
                     payload: newFilters
                 })
    }, [])

    // Update search term
    const updateSearchTerm = useCallback((term) => {
        dispatch({
                     type: PERMIT_ACTIONS.SET_SEARCH_TERM,
                     payload: term
                 })
    }, [])

    // Update pagination
    const updatePagination = useCallback((newPagination) => {
        dispatch({
                     type: PERMIT_ACTIONS.SET_PAGINATION,
                     payload: newPagination
                 })
    }, [])

    // Clear error
    const clearError = useCallback(() => {
        dispatch({ type: PERMIT_ACTIONS.CLEAR_ERROR })
    }, [])

    // Context value
    const value = {
        // State
        permits: state.permits,
        loading: state.loading,
        error: state.error,
        filters: state.filters,
        searchTerm: state.searchTerm,
        pagination: state.pagination,
        selectedPermits: state.selectedPermits,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,

        // Actions
        loadPermits,
        createPermit,
        updatePermit,
        deletePermit,
        submitPermit,
        updateFilters,
        updateSearchTerm,
        updatePagination,
        clearError
    }

    return (
        <PermitContext.Provider value={value}>
            {children}
        </PermitContext.Provider>
    )
}

// Custom hook to use permit context
export const usePermitContext = () => {
    const context = useContext(PermitContext)

    if (context === undefined) {
        throw new Error('usePermitContext must be used within a PermitProvider')
    }

    return context
}

export default PermitContext