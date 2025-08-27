// Storage utility functions for managing browser storage
const STORAGE_KEYS = {
    TOKEN: 'permit_auth_token',
    REFRESH_TOKEN: 'permit_refresh_token',
    USER: 'permit_user_data',
    THEME: 'permit_theme_preference',
    NOTIFICATIONS: 'permit_notification_preferences',
    FORM_DRAFTS: 'permit_form_drafts',
    PREFERENCES: 'permit_user_preferences',
    RECENT_SEARCHES: 'permit_recent_searches',
    LANGUAGE: 'permit_language_preference'
}

// Generic storage functions
const storage = {
    // Set item in localStorage with error handling
    set: (key, value) => {
        try {
            const serializedValue = JSON.stringify(value)
            localStorage.setItem(key, serializedValue)
            return true
        } catch (error) {
            console.error(`Error setting localStorage item "${key}":`, error)
            return false
        }
    },

    // Get item from localStorage with error handling
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key)
            if (item === null) return defaultValue
            return JSON.parse(item)
        } catch (error) {
            console.error(`Error getting localStorage item "${key}":`, error)
            return defaultValue
        }
    },

    // Remove item from localStorage
    remove: (key) => {
        try {
            localStorage.removeItem(key)
            return true
        } catch (error) {
            console.error(`Error removing localStorage item "${key}":`, error)
            return false
        }
    },

    // Clear all localStorage
    clear: () => {
        try {
            localStorage.clear()
            return true
        } catch (error) {
            console.error('Error clearing localStorage:', error)
            return false
        }
    },

    // Check if localStorage is available
    isAvailable: () => {
        try {
            const test = '__localStorage_test__'
            localStorage.setItem(test, test)
            localStorage.removeItem(test)
            return true
        } catch (error) {
            return false
        }
    }
}

// Authentication storage functions
export const storageUtils = {
    // Token management
    getToken: () => storage.get(STORAGE_KEYS.TOKEN),
    setToken: (token) => storage.set(STORAGE_KEYS.TOKEN, token),
    removeToken: () => storage.remove(STORAGE_KEYS.TOKEN),

    // Refresh token management
    getRefreshToken: () => storage.get(STORAGE_KEYS.REFRESH_TOKEN),
    setRefreshToken: (refreshToken) => storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
    removeRefreshToken: () => storage.remove(STORAGE_KEYS.REFRESH_TOKEN),

    // User data management
    getUser: () => storage.get(STORAGE_KEYS.USER),
    setUser: (user) => storage.set(STORAGE_KEYS.USER, user),
    removeUser: () => storage.remove(STORAGE_KEYS.USER),

    // Theme management
    getTheme: () => storage.get(STORAGE_KEYS.THEME, 'system'),
    setTheme: (theme) => storage.set(STORAGE_KEYS.THEME, theme),
    removeTheme: () => storage.remove(STORAGE_KEYS.THEME),

    // Notification preferences
    getNotificationPreferences: () => storage.get(STORAGE_KEYS.NOTIFICATIONS, {
        permit: true,
        auth: true,
        validation: true,
        system: true,
        document: true,
        showToasts: true,
        soundEnabled: false
    }),
    setNotificationPreferences: (prefs) => storage.set(STORAGE_KEYS.NOTIFICATIONS, prefs),

    // Form drafts (for auto-save functionality)
    getFormDraft: (formId) => {
        const drafts = storage.get(STORAGE_KEYS.FORM_DRAFTS, {})
        return drafts[formId] || null
    },
    setFormDraft: (formId, formData) => {
        const drafts = storage.get(STORAGE_KEYS.FORM_DRAFTS, {})
        drafts[formId] = {
            data: formData,
            timestamp: new Date().toISOString()
        }
        storage.set(STORAGE_KEYS.FORM_DRAFTS, drafts)
    },
    removeFormDraft: (formId) => {
        const drafts = storage.get(STORAGE_KEYS.FORM_DRAFTS, {})
        delete drafts[formId]
        storage.set(STORAGE_KEYS.FORM_DRAFTS, drafts)
    },
    getAllFormDrafts: () => storage.get(STORAGE_KEYS.FORM_DRAFTS, {}),
    clearExpiredFormDrafts: () => {
        const drafts = storage.get(STORAGE_KEYS.FORM_DRAFTS, {})
        const twentyFourHoursAgo = new Date()
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

        Object.keys(drafts).forEach(formId => {
            const draft = drafts[formId]
            if (new Date(draft.timestamp) < twentyFourHoursAgo) {
                delete drafts[formId]
            }
        })

        storage.set(STORAGE_KEYS.FORM_DRAFTS, drafts)
    },

    // User preferences
    getUserPreferences: () => storage.get(STORAGE_KEYS.PREFERENCES, {
        language: 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        dateFormat: 'MM/dd/yyyy',
        pageSize: 20,
        autoSave: true,
        emailNotifications: true
    }),
    setUserPreferences: (preferences) => storage.set(STORAGE_KEYS.PREFERENCES, preferences),
    updateUserPreference: (key, value) => {
        const preferences = storage.get(STORAGE_KEYS.PREFERENCES, {})
        preferences[key] = value
        storage.set(STORAGE_KEYS.PREFERENCES, preferences)
    },

    // Recent searches
    getRecentSearches: () => storage.get(STORAGE_KEYS.RECENT_SEARCHES, []),
    addRecentSearch: (searchTerm) => {
        const searches = storage.get(STORAGE_KEYS.RECENT_SEARCHES, [])
        // Remove if already exists
        const filtered = searches.filter(term => term !== searchTerm)
        // Add to beginning
        filtered.unshift(searchTerm)
        // Keep only last 10 searches
        storage.set(STORAGE_KEYS.RECENT_SEARCHES, filtered.slice(0, 10))
    },
    clearRecentSearches: () => storage.remove(STORAGE_KEYS.RECENT_SEARCHES),

    // Language preference
    getLanguage: () => storage.get(STORAGE_KEYS.LANGUAGE, 'en'),
    setLanguage: (language) => storage.set(STORAGE_KEYS.LANGUAGE, language),

    // Clear all authentication data
    clearAuth: () => {
        storage.remove(STORAGE_KEYS.TOKEN)
        storage.remove(STORAGE_KEYS.REFRESH_TOKEN)
        storage.remove(STORAGE_KEYS.USER)
    },

    // Clear all user data (for complete logout)
    clearAllUserData: () => {
        storage.remove(STORAGE_KEYS.TOKEN)
        storage.remove(STORAGE_KEYS.REFRESH_TOKEN)
        storage.remove(STORAGE_KEYS.USER)
        storage.remove(STORAGE_KEYS.PREFERENCES)
        storage.remove(STORAGE_KEYS.FORM_DRAFTS)
        storage.remove(STORAGE_KEYS.RECENT_SEARCHES)
    },

    // Utility functions
    isStorageAvailable: storage.isAvailable,

    // Get storage size (approximate)
    getStorageSize: () => {
        if (!storage.isAvailable()) return 0

        let total = 0
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage.getItem(key).length + key.length
            }
        }
        return total
    },

    // Clean up storage (remove old/unused items)
    cleanup: () => {
        // Clear expired form drafts
        storageUtils.clearExpiredFormDrafts()

        // Remove any invalid tokens
        const token = storage.get(STORAGE_KEYS.TOKEN)
        if (token && typeof token !== 'string') {
            storage.remove(STORAGE_KEYS.TOKEN)
        }

        // Remove any malformed user data
        const user = storage.get(STORAGE_KEYS.USER)
        if (user && (!user.id || !user.email)) {
            storage.remove(STORAGE_KEYS.USER)
        }
    },

    // Export/Import functionality for user data backup
    exportUserData: () => {
        const userData = {
            preferences: storageUtils.getUserPreferences(),
            notifications: storageUtils.getNotificationPreferences(),
            theme: storageUtils.getTheme(),
            language: storageUtils.getLanguage(),
            formDrafts: storageUtils.getAllFormDrafts(),
            recentSearches: storageUtils.getRecentSearches(),
            exportDate: new Date().toISOString()
        }
        return userData
    },

    importUserData: (userData) => {
        try {
            if (userData.preferences) {
                storageUtils.setUserPreferences(userData.preferences)
            }
            if (userData.notifications) {
                storageUtils.setNotificationPreferences(userData.notifications)
            }
            if (userData.theme) {
                storageUtils.setTheme(userData.theme)
            }
            if (userData.language) {
                storageUtils.setLanguage(userData.language)
            }
            // Note: Not importing form drafts or recent searches for security
            return true
        } catch (error) {
            console.error('Error importing user data:', error)
            return false
        }
    }
}

export default storageUtils