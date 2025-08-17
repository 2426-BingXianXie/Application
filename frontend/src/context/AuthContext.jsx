import React, { createContext, useContext, useReducer, useEffect } from 'react'
import toast from 'react-hot-toast'

// Auth Context
const AuthContext = createContext()

// Auth actions
const AUTH_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    SET_USER: 'SET_USER',
    CLEAR_ERROR: 'CLEAR_ERROR',
}

// Initial state
const initialState = {
    user: null,
    token: localStorage.getItem('auth_token'),
    isAuthenticated: !!localStorage.getItem('auth_token'),
    isLoading: false,
    error: null,
}

// Auth reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_START:
            return {
                ...state,
                isLoading: true,
                error: null,
            }

        case AUTH_ACTIONS.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            }

        case AUTH_ACTIONS.LOGIN_FAILURE:
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload.error,
            }

        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            }

        case AUTH_ACTIONS.SET_USER:
            return {
                ...state,
                user: action.payload.user,
            }

        case AUTH_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null,
            }

        default:
            return state
    }
}

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState)

    // Check if user is logged in on app start
    useEffect(() => {
        const token = localStorage.getItem('auth_token')
        const userData = localStorage.getItem('user_data')

        if (token && userData) {
            try {
                const user = JSON.parse(userData)
                dispatch({
                             type: AUTH_ACTIONS.SET_USER,
                             payload: { user }
                         })
            } catch (error) {
                console.error('Error parsing user data:', error)
                logout()
            }
        }
    }, [])

    // Login function
    const login = async (credentials) => {
        dispatch({ type: AUTH_ACTIONS.LOGIN_START })

        try {
            // For now, simulate API call
            // In real app, this would be an API call to your backend
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Mock user data - replace with actual API response
            const mockUser = {
                id: 1,
                name: 'John Smith',
                email: credentials.email,
                role: 'applicant',
                permissions: ['read', 'create', 'update']
            }

            const mockToken = 'mock_jwt_token_' + Date.now()

            // Store in localStorage
            localStorage.setItem('auth_token', mockToken)
            localStorage.setItem('user_data', JSON.stringify(mockUser))

            dispatch({
                         type: AUTH_ACTIONS.LOGIN_SUCCESS,
                         payload: {
                             user: mockUser,
                             token: mockToken
                         }
                     })

            toast.success('Login successful!')
            return { success: true, user: mockUser }

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed'

            dispatch({
                         type: AUTH_ACTIONS.LOGIN_FAILURE,
                         payload: { error: errorMessage }
                     })

            toast.error(errorMessage)
            return { success: false, error: errorMessage }
        }
    }

    // Logout function
    const logout = () => {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')

        dispatch({ type: AUTH_ACTIONS.LOGOUT })
        toast.success('Logged out successfully')
    }

    // Update user profile
    const updateUser = async (userData) => {
        try {
            // In real app, this would be an API call
            const updatedUser = { ...state.user, ...userData }

            localStorage.setItem('user_data', JSON.stringify(updatedUser))
            dispatch({
                         type: AUTH_ACTIONS.SET_USER,
                         payload: { user: updatedUser }
                     })

            toast.success('Profile updated successfully')
            return { success: true, user: updatedUser }

        } catch (error) {
            toast.error('Failed to update profile')
            return { success: false, error: error.message }
        }
    }

    // Clear error
    const clearError = () => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })
    }

    // Check if user has permission
    const hasPermission = (permission) => {
        return state.user?.permissions?.includes(permission) || false
    }

    // Check if user has role
    const hasRole = (role) => {
        return state.user?.role === role
    }

    const value = {
        // State
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        error: state.error,

        // Actions
        login,
        logout,
        updateUser,
        clearError,
        hasPermission,
        hasRole,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

// Hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}