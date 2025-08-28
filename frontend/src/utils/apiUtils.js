// API utility functions for common request patterns and error handling

import { storageUtils } from './storageUtils'

// Build query string from object
export const buildQueryString = (params) => {
    const filtered = Object.entries(params)
        .filter(([_, value]) => value !== null && value !== undefined && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)

    return filtered.length > 0 ? `?${filtered.join('&')}` : ''
}

// Parse pagination response
export const parsePaginationResponse = (response) => {
    const data = response.data || response

    return {
        data: data.content || data.data || data,
        pagination: {
            page: data.number || data.page || 0,
            size: data.size || 20,
            totalElements: data.totalElements || data.total || 0,
            totalPages: data.totalPages || Math.ceil((data.totalElements || 0) / (data.size || 20)),
            hasNext: !data.last && data.totalPages > (data.number || 0) + 1,
            hasPrevious: !data.first && (data.number || 0) > 0,
            isFirst: data.first !== undefined ? data.first : (data.number || 0) === 0,
            isLast: data.last !== undefined ? data.last : (data.number || 0) === (data.totalPages || 1) - 1
        }
    }
}

// Create request headers with auth token
export const createAuthHeaders = (additionalHeaders = {}) => {
    const token = storageUtils.getToken()

    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...additionalHeaders
    }
}

// Create multipart headers for file upload
export const createMultipartHeaders = (additionalHeaders = {}) => {
    const token = storageUtils.getToken()

    return {
        // Don't set Content-Type for multipart - let browser set it with boundary
        ...(token && { Authorization: `Bearer ${token}` }),
        ...additionalHeaders
    }
}

// Retry request with exponential backoff
export const retryRequest = async (requestFn, options = {}) => {
    const {
        maxRetries = 3,
        baseDelay = 1000,
        maxDelay = 10000,
        retryCondition = () => true
    } = options

    let lastError

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await requestFn()
        } catch (error) {
            lastError = error

            // Don't retry if condition not met
            if (!retryCondition(error)) {
                throw error
            }

            // Don't retry on last attempt
            if (attempt === maxRetries) {
                break
            }

            // Calculate delay with exponential backoff
            const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay)
            await new Promise(resolve => setTimeout(resolve, delay))

            console.log(`Retrying request (attempt ${attempt + 1}/${maxRetries}) after ${delay}ms`)
        }
    }

    throw lastError
}

// Check if error is retryable
export const isRetryableError = (error) => {
    if (!error.response) return true // Network errors are retryable

    const { status } = error.response

    // Retry on server errors and rate limiting
    return status >= 500 || status === 429
}

// Transform API response for consistent format
export const transformApiResponse = (response) => {
    return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        success: response.status >= 200 && response.status < 300
    }
}

// Handle file download from API response
export const handleFileDownload = (response, filename) => {
    const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/octet-stream'
    })

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
}

// Validate file before upload
export const validateFile = (file, options = {}) => {
    const {
        maxSize = 10 * 1024 * 1024, // 10MB default
        allowedTypes = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
        allowedMimeTypes = []
    } = options

    const errors = []

    // Check file size
    if (file.size > maxSize) {
        errors.push(`File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)}MB`)
    }

    // Check file type by extension
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (allowedTypes.length > 0 && !allowedTypes.includes(extension)) {
        errors.push(`File type .${extension} is not allowed. Allowed types: ${allowedTypes.join(', ')}`)
    }

    // Check MIME type
    if (allowedMimeTypes.length > 0 && !allowedMimeTypes.includes(file.type)) {
        errors.push(`File MIME type ${file.type} is not allowed`)
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

// Create form data for file upload
export const createUploadFormData = (file, additionalData = {}) => {
    const formData = new FormData()

    formData.append('file', file)

    Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            formData.append(key, value)
        }
    })

    return formData
}

// Parse error response
export const parseErrorResponse = (error) => {
    if (error.response?.data) {
        const { data } = error.response

        return {
            message: data.message || 'Request failed',
            code: data.code || error.response.status,
            details: data.details || {},
            timestamp: data.timestamp || new Date().toISOString(),
            status: error.response.status
        }
    }

    return {
        message: error.message || 'Network error occurred',
        code: 'NETWORK_ERROR',
        details: {},
        timestamp: new Date().toISOString(),
        status: null
    }
}

// Cache management for API responses
const cache = new Map()

export const getCachedResponse = (key) => {
    const cached = cache.get(key)

    if (!cached) return null

    // Check if cache has expired (default 5 minutes)
    const isExpired = Date.now() - cached.timestamp > (cached.ttl || 5 * 60 * 1000)

    if (isExpired) {
        cache.delete(key)
        return null
    }

    return cached.data
}

export const setCachedResponse = (key, data, ttl = 5 * 60 * 1000) => {
    cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl
    })
}

export const clearCache = (pattern = null) => {
    if (pattern) {
        const regex = new RegExp(pattern)
        for (const key of cache.keys()) {
            if (regex.test(key)) {
                cache.delete(key)
            }
        }
    } else {
        cache.clear()
    }
}

// Create cache key for requests
export const createCacheKey = (url, params = {}) => {
    const sortedParams = Object.keys(params)
        .sort()
        .reduce((result, key) => {
            result[key] = params[key]
            return result
        }, {})

    return `${url}:${JSON.stringify(sortedParams)}`
}

// Batch API requests
export const batchRequests = async (requests, options = {}) => {
    const {
        concurrency = 5,
        continueOnError = true
    } = options

    const results = []

    for (let i = 0; i < requests.length; i += concurrency) {
        const batch = requests.slice(i, i + concurrency)

        try {
            const batchResults = await Promise.allSettled(
                batch.map(request => request())
            )

            results.push(...batchResults.map((result, index) => ({
                index: i + index,
                success: result.status === 'fulfilled',
                data: result.status === 'fulfilled' ? result.value : null,
                error: result.status === 'rejected' ? result.reason : null
            })))

        } catch (error) {
            if (!continueOnError) {
                throw error
            }

            // Add error results for this batch
            batch.forEach((_, index) => {
                results.push({
                                 index: i + index,
                                 success: false,
                                 data: null,
                                 error
                             })
            })
        }
    }

    return results
}

// URL helpers
export const joinUrl = (base, ...parts) => {
    return [base, ...parts]
        .map(part => part.toString().replace(/^\/+|\/+$/g, ''))
        .filter(Boolean)
        .join('/')
}

export const addQueryParams = (url, params) => {
    const queryString = buildQueryString(params)
    return queryString ? `${url}${queryString}` : url
}

// Request timeout wrapper
export const withTimeout = (promise, timeoutMs = 30000) => {
    return Promise.race([
                            promise,
                            new Promise((_, reject) =>
                                            setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
                            )
                        ])
}

export default {
    buildQueryString,
    parsePaginationResponse,
    createAuthHeaders,
    createMultipartHeaders,
    retryRequest,
    isRetryableError,
    transformApiResponse,
    handleFileDownload,
    validateFile,
    createUploadFormData,
    parseErrorResponse,
    getCachedResponse,
    setCachedResponse,
    clearCache,
    createCacheKey,
    batchRequests,
    joinUrl,
    addQueryParams,
    withTimeout
}