import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000

// Create axios instance
export const apiClient = axios.create({
                                          baseURL: API_BASE_URL,
                                          timeout: API_TIMEOUT,
                                          headers: {
                                              'Content-Type': 'application/json',
                                          },
                                      })

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // Log request in development
        if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
            console.log('🚀 API Request:', {
                method: config.method?.toUpperCase(),
                url: config.url,
                data: config.data,
            })
        }

        return config
    },
    (error) => {
        console.error('❌ Request Error:', error)
        return Promise.reject(error)
    }
)

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        // Log response in development
        if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
            console.log('API Response:', {
                status: response.status,
                url: response.config.url,
                data: response.data,
            })
        }

        return response
    },
    (error) => {
        console.error('API Error:', error)

        // Handle specific error cases
        if (error.response) {
            const { status, data } = error.response

            switch (status) {
                case 400:
                    toast.error(data.message || 'Invalid request data')
                    break
                case 401:
                    toast.error('Authentication required')
                    // Redirect to login or refresh token
                    localStorage.removeItem('auth_token')
                    window.location.href = '/login'
                    break
                case 403:
                    toast.error('Access denied')
                    break
                case 404:
                    toast.error(data.message || 'Resource not found')
                    break
                case 409:
                    toast.error(data.message || 'Conflict occurred')
                    break
                case 422:
                    // Validation errors
                    if (data.fieldErrors) {
                        Object.values(data.fieldErrors).forEach(error => {
                            toast.error(error)
                        })
                    } else {
                        toast.error(data.message || 'Validation failed')
                    }
                    break
                case 500:
                    toast.error('Server error occurred. Please try again later.')
                    break
                default:
                    toast.error(`Error ${status}: ${data.message || 'Something went wrong'}`)
            }
        } else if (error.request) {
            // Network error
            toast.error('Network error. Please check your connection.')
        } else {
            toast.error('An unexpected error occurred')
        }

        return Promise.reject(error)
    }
)

// API utility functions
export const api = {
    // Generic CRUD operations
    get: (url, config = {}) => apiClient.get(url, config),
    post: (url, data, config = {}) => apiClient.post(url, data, config),
    put: (url, data, config = {}) => apiClient.put(url, data, config),
    patch: (url, data, config = {}) => apiClient.patch(url, data, config),
    delete: (url, config = {}) => apiClient.delete(url, config),

    // File upload with progress
    upload: (url, formData, onProgress) => {
        return apiClient.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    onProgress(progress)
                }
            },
        })
    },

    // Download file
    download: (url, filename) => {
        return apiClient.get(url, {
            responseType: 'blob',
        }).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        })
    },
}

export default apiClient