// General utility functions for the permit management system

// Debounce function for search inputs
export const debounce = (func, wait) => {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

// Throttle function for frequent events
export const throttle = (func, limit) => {
    let inThrottle
    return function() {
        const args = arguments
        const context = this
        if (!inThrottle) {
            func.apply(context, args)
            inThrottle = true
            setTimeout(() => inThrottle = false, limit)
        }
    }
}

// Generate unique ID
export const generateId = (prefix = 'id') => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Deep clone object
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime())
    if (obj instanceof Array) return obj.map(item => deepClone(item))
    if (typeof obj === 'object') {
        const copy = {}
        Object.keys(obj).forEach(key => {
            copy[key] = deepClone(obj[key])
        })
        return copy
    }
}

// Deep merge objects
export const deepMerge = (target, ...sources) => {
    if (!sources.length) return target
    const source = sources.shift()

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} })
                deepMerge(target[key], source[key])
            } else {
                Object.assign(target, { [key]: source[key] })
            }
        }
    }

    return deepMerge(target, ...sources)
}

// Check if value is object
const isObject = (item) => {
    return item && typeof item === 'object' && !Array.isArray(item)
}

// Get nested object value by path
export const getValueByPath = (obj, path, defaultValue = null) => {
    const keys = path.split('.')
    let current = obj

    for (const key of keys) {
        if (current && current[key] !== undefined) {
            current = current[key]
        } else {
            return defaultValue
        }
    }

    return current
}

// Set nested object value by path
export const setValueByPath = (obj, path, value) => {
    const keys = path.split('.')
    const lastKey = keys.pop()
    let current = obj

    for (const key of keys) {
        if (!current[key] || typeof current[key] !== 'object') {
            current[key] = {}
        }
        current = current[key]
    }

    current[lastKey] = value
    return obj
}

// Remove empty values from object
export const removeEmptyValues = (obj) => {
    const cleaned = {}

    Object.keys(obj).forEach(key => {
        const value = obj[key]

        if (value === null || value === undefined || value === '') {
            return // Skip empty values
        }

        if (Array.isArray(value)) {
            if (value.length > 0) {
                cleaned[key] = value
            }
        } else if (typeof value === 'object') {
            const cleanedNested = removeEmptyValues(value)
            if (Object.keys(cleanedNested).length > 0) {
                cleaned[key] = cleanedNested
            }
        } else {
            cleaned[key] = value
        }
    })

    return cleaned
}

// Capitalize first letter
export const capitalize = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Convert camelCase to Title Case
export const camelToTitle = (str) => {
    if (!str) return ''
    return str
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim()
}

// Convert snake_case to Title Case
export const snakeToTitle = (str) => {
    if (!str) return ''
    return str
        .split('_')
        .map(word => capitalize(word))
        .join(' ')
}

// Format file size
export const formatFileSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// Download file from blob
export const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
}

// Copy text to clipboard
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        try {
            document.execCommand('copy')
            return true
        } catch (fallbackErr) {
            return false
        } finally {
            document.body.removeChild(textArea)
        }
    }
}

// Check if element is in viewport
export const isInViewport = (element) => {
    const rect = element.getBoundingClientRect()
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
}

// Smooth scroll to element
export const scrollToElement = (element, offset = 0) => {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    const targetPosition = elementPosition - offset

    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    })
}

// Generate permit number
export const generatePermitNumber = (permitType, year = new Date().getFullYear()) => {
    const prefix = permitType === 'building' ? 'BP' : 'GP'
    const timestamp = Date.now().toString().slice(-6)
    return `${prefix}-${year}-${timestamp}`
}

// Calculate permit expiration date
export const calculateExpirationDate = (approvalDate, permitType) => {
    const approval = new Date(approvalDate)
    const expiration = new Date(approval)

    // Default expiration periods (in months)
    const expirationPeriods = {
        building: 12,
        gas: 6,
        electrical: 6,
        plumbing: 6,
        mechanical: 6
    }

    const months = expirationPeriods[permitType] || 12
    expiration.setMonth(expiration.getMonth() + months)

    return expiration
}

// Check if permit is expired
export const isPermitExpired = (expirationDate) => {
    if (!expirationDate) return false
    return new Date() > new Date(expirationDate)
}

// Get days until expiration
export const getDaysUntilExpiration = (expirationDate) => {
    if (!expirationDate) return null

    const now = new Date()
    const expiration = new Date(expirationDate)
    const diffTime = expiration - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
}

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
    if (amount === null || amount === undefined) return 'N/A'

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount)
}

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
    if (value === null || value === undefined) return 'N/A'

    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value / 100)
}

// Truncate text
export const truncateText = (text, maxLength, suffix = '...') => {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength - suffix.length) + suffix
}

