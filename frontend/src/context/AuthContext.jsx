import React, { createContext, useContext, useReducer, useEffect } from 'react'
import authService from '../services/authService'
import { storageUtils } from '../utils/storageUtils'

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
    CLEAR_ERROR: 'CLEAR_ERROR'
}

// Initial State
const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
    error: null,
    permissions: [],
    preferences: {}
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
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                loading: false,
                error: null,
                permissions: action.payload.permissions || [],
                preferences: action.payload.preferences || {}
            }

        case AUTH_ACTIONS.LOGIN_FAILURE:
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                loading: false,
                error: action.payload.error,
                permissions: [],
                preferences: {}
            }

        case AUTH_ACTIONS.LOGOUT:
            return {
                ...initialState,
                loading: false
            }

        case AUTH_ACTIONS.UPDATE_PROFILE:
            return {
                ...state,
                user: { ...state.user, ...action.payload },
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

                if (token) {
                    // Validate token and get user info
                    const userData = await authService.validateToken(token)

                    dispatch({
                                 type: AUTH_ACTIONS.LOGIN_SUCCESS,
                                 payload: {
                                     user: userData.user,
                                     token: token,
                                     permissions: userData.permissions,
                                     preferences: userData.preferences
                                 }
                             })
                } else {
                    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
                }
            } catch (error) {
                console.error('Auth initialization failed:', error)
                storageUtils.removeToken()
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

            // Store token
            storageUtils.setToken(response.token)

            dispatch({
                         type: AUTH_ACTIONS.LOGIN_SUCCESS,
                         payload: {
                             user: response.user,
                             token: response.token,
                             permissions: response.permissions,
                             preferences: response.preferences
                         }
                     })

            return { success: true }
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
            storageUtils.removeToken()
            dispatch({ type: AUTH_ACTIONS.LOGOUT })
        }
    }

    // Register function
    const register = async (userData) => {
        try {
            dispatch({ type: AUTH_ACTIONS.LOGIN_START })

            const response = await authService.register(userData)

            // Auto-login after successful registration
            storageUtils.setToken(response.token)

            dispatch({
                         type: AUTH_ACTIONS.LOGIN_SUCCESS,
                         payload: {
                             user: response.user,
                             token: response.token,
                             permissions: response.permissions,
                             preferences: response.preferences
                         }
                     })

            return { success: true }
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
                         payload: updatedUser
                     })

            return { success: true }
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

    // Clear error function
    const clearError = () => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })
    }

    // Check if user has specific permission
    const hasPermission = (permission) => {
        return state.permissions.includes(permission)
    }

    // Check if user has any of the specified roles
    const hasRole = (roles) => {
        if (!state.user?.roles) return false
        const userRoles = Array.isArray(state.user.roles)
                          ? state.user.roles
                          : [state.user.roles]
        return roles.some(role => userRoles.includes(role))
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
        clearError,

        // Utilities
        hasPermission,
        hasRole,
        getPreference,
        updatePreferences
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

export default AuthContext