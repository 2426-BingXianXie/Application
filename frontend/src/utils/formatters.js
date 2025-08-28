// Date formatting utilities
export const formatDate = (date, format = 'short') => {
    if (!date) return 'N/A'

    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) return 'Invalid Date'

    const options = {
        short: {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        },
        long: {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        },
        time: {
            hour: '2-digit',
            minute: '2-digit'
        },
        datetime: {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }
    }

    return dateObj.toLocaleDateString('en-US', options[format] || options.short)
}

// Currency formatting
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
    if (amount === null || amount === undefined || isNaN(amount)) return 'N/A'

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount)
}

// Number formatting
export const formatNumber = (number, options = {}) => {
    if (number === null || number === undefined || isNaN(number)) return 'N/A'

    const defaultOptions = {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }

    return new Intl.NumberFormat('en-US', { ...defaultOptions, ...options }).format(number)
}

// Percentage formatting
export const formatPercentage = (value, decimals = 1) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A'

    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value / 100)
}

// Phone number formatting
export const formatPhone = (phone) => {
    if (!phone) return ''

    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '')

    // Format based on length
    if (cleaned.length <= 3) {
        return cleaned
    } else if (cleaned.length <= 6) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
    } else if (cleaned.length <= 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    } else {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)} ext. ${cleaned.slice(10)}`
    }
}

// File size formatting
export const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B'

    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    const index = Math.floor(Math.log(bytes) / Math.log(1024))
    const size = (bytes / Math.pow(1024, index)).toFixed(1)

    return `${size} ${units[index]}`
}

// Relative time formatting
export const formatRelativeTime = (date) => {
    if (!date) return 'N/A'

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
        const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds)
        if (count >= 1) {
            const timeAgo = diffInSeconds > 0 ? 'ago' : 'from now'
            return `${count} ${interval.label}${count > 1 ? 's' : ''} ${timeAgo}`
        }
    }

    return 'Just now'
}

// Duration formatting (minutes to human readable)
export const formatDuration = (minutes) => {
    if (!minutes || minutes === 0) return '0 minutes'

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours === 0) {
        return `${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`
    } else if (remainingMinutes === 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''}`
    } else {
        return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`
    }
}

// Address formatting
export const formatAddress = (address) => {
    if (!address) return 'N/A'

    const parts = []

    if (address.address1) parts.push(address.address1)
    if (address.address2) parts.push(address.address2)

    const cityStateZip = [address.city, address.state, address.zipCode]
        .filter(Boolean)
        .join(', ')

    if (cityStateZip) parts.push(cityStateZip)

    return parts.join(', ') || 'N/A'
}

// Permit number formatting
export const formatPermitNumber = (number, permitType) => {
    if (!number) return 'N/A'

    // If already formatted, return as-is
    if (typeof number === 'string' && number.includes('-')) {
        return number
    }

    // Generate formatted permit number
    const prefix = permitType === 'building' ? 'BP' : 'GP'
    const year = new Date().getFullYear()
    const paddedNumber = String(number).padStart(6, '0')

    return `${prefix}-${year}-${paddedNumber}`
}

// Status formatting
export const formatStatus = (status) => {
    if (!status) return 'Unknown'

    return status
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, l => l.toUpperCase())
}

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100, suffix = '...') => {
    if (!text || text.length <= maxLength) return text || ''

    return text.substring(0, maxLength - suffix.length) + suffix
}

// Title case formatting
export const toTitleCase = (str) => {
    if (!str) return ''

    return str
        .toLowerCase()
        .replace(/(?:^|\s)\w/g, (match) => match.toUpperCase())
        .replace(/\b(?:a|an|and|at|by|for|in|of|on|or|the|to|up|but|nor|yet|so)\b/gi, (match) => match.toLowerCase())
        .replace(/^./, (match) => match.toUpperCase())
}

// Camel case to readable format
export const camelToReadable = (str) => {
    if (!str) return ''

    return str
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim()
}

// Snake case to readable format
export const snakeToReadable = (str) => {
    if (!str) return ''

    return str
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
}

// Format coordinates
export const formatCoordinates = (lat, lng, precision = 4) => {
    if (!lat || !lng) return 'N/A'

    const latitude = parseFloat(lat).toFixed(precision)
    const longitude = parseFloat(lng).toFixed(precision)

    return `${latitude}, ${longitude}`
}

// Format boolean as Yes/No
export const formatBoolean = (value) => {
    if (value === null || value === undefined) return 'N/A'
    return value ? 'Yes' : 'No'
}

// Format array as comma-separated list
export const formatArray = (array, conjunction = 'and') => {
    if (!array || !Array.isArray(array) || array.length === 0) return 'None'

    if (array.length === 1) return array[0]
    if (array.length === 2) return `${array[0]} ${conjunction} ${array[1]}`

    return `${array.slice(0, -1).join(', ')}, ${conjunction} ${array[array.length - 1]}`
}

// Format permit timeline
export const formatPermitTimeline = (permit) => {
    const timeline = []

    if (permit.submissionDate) {
        timeline.push({
                          date: permit.submissionDate,
                          status: 'submitted',
                          label: 'Application Submitted'
                      })
    }

    if (permit.approvalDate) {
        timeline.push({
                          date: permit.approvalDate,
                          status: permit.status === 'APPROVED' ? 'approved' : 'rejected',
                          label: permit.status === 'APPROVED' ? 'Permit Approved' : 'Permit Rejected'
                      })
    }

    if (permit.expirationDate && permit.status === 'APPROVED') {
        timeline.push({
                          date: permit.expirationDate,
                          status: 'expires',
                          label: 'Permit Expires'
                      })
    }

    return timeline.sort((a, b) => new Date(a.date) - new Date(b.date))
}

// Format validation errors for display
export const formatValidationErrors = (errors) => {
    if (!errors || typeof errors !== 'object') return []

    return Object.entries(errors).map(([field, message]) => ({
        field: camelToReadable(field),
        message: Array.isArray(message) ? message.join(', ') : message
    }))
}

export default {
    formatDate,
    formatCurrency,
    formatNumber,
    formatPercentage,
    formatPhone,
    formatFileSize,
    formatRelativeTime,
    formatDuration,
    formatAddress,
    formatPermitNumber,
    formatStatus,
    truncateText,
    toTitleCase,
    camelToReadable,
    snakeToReadable,
    formatCoordinates,
    formatBoolean,
    formatArray,
    formatPermitTimeline,
    formatValidationErrors
}