// Parse query string
export const parseQueryString = (queryString) => {
    const params = new URLSearchParams(queryString)
    const result = {}

    for (const [key, value] of params.entries()) {
        result[key] = value
    }

    return result
}

// Build query string
export const buildQueryString = (params) => {
    const cleanParams = removeEmptyValues(params)
    return new URLSearchParams(cleanParams).toString()
}

// Validate browser support
export const checkBrowserSupport = () => {
    const support = {
        localStorage: typeof Storage !== 'undefined',
        fileAPI: typeof File !== 'undefined' && typeof FileReader !== 'undefined',
        geolocation: 'geolocation' in navigator,
        notifications: 'Notification' in window,
        serviceWorker: 'serviceWorker' in navigator,
        webWorkers: typeof Worker !== 'undefined'
    }

    return support
}

// Get device info
export const getDeviceInfo = () => {
    const userAgent = navigator.userAgent

    return {
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
        isTablet: /iPad|Android(?!.*Mobile)/i.test(userAgent),
        isDesktop: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
        browser: getBrowserName(),
        os: getOperatingSystem(),
        screen: {
            width: window.screen.width,
            height: window.screen.height,
            availWidth: window.screen.availWidth,
            availHeight: window.screen.availHeight
        }
    }
}

// Get browser name
const getBrowserName = () => {
    const userAgent = navigator.userAgent

    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    if (userAgent.includes('Opera')) return 'Opera'

    return 'Unknown'
}

// Get operating system
const getOperatingSystem = () => {
    const userAgent = navigator.userAgent

    if (userAgent.includes('Windows')) return 'Windows'
    if (userAgent.includes('Mac')) return 'macOS'
    if (userAgent.includes('Linux')) return 'Linux'
    if (userAgent.includes('Android')) return 'Android'
    if (userAgent.includes('iOS')) return 'iOS'

    return 'Unknown'
}

// Retry async operation
export const retryAsync = async (fn, maxRetries = 3, delay = 1000) => {
    let lastError

    for (let i = 0; i <= maxRetries; i++) {
        try {
            return await fn()
        } catch (error) {
            lastError = error

            if (i < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
            }
        }
    }

    throw lastError
}

// Wait for element to exist
export const waitForElement = (selector, timeout = 5000) => {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector)

        if (element) {
            resolve(element)
            return
        }

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector)
            if (element) {
                observer.disconnect()
                resolve(element)
            }
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true
        })

        setTimeout(() => {
            observer.disconnect()
            reject(new Error(`Element ${selector} not found within ${timeout}ms`))
        }, timeout)
    })
}

