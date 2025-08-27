import axios from 'axios'
import { storageUtils } from '../utils/storageUtils'

// API Configuration
const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
}

// Create axios instance
const api = axios.create(API_CONFIG)

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = storageUtils.getToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // Add request ID for tracking
        config.headers['X-Request-ID'] = generateRequestId()

        // Log request in development
        if (import.meta.env.DEV) {
            console.log('🚀 API Request:', {
                method: config.method?.toUpperCase(),
                url: config.url,
                data: config.data
            })
        }

        return config
    },
    (error) => {
        console.error('Request interceptor error:', error)
        return Promise.reject(error)
    }
)

// Response interceptor
api.interceptors.response.use(
    (response) => {
        // Log successful responses in development
        if (import.meta.env.DEV) {
            console.log('✅ API Response:', {
                status: response.status,
                url: response.config.url,
                data: response.data
            })
        }

        return response
    },
    async (error) => {
        const originalRequest = error.config

        // Log errors in development
        if (import.meta.env.DEV) {
            console.error('❌ API Error:', {
                status: error.response?.status,
                url: error.config?.url,
                message: error.message,
                data: error.response?.data
            })
        }

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                // Try to refresh token
                const refreshToken = storageUtils.getRefreshToken()
                if (refreshToken) {
                    const response = await axios.post(`${API_CONFIG.baseURL}/auth/refresh`, {
                        refreshToken
                    })

                    const { token } = response.data
                    storageUtils.setToken(token)

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${token}`
                    return api(originalRequest)
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError)
            }

            // Redirect to login if refresh fails
            storageUtils.clearAuth()
            window.location.href = '/login'
            return Promise.reject(error)
        }

        // Handle 403 Forbidden
        if (error.response?.status === 403) {
            window.location.href = '/unauthorized'
            return Promise.reject(error)
        }

        // Handle network errors
        if (!error.response) {
            error.message = 'Network error. Please check your connection.'
        }

        // Transform error response
        const transformedError = {
            message: error.response?.data?.message || error.message || 'An unexpected error occurred',
            status: error.response?.status,
            code: error.response?.data?.code,
            details: error.response?.data?.details || {},
            timestamp: new Date().toISOString()
        }

        return Promise.reject(transformedError)
    }
)

// Generate unique request ID
const generateRequestId = () => {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Helper functions for common request patterns

// GET with query parameters
const get = (url, params = {}) => {
    return api.get(url, { params })
}

// POST with data
const post = (url, data = {}) => {
    return api.post(url, data)
}

// PUT with data
const put = (url, data = {}) => {
    return api.put(url, data)
}

// PATCH with data
const patch = (url, data = {}) => {
    return api.patch(url, data)
}

// DELETE request
const deleteRequest = (url) => {
    return api.delete(url)
}

// File upload with progress tracking
const upload = (url, formData, onProgress = null) => {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }

    if (onProgress) {
        config.onUploadProgress = (progressEvent) => {
            const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
            )
            onProgress(percentCompleted)
        }
    }

    return api.post(url, formData, config)
}

// File download
const download = async (url, filename) => {
    try {
        const response = await api.get(url, {
            responseType: 'blob'
        })

        // Create blob URL and trigger download
        const blob = new Blob([response.data])
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = filename || 'download'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)

        return response
    } catch (error) {
        console.error('Download failed:', error)
        throw error
    }
}

// Paginated GET request
const getPaginated = async (url, params = {}) => {
    const response = await api.get(url, { params })

    return {
        data: response.data.content || response.data.data || response.data,
        pagination: {
            page: response.data.number || params.page || 0,
            size: response.data.size || params.size || 20,
            totalElements: response.data.totalElements || 0,
            totalPages: response.data.totalPages || 0,
            hasNext: !response.data.last,
            hasPrevious: !response.data.first
        }
    }
}

// Batch request helper
const batch = async (requests) => {
    try {
        const responses = await Promise.allSettled(requests)

        return responses.map((result, index) => ({
            index,
            success: result.status === 'fulfilled',
            data: result.status === 'fulfilled' ? result.value.data : null,
            error: result.status === 'rejected' ? result.reason : null
        }))
    } catch (error) {
        console.error('Batch request failed:', error)
        throw error
    }
}

// Health check
const healthCheck = async () => {
    try {
        const response = await api.get('/health')
        return {
            healthy: response.status === 200,
            status: response.data?.status || 'unknown',
            timestamp: response.data?.timestamp || new Date().toISOString()
        }
    } catch (error) {
        return {
            healthy: false,
            status: 'error',
            error: error.message,
            timestamp: new Date().toISOString()
        }
    }
}

// Export individual methods and instance
export {
    get,
    post,
    put,
    patch,
    deleteRequest as delete,
    upload,
    download,
    getPaginated,
    batch,
    healthCheck
}

export default api