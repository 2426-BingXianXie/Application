// Date utility functions for the permit management system

// Add days to a date
export const addDays = (date, days) => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
}

// Add months to a date
export const addMonths = (date, months) => {
    const result = new Date(date)
    result.setMonth(result.getMonth() + months)
    return result
}

// Add years to a date
export const addYears = (date, years) => {
    const result = new Date(date)
    result.setFullYear(result.getFullYear() + years)
    return result
}

// Get difference between dates in days
export const getDaysDifference = (date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000
    const firstDate = new Date(date1)
    const secondDate = new Date(date2)

    return Math.round((secondDate - firstDate) / oneDay)
}

// Check if date is in the past
export const isPastDate = (date) => {
    return new Date(date) < new Date()
}

// Check if date is in the future
export const isFutureDate = (date) => {
    return new Date(date) > new Date()
}

// Check if date is today
export const isToday = (date) => {
    const today = new Date()
    const checkDate = new Date(date)

    return checkDate.getDate() === today.getDate() &&
           checkDate.getMonth() === today.getMonth() &&
           checkDate.getFullYear() === today.getFullYear()
}

// Get start of day
export const startOfDay = (date) => {
    const result = new Date(date)
    result.setHours(0, 0, 0, 0)
    return result
}

// Get end of day
export const endOfDay = (date) => {
    const result = new Date(date)
    result.setHours(23, 59, 59, 999)
    return result
}

// Get start of week (Monday)
export const startOfWeek = (date) => {
    const result = new Date(date)
    const day = result.getDay()
    const diff = result.getDate() - day + (day === 0 ? -6 : 1)
    result.setDate(diff)
    return startOfDay(result)
}

// Get end of week (Sunday)
export const endOfWeek = (date) => {
    const result = startOfWeek(date)
    result.setDate(result.getDate() + 6)
    return endOfDay(result)
}

// Get start of month
export const startOfMonth = (date) => {
    const result = new Date(date)
    result.setDate(1)
    return startOfDay(result)
}

// Get end of month
export const endOfMonth = (date) => {
    const result = new Date(date)
    result.setMonth(result.getMonth() + 1, 0)
    return endOfDay(result)
}

// Get business days between dates (excluding weekends)
export const getBusinessDays = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    let businessDays = 0

    while (start <= end) {
        const dayOfWeek = start.getDay()
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
            businessDays++
        }
        start.setDate(start.getDate() + 1)
    }

    return businessDays
}

// Check if date is weekend
export const isWeekend = (date) => {
    const dayOfWeek = new Date(date).getDay()
    return dayOfWeek === 0 || dayOfWeek === 6
}

// Get age from birthdate
export const getAge = (birthDate) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()

    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--
    }

    return age
}

// Format date for input fields (YYYY-MM-DD)
export const formatDateForInput = (date) => {
    if (!date) return ''

    const d = new Date(date)
    if (isNaN(d.getTime())) return ''

    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

// Parse date from input field
export const parseDateFromInput = (dateString) => {
    if (!dateString) return null

    const date = new Date(dateString)
    return isNaN(date.getTime()) ? null : date
}

// Get permit expiration date based on type
export const getPermitExpirationDate = (approvalDate, permitType) => {
    const approval = new Date(approvalDate)

    const expirationMonths = {
        building: 12,
        gas: 6,
        electrical: 6,
        plumbing: 6,
        mechanical: 6
    }

    const months = expirationMonths[permitType?.toLowerCase()] || 12
    return addMonths(approval, months)
}

// Check if permit is expiring soon (within 30 days)
export const isExpiringSoon = (expirationDate, warningDays = 30) => {
    if (!expirationDate) return false

    const expiry = new Date(expirationDate)
    const warningDate = addDays(new Date(), warningDays)

    return expiry <= warningDate && expiry > new Date()
}

// Get days until expiration
export const getDaysUntilExpiration = (expirationDate) => {
    if (!expirationDate) return null

    return getDaysDifference(new Date(), expirationDate)
}

// Format time range for reports
export const formatTimeRange = (range) => {
    const now = new Date()

    switch (range) {
        case 'today':
            return {
                start: startOfDay(now),
                end: endOfDay(now),
                label: 'Today'
            }
        case 'yesterday':
            const yesterday = addDays(now, -1)
            return {
                start: startOfDay(yesterday),
                end: endOfDay(yesterday),
                label: 'Yesterday'
            }
        case 'week':
            return {
                start: startOfWeek(now),
                end: endOfWeek(now),
                label: 'This Week'
            }
        case 'month':
            return {
                start: startOfMonth(now),
                end: endOfMonth(now),
                label: 'This Month'
            }
        case 'quarter':
            const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
            const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0)
            return {
                start: quarterStart,
                end: endOfDay(quarterEnd),
                label: 'This Quarter'
            }
        case 'year':
            return {
                start: new Date(now.getFullYear(), 0, 1),
                end: new Date(now.getFullYear(), 11, 31, 23, 59, 59),
                label: 'This Year'
            }
        default:
            return {
                start: startOfMonth(now),
                end: endOfMonth(now),
                label: 'This Month'
            }
    }
}

// Get fiscal year dates (assuming Oct 1 - Sep 30)
export const getFiscalYear = (date = new Date()) => {
    const year = new Date(date).getFullYear()
    const fiscalStart = new Date(year, 9, 1) // October 1st

    if (new Date(date) < fiscalStart) {
        // Before Oct 1, so we're in the previous fiscal year
        return {
            start: new Date(year - 1, 9, 1),
            end: new Date(year, 8, 30), // September 30th
            label: `FY ${year}`
        }
    } else {
        // After Oct 1, so we're in the current fiscal year
        return {
            start: fiscalStart,
            end: new Date(year + 1, 8, 30),
            label: `FY ${year + 1}`
        }
    }
}

// Validate date string
export const isValidDate = (dateString) => {
    const date = new Date(dateString)
    return !isNaN(date.getTime())
}

// Get timezone offset string
export const getTimezoneOffset = () => {
    const offset = new Date().getTimezoneOffset()
    const hours = Math.floor(Math.abs(offset) / 60)
    const minutes = Math.abs(offset) % 60
    const sign = offset > 0 ? '-' : '+'

    return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

// Convert UTC to local time
export const utcToLocal = (utcDate) => {
    const date = new Date(utcDate)
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
}

// Convert local to UTC
export const localToUtc = (localDate) => {
    const date = new Date(localDate)
    return new Date(date.getTime() + (date.getTimezoneOffset() * 60000))
}

// Get readable time ago
export const getTimeAgo = (date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000)

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

export default {
    addDays,
    addMonths,
    addYears,
    getDaysDifference,
    isPastDate,
    isFutureDate,
    isToday,
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    getBusinessDays,
    isWeekend,
    getAge,
    formatDateForInput,
    parseDateFromInput,
    getPermitExpirationDate,
    isExpiringSoon,
    getDaysUntilExpiration,
    formatTimeRange,
    getFiscalYear,
    isValidDate,
    getTimezoneOffset,
    utcToLocal,
    localToUtc,
    getTimeAgo
}