import api from './api'

const authService = {
    // Login user
    login: async (credentials) => {
        const response = await api.post('/auth/login', {
            email: credentials.email,
            password: credentials.password,
            rememberMe: credentials.rememberMe || false
        })
        return response.data
    },

    // Register new user
    register: async (userData) => {
        const response = await api.post('/auth/register', {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password,
            phone: userData.phone,
            organization: userData.organization,
            role: userData.role || 'APPLICANT',
            acceptTerms: userData.acceptTerms
        })
        return response.data
    },

    // Logout user
    logout: async () => {
        try {
            await api.post('/auth/logout')
        } catch (error) {
            // Even if logout fails on server, we clear local storage
            console.warn('Logout request failed, but clearing local session:', error)
        }
    },

    // Refresh authentication token
    refreshToken: async (refreshToken) => {
        const response = await api.post('/auth/refresh', {
            refreshToken
        })
        return response.data
    },

    // Validate current token
    validateToken: async (token) => {
        const response = await api.get('/auth/validate', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    },

    // Get current user profile
    getCurrentUser: async () => {
        const response = await api.get('/auth/me')
        return response.data
    },

    // Update user profile
    updateProfile: async (profileData) => {
        const response = await api.put('/auth/profile', {
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            phone: profileData.phone,
            organization: profileData.organization,
            preferences: profileData.preferences
        })
        return response.data
    },

    // Change password
    changePassword: async (passwordData) => {
        const response = await api.post('/auth/change-password', {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
            confirmPassword: passwordData.confirmPassword
        })
        return response.data
    },

    // Request password reset
    requestPasswordReset: async (email) => {
        const response = await api.post('/auth/forgot-password', {
            email
        })
        return response.data
    },

    // Reset password with token
    resetPassword: async (token, newPassword) => {
        const response = await api.post('/auth/reset-password', {
            token,
            newPassword
        })
        return response.data
    },

    // Verify email address
    verifyEmail: async (token) => {
        const response = await api.post('/auth/verify-email', {
            token
        })
        return response.data
    },

    // Resend email verification
    resendEmailVerification: async (email) => {
        const response = await api.post('/auth/resend-verification', {
            email
        })
        return response.data
    },

    // Get user permissions
    getUserPermissions: async () => {
        const response = await api.get('/auth/permissions')
        return response.data
    },

    // Update user preferences
    updatePreferences: async (preferences) => {
        const response = await api.put('/auth/preferences', preferences)
        return response.data
    },

    // Get user activity log
    getUserActivity: async (params = {}) => {
        const response = await api.get('/auth/activity', { params })
        return response.data
    },

    // Check if email exists
    checkEmailExists: async (email) => {
        const response = await api.post('/auth/check-email', {
            email
        })
        return response.data
    },

    // Enable two-factor authentication
    enableTwoFactor: async () => {
        const response = await api.post('/auth/2fa/enable')
        return response.data
    },

    // Disable two-factor authentication
    disableTwoFactor: async (token) => {
        const response = await api.post('/auth/2fa/disable', {
            token
        })
        return response.data
    },

    // Verify two-factor authentication token
    verifyTwoFactor: async (token) => {
        const response = await api.post('/auth/2fa/verify', {
            token
        })
        return response.data
    },

    // Get backup codes for 2FA
    getBackupCodes: async () => {
        const response = await api.get('/auth/2fa/backup-codes')
        return response.data
    },

    // Regenerate backup codes
    regenerateBackupCodes: async () => {
        const response = await api.post('/auth/2fa/backup-codes/regenerate')
        return response.data
    },

    // Get user sessions
    getUserSessions: async () => {
        const response = await api.get('/auth/sessions')
        return response.data
    },

    // Revoke user session
    revokeSession: async (sessionId) => {
        const response = await api.delete(`/auth/sessions/${sessionId}`)
        return response.data
    },

    // Revoke all sessions except current
    revokeAllOtherSessions: async () => {
        const response = await api.post('/auth/sessions/revoke-others')
        return response.data
    },

    // Update user avatar
    updateAvatar: async (file) => {
        const formData = new FormData()
        formData.append('avatar', file)

        const response = await api.post('/auth/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    },

    // Delete user avatar
    deleteAvatar: async () => {
        const response = await api.delete('/auth/avatar')
        return response.data
    },

    // Get user notification preferences
    getNotificationPreferences: async () => {
        const response = await api.get('/auth/notification-preferences')
        return response.data
    },

    // Update notification preferences
    updateNotificationPreferences: async (preferences) => {
        const response = await api.put('/auth/notification-preferences', preferences)
        return response.data
    },

    // Delete account (soft delete)
    deleteAccount: async (password) => {
        const response = await api.post('/auth/delete-account', {
            password
        })
        return response.data
    },

    // Export user data (GDPR compliance)
    exportUserData: async () => {
        const response = await api.get('/auth/export-data')
        return response.data
    },

    // Get account status
    getAccountStatus: async () => {
        const response = await api.get('/auth/status')
        return response.data
    }
}

export default authService