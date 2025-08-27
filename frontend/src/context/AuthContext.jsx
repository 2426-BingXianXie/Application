import React, { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'
import { useToast } from '../components/ui/Toast'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const { success, error } = useToast()

    // Check for existing auth on mount
    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('auth_token')
            if (!token) {
                setLoading(false)
                return
            }

            const userData = await authService.getCurrentUser()
            setUser(userData)
            setIsAuthenticated(true)
        } catch (err) {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user_data')
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password, rememberMe = false) => {
        try {
            const response = await authService.login(email, password)
            const { token, user: userData } = response

            // Store auth data
            localStorage.setItem('auth_token', token)
            localStorage.setItem('user_data', JSON.stringify(userData))

            setUser(userData)
            setIsAuthenticated(true)

            return userData
        } catch (err) {
            throw new Error(err.message || 'Login failed')
        }
    }

    const register = async (userData) => {
        try {
            const response = await authService.register(userData)
            return response
        } catch (err) {
            throw new Error(err.message || 'Registration failed')
        }
    }

    const logout = async () => {
        try {
            await authService.logout()
        } catch (err) {
            console.error('Logout error:', err)
        } finally {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user_data')
            setUser(null)
            setIsAuthenticated(false)
            success('Logged out successfully')
        }
    }

    const updateProfile = async (profileData) => {
        try {
            const updatedUser = await authService.updateProfile(profileData)
            setUser(updatedUser)
            localStorage.setItem('user_data', JSON.stringify(updatedUser))
            return updatedUser
        } catch (err) {
            throw new Error(err.message || 'Profile update failed')
        }
    }

    const changePassword = async (currentPassword, newPassword) => {
        try {
            await authService.changePassword(currentPassword, newPassword)
            success('Password changed successfully')
        } catch (err) {
            throw new Error(err.message || 'Password change failed')
        }
    }

    const hasPermission = (permission) => {
        if (!user?.roles) return false

        const rolePermissions = {
            USER: ['read', 'create', 'update_own'],
            CONTRACTOR: ['read', 'create', 'update_own', 'submit'],
            REVIEWER: ['read', 'create', 'update_own', 'submit', 'review', 'approve', 'reject'],
            ADMIN: ['read', 'create', 'update', 'delete', 'submit', 'review', 'approve', 'reject', 'admin']
        }

        return user.roles.some(role =>
                                   rolePermissions[role]?.includes(permission)
        )
    }

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        hasPermission,
        checkAuth
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}