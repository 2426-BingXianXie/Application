import React, { createContext, useContext, useReducer, useEffect } from 'react'
import authService from '../services/authService'
import { storageUtils } from '../utils/storageUtils'
import { USER_ROLE, ROLE_PERMISSIONS } from '../utils/constants'

// Auth Context
const AuthContext = createContext()

// Action Types
const AUTH_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    UPDATE_PROFILE: 'UPDATE_PROFILE',
    SET_LOADING: 'SET_LOADING',
    CLEAR_ERROR: 'CLEAR_ERROR',
    REFRESH_TOKEN_SUCCESS: 'REFRESH_TOKEN_SUCCESS',
    REFRESH_TOKEN_FAILURE: 'REFRESH_TOKEN_FAILURE'
}

// Initial State
const initialState = {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: true,
    error: null,
    permissions: [],
    userRole: null,
    preferences: {
        theme: 'system',
        notifications: true,
        emailUpdates: true
    }
}

// Auth Reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_START:
            return {
                ...state,
                loading: true,
                error: null
            }

        case AUTH_ACTIONS.LOGIN_SUCCESS:
            const userRole = action.payload.user?.role || USER_ROLE.APPLICANT
            const permissions = ROLE_PERMISSIONS[userRole] || []

            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                refreshToken: action.payload.refreshToken,
                isAuthenticated: true,
                loading: false,
                error: null,
                userRole,
                permissions,
                preferences: {
                    ...state.preferences,
                    ...(action.payload.preferences || {})
                }
            }

        case AUTH_ACTIONS.LOGIN_FAILURE:
            return {
                ...state,
                user: null,
                token: null,
                refreshToken: null,
                isAuthenticated: false,
                loading: false,
                error: action.payload.error,
                permissions: [],
                userRole: null,
                preferences: initialState.preferences
            }

        case AUTH_ACTIONS.LOGOUT:
            return {
                ...initialState,
                loading: false
            }

        case AUTH_ACTIONS.UPDATE_PROFILE:
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload.user
                },
                preferences: {
                    ...state.preferences,
                    ...(action.payload.preferences || {})
                },
                loading: false,
                error: null
            }

        case AUTH_ACTIONS.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            }

        case AUTH_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
            }

        case AUTH_ACTIONS.REFRESH_TOKEN_SUCCESS:
            return {
                ...state,
                token: action.payload.token,
                refreshToken: action.payload.refreshToken,
                error: null
            }

        case AUTH_ACTIONS.REFRESH_TOKEN_FAILURE:
            return {
                ...initialState,
                loading: false,
                error: 'Session expired. Please login again.'
            }

        default:
            return state
    }
}

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState)

    // Initialize authentication state on app load
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = storageUtils.getToken()
                const refreshToken = storageUtils.getRefreshToken()

                if (token) {
                    // Validate token and get user info
                    const userData = await authService.validateToken(token)

                    dispatch({
                                 type: AUTH_ACTIONS.LOGIN_SUCCESS,
                                 payload: {
                                     user: userData.user,
                                     token: token,
                                     refreshToken: refreshToken,
                                     permissions: userData.permissions,
                                     preferences: userData.preferences
                                 }
                             })
                } else {
                    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
                }
            } catch (error) {
                console.error('Auth initialization failed:', error)
                // Clear invalid tokens
                storageUtils.removeToken()
                storageUtils.removeRefreshToken()
                dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
            }
        }

        initializeAuth()
    }, [])

    // Login function
    const login = async (credentials) => {
        try {
            dispatch({ type: AUTH_ACTIONS.LOGIN_START })

            const response = await authService.login(credentials)

            // Store tokens
            storageUtils.setToken(response.token)
            if (response.refreshToken) {
                storageUtils.setRefreshToken(response.refreshToken)
            }

            dispatch({
                         type: AUTH_ACTIONS.LOGIN_SUCCESS,
                         payload: {
                             user: response.user,
                             token: response.token,
                             refreshToken: response.refreshToken,
                             permissions: response.permissions,
                             preferences: response.preferences
                         }
                     })

            return { success: true, user: response.user }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.'

            dispatch({
                         type: AUTH_ACTIONS.LOGIN_FAILURE,
                         payload: { error: errorMessage }
                     })

            return { success: false, error: errorMessage }
        }
    }

    // Logout function
    const logout = async () => {
        try {
            await authService.logout()
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            // Clear storage and state regardless of API call result
            storageUtils.removeToken()
            storageUtils.removeRefreshToken()
            storageUtils.clearUserData()
            dispatch({ type: AUTH_ACTIONS.LOGOUT })
        }
    }

    // Register function (with auto-login)
    const register = async (userData) => {
        try {
            dispatch({ type: AUTH_ACTIONS.LOGIN_START })

            const response = await authService.register(userData)

            // Auto-login after successful registration
            storageUtils.setToken(response.token)
            if (response.refreshToken) {
                storageUtils.setRefreshToken(response.refreshToken)
            }

            dispatch({
                         type: AUTH_ACTIONS.LOGIN_SUCCESS,
                         payload: {
                             user: response.user,
                             token: response.token,
                             refreshToken: response.refreshToken,
                             permissions: response.permissions,
                             preferences: response.preferences
                         }
                     })

            return { success: true, user: response.user }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.'

            dispatch({
                         type: AUTH_ACTIONS.LOGIN_FAILURE,
                         payload: { error: errorMessage }
                     })

            return { success: false, error: errorMessage }
        }
    }

    // Update profile function
    const updateProfile = async (profileData) => {
        try {
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })

            const updatedUser = await authService.updateProfile(profileData)

            dispatch({
                         type: AUTH_ACTIONS.UPDATE_PROFILE,
                         payload: { user: updatedUser }
                     })

            return { success: true, user: updatedUser }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Profile update failed.'

            dispatch({
                         type: AUTH_ACTIONS.LOGIN_FAILURE,
                         payload: { error: errorMessage }
                     })

            return { success: false, error: errorMessage }
        }
    }

    // Change password function
    const changePassword = async (passwordData) => {
        try {
            await authService.changePassword(passwordData)
            return { success: true }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Password change failed.'
            return { success: false, error: errorMessage }
        }
    }

    // Refresh token function
    const refreshAuthToken = async () => {
        try {
            const refreshToken = storageUtils.getRefreshToken()
            if (!refreshToken) {
                throw new Error('No refresh token available')
            }

            const response = await authService.refreshToken(refreshToken)

            storageUtils.setToken(response.token)
            storageUtils.setRefreshToken(response.refreshToken)

            dispatch({
                         type: AUTH_ACTIONS.REFRESH_TOKEN_SUCCESS,
                         payload: response
                     })

            return { success: true }
        } catch (error) {
            dispatch({ type: AUTH_ACTIONS.REFRESH_TOKEN_FAILURE })
            return { success: false, error: error.message }
        }
    }

    // Clear error function
    const clearError = () => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })
    }

    // Check if user has specific permission
    const hasPermission = (permission) => {
        return state.permissions.includes(permission)
    }

    // Check if user has any of the specified permissions
    const hasAnyPermission = (permissionList) => {
        if (!Array.isArray(permissionList)) {
            return hasPermission(permissionList)
        }
        return permissionList.some(permission => state.permissions.includes(permission))
    }

    // Check if user has all of the specified permissions
    const hasAllPermissions = (permissionList) => {
        if (!Array.isArray(permissionList)) {
            return hasPermission(permissionList)
        }
        return permissionList.every(permission => state.permissions.includes(permission))
    }

    // Check if user has any of the specified roles
    const hasRole = (roles) => {
        if (!state.userRole) return false
        const roleArray = Array.isArray(roles) ? roles : [roles]
        return roleArray.includes(state.userRole)
    }

    // Role checking functions
    const isAdmin = () => {
        return state.userRole === USER_ROLE.ADMIN
    }

    const isReviewer = () => {
        return state.userRole === USER_ROLE.REVIEWER
    }

    const isContractor = () => {
        return state.userRole === USER_ROLE.CONTRACTOR
    }

    const isApplicant = () => {
        return state.userRole === USER_ROLE.APPLICANT
    }

    // Feature-specific permission functions
    const canViewAllPermits = () => {
        return hasPermission('VIEW_ALL_PERMITS')
    }

    const canManagePermits = () => {
        return hasAnyPermission(['APPROVE_PERMITS', 'REJECT_PERMITS', 'DELETE_PERMITS'])
    }

    const canManageUsers = () => {
        return hasPermission('MANAGE_USERS')
    }

    const canViewReports = () => {
        return hasPermission('VIEW_REPORTS')
    }

    const canAccessSystemSettings = () => {
        return hasPermission('SYSTEM_SETTINGS')
    }

    // Check if user can edit a specific permit
    const canEditPermit = (permit) => {
        if (!permit) return false

        // Admin can edit all permits
        if (hasPermission('EDIT_ALL_PERMITS')) {
            return true
        }

        // Users can only edit their own draft permits
        if (hasPermission('EDIT_OWN_DRAFT_PERMITS')) {
            return permit.applicantId === state.user?.id && permit.status === 'DRAFT'
        }

        return false
    }

    // Check if user can delete a specific permit
    const canDeletePermit = (permit) => {
        if (!permit) return false

        // Only admin can delete permits
        return hasPermission('DELETE_PERMITS')
    }

    // Get user preferences
    const getPreference = (key, defaultValue = null) => {
        return state.preferences[key] || defaultValue
    }

    // Update user preferences
    const updatePreferences = async (preferences) => {
        try {
            const updatedPreferences = await authService.updatePreferences(preferences)

            dispatch({
                         type: AUTH_ACTIONS.UPDATE_PROFILE,
                         payload: { preferences: updatedPreferences }
                     })

            return { success: true }
        } catch (error) {
            return { success: false, error: 'Failed to update preferences' }
        }
    }

    // Get user's full name
    const getFullName = () => {
        if (!state.user) return 'Unknown User'
        return `${state.user.firstName} ${state.user.lastName}`.trim()
    }

    // Get user's initials
    const getInitials = () => {
        if (!state.user) return 'UU'
        const firstName = state.user.firstName || ''
        const lastName = state.user.lastName || ''
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }

    // Context value
    const value = {
        // State
        ...state,

        // Actions
        login,
        logout,
        register,
        updateProfile,
        changePassword,
        refreshAuthToken,
        clearError,

        // Permission functions
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,

        // Role checking functions (both styles for compatibility)
        hasRole,
        isAdmin,
        isReviewer,
        isContractor,
        isApplicant,

        // Feature-specific permission functions
        canViewAllPermits,
        canManagePermits,
        canManageUsers,
        canViewReports,
        canAccessSystemSettings,
        canEditPermit,
        canDeletePermit,

        // Utilities
        getPreference,
        updatePreferences,
        getFullName,
        getInitials
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext)

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }

    return context
}

// HOC for components that require authentication
export const withAuth = (WrappedComponent) => {
    return function AuthenticatedComponent(props) {
        const { isAuthenticated, loading } = useAuth()

        if (loading) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                </div>
            )
        }

        if (!isAuthenticated) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Authentication Required
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Please log in to access this page.
                        </p>
                        <a
                            href="/login"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Go to Login
                        </a>
                    </div>
                </div>
            )
        }

        return <WrappedComponent {...props} />
    }
}

export default AuthContext