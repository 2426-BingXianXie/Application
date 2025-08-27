// formatters.js - Enhanced formatting utilities
import { format, parseISO, formatDistanceToNow, isValid } from 'date-fns'

// Currency formatting
export const formatCurrency = (amount, currency = 'USD', options = {}) => {
    const { minimumFractionDigits = 2, maximumFractionDigits = 2 } = options

    if (amount === null || amount === undefined || amount === '') {
        return ''
    }

    // Handle string inputs by removing non-numeric characters except decimal point
    let numericAmount = amount
    if (typeof amount === 'string') {
        numericAmount = parseFloat(amount.replace(/[^0-9.-]/g, ''))
    }

    if (isNaN(numericAmount)) {
        return ''
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits,
        maximumFractionDigits
    }).format(numericAmount)
}

// Parse currency string to number
export const parseCurrency = (currencyString) => {
    if (typeof currencyString === 'number') return currencyString
    if (!currencyString) return 0

    const cleaned = currencyString.toString().replace(/[^0-9.-]/g, '')
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? 0 : parsed
}

// Format currency input (for controlled inputs)
export const formatCurrencyInput = (value) => {
    if (!value) return ''

    // Remove all non-digit characters except decimal point
    const cleaned = value.replace(/[^\d.]/g, '')

    // Handle multiple decimal points
    const parts = cleaned.split('.')
    if (parts.length > 2) {
        return parts[0] + '.' + parts.slice(1).join('')
    }

    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
        return parts[0] + '.' + parts[1].substring(0, 2)
    }

    const number = parseFloat(cleaned)
    if (isNaN(number)) return ''

    // Format with commas but preserve decimal input
    const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(number)

    return '$' + formatted
}

// Date formatting
export const formatDate = (date, formatString = 'MM/dd/yyyy') => {
    if (!date) return ''

    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date

        if (!isValid(dateObj)) {
            return 'Invalid date'
        }

        return format(dateObj, formatString)
    } catch (error) {
        console.error('Date formatting error:', error)
        return 'Invalid date'
    }
}

// Relative time formatting
export const formatRelativeTime = (date) => {
    if (!date) return ''

    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date

        if (!isValid(dateObj)) {
            return 'Invalid date'
        }

        return formatDistanceToNow(dateObj, { addSuffix: true })
    } catch (error) {
        console.error('Relative time formatting error:', error)
        return 'Invalid date'
    }
}

// Phone number formatting
export const formatPhoneDisplay = (phone) => {
    if (!phone) return ''

    const digits = phone.replace(/\D/g, '')

    if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
    }

    if (digits.length === 11 && digits[0] === '1') {
        return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
    }

    return phone
}

// Address formatting
export const formatAddress = (addressObj) => {
    if (!addressObj) return ''

    const parts = [
        addressObj.address1,
        addressObj.address2,
        addressObj.city,
        addressObj.state && addressObj.zipCode ? `${addressObj.state} ${addressObj.zipCode}` : addressObj.state || addressObj.zipCode
    ].filter(Boolean)

    return parts.join(', ')
}

// Full name formatting
export const formatFullName = (firstName, lastName, options = {}) => {
    const { includeMiddle = false, middle = '', lastFirst = false } = options

    if (!firstName && !lastName) return ''

    const first = firstName || ''
    const last = lastName || ''
    const mid = includeMiddle && middle ? ` ${middle}` : ''

    if (lastFirst) {
        return `${last}, ${first}${mid}`.trim()
    }

    return `${first}${mid} ${last}`.trim()
}

// File size formatting
export const formatFileSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// Number formatting with commas
export const formatNumber = (number, options = {}) => {
    const { minimumFractionDigits = 0, maximumFractionDigits = 2 } = options

    if (number === null || number === undefined || isNaN(number)) {
        return ''
    }

    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits,
        maximumFractionDigits
    }).format(number)
}

// Percentage formatting
export const formatPercentage = (value, decimals = 1) => {
    if (value === null || value === undefined || isNaN(value)) {
        return ''
    }

    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value / 100)
}

// Permit number formatting
export const formatPermitNumber = (permitType, id) => {
    const prefix = permitType === 'BUILDING' ? 'BP' : 'GP'
    return `${prefix}${String(id).padStart(6, '0')}`
}

// Status formatting with colors
export const formatStatus = (status, options = {}) => {
    const { includeIcon = false, colorClass = false } = options

    const statusConfig = {
        DRAFT: { label: 'Draft', color: 'gray', icon: '📝' },
        SUBMITTED: { label: 'Submitted', color: 'blue', icon: '📤' },
        PENDING_REVIEW: { label: 'Pending Review', color: 'yellow', icon: '⏳' },
        APPROVED: { label: 'Approved', color: 'green', icon: '✅' },
        REJECTED: { label: 'Rejected', color: 'red', icon: '❌' },
        EXPIRED: { label: 'Expired', color: 'gray', icon: '⏰' }
    }

    const config = statusConfig[status] || { label: status, color: 'gray', icon: '❓' }

    let formatted = config.label

    if (includeIcon) {
        formatted = `${config.icon} ${formatted}`
    }

    if (colorClass) {
        return {
            text: formatted,
            className: `text-${config.color}-600 dark:text-${config.color}-400`
        }
    }

    return formatted
}

// Duration formatting
export const formatDuration = (minutes) => {
    if (!minutes || minutes < 0) return ''

    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours === 0) {
        return `${mins} minute${mins !== 1 ? 's' : ''}`
    }

    if (mins === 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''}`
    }

    return `${hours} hour${hours !== 1 ? 's' : ''} ${mins} minute${mins !== 1 ? 's' : ''}`
}

// BTU formatting
export const formatBTU = (btu) => {
    if (!btu || isNaN(btu)) return ''

    const btuValue = parseInt(btu)

    if (btuValue >= 1000000) {
        return `${(btuValue / 1000000).toFixed(1)}M BTU/hr`
    }

    if (btuValue >= 1000) {
        return `${(btuValue / 1000).toFixed(0)}K BTU/hr`
    }

    return `${btuValue.toLocaleString()} BTU/hr`
}

// Project cost tier formatting
export const formatProjectTier = (cost) => {
    const amount = parseCurrency(cost)

    if (amount < 1000) return 'Small Project'
    if (amount < 10000) return 'Medium Project'
    if (amount < 50000) return 'Large Project'
    if (amount < 100000) return 'Major Project'
    return 'Commercial Project'
}

// Form field formatting helpers
export const formatters = {
    // Format as you type handlers
    currency: (value) => {
        const numeric = value.replace(/[^\d.]/g, '')
        if (!numeric) return ''

        const parts = numeric.split('.')
        const dollars = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        const cents = parts[1] ? '.' + parts[1].substring(0, 2) : ''

        return '$' + dollars + cents
    },

    phone: (value) => {
        const digits = value.replace(/\D/g, '')
        if (digits.length <= 3) return digits
        if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
    },

    zipCode: (value) => {
        return value.replace(/\D/g, '').substring(0, 5)
    },

    parcelId: (value) => {
        return value.toUpperCase().replace(/[^A-Z0-9-]/g, '')
    },

    licenseNumber: (value) => {
        return value.toUpperCase().replace(/[^A-Z0-9-]/g, '')
    }
}

// Validation message formatting
export const formatValidationMessage = (field, error) => {
    if (!error) return ''

    if (typeof error === 'object' && error.type === 'warning') {
        return error.message
    }

    return error
}

// Export utilities
export const exportFormatters = {
    csv: (data, filename = 'export.csv') => {
        const csv = data.map(row =>
                                 Object.values(row).map(value =>
                                                            typeof value === 'string' && value.includes(',')
                                                            ? `"${value}"`
                                                            : value
                                 ).join(',')
        ).join('\n')

        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        link.click()
        window.URL.revokeObjectURL(url)
    },

    json: (data, filename = 'export.json') => {
        const json = JSON.stringify(data, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        link.click()
        window.URL.revokeObjectURL(url)
    }
}

export default {
    formatCurrency,
    parseCurrency,
    formatCurrencyInput,
    formatDate,
    formatRelativeTime,
    formatPhoneDisplay,
    formatAddress,
    formatFullName,
    formatFileSize,
    formatNumber,
    formatPercentage,
    formatPermitNumber,
    formatStatus,
    formatDuration,
    formatBTU,
    formatProjectTier,
    formatters,
    formatValidationMessage,
    exportFormatters
}