import api from './api'

const authService = {
    // Login user
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password })
        return response.data
    },

    // Register new user
    register: async (userData) => {
        const response = await api.post('/auth/register', userData)
        return response.data
    },

    // Logout user
    logout: async () => {
        try {
            await api.post('/auth/logout')
        } catch (error) {
            // Continue with client-side logout even if server call fails
            console.warn('Server logout failed:', error)
        }
    },

    // Get current user profile
    getCurrentUser: async () => {
        const response = await api.get('/auth/me')
        return response.data
    },

    // Update user profile
    updateProfile: async (profileData) => {
        const response = await api.put('/auth/profile', profileData)
        return response.data
    },

    // Change password
    changePassword: async (currentPassword, newPassword) => {
        const response = await api.post('/auth/change-password', {
            currentPassword,
            newPassword
        })
        return response.data
    },

    // Forgot password
    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email })
        return response.data
    },

    // Reset password
    resetPassword: async (token, newPassword) => {
        const response = await api.post('/auth/reset-password', {
            token,
            newPassword
        })
        return response.data
    },

    // Verify email
    verifyEmail: async (token) => {
        const response = await api.post('/auth/verify-email', { token })
        return response.data
    },

    // Refresh token
    refreshToken: async () => {
        const response = await api.post('/auth/refresh')
        return response.data
    }
}

export default authService