// Format relative time
export const getRelativeTime = (date) => {
    const now = new Date()
    const target = new Date(date)
    const diffInSeconds = Math.floor((now - target) / 1000)

    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 }
    ]

    for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds)
        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`
        }
    }

    return 'Just now'
}

// Convert file to base64
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            const base64 = reader.result.split(',')[1]
            resolve(base64)
        }
        reader.onerror = error => reject(error)
    })
}

// Validate file type
export const validateFileType = (file, allowedTypes) => {
    if (!file || !allowedTypes) return false

    const fileExtension = file.name.toLowerCase().split('.').pop()
    const mimeType = file.type.toLowerCase()

    return allowedTypes.some(type =>
                                 type.toLowerCase() === fileExtension ||
                                 type.toLowerCase() === mimeType ||
                                 (type.includes('/') && mimeType.startsWith(type.split('/')[0]))
    )
}

// Format permit status for display
export const formatPermitStatus = (status) => {
    const statusMap = {
        draft: 'Draft',
        submitted: 'Submitted',
        under_review: 'Under Review',
        approved: 'Approved',
        rejected: 'Rejected',
        expired: 'Expired',
        cancelled: 'Cancelled'
    }

    return statusMap[status] || capitalize(status)
}

// Get status color
export const getStatusColor = (status) => {
    const colorMap = {
        draft: 'gray',
        submitted: 'blue',
        under_review: 'amber',
        approved: 'green',
        rejected: 'red',
        expired: 'gray',
        cancelled: 'gray'
    }

    return colorMap[status] || 'gray'
}

// Calculate permit fee based on project cost
export const calculatePermitFee = (projectCost, permitType = 'building') => {
    if (!projectCost || projectCost <= 0) return 0

    // Basic fee calculation logic (would be more complex in reality)
    const baseFees = {
        building: 100,
        gas: 75,
        electrical: 50,
        plumbing: 50,
        mechanical: 50
    }

    const baseFee = baseFees[permitType] || 100
    const percentageFee = projectCost * 0.005 // 0.5% of project cost

    return Math.max(baseFee, percentageFee)
}

// Sort array by multiple criteria
export const multiSort = (array, sortCriteria) => {
    return array.sort((a, b) => {
        for (const { key, direction = 'asc' } of sortCriteria) {
            const aVal = getValueByPath(a, key)
            const bVal = getValueByPath(b, key)

            let comparison = 0

            if (aVal > bVal) comparison = 1
            if (aVal < bVal) comparison = -1

            if (comparison !== 0) {
                return direction === 'desc' ? comparison * -1 : comparison
            }
        }
        return 0
    })
}

// Group array by property
export const groupBy = (array, keyFn) => {
    return array.reduce((groups, item) => {
        const key = typeof keyFn === 'function' ? keyFn(item) : item[keyFn]
        const group = groups[key] || []
        group.push(item)
        groups[key] = group
        return groups
    }, {})
}

// Filter array with multiple criteria
export const multiFilter = (array, filters) => {
    return array.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
            if (!value) return true // Skip empty filters

            const itemValue = getValueByPath(item, key)

            if (Array.isArray(value)) {
                return value.includes(itemValue)
            }

            if (typeof value === 'string') {
                return itemValue?.toString().toLowerCase().includes(value.toLowerCase())
            }

            return itemValue === value
        })
    })
}

// Generate color from string (for avatars, etc.)
export const stringToColor = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }

    const hue = hash % 360
    return `hsl(${hue}, 70%, 50%)`
}

// Get initials from name
export const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0)?.toUpperCase() || ''
    const last = lastName?.charAt(0)?.toUpperCase() || ''
    return first + last
}

// Check if user is online
export const isOnline = () => {
    return navigator.onLine
}

// Add event listener for online/offline
export const onConnectionChange = (callback) => {
    const handleOnline = () => callback(true)
    const handleOffline = () => callback(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
    }
}

// Local storage with expiry
export const setWithExpiry = (key, value, ttl) => {
    const now = new Date()
    const item = {
        value: value,
        expiry: now.getTime() + ttl
    }
    localStorage.setItem(key, JSON.stringify(item))
}

export const getWithExpiry = (key) => {
    const itemStr = localStorage.getItem(key)

    if (!itemStr) return null

    try {
        const item = JSON.parse(itemStr)
        const now = new Date()

        if (now.getTime() > item.expiry) {
            localStorage.removeItem(key)
            return null
        }

        return item.value
    } catch {
        localStorage.removeItem(key)
        return null
    }
}

// Simple hash function
export const simpleHash = (str) => {
    let hash = 0
    if (str.length === 0) return hash

    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32-bit integer
    }

    return Math.abs(hash)
}

// Flatten nested object
export const flattenObject = (obj, prefix = '', separator = '.') => {
    const flattened = {}

    Object.keys(obj).forEach(key => {
        const value = obj[key]
        const newKey = prefix ? `${prefix}${separator}${key}` : key

        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(flattened, flattenObject(value, newKey, separator))
        } else {
            flattened[newKey] = value
        }
    })

    return flattened
}

// Unflatten object
export const unflattenObject = (obj, separator = '.') => {
    const result = {}

    Object.keys(obj).forEach(key => {
        setValueByPath(result, key.replace(new RegExp(separator, 'g'), '.'), obj[key])
    })

    return result
}

// Check if arrays are equal
export const arraysEqual = (a, b) => {
    if (a === b) return true
    if (a == null || b == null) return false
    if (a.length !== b.length) return false

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false
    }

    return true
}

// Check if objects are equal (shallow)
export const objectsEqual = (obj1, obj2) => {
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)

    if (keys1.length !== keys2.length) return false

    for (const key of keys1) {
        if (obj1[key] !== obj2[key]) return false
    }

    return true
}

// Sleep/delay function
export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export default {
    debounce,
    throttle,
    generateId,
    deepClone,
    deepMerge,
    getValueByPath,
    setValueByPath,
    removeEmptyValues,
    capitalize,
    camelToTitle,
    snakeToTitle,
    formatFileSize,
    downloadBlob,
    copyToClipboard,
    isInViewport,
    scrollToElement,
    generatePermitNumber,
    calculateExpirationDate,
    isPermitExpired,
    getDaysUntilExpiration,
    formatCurrency,
    formatPercentage,
    truncateText,
    parseQueryString,
    buildQueryString,
    checkBrowserSupport,
    getDeviceInfo,
    retryAsync,
    waitForElement,
    getRelativeTime,
    fileToBase64,
    validateFileType,
    formatPermitStatus,
    getStatusColor,
    calculatePermitFee,
    multiSort,
    groupBy,
    multiFilter,
    stringToColor,
    getInitials,
    isOnline,
    onConnectionChange,
    setWithExpiry,
    getWithExpiry,
    simpleHash,
    flattenObject,
    unflattenObject,
    arraysEqual,
    objectsEqual,
    sleep
}