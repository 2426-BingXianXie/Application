import React, { createContext, useContext, useReducer, useCallback } from 'react'

// App Context
const AppContext = createContext()

// Action Types
const APP_ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
    SET_BREADCRUMB: 'SET_BREADCRUMB',
    UPDATE_METADATA: 'UPDATE_METADATA',
    SET_SIDEBAR_OPEN: 'SET_SIDEBAR_OPEN',
    SET_ONLINE_STATUS: 'SET_ONLINE_STATUS'
}

// Initial State
const initialState = {
    loading: false,
    error: null,
    breadcrumb: [],
    metadata: {
        title: 'Permit Management System',
        description: 'Municipal permit application and tracking system'
    },
    sidebarOpen: false,
    isOnline: navigator.onLine,
    lastActivity: new Date()
}

// App Reducer
const appReducer = (state, action) => {
    switch (action.type) {
        case APP_ACTIONS.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            }

        case APP_ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false
            }

        case APP_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
            }

        case APP_ACTIONS.SET_BREADCRUMB:
            return {
                ...state,
                breadcrumb: action.payload
            }

        case APP_ACTIONS.UPDATE_METADATA:
            return {
                ...state,
                metadata: { ...state.metadata, ...action.payload }
            }

        case APP_ACTIONS.SET_SIDEBAR_OPEN:
            return {
                ...state,
                sidebarOpen: action.payload
            }

        case APP_ACTIONS.SET_ONLINE_STATUS:
            return {
                ...state,
                isOnline: action.payload
            }

        default:
            return state
    }
}

// App Provider Component
export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState)

    // Set global loading state
    const setLoading = useCallback((loading) => {
        dispatch({
                     type: APP_ACTIONS.SET_LOADING,
                     payload: loading
                 })
    }, [])

    // Set global error
    const setError = useCallback((error) => {
        dispatch({
                     type: APP_ACTIONS.SET_ERROR,
                     payload: error
                 })
    }, [])

    // Clear error
    const clearError = useCallback(() => {
        dispatch({ type: APP_ACTIONS.CLEAR_ERROR })
    }, [])

    // Update breadcrumb
    const setBreadcrumb = useCallback((breadcrumb) => {
        dispatch({
                     type: APP_ACTIONS.SET_BREADCRUMB,
                     payload: breadcrumb
                 })
    }, [])

    // Update page metadata
    const updateMetadata = useCallback((metadata) => {
        dispatch({
                     type: APP_ACTIONS.UPDATE_METADATA,
                     payload: metadata
                 })

        // Update document title
        if (metadata.title) {
            document.title = metadata.title
        }

        // Update meta description
        if (metadata.description) {
            const metaDescription = document.querySelector('meta[name="description"]')
            if (metaDescription) {
                metaDescription.setAttribute('content', metadata.description)
            }
        }
    }, [])

    // Toggle sidebar
    const toggleSidebar = useCallback(() => {
        dispatch({
                     type: APP_ACTIONS.SET_SIDEBAR_OPEN,
                     payload: !state.sidebarOpen
                 })
    }, [state.sidebarOpen])

    // Set sidebar state
    const setSidebarOpen = useCallback((open) => {
        dispatch({
                     type: APP_ACTIONS.SET_SIDEBAR_OPEN,
                     payload: open
                 })
    }, [])

    // Update online status
    const setOnlineStatus = useCallback((isOnline) => {
        dispatch({
                     type: APP_ACTIONS.SET_ONLINE_STATUS,
                     payload: isOnline
                 })
    }, [])

    // Context value
    const value = {
        // State
        loading: state.loading,
        error: state.error,
        breadcrumb: state.breadcrumb,
        metadata: state.metadata,
        sidebarOpen: state.sidebarOpen,
        isOnline: state.isOnline,
        lastActivity: state.lastActivity,

        // Actions
        setLoading,
        setError,
        clearError,
        setBreadcrumb,
        updateMetadata,
        toggleSidebar,
        setSidebarOpen,
        setOnlineStatus
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

// Custom hook to use app context
export const useApp = () => {
    const context = useContext(AppContext)

    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider')
    }

    return context
}

export default AppContext