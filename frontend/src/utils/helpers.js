/**
 * General utility helper functions
 * Common functionality used throughout the application
 */

// Delay/sleep function
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Debounce function
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

// Throttle function
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

// Deep clone object
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime())
    if (obj instanceof Array) return obj.map(item => deepClone(item))
    if (typeof obj === 'object') {
        const clonedObj = {}
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key])
            }
        }
        return clonedObj
    }
}

// Check if object is empty
export const isEmpty = (obj) => {
    if (obj == null) return true
    if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0
    if (typeof obj === 'object') return Object.keys(obj).length === 0
    return false
}

// Generate unique ID
export const generateId = (prefix = '') => {
    const timestamp = Date.now().toString(36)
    const randomStr = Math.random().toString(36).substr(2, 9)
    return `${prefix}${timestamp}-${randomStr}`
}

// Capitalize first letter
export const capitalize = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Title case conversion
export const toTitleCase = (str) => {
    if (!str) return ''
    return str.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
}

// Truncate text
export const truncate = (str, length = 100, suffix = '...') => {
    if (!str || str.length <= length) return str
    return str.substring(0, length).trim() + suffix
}

// Remove HTML tags
export const stripHtml = (html) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
}

// Format phone number
export const formatPhoneNumber = (phone) => {
    if (!phone) return ''
    const cleaned = phone.replace(/\D/g, '')

    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    }

    if (cleaned.length === 11 && cleaned[0] === '1') {
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
    }

    return phone
}

// Format currency
export const formatCurrency = (amount, currency = 'USD', options = {}) => {
    if (amount == null || isNaN(amount)) return '$0.00'

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        ...options
    }).format(amount)
}

// Format number with commas
export const formatNumber = (num, decimals = 0) => {
    if (num == null || isNaN(num)) return '0'

    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(num)
}

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
    if (value == null || isNaN(value)) return '0%'
    return `${(value * 100).toFixed(decimals)}%`
}

// Parse URL parameters
export const parseUrlParams = (url = window.location.search) => {
    const params = new URLSearchParams(url)
    const result = {}

    for (const [key, value] of params.entries()) {
        result[key] = value
    }

    return result
}

// Build URL with parameters
export const buildUrl = (baseUrl, params = {}) => {
    const url = new URL(baseUrl, window.location.origin)

    Object.entries(params).forEach(([key, value]) => {
        if (value != null && value !== '') {
            url.searchParams.set(key, value)
        }
    })

    return url.toString()
}

// Download file from blob
export const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
}

// Copy text to clipboard
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        try {
            document.execCommand('copy')
            return true
        } catch (err) {
            console.error('Failed to copy text: ', err)
            return false
        } finally {
            document.body.removeChild(textArea)
        }
    }
}

// Check if user is on mobile device
export const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// Check if user is on iOS
export const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

// Get browser name
export const getBrowserName = () => {
    const userAgent = navigator.userAgent

    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    if (userAgent.includes('Opera')) return 'Opera'

    return 'Unknown'
}

// Scroll to element
export const scrollToElement = (elementId, behavior = 'smooth') => {
    const element = document.getElementById(elementId)
    if (element) {
        element.scrollIntoView({ behavior, block: 'start' })
    }
}

// Get element position
export const getElementPosition = (element) => {
    const rect = element.getBoundingClientRect()
    return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset,
        bottom: rect.bottom + window.pageYOffset,
        right: rect.right + window.pageXOffset,
        width: rect.width,
        height: rect.height
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

// Random array element
export const getRandomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

// Shuffle array
export const shuffleArray = (array) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
}

// Group array by property
export const groupBy = (array, key) => {
    return array.reduce((groups, item) => {
        const group = item[key]
        groups[group] = groups[group] || []
        groups[group].push(item)
        return groups
    }, {})
}

// Sort array by multiple properties
export const sortBy = (array, ...properties) => {
    return array.sort((a, b) => {
        for (const property of properties) {
            let aValue = a[property]
            let bValue = b[property]

            if (typeof aValue === 'string') aValue = aValue.toLowerCase()
            if (typeof bValue === 'string') bValue = bValue.toLowerCase()

            if (aValue < bValue) return -1
            if (aValue > bValue) return 1
        }
        return 0
    })
}

// Remove duplicates from array
export const uniqueBy = (array, key) => {
    const seen = new Set()
    return array.filter(item => {
        const value = item[key]
        if (seen.has(value)) {
            return false
        }
        seen.add(value)
        return true
    })
}

// Chunk array into smaller arrays
export const chunk = (array, size) => {
    const chunks = []
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size))
    }
    return chunks
}

// Retry function with exponential backoff
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn()
        } catch (error) {
            if (attempt === maxRetries) throw error

            const delay = baseDelay * Math.pow(2, attempt)
            await sleep(delay)
        }
    }
}

// Load script dynamically
export const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve()
            return
        }

        const script = document.createElement('script')
        script.src = src
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
    })
}

// Local storage helpers with error handling
export const safeLocalStorage = {
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : defaultValue
        } catch (error) {
            console.error('Error reading from localStorage:', error)
            return defaultValue
        }
    },

    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value))
            return true
        } catch (error) {
            console.error('Error writing to localStorage:', error)
            return false
        }
    },

    remove: (key) => {
        try {
            localStorage.removeItem(key)
            return true
        } catch (error) {
            console.error('Error removing from localStorage:', error)
            return false
        }
    },

    clear: () => {
        try {
            localStorage.clear()
            return true
        } catch (error) {
            console.error('Error clearing localStorage:', error)
            return false
        }
    }
}

// Session storage helpers
export const safeSessionStorage = {
    get: (key, defaultValue = null) => {
        try {
            const item = sessionStorage.getItem(key)
            return item ? JSON.parse(item) : defaultValue
        } catch (error) {
            console.error('Error reading from sessionStorage:', error)
            return defaultValue
        }
    },

    set: (key, value) => {
        try {
            sessionStorage.setItem(key, JSON.stringify(value))
            return true
        } catch (error) {
            console.error('Error writing to sessionStorage:', error)
            return false
        }
    },

    remove: (key) => {
        try {
            sessionStorage.removeItem(key)
            return true
        } catch (error) {
            console.error('Error removing from sessionStorage:', error)
            return false
        }
    }
}

// Environment helpers
export const isDevelopment = () => import.meta.env.VITE_APP_ENVIRONMENT === 'development'
export const isProduction = () => import.meta.env.VITE_APP_ENVIRONMENT === 'production'
export const isDebugMode = () => import.meta.env.VITE_ENABLE_DEBUG === 'true'

// Log helper that only logs in development
export const devLog = (...args) => {
    if (isDevelopment()) {
        console.log(...args)
    }
}

// Error helper
export const devError = (...args) => {
    if (isDevelopment()) {
        console.error(...args)
    }
}

// Warning helper
export const devWarn = (...args) => {
    if (isDevelopment()) {
        console.warn(...args)
    }
}

// Create CSS classes string
export const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ')
}

// Conditional class names (similar to clsx)
export const cn = (...inputs) => {
    const classes = []

    for (const input of inputs) {
        if (!input) continue

        if (typeof input === 'string') {
            classes.push(input)
        } else if (typeof input === 'object') {
            for (const [key, value] of Object.entries(input)) {
                if (value) classes.push(key)
            }
        }
    }

    return classes.join(' ')
}

// Convert camelCase to kebab-case
export const camelToKebab = (str) => {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
}

// Convert kebab-case to camelCase
export const kebabToCamel = (str) => {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}

// Convert snake_case to camelCase
export const snakeToCamel = (str) => {
    return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
}

// Object key transformation
export const transformKeys = (obj, transformFn) => {
    if (Array.isArray(obj)) {
        return obj.map(item => transformKeys(item, transformFn))
    }

    if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((result, key) => {
            const transformedKey = transformFn(key)
            result[transformedKey] = transformKeys(obj[key], transformFn)
            return result
        }, {})
    }

    return obj
}

// Flatten nested object
export const flattenObject = (obj, prefix = '') => {
    const flattened = {}

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const newKey = prefix ? `${prefix}.${key}` : key

            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                Object.assign(flattened, flattenObject(obj[key], newKey))
            } else {
                flattened[newKey] = obj[key]
            }
        }
    }

    return flattened
}

// Pick specific properties from object
export const pick = (obj, keys) => {
    const result = {}
    for (const key of keys) {
        if (key in obj) {
            result[key] = obj[key]
        }
    }
    return result
}

// Omit specific properties from object
export const omit = (obj, keys) => {
    const result = { ...obj }
    for (const key of keys) {
        delete result[key]
    }
    return result
}

// Check if value exists in nested object
export const hasNestedProperty = (obj, path) => {
    const keys = path.split('.')
    let current = obj

    for (const key of keys) {
        if (current == null || !(key in current)) {
            return false
        }
        current = current[key]
    }

    return true
}

// Get nested property value
export const getNestedProperty = (obj, path, defaultValue = undefined) => {
    const keys = path.split('.')
    let current = obj

    for (const key of keys) {
        if (current == null || !(key in current)) {
            return defaultValue
        }
        current = current[key]
    }

    return current
}

// Set nested property value
export const setNestedProperty = (obj, path, value) => {
    const keys = path.split('.')
    const lastKey = keys.pop()
    let current = obj

    for (const key of keys) {
        if (!(key in current) || typeof current[key] !== 'object') {
            current[key] = {}
        }
        current = current[key]
    }

    current[lastKey] = value
    return obj
}

// Merge objects deeply
export const mergeDeep = (target, ...sources) => {
    if (!sources.length) return target
    const source = sources.shift()

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} })
                mergeDeep(target[key], source[key])
            } else {
                Object.assign(target, { [key]: source[key] })
            }
        }
    }

    return mergeDeep(target, ...sources)
}

// Helper function for mergeDeep
const isObject = (item) => {
    return item && typeof item === 'object' && !Array.isArray(item)
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

// Generate color from string (for avatars, etc.)
export const stringToColor = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }

    const hue = Math.abs(hash) % 360
    return `hsl(${hue}, 70%, 50%)`
}

// Get initials from name
export const getInitials = (name) => {
    if (!name) return '??'

    return name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('')
}

// Mask sensitive data
export const maskString = (str, visibleStart = 2, visibleEnd = 2, maskChar = '*') => {
    if (!str || str.length <= visibleStart + visibleEnd) return str

    const start = str.slice(0, visibleStart)
    const end = str.slice(-visibleEnd)
    const middle = maskChar.repeat(str.length - visibleStart - visibleEnd)

    return start + middle + end
}

// Validate JSON string
export const isValidJSON = (str) => {
    try {
        JSON.parse(str)
        return true
    } catch {
        return false
    }
}

// Safe JSON parse
export const safeJsonParse = (str, defaultValue = null) => {
    try {
        return JSON.parse(str)
    } catch {
        return defaultValue
    }
}

// Create query string from object
export const createQueryString = (params) => {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
        if (value != null && value !== '') {
            searchParams.append(key, value)
        }
    })

    return searchParams.toString()
}

export default {
    sleep,
    debounce,
    throttle,
    deepClone,
    isEmpty,
    generateId,
    capitalize,
    toTitleCase,
    truncate,
    stripHtml,
    formatPhoneNumber,
    formatCurrency,
    formatNumber,
    formatPercentage,
    parseUrlParams,
    buildUrl,
    downloadFile,
    copyToClipboard,
    isMobile,
    isIOS,
    getBrowserName,
    scrollToElement,
    getElementPosition,
    isInViewport,
    getRandomElement,
    shuffleArray,
    groupBy,
    sortBy,
    uniqueBy,
    chunk,
    retryWithBackoff,
    loadScript,
    safeLocalStorage,
    safeSessionStorage,
    isDevelopment,
    isProduction,
    isDebugMode,
    devLog,
    devError,
    devWarn,
    classNames,
    cn,
    camelToKebab,
    kebabToCamel,
    snakeToCamel,
    transformKeys,
    flattenObject,
    pick,
    omit,
    hasNestedProperty,
    getNestedProperty,
    setNestedProperty,
    mergeDeep,
    formatFileSize,
    stringToColor,
    getInitials,
    maskString,
    isValidJSON,
    safeJsonParse,
    createQueryString,